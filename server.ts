import express from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Helper to get GoogleGenAI client
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Check AI status
app.get('/api/status', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY');
  res.json({
    configured: isConfigured,
    model: 'gemini-3.8-flash',
    provider: 'Google Gemini',
  });
});

// Explicit endpoint for Android Trusted Web Activity (TWA) Digital Asset Links
app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'public', '.well-known', 'assetlinks.json'));
});

// --- Monetization, Subscription Tiers, & Usage Tracking (Server-Enforced) ---
interface ClientUsage {
  plan: 'free' | 'creator-pro' | 'business';
  dailyDate: string; // YYYY-MM-DD
  dailyUsed: number;
  monthlyMonth: string; // YYYY-MM
  monthlyUsed: number;
  totalAllTime: number;
}

interface UsageAuditRecord {
  id: string;
  timestamp: number;
  clientId: string;
  tool: string;
  model: string;
  promptTopic: string;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostUSD: number;
}

const clientUsageStore = new Map<string, ClientUsage>();
const activeGenerationsSet = new Set<string>();
const usageAuditLogs: UsageAuditRecord[] = [];

function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentMonthUTC(): string {
  return new Date().toISOString().slice(0, 7);
}

function getNextMidnightUTC(): string {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d.toISOString();
}

function extractClientId(req: express.Request): string {
  const customId = req.headers['x-client-id'];
  if (typeof customId === 'string' && customId.trim()) {
    return customId.trim();
  }
  return req.ip || 'anon_guest';
}

function getClientUsage(clientId: string): ClientUsage {
  const today = getTodayUTC();
  const currentMonth = getCurrentMonthUTC();

  let usage = clientUsageStore.get(clientId);
  if (!usage) {
    usage = {
      plan: 'free',
      dailyDate: today,
      dailyUsed: 0,
      monthlyMonth: currentMonth,
      monthlyUsed: 0,
      totalAllTime: 0,
    };
    clientUsageStore.set(clientId, usage);
  } else {
    // Reset daily if date rolled over
    if (usage.dailyDate !== today) {
      usage.dailyDate = today;
      usage.dailyUsed = 0;
    }
    // Reset monthly if month rolled over
    if (usage.monthlyMonth !== currentMonth) {
      usage.monthlyMonth = currentMonth;
      usage.monthlyUsed = 0;
    }
  }

  return usage;
}

function getPlanLimits(plan: 'free' | 'creator-pro' | 'business') {
  switch (plan) {
    case 'creator-pro':
      return { dailyLimit: 100, monthlyLimit: 100, planName: 'Creator Pro' };
    case 'business':
      return { dailyLimit: 300, monthlyLimit: 300, planName: 'Business' };
    case 'free':
    default:
      return { dailyLimit: 5, monthlyLimit: 150, planName: 'Free Tier' };
  }
}

function checkQuotaAndLock(clientId: string): { allowed: boolean; errorStatus?: number; errorPayload?: any } {
  // Prevent accidental repeated in-flight requests (Requirement 7)
  if (activeGenerationsSet.has(clientId)) {
    return {
      allowed: false,
      errorStatus: 429,
      errorPayload: {
        error: 'REQUEST_IN_PROGRESS',
        message: 'A content generation is already running for your session. Please wait for it to complete.',
        retryable: true,
        retryAfterSeconds: 2,
      },
    };
  }

  const usage = getClientUsage(clientId);
  const limits = getPlanLimits(usage.plan);

  if (usage.plan === 'free') {
    if (usage.dailyUsed >= limits.dailyLimit) {
      return {
        allowed: false,
        errorStatus: 429,
        errorPayload: {
          error: 'DAILY_LIMIT_REACHED',
          message: `You have reached your Free plan daily limit of ${limits.dailyLimit} real AI generations today. Upgrade to Creator Pro ($9.99/mo for 100/mo) or switch to unlimited Demo Mode!`,
          dailyLimit: limits.dailyLimit,
          dailyUsed: usage.dailyUsed,
          remaining: 0,
          resetsAt: getNextMidnightUTC(),
          suggestDemoMode: true,
          suggestUpgrade: true,
        },
      };
    }
  } else {
    if (usage.monthlyUsed >= limits.monthlyLimit) {
      return {
        allowed: false,
        errorStatus: 429,
        errorPayload: {
          error: 'MONTHLY_LIMIT_REACHED',
          message: `You have reached your monthly limit of ${limits.monthlyLimit} AI generations for the ${limits.planName} plan.`,
          monthlyLimit: limits.monthlyLimit,
          monthlyUsed: usage.monthlyUsed,
          remaining: 0,
          suggestDemoMode: true,
        },
      };
    }
  }

  // Set in-flight lock
  activeGenerationsSet.add(clientId);
  return { allowed: true };
}

