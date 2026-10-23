import { 
  AIStatus, 
  VideoScriptData, 
  YouTubePackageData, 
  SocialCaptionsData, 
  VideoPlanData, 
  ContentIdeasData,
  UserUsageState,
  CostSummary,
  CheckoutSessionResult
} from '../types';

export class APIError extends Error {
  code?: string;
  setupGuide?: any;
  retryable?: boolean;
  retryAfterSeconds?: number;
  suggestDemoMode?: boolean;

  constructor(
    message: string, 
    code?: string, 
    setupGuide?: any,
    retryable?: boolean,
    retryAfterSeconds?: number,
    suggestDemoMode?: boolean
  ) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.setupGuide = setupGuide;
    this.retryable = retryable;
    this.retryAfterSeconds = retryAfterSeconds;
    this.suggestDemoMode = suggestDemoMode;
  }
}

export function getClientId(): string {
  try {
    let id = localStorage.getItem('creatorai_client_id');
    if (!id) {
      id = 'usr_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('creatorai_client_id', id);
    }
    return id;
  } catch {
    return 'anon_guest';
  }
}

function getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-client-id': getClientId(),
    ...customHeaders,
  };
}

export async function fetchAIStatus(): Promise<AIStatus> {
  try {
    const res = await fetch('/api/status', {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  } catch (err) {
    return {
      configured: false,
      model: 'gemini-3.8-flash',
      provider: 'Google Gemini',
    };
  }
}

export async function fetchUserUsage(): Promise<UserUsageState> {
  try {
    const res = await fetch('/api/subscription/usage', {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Usage fetch failed');
    const json = await res.json();
    return json.usage;
  } catch (err) {
    return {
      plan: 'free',
      planName: 'Free Tier',
      dailyLimit: 5,
      dailyUsed: 0,
      dailyRemaining: 5,
      monthlyLimit: 150,
      monthlyUsed: 0,
      monthlyRemaining: 150,
      resetsAt: new Date(Date.now() + 86400000).toISOString(),
      totalGenerationsAllTime: 0,
      isUnlimitedDemo: true,
    };
  }
}

export async function fetchUsageStats(): Promise<CostSummary> {
  const res = await fetch('/api/usage/stats', {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Stats fetch failed');
  return await res.json();
}

export async function createCheckoutSession(plan: 'creator-pro' | 'business'): Promise<CheckoutSessionResult> {
  const res = await fetch('/api/subscription/create-checkout-session', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ plan }),
  });
  return await res.json();
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new APIError(
      json.error || json.message || 'Server request failed',
      json.error,
      json.setupGuide,
      json.retryable ?? (res.status === 503 || res.status === 429),
      json.retryAfterSeconds ?? 3,
      json.suggestDemoMode ?? true
    );
  }
  return json.data as T;
}

export async function generateVideoScript(params: {
  topic: string;
  platform: string;
  tone: string;
  duration: string;
  audience?: string;
  extraNotes?: string;
}): Promise<VideoScriptData> {
  const res = await fetch('/api/generate/video-script', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<VideoScriptData>(res);
}

export async function generateYouTubePackage(params: {
  topic: string;
  channelNiche?: string;
  audience?: string;
  videoType?: string;
}): Promise<YouTubePackageData> {
  const res = await fetch('/api/generate/youtube-assistant', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<YouTubePackageData>(res);
}

export async function generateSocialCaptions(params: {
  topic: string;
  platform: string;
  tone: string;
  goal: string;
  extraKeywords?: string;
}): Promise<SocialCaptionsData> {
  const res = await fetch('/api/generate/social-captions', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<SocialCaptionsData>(res);
}

export async function generateVideoPlan(params: {
  concept: string;
  format: string;
  targetDuration: string;
  visualStyle: string;
}): Promise<VideoPlanData> {
  const res = await fetch('/api/generate/video-planner', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<VideoPlanData>(res);
}

export async function generateContentIdeas(params: {
  niche: string;
  targetPlatform?: string;
  ideaCategory?: string;
  goal?: string;
}): Promise<ContentIdeasData> {
  const res = await fetch('/api/generate/content-ideas', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(params),
  });
  return handleResponse<ContentIdeasData>(res);
}

