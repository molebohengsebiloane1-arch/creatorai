import React from 'react';
import { 
  Sparkles, 
  Video, 
  Youtube, 
  MessageSquare, 
  Film, 
  Lightbulb, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  TrendingUp, 
  Layers,
  Flame,
  Key,
  CreditCard,
  Activity
} from 'lucide-react';
import { AppTab, AIStatus, UserUsageState } from '../types';
import { AdBanner } from './AdBanner';

interface DashboardProps {
  setActiveTab: (tab: AppTab) => void;
  status: AIStatus;
  onOpenSetup: () => void;
  onQuickStart: (tab: AppTab, topic: string) => void;
  demoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
  usage?: UserUsageState;
  onOpenUsageModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  status,
  onOpenSetup,
  onQuickStart,
  demoMode,
  onToggleDemoMode,
  usage,
  onOpenUsageModal,
}) => {
  const tools = [
    {
      tab: 'script-generator' as AppTab,
      title: 'AI Video Script Generator',
      tagline: 'High-Retention Video Scripts',
      description: 'Generate scroll-stopping hooks, verbatim scripts, visual cues, and calls to action for YouTube, TikTok, Instagram, and Facebook.',
      icon: <Video size={28} className="text-purple-400" />,
      gradient: 'from-purple-900/40 via-purple-800/20 to-transparent',
      border: 'hover:border-purple-500/50',
      badge: 'Most Popular',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      platforms: ['YouTube', 'TikTok', 'Instagram', 'Facebook'],
      quickTopics: [
        '5 AI Tools to 10x Content Output',
        '3 Mistakes Killing Your Video Retention',
      ],
    },
    {
      tab: 'youtube-assistant' as AppTab,
      title: 'YouTube Assistant',
      tagline: 'CTR & SEO Powerhouse',
      description: 'Craft viral video titles, rich keyword-optimized descriptions, copyable tags for YouTube Studio, and high-contrast thumbnail concepts.',
      icon: <Youtube size={28} className="text-rose-400" />,
      gradient: 'from-rose-900/40 via-purple-900/20 to-transparent',
      border: 'hover:border-rose-500/50',
      badge: 'Growth Tool',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      platforms: ['Titles', 'Descriptions', 'Studio Tags', 'Thumbnails'],
      quickTopics: [
        'How to Start a Faceless Channel in 2026',
        'Top 10 Video Editing Secrets',
      ],
    },
    {
      tab: 'social-captions' as AppTab,
      title: 'Social Media Caption Generator',
      tagline: 'Engagement & Promo Copy',
      description: 'Instant multi-style captions, targeted hashtag clouds, promo drafts with CTAs, and algorithm posting recommendations.',
      icon: <MessageSquare size={28} className="text-blue-400" />,
      gradient: 'from-blue-900/40 via-indigo-900/20 to-transparent',
      border: 'hover:border-blue-500/50',
      badge: 'Multi-Platform',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      platforms: ['Instagram', 'TikTok', 'X / Twitter', 'LinkedIn'],
      quickTopics: [
        'Why Consistency Beats Motivation',
        'Behind the Scenes of My Creator Business',
      ],
    },
    {
      tab: 'video-planner' as AppTab,
      title: 'AI Video Planner',
      tagline: 'Scene-by-Scene Director',
      description: 'Plan complete video shoots with camera angles, visual B-roll prompts, voiceover lines, music/SFX cues, and duration timers.',
      icon: <Film size={28} className="text-cyan-400" />,
      gradient: 'from-cyan-900/40 via-blue-900/20 to-transparent',
      border: 'hover:border-cyan-500/50',
      badge: 'Production Ready',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      platforms: ['Shorts', 'Reels', 'Documentary', 'Explainers'],
      quickTopics: [
        'Morning Productivity Reset Routine',
        'Step-by-Step Software Tutorial Walkthrough',
      ],
    },
    {
      tab: 'content-ideas' as AppTab,
      title: 'Content Ideas Hub',
      tagline: 'Infinite Viral Inspiration',
      description: 'Generate high-impact content concepts, digital micro-products, and business ideas tailored to your specific niche.',
      icon: <Lightbulb size={28} className="text-amber-400" />,
      gradient: 'from-amber-900/40 via-purple-900/20 to-transparent',
      border: 'hover:border-amber-500/50',
      badge: 'Trend Radar',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      platforms: ['Viral Videos', 'Threads', 'Digital Products'],
      quickTopics: [
        'Tech & AI Creators',
        'Personal Finance & Side Hustles',
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0E1527] to-[#0A0D1A] border border-slate-800 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Flame size={14} className="text-purple-400" />
            AI Content Creation Platform
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Create Smarter. <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">
              Grow Faster.
            </span>
          </h1>

          <p className="mt-3 md:mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Turn your ideas into high-converting video scripts, viral YouTube titles, engaging social captions, and scene-by-scene production plans in seconds.
          </p>

          {/* Mobile-Friendly CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setActiveTab('script-generator')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-purple-900/40 border border-purple-400/30 transition-all active:scale-95 cursor-pointer min-h-[50px]"
            >
              <Video size={18} />
              <span>Generate Video Script</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setActiveTab('content-ideas')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-semibold text-base border border-slate-700 transition-all active:scale-95 cursor-pointer min-h-[50px]"
            >
              <Lightbulb size={18} className="text-amber-400" />
              <span>Explore Content Ideas</span>
            </button>
          </div>

          {/* Trust / Feature Metrics */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">5 Tools</p>
              <p className="text-xs text-slate-400">All-in-one suite</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-purple-400">100% Free</p>
              <p className="text-xs text-slate-400">Generous development tier</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-blue-400">Secure AI</p>
              <p className="text-xs text-slate-400">Server-side execution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Mode Notification / Quick Toggle Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        demoMode
          ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-950/20'
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            demoMode ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/10 text-purple-400'
          }`}>
            <Zap size={20} className={demoMode ? 'fill-amber-400' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-sm sm:text-base">
                Built-in Demo Mode {demoMode ? '(ACTIVE)' : '(Available)'}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                demoMode ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {demoMode ? '⚡ Instant Demo Generation' : 'Optional Offline Mode'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {demoMode 
                ? 'Demo Mode is currently ON. All 5 tools will generate rich, topic-tailored sample content instantly without making an external AI API call.'
                : 'Experience the full suite immediately without waiting for API keys or external servers. Switch to Demo Mode for instant topic-customized sample content.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleDemoMode(!demoMode)}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2 ${
            demoMode
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-950/40'
          }`}
        >
          <Zap size={14} className={demoMode ? 'text-amber-400' : 'text-slate-950 fill-slate-950'} />
          <span>{demoMode ? 'Switch to Live AI Mode' : 'Enable Demo Mode'}</span>
        </button>
      </div>

      {/* Daily Quota & Monetization Overview Banner (Requirements 1, 6, 7) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/20 via-slate-900 to-blue-950/20 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
            <Zap size={20} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-white">
                Daily AI Content Quota:
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                {usage ? `${usage.dailyRemaining} of ${usage.dailyLimit} remaining today` : '5 of 5 remaining'}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Free Tier ($0/mo)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Real AI generations are server-limited to 5/day to preserve infrastructure. Built-in Demo Mode is <strong>100% unlimited</strong> and does not consume your daily quota.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={onOpenUsageModal}
            className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
          >
            <Activity size={14} className="text-purple-400" />
            <span>Usage &amp; Cost Monitor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[42px]"
          >
            <CreditCard size={14} />
            <span>View Plans</span>
          </button>
        </div>
      </div>

      {/* AI Connection Status Alert if not configured */}
      {!status.configured && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <Key size={20} />
            </div>
            <div>
              <h4 className="font-bold text-amber-200 text-sm sm:text-base">
                Google Gemini Integration Setup Required for Live AI
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Add your free <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono text-xs">GEMINI_API_KEY</code> in Settings &gt; Secrets to generate real-time content. You can also explore each tool in Sample Preview mode.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSetup}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md min-h-[44px]"
          >
            Setup Guide &amp; Test
          </button>
        </div>
      )}

      {/* Core Tools Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Creator Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select a specialized tool to accelerate your workflow
            </p>
          </div>
          <span className="hidden sm:inline-flex text-xs font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
            Android &amp; Desktop Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <div
              key={tool.tab}
              onClick={() => setActiveTab(tool.tab)}
              className={`group relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 ${tool.border} p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/20 cursor-pointer`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${tool.gradient} opacity-50 pointer-events-none`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 group-hover:scale-105 transition-transform">
                    {tool.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs font-medium text-purple-400 mb-2">
                  {tool.tagline}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tool.description}
                </p>

                {/* Platforms/tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {tool.platforms.map((p) => (
                    <span
                      key={p}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Launch Topics */}
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                  <Zap size={12} className="text-purple-400" />
                  Quick Launch Presets:
                </div>
                <div className="space-y-1.5">
                  {tool.quickTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickStart(tool.tab, topic);
                      }}
                      className="w-full text-left text-[11px] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/40 transition-colors flex items-center justify-between group/btn min-h-[36px]"
                    >
                      <span className="truncate">{topic}</span>
                      <ArrowRight size={12} className="text-slate-500 group-hover/btn:text-purple-300 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Pricing & Free Tier Card */}
          <div
            onClick={() => setActiveTab('pricing')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/30 cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
                  <TrendingUp size={28} />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  Current: $0 Free
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Transparent Plans
              </h3>
              <p className="text-xs font-medium text-emerald-400 mb-2">
                Free Forever Tier Active
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy full access to all 5 generators, local history, and export features. Proposed plans ($4.99 and $9.99) are presented transparently without fake payment gates.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
              <span>View Pricing Breakdown</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