function releaseClientLock(clientId: string) {
  activeGenerationsSet.delete(clientId);
}

function recordUsageAndCost(
  clientId: string,
  tool: string,
  topic: string,
  model: string,
  inputLength: number,
  outputLength: number
) {
  const usage = getClientUsage(clientId);
  usage.dailyUsed += 1;
  usage.monthlyUsed += 1;
  usage.totalAllTime += 1;

  const estimatedInputTokens = Math.max(1, Math.round(inputLength / 4));
  const estimatedOutputTokens = Math.max(1, Math.round(outputLength / 4));
  // Gemini 3.8 Flash estimated pricing: $0.15/1M input, $0.60/1M output
  const estimatedCostUSD = (estimatedInputTokens * 0.00000015) + (estimatedOutputTokens * 0.00000060);

  const auditRecord: UsageAuditRecord = {
    id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    clientId,
    tool,
    model,
    promptTopic: topic.slice(0, 80),
    estimatedInputTokens,
    estimatedOutputTokens,
    estimatedCostUSD,
  };

  usageAuditLogs.unshift(auditRecord);
  if (usageAuditLogs.length > 200) {
    usageAuditLogs.pop();
  }

  const limits = getPlanLimits(usage.plan);
  return {
    plan: usage.plan,
    dailyUsed: usage.dailyUsed,
    dailyLimit: limits.dailyLimit,
    dailyRemaining: Math.max(0, limits.dailyLimit - usage.dailyUsed),
    monthlyUsed: usage.monthlyUsed,
    monthlyLimit: limits.monthlyLimit,
    monthlyRemaining: Math.max(0, limits.monthlyLimit - usage.monthlyUsed),
    estimatedTokensThisCall: estimatedInputTokens + estimatedOutputTokens,
  };
}

// Subscription & Quota Usage Endpoint
app.get('/api/subscription/usage', (req, res) => {
  const clientId = extractClientId(req);
  const usage = getClientUsage(clientId);
  const limits = getPlanLimits(usage.plan);

  res.json({
    success: true,
    usage: {
      plan: usage.plan,
      planName: limits.planName,
      dailyLimit: limits.dailyLimit,
      dailyUsed: usage.dailyUsed,
      dailyRemaining: Math.max(0, limits.dailyLimit - usage.dailyUsed),
      monthlyLimit: limits.monthlyLimit,
      monthlyUsed: usage.monthlyUsed,
      monthlyRemaining: Math.max(0, limits.monthlyLimit - usage.monthlyUsed),
      resetsAt: getNextMidnightUTC(),
      totalGenerationsAllTime: usage.totalAllTime,
      isUnlimitedDemo: true,
    },
  });
});

// Checkout Session Handshake (Stripe Integration Ready)
app.post('/api/subscription/create-checkout-session', (req, res) => {
  const { plan } = req.body;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const isStripeConfigured = Boolean(stripeKey && stripeKey.trim() !== '' && !stripeKey.includes('PLACEHOLDER'));

  const planDetails: Record<string, { price: string; name: string; monthlyGenerations: number }> = {
    'creator-pro': { price: '$9.99/month', name: 'Creator Pro', monthlyGenerations: 100 },
    'business': { price: '$19.99/month', name: 'Business', monthlyGenerations: 300 },
  };

  const selected = planDetails[plan] || planDetails['creator-pro'];

  if (!isStripeConfigured) {
    return res.json({
      configured: false,
      plan: selected.name,
      price: selected.price,
      monthlyGenerations: selected.monthlyGenerations,
      message: 'Payment Gateway (Stripe) is awaiting API configuration in the server environment. In accordance with strict payment security guidelines, no fake purchases will be simulated. You remain on the Free plan with 5 daily real AI generations & unlimited Demo Mode.',
      requiredEnvVars: [
        'STRIPE_SECRET_KEY (from Stripe Dashboard > Developers > API Keys)',
        'STRIPE_WEBHOOK_SECRET (from Stripe Dashboard > Webhooks)',
        'STRIPE_PRICE_ID_PRO (Price ID for $9.99/mo plan)',
        'STRIPE_PRICE_ID_BIZ (Price ID for $19.99/mo plan)'
      ],
      setupGuide: {
        step1: 'Create a free Stripe account at https://dashboard.stripe.com/register (free developer test mode available)',
        step2: 'Add Products: Creator Pro ($9.99/mo) and Business ($19.99/mo)',
        step3: 'Copy STRIPE_SECRET_KEY and add it to your environment or AI Studio Secrets',
        step4: 'CreatorAI server will then generate live or test Stripe Checkout redirect URLs'
      }
    });
  }

  // When Stripe is configured, create real Stripe session here
  return res.json({
    configured: true,
    message: 'Stripe configuration detected.',
    checkoutUrl: `https://checkout.stripe.com/pay/mock_session_ready?plan=${plan}`,
  });
});

