export type AppTab = 
  | 'dashboard'
  | 'script-generator'
  | 'youtube-assistant'
  | 'social-captions'
  | 'video-planner'
  | 'content-ideas'
  | 'pricing'
  | 'history';

export interface AIStatus {
  configured: boolean;
  model: string;
  provider: string;
}

// 1. Script Generator Types
export interface ScriptHook {
  type: string;
  spokenLine: string;
  visualAction: string;
}

export interface ScriptSection {
  sectionName: string;
  duration: string;
  spokenWords: string;
  visualNotes: string;
  screenText: string;
}

export interface ScriptCTA {
  goal: string;
  phrase: string;
  visualCue: string;
}

export interface VideoScriptData {
  title: string;
  platform: string;
  estimatedDuration: string;
  targetAudience: string;
  hookOptions: ScriptHook[];
  scriptSections: ScriptSection[];
  callsToAction: ScriptCTA[];
  audioAndMusicVibe: string;
  viralRetentionTips: string[];
}

// 2. YouTube Assistant Types
export interface YouTubeTitle {
  title: string;
  style: string;
  estimatedCTR: string;
  reason: string;
}

export interface YouTubeDescription {
  aboveTheFold: string;
  summary: string;
  chapters: string[];
  linksPlaceholder: string;
  hashtags: string;
}

export interface ThumbnailIdea {
  concept: string;
  overlayText: string;
  visualLayout: string;
  facialExpression: string;
  colorContrastAdvice: string;
}

export interface YouTubePackageData {
  titles: YouTubeTitle[];
  description: YouTubeDescription;
  tags: string[];
  tagsRaw: string;
  keywords: {
    primary: string[];
    secondary: string[];
    longTail: string[];
  };
  thumbnailIdeas: ThumbnailIdea[];
}

// 3. Social Media Captions Types
export interface SocialCaptionItem {
  style: string;
  caption: string;
  characterCount: number;
  bestFor: string;
}

export interface SocialCaptionsData {
  platform: string;
  captions: SocialCaptionItem[];
  promotionalPost: {
    headline: string;
    body: string;
    callToAction: string;
  };
  hashtags: {
    trending: string[];
    niche: string[];
    community: string[];
    allCombined: string;
  };
  engagementQuestions: string[];
  bestTimeTip: string;
}

// 4. Video Planner Types
export interface PlannerScene {
  sceneNumber: number;
  name: string;
  durationSeconds: number;
  visualPrompt: string;
  voiceover: string;
  audioSfx: string;
  onScreenGraphics: string;
  cameraAngle: string;
}

export interface VideoPlanData {
  projectTitle: string;
  synopsis: string;
  targetDuration: string;
  visualStyle: string;
  totalScenes: number;
  scenes: PlannerScene[];
  productionTips: string[];
  gearRecommendations: string;
}

// 5. Content Ideas Types
export interface ContentIdeaItem {
  id: number;
  title: string;
  type: 'video' | 'social' | 'business';
  format: string;
  targetAudience: string;
  hook: string;
  conceptSummary: string;
  whyItWorks: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  potentialImpact: string;
  monetizationAngle: string;
}

export interface ContentIdeasData {
  niche: string;
  marketInsight: string;
  ideas: ContentIdeaItem[];
}

// History item
export interface HistoryRecord {
  id: string;
  type: 'script' | 'youtube' | 'social' | 'planner' | 'ideas';
  title: string;
  topic: string;
  createdAt: number;
  data: any;
  isDemo?: boolean;
}

// Monetization & Subscription Types
export type SubscriptionTier = 'free' | 'creator-pro' | 'business';

export interface UserUsageState {
  plan: SubscriptionTier;
  planName: string;
  dailyLimit: number; // 5 for free
  dailyUsed: number;
  dailyRemaining: number;
  monthlyLimit: number; // 100 for pro, 300 for biz, 150 (5*30) for free
  monthlyUsed: number;
  monthlyRemaining: number;
  resetsAt: string;
  totalGenerationsAllTime: number;
  isUnlimitedDemo: boolean;
}

export interface UsageAuditRecord {
  id: string;
  timestamp: number;
  tool: string;
  model: string;
  promptTopic: string;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  estimatedCostUSD: number;
}

export interface CostSummary {
  totalRequests: number;
  totalTokens: number;
  totalEstimatedCostUSD: number;
  todayRequests: number;
  todayCostUSD: number;
  recentRecords: UsageAuditRecord[];
}

export interface CheckoutSessionResult {
  configured: boolean;
  message: string;
  error?: string;
  checkoutUrl?: string;
  plan?: string;
  requiredEnvVars?: string[];
}