// Cost and Usage Audit Stats Endpoint
app.get('/api/usage/stats', (req, res) => {
  const today = getTodayUTC();
  const todayRecords = usageAuditLogs.filter(
    (r) => new Date(r.timestamp).toISOString().slice(0, 10) === today
  );

  const totalTokens = usageAuditLogs.reduce(
    (acc, r) => acc + r.estimatedInputTokens + r.estimatedOutputTokens,
    0
  );
  const totalCost = usageAuditLogs.reduce((acc, r) => acc + r.estimatedCostUSD, 0);
  const todayCost = todayRecords.reduce((acc, r) => acc + r.estimatedCostUSD, 0);

  res.json({
    totalRequests: usageAuditLogs.length,
    totalTokens,
    totalEstimatedCostUSD: totalCost,
    todayRequests: todayRecords.length,
    todayCostUSD: todayCost,
    recentRecords: usageAuditLogs.slice(0, 20),
  });
});

// Advertising Configuration Endpoint
app.get('/api/advertising/config', (req, res) => {
  const adsEnabled = process.env.ENABLE_ADS === 'true';
  res.json({
    enabled: adsEnabled,
    provider: 'Google AdSense / Carbon Ads',
    status: adsEnabled ? 'active' : 'integration_ready',
    slotPlacement: ['dashboard_banner', 'results_footer', 'sidebar_banner'],
    requirements: [
      'Publisher approval from Google AdSense or Carbon Ads',
      'ads.txt file served from domain root (/ads.txt)',
      'Provider script tag placed in index.html with valid data-ad-client',
      'Privacy policy covering cookie usage for ad personalization'
    ]
  });
});


// Clean error formatting helper
function formatAIErrorResponse(error: any) {
  if (!error) {
    return {
      message: 'An unexpected error occurred during generation.',
      retryable: true,
      retryAfterSeconds: 3,
      suggestDemoMode: true,
    };
  }

  const msg = error.message || String(error);
  let parsedCode = error.status || error.code || 500;
  let cleanMessage = msg;

  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.message) {
      cleanMessage = parsed.error.message;
      parsedCode = parsed.error.code || parsedCode;
    }
  } catch {}

  const isHighDemandOrUnavailable = 
    parsedCode === 503 || 
    parsedCode === 429 || 
    cleanMessage.includes('503') || 
    cleanMessage.includes('high demand') || 
    cleanMessage.includes('UNAVAILABLE') ||
    cleanMessage.includes('RESOURCE_EXHAUSTED');

  if (isHighDemandOrUnavailable) {
    return {
      message: 'Google Gemini is currently experiencing high demand upstream. You can click "Retry" below to attempt with automatic backoff, or toggle "Demo Mode" for instant results.',
      retryable: true,
      retryAfterSeconds: 3,
      suggestDemoMode: true,
      statusCode: 503,
    };
  }

  return {
    message: cleanMessage,
    retryable: true,
    retryAfterSeconds: 4,
    suggestDemoMode: true,
    statusCode: 500,
  };
}

// Generate with retry and model fallback cascade
async function generateWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  config?: any
) {
  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            ...config,
          },
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const isTransient = 
          err?.status === 503 || 
          err?.status === 429 ||
          String(err?.message || '').includes('503') ||
          String(err?.message || '').includes('high demand') ||
          String(err?.message || '').includes('UNAVAILABLE') ||
          String(err?.message || '').includes('RESOURCE_EXHAUSTED');

        if (isTransient && attempt < 2) {
          // Exponential backoff delay
          await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
        } else {
          break; // Try next model in cascade
        }
      }
    }
  }

  throw lastError;
}

// Helper error handler for missing key
function handleAIKeyMissing(res: express.Response) {
  return res.status(503).json({
    error: 'GEMINI_API_KEY_REQUIRED',
    message: 'AI integration is not configured. Please set your GEMINI_API_KEY in the environment or the AI Studio Secrets panel, or use Demo Mode for instant sample generation.',
    suggestDemoMode: true,
    setupGuide: {
      step1: 'Open the AI Studio left sidebar or Settings menu',
      step2: 'Navigate to "Secrets" / Environment Variables',
      step3: 'Add "GEMINI_API_KEY" with your Google AI Studio API key',
      step4: 'Reload or re-trigger generation',
    },
  });
}

// 1. AI Video Script Generator
app.post('/api/generate/video-script', async (req, res) => {
  const clientId = extractClientId(req);
  const quotaCheck = checkQuotaAndLock(clientId);
  if (!quotaCheck.allowed) {
    return res.status(quotaCheck.errorStatus!).json(quotaCheck.errorPayload);
  }

  try {
    const ai = getGenAIClient();
    if (!ai) return handleAIKeyMissing(res);

    const { topic, platform = 'youtube', tone = 'energetic', duration = '60s', audience = 'general', extraNotes = '' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `You are an elite video scriptwriter and viral content strategist for creator platforms.
Create a high-performing video script for:
- Platform: ${platform}
- Topic: ${topic}
- Tone: ${tone}
- Target Duration: ${duration}
- Target Audience: ${audience}
- Extra Notes/Instructions: ${extraNotes || 'None'}

Provide an engaging, retention-optimized response in valid JSON matching this exact structure:
{
  "title": "Compelling video title",
  "platform": "${platform}",
  "estimatedDuration": "${duration}",
  "targetAudience": "${audience}",
  "hookOptions": [
    {
      "type": "Curiosity Hook",
      "spokenLine": "Opening hook dialogue",
      "visualAction": "What the creator or screen shows in first 3 seconds"
    },
    {
      "type": "Problem / Pain Point Hook",
      "spokenLine": "Relatable problem dialogue",
      "visualAction": "Visual cues"
    },
    {
      "type": "Bold Statement Hook",
      "spokenLine": "Surprising claim dialogue",
      "visualAction": "Visual cues"
    }
  ],
  "scriptSections": [
    {
      "sectionName": "Intro & Pattern Interrupt",
      "duration": "0:00 - 0:08",
      "spokenWords": "Full verbatim script lines...",
      "visualNotes": "Visual action, B-roll, camera movement",
      "screenText": "Text overlay graphic"
    },
    {
      "sectionName": "Core Value / Point 1",
      "duration": "0:08 - 0:25",
      "spokenWords": "Full verbatim script lines...",
      "visualNotes": "B-roll, kinetic typography, screen demonstration",
      "screenText": "Key takeaway text"
    },
    {
      "sectionName": "Key Insight / Demonstration",
      "duration": "0:25 - 0:45",
      "spokenWords": "Full verbatim script lines...",
      "visualNotes": "Visual proof or transformation",
      "screenText": "Pro-tip text"
    },
    {
      "sectionName": "Climax & Payoff",
      "duration": "0:45 - 0:55",
      "spokenWords": "Payoff statement...",
      "visualNotes": "Fast-paced punchy cuts",
      "screenText": "Actionable summary"
    }
  ],
  "callsToAction": [
    {
      "goal": "Follow / Subscribe",
      "phrase": "High-conversion CTA line",
      "visualCue": "Pointer to follow button, animation sound"
    },
    {
      "goal": "Engagement & Comments",
      "phrase": "Specific debate/question for comment section",
      "visualCue": "Comment icon popup"
    }
  ],
  "audioAndMusicVibe": "Suggested tempo, music genre, or trending sound cue",
  "viralRetentionTips": [
    "Tip 1 for keeping viewers until the last second on ${platform}",
    "Tip 2 for algorithmic velocity"
  ]
}`;

    const response = await generateWithRetry(ai, prompt);
    const parsed = JSON.parse(response.text || '{}');
    const usage = recordUsageAndCost(clientId, 'video-script', topic, 'gemini-3.8-flash', prompt.length, response.text?.length || 0);
    res.json({ success: true, data: parsed, usage });
  } catch (error: any) {
    console.error('Error in video-script route:', error);
    const formatted = formatAIErrorResponse(error);
    res.status(formatted.statusCode || 500).json({ 
      error: formatted.message,
      retryable: formatted.retryable,
      retryAfterSeconds: formatted.retryAfterSeconds,
      suggestDemoMode: formatted.suggestDemoMode 
    });
  } finally {
    releaseClientLock(clientId);
  }
});

// 2. YouTube Assistant
app.post('/api/generate/youtube-assistant', async (req, res) => {
  const clientId = extractClientId(req);
  const quotaCheck = checkQuotaAndLock(clientId);
  if (!quotaCheck.allowed) {
    return res.status(quotaCheck.errorStatus!).json(quotaCheck.errorPayload);
  }

  try {
    const ai = getGenAIClient();
    if (!ai) return handleAIKeyMissing(res);

    const { topic, channelNiche = 'Tech & Creation', audience = 'general', videoType = 'Tutorial/How-to' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `You are a YouTube Growth & SEO Master who helps creators get millions of views.
Generate a complete YouTube publishing package for:
- Topic: ${topic}
- Channel Niche: ${channelNiche}
- Audience: ${audience}
- Video Type: ${videoType}

Provide the output in valid JSON matching this exact structure:
{
  "titles": [
    {
      "title": "Title variation 1",
      "style": "High-CTR Curiosity Gap",
      "estimatedCTR": "Very High",
      "reason": "Why this title triggers clicks"
    },
    {
      "title": "Title variation 2",
      "style": "Search & SEO Optimized",
      "estimatedCTR": "Consistent Search",
      "reason": "Captures high intent search traffic"
    },
    {
      "title": "Title variation 3",
      "style": "Bold Claim / Transformational",
      "estimatedCTR": "High",
      "reason": "Appeals to viewer aspirations"
    },
    {
      "title": "Title variation 4",
      "style": "Mistake / Negative Hook",
      "estimatedCTR": "Very High",
      "reason": "Triggers loss aversion"
    },
    {
      "title": "Title variation 5",
      "style": "Fast & Actionable",
      "estimatedCTR": "High",
      "reason": "Promises immediate results"
    }
  ],
  "description": {
    "aboveTheFold": "First 2-3 lines before 'Show More' with primary keyword, compelling hook, and clear value proposition.",
    "summary": "2-3 comprehensive paragraphs summarizing what viewers will learn and why it matters.",
    "chapters": [
      "00:00 - Introduction & The Big Problem",
      "01:15 - Key Mistake Most People Make",
      "03:40 - Step-by-Step Walkthrough",
      "07:20 - Secret Pro-Tip & Shortcut",
      "09:10 - Final Summary & Next Steps"
    ],
    "linksPlaceholder": "RESOURCES MENTIONED:\\n- Tool 1: [Link]\\n- Free Checklist: [Link]\\n- Join our Community: [Link]",
    "hashtags": "#${topic.replace(/\\s+/g, '')} #YouTubeCreator #ContentCreation"
  },
  "tags": [
    "${topic}",
    "${topic} tutorial",
    "how to ${topic}",
    "best way to ${topic}",
    "${topic} 2026",
    "${topic} for beginners",
    "${topic} tips"
  ],
  "tagsRaw": "Comma-separated string of 15-20 optimal tags for direct paste into YouTube Studio",
  "keywords": {
    "primary": ["Primary SEO term 1", "Primary SEO term 2"],
    "secondary": ["Secondary phrase 1", "Secondary phrase 2", "Secondary phrase 3"],
    "longTail": ["Long-tail search query 1", "Long-tail search query 2"]
  },
  "thumbnailIdeas": [
    {
      "concept": "Concept 1",
      "overlayText": "3-4 PUNCHY WORDS",
      "visualLayout": "Split screen or zoomed close-up subject with vibrant colored accent lighting",
      "facialExpression": "Shocked, intensely focused, or grinning with excitement",
      "colorContrastAdvice": "Neon yellow text on deep dark purple/blue background for maximum mobile contrast"
    },
    {
      "concept": "Concept 2",
      "overlayText": "DON'T DO THIS!",
      "visualLayout": "Red X vs Green Checkmark comparison",
      "facialExpression": "Warning / serious hand gesture",
      "colorContrastAdvice": "Vibrant emerald green and crimson red highlights against dark background"
    },
    {
      "concept": "Concept 3",
      "overlayText": "I TESTED IT",
      "visualLayout": "Before/After graph or product reveal with arrow",
      "facialExpression": "Intrigued or confident pose",
      "colorContrastAdvice": "Cyan and electric purple glow effects"
    }
  ]
}`;

    const response = await generateWithRetry(ai, prompt);
    const parsed = JSON.parse(response.text || '{}');
    const usage = recordUsageAndCost(clientId, 'youtube-assistant', topic, 'gemini-3.8-flash', prompt.length, response.text?.length || 0);
    res.json({ success: true, data: parsed, usage });
  } catch (error: any) {
    console.error('Error in YouTube assistant:', error);
    const formatted = formatAIErrorResponse(error);
    res.status(formatted.statusCode || 500).json({ 
      error: formatted.message,
      retryable: formatted.retryable,
      retryAfterSeconds: formatted.retryAfterSeconds,
      suggestDemoMode: formatted.suggestDemoMode 
    });
  } finally {
    releaseClientLock(clientId);
  }
});

// 3. Social Media Caption Generator
app.post('/api/generate/social-captions', async (req, res) => {
  const clientId = extractClientId(req);
  const quotaCheck = checkQuotaAndLock(clientId);
  if (!quotaCheck.allowed) {
    return res.status(quotaCheck.errorStatus!).json(quotaCheck.errorPayload);
  }

  try {
    const ai = getGenAIClient();
    if (!ai) return handleAIKeyMissing(res);

    const { topic, platform = 'instagram', tone = 'engaging', goal = 'engagement', extraKeywords = '' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `You are a social media copywriter specialized in viral organic reach and high conversions.
Generate social media captions for:
- Platform: ${platform}
- Topic: ${topic}
- Tone: ${tone}
- Primary Goal: ${goal}
- Keywords / Context: ${extraKeywords || 'None'}

Provide the output in valid JSON matching this exact structure:
{
  "platform": "${platform}",
  "captions": [
    {
      "style": "Hook & Value Story",
      "caption": "Full formatted caption with line breaks, emojis, strong first line, and clear call-to-action.",
      "characterCount": 450,
      "bestFor": "Maximum comments and saves"
    },
    {
      "style": "Short & Punchy",
      "caption": "Quick, punchy 2-3 sentence caption for fast-scrollers.",
      "characterCount": 180,
      "bestFor": "Quick viral reach and shares"
    },
    {
      "style": "Educational Bullet List",
      "caption": "Numbered or bulleted value drop with actionable advice.",
      "characterCount": 550,
      "bestFor": "High bookmark/save rates and authority building"
    }
  ],
  "promotionalPost": {
    "headline": "High-converting promo hook",
    "body": "Persuasive sales / conversion post driving clicks to link in bio or DM keyword",
    "callToAction": "Drop a comment 'GROW' and I'll send you the link!"
  },
  "hashtags": {
    "trending": ["#tag1", "#tag2", "#tag3"],
    "niche": ["#nichetag1", "#nichetag2", "#nichetag3", "#nichetag4"],
    "community": ["#community1", "#community2"],
    "allCombined": "#tag1 #tag2 #tag3 #nichetag1 #nichetag2 #community1"
  },
  "engagementQuestions": [
    "Question 1 to ask in caption to get 50+ comments",
    "Question 2 to spark friendly debate"
  ],
  "bestTimeTip": "Recommended posting time and platform-specific algorithm advice"
}`;

    const response = await generateWithRetry(ai, prompt);
    const parsed = JSON.parse(response.text || '{}');
    const usage = recordUsageAndCost(clientId, 'social-captions', topic, 'gemini-3.8-flash', prompt.length, response.text?.length || 0);
    res.json({ success: true, data: parsed, usage });
  } catch (error: any) {
    console.error('Error generating social captions:', error);
    const formatted = formatAIErrorResponse(error);
    res.status(formatted.statusCode || 500).json({ 
      error: formatted.message,
      retryable: formatted.retryable,
      retryAfterSeconds: formatted.retryAfterSeconds,
      suggestDemoMode: formatted.suggestDemoMode 
    });
  } finally {
    releaseClientLock(clientId);
  }
});

// 4. AI Video Planner
app.post('/api/generate/video-planner', async (req, res) => {
  const clientId = extractClientId(req);
  const quotaCheck = checkQuotaAndLock(clientId);
  if (!quotaCheck.allowed) {
    return res.status(quotaCheck.errorStatus!).json(quotaCheck.errorPayload);
  }

  try {
    const ai = getGenAIClient();
    if (!ai) return handleAIKeyMissing(res);

    const { concept, format = 'short-form', targetDuration = '60 seconds', visualStyle = 'Modern creator, cinematic lighting' } = req.body;

    if (!concept || typeof concept !== 'string' || concept.trim().length === 0) {
      return res.status(400).json({ error: 'Concept is required' });
    }

    const prompt = `You are a film director and senior video production planner.
Create a comprehensive, production-ready scene-by-scene video plan for:
- Video Concept: ${concept}
- Format: ${format}
- Target Duration: ${targetDuration}
- Visual Style: ${visualStyle}

Provide output in valid JSON matching this exact structure:
{
  "projectTitle": "Polished Project Title",
  "synopsis": "Clear 2-sentence summary of the video's premise and core visual journey.",
  "targetDuration": "${targetDuration}",
  "visualStyle": "${visualStyle}",
  "totalScenes": 5,
  "scenes": [
    {
      "sceneNumber": 1,
      "name": "The Hook / Cold Open",
      "durationSeconds": 5,
      "visualPrompt": "Close-up shot of creator holding a phone, quick whip-pan camera move. Ambient neon purple lighting.",
      "voiceover": "Stop making this single mistake that costs you 80% of your audience.",
      "audioSfx": "Fast whoosh sound effect into rhythmic upbeat synth intro",
      "onScreenGraphics": "'BIGGEST MISTAKE' in bold kinetic typography",
      "cameraAngle": "Eye-level 50mm, slight dolly-in"
    },
    {
      "sceneNumber": 2,
      "name": "The Reality Check",
      "durationSeconds": 10,
      "visualPrompt": "B-roll screen recording of analytics dropping or frustrated creator looking at laptop.",
      "voiceover": "You spend 10 hours creating a video, hit publish, and hear crickets. Here is why.",
      "audioSfx": "Subtle low bass drop, keyboard typing SFX",
      "onScreenGraphics": "Red downward arrow & analytics graph highlight",
      "cameraAngle": "Over-the-shoulder 35mm"
    },
    {
      "sceneNumber": 3,
      "name": "The Secret Formula (Core Solution)",
      "durationSeconds": 20,
      "visualPrompt": "Dynamic split screen or rapid A-roll explanation with high-energy hand gestures.",
      "voiceover": "Step one: Hook them with an open loop. Step two: Deliver value every 4 seconds. Step three: Reward their time.",
      "audioSfx": "Chime sound effect on each step, energetic backing track builds",
      "onScreenGraphics": "3-step visual badge cards appearing sequentially",
      "cameraAngle": "Medium shot with digital zoom punch-in on key words"
    },
    {
      "sceneNumber": 4,
      "name": "Visual Demonstration / Proof",
      "durationSeconds": 15,
      "visualPrompt": "Side-by-side comparison or live example demonstrating the transformation.",
      "voiceover": "Notice how applying this immediately increases watch time from 30 seconds to over 2 minutes.",
      "audioSfx": "Success 'ding' SFX, upbeat musical swell",
      "onScreenGraphics": "'30s vs 2:15 Avg Watch Time' green metric highlight",
      "cameraAngle": "Screen-in-screen overlay"
    },
    {
      "sceneNumber": 5,
      "name": "Closing Call-to-Action",
      "durationSeconds": 10,
      "visualPrompt": "Creator looks straight down lens with warm smile, gestures down.",
      "voiceover": "Save this video for your next shoot, and follow for part two where we break down the retention curve.",
      "audioSfx": "Smooth musical outro fade",
      "onScreenGraphics": "'SAVE FOR LATER' animated icon + Subscribe button",
      "cameraAngle": "Medium close-up"
    }
  ],
  "productionTips": [
    "Lighting: Place key light at 45 degrees, use blue/purple back edge light",
    "Audio: Lapel mic 6 inches below chin for crisp podcast-level voice clarity",
    "Pacing: Cut out all breath pauses to maintain high viewer velocity"
  ],
  "gearRecommendations": "Smartphone with 4K 30fps or mirrorless camera, ring/key light, wireless lapel mic."
}`;

    const response = await generateWithRetry(ai, prompt);
    const parsed = JSON.parse(response.text || '{}');
    const usage = recordUsageAndCost(clientId, 'video-planner', concept, 'gemini-3.8-flash', prompt.length, response.text?.length || 0);
    res.json({ success: true, data: parsed, usage });
  } catch (error: any) {
    console.error('Error in video planner:', error);
    const formatted = formatAIErrorResponse(error);
    res.status(formatted.statusCode || 500).json({ 
      error: formatted.message,
      retryable: formatted.retryable,
      retryAfterSeconds: formatted.retryAfterSeconds,
      suggestDemoMode: formatted.suggestDemoMode 
    });
  } finally {
    releaseClientLock(clientId);
  }
});

// 5. Content Ideas Generator
app.post('/api/generate/content-ideas', async (req, res) => {
  const clientId = extractClientId(req);
  const quotaCheck = checkQuotaAndLock(clientId);
  if (!quotaCheck.allowed) {
    return res.status(quotaCheck.errorStatus!).json(quotaCheck.errorPayload);
  }

  try {
    const ai = getGenAIClient();
    if (!ai) return handleAIKeyMissing(res);

    const { niche = 'Digital Creators', targetPlatform = 'all', ideaCategory = 'all', goal = 'growth' } = req.body;

    if (!niche || typeof niche !== 'string' || niche.trim().length === 0) {
      return res.status(400).json({ error: 'Niche is required' });
    }

    const prompt = `You are a viral trend analyst and digital business strategist.
Generate actionable, high-growth content and online business ideas for:
- Niche: ${niche}
- Platform: ${targetPlatform}
- Category: ${ideaCategory}
- Goal: ${goal}

Generate 6 high-potential, distinct ideas in valid JSON matching this exact structure:
{
  "niche": "${niche}",
  "marketInsight": "Brief 1-sentence insight on why this niche is booming right now.",
  "ideas": [
    {
      "id": 1,
      "title": "Compelling Idea Title",
      "type": "video",
      "format": "Short-Form Reel / TikTok",
      "targetAudience": "Beginners seeking quick wins",
      "hook": "Opening sentence that stops the scroll immediately",
      "conceptSummary": "Clear 2-sentence summary of what this piece of content delivers",
      "whyItWorks": "Psychological trigger or algorithmic factor",
      "difficulty": "Easy",
      "potentialImpact": "Viral Reach (High)",
      "monetizationAngle": "Direct to digital guide or affiliate link"
    },
    {
      "id": 2,
      "title": "Comprehensive Deep-Dive Concept",
      "type": "video",
      "format": "Long-Form YouTube Video",
      "targetAudience": "Intermediate practitioners looking to level up",
      "hook": "The harsh truth nobody tells you about...",
      "conceptSummary": "Complete teardown or step-by-step masterclass",
      "whyItWorks": "Builds high trust and authority",
      "difficulty": "Medium",
      "potentialImpact": "High Watch Time & Subscribers",
      "monetizationAngle": "High-ticket coaching or premium community"
    },
    {
      "id": 3,
      "title": "Interactive Community Discussion Post",
      "type": "social",
      "format": "Carousel / Text Thread",
      "targetAudience": "Engaged followers",
      "hook": "Unpopular opinion: Most creators are doing X completely wrong",
      "conceptSummary": "Contrarian viewpoint backed by solid reasoning and examples",
      "whyItWorks": "Drives passionate comment section engagement and shares",
      "difficulty": "Easy",
      "potentialImpact": "Viral Engagement & Shares",
      "monetizationAngle": "Newsletter sign-up CTA"
    },
    {
      "id": 4,
      "title": "Digital Micro-Product Opportunity",
      "type": "business",
      "format": "Digital Asset / Template / Notion Hub",
      "targetAudience": "Busy professionals and creators",
      "hook": "Automate your entire workflow in 15 minutes",
      "conceptSummary": "Turn a repeatable process in \${niche} into a $19-$49 plug-and-play digital toolkit",
      "whyItWorks": "Solves an urgent pain point with zero fulfillment cost",
      "difficulty": "Medium",
      "potentialImpact": "$1k-$5k/mo Passive Revenue",
      "monetizationAngle": "Direct Gumroad/Stripe sales"
    },
    {
      "id": 5,
      "title": "Behind-The-Scenes Income / Growth Breakdown",
      "type": "social",
      "format": "Multi-Image Carousel / Case Study",
      "targetAudience": "Curious learners and peers",
      "hook": "How 1 simple switch doubled our results in 30 days (exact numbers)",
      "conceptSummary": "Transparent case study sharing real screenshots, lessons, and takeaways",
      "whyItWorks": "Proof and transparency are the highest converting content formats",
      "difficulty": "Easy",
      "potentialImpact": "Authority & High Inbound Leads",
      "monetizationAngle": "Sponsorships and client inquiries"
    },
    {
      "id": 6,
      "title": "Subscription Newsletter or Micro-SaaS Idea",
      "type": "business",
      "format": "Paid Community / Micro-Service",
      "targetAudience": "Niche enthusiasts willing to pay for curation or time savings",
      "hook": "Get the top 1% opportunities delivered every Monday",
      "conceptSummary": "Curated weekly dispatch or specialized vetted directory for \${niche}",
      "whyItWorks": "Recurring subscription revenue with compounding retention",
      "difficulty": "Advanced",
      "potentialImpact": "Predictable Monthly Recurring Revenue",
      "monetizationAngle": "Monthly subscription ($9-$29/mo)"
    }
  ]
}`;

    const response = await generateWithRetry(ai, prompt);
    const parsed = JSON.parse(response.text || '{}');
    const usage = recordUsageAndCost(clientId, 'content-ideas', niche, 'gemini-3.8-flash', prompt.length, response.text?.length || 0);
    res.json({ success: true, data: parsed, usage });
  } catch (error: any) {
    console.error('Error generating ideas:', error);
    const formatted = formatAIErrorResponse(error);
    res.status(formatted.statusCode || 500).json({ 
      error: formatted.message,
      retryable: formatted.retryable,
      retryAfterSeconds: formatted.retryAfterSeconds,
      suggestDemoMode: formatted.suggestDemoMode 
    });
  } finally {
    releaseClientLock(clientId);
  }
});

// Vite Middleware integration for development and production static serving
async function setupVite() {
  const isHmrDisabled = process.env.DISABLE_HMR === 'true';

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CreatorAI server running on http://0.0.0.0:${PORT}`);
    });
  } else {
    const server = http.createServer(app);
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`CreatorAI server running on http://0.0.0.0:${PORT}`);
    });
  }
}

setupVite();
