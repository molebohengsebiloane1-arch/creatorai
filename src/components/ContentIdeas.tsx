import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  TrendingUp, 
  Video, 
  MessageSquare, 
  Briefcase, 
  ArrowRight, 
  Bookmark, 
  Check, 
  AlertCircle, 
  Flame, 
  Layers,
  Zap,
  Filter
} from 'lucide-react';
import { ContentIdeasData, ContentIdeaItem, AIStatus, AppTab } from '../types';
import { generateContentIdeas } from '../services/api';
import { SAMPLE_CONTENT_IDEAS } from '../data/samples';
import { CopyButton } from './CopyButton';
import { RetryButton } from './RetryButton';
import { DemoToggle, DemoBadge } from './DemoToggle';
import { generateDemoContentIdeas } from '../services/demoGenerator';

interface ContentIdeasProps {
  status: AIStatus;
  onOpenSetup: () => void;
  onSaveHistory: (type: 'ideas', title: string, topic: string, data: ContentIdeasData, isDemo?: boolean) => void;
  onTransferToTool: (tab: AppTab, topic: string) => void;
  initialNiche?: string;
  demoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
}

export const ContentIdeas: React.FC<ContentIdeasProps> = ({
  status,
  onOpenSetup,
  onSaveHistory,
  onTransferToTool,
  initialNiche = '',
  demoMode,
  onToggleDemoMode,
}) => {
  const [niche, setNiche] = useState(initialNiche || 'AI & Digital Creators');
  const [platform, setPlatform] = useState('all');
  const [ideaCategory, setIdeaCategory] = useState<'all' | 'video' | 'social' | 'business'>('all');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContentIdeasData | null>(null);
  const [isDemoResult, setIsDemoResult] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const popularNiches = [
    'AI & Digital Creators',
    'Personal Finance & Side Hustles',
    'Fitness & Health',
    'Productivity & Notion Systems',
    'E-Commerce & Digital Dropshipping',
    'Software & Web Development',
    'Self-Improvement & Mindset',
  ];

  const handleGenerateDemo = (customNiche?: string) => {
    const targetNiche = customNiche || niche || 'AI & Digital Creators';
    if (!niche && customNiche) setNiche(customNiche);
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const demoData = generateDemoContentIdeas({
        niche: targetNiche,
        ideaCategory,
        targetPlatform: platform,
      });
      setResult(demoData);
      setIsDemoResult(true);
      setLoading(false);
      onSaveHistory('ideas', `${targetNiche} Idea Vault`, targetNiche, demoData, true);
    }, 250);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNiche = niche.trim();
    if (!cleanNiche) {
      setError('Please specify a niche or industry.');
      return;
    }

    if (demoMode) {
      handleGenerateDemo(cleanNiche);
      return;
    }

    if (!status.configured) {
      setError('GEMINI_API_KEY is not configured on the server. Please click "Setup AI" to configure your key or click "Generate Demo Ideas" below.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsDemoResult(false);

    try {
      const data = await generateContentIdeas({
        niche: cleanNiche,
        targetPlatform: platform,
        ideaCategory,
      });
      setResult(data);
      setIsDemoResult(false);
      setRetryAttempts(0);
      onSaveHistory('ideas', `${cleanNiche} Idea Vault`, cleanNiche, data, false);
    } catch (err: any) {
      setRetryAttempts((prev) => prev + 1);
      setError(err?.message || 'Failed to generate ideas. Upstream model is experiencing high demand.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    handleGenerateDemo('AI & Digital Creators');
  };

  const handleSave = () => {
    if (!result) return;
    onSaveHistory('ideas', `${niche} Idea Vault`, niche, result, isDemoResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Filter ideas by category
  const filteredIdeas = result?.ideas?.filter((idea) => {
    if (ideaCategory === 'all') return true;
    return idea.type === ideaCategory;
  }) || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
            <Lightbulb size={14} />
            <span>Ideation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Content &amp; Business Ideas Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate high-growth ideas for viral videos, social media threads, and online businesses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <DemoToggle
            demoMode={demoMode}
            onToggle={onToggleDemoMode}
            size="sm"
          />
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Load Sample</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        <div>
          <label htmlFor="niche-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            1. Your Niche or Industry
          </label>
          <input
            id="niche-input"
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. Personal Finance for Gen Z, AI Automation for Agencies..."
            className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 min-h-[48px]"
          />

          {/* Quick Niche Chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Quick niches:</span>
            {popularNiches.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNiche(n)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  niche === n
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Idea Categories Focus
            </label>
            <select
              value={ideaCategory}
              onChange={(e) => setIdeaCategory(e.target.value as any)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 cursor-pointer min-h-[46px]"
            >
              <option value="all">All Formats (Videos, Social Posts, Businesses)</option>
              <option value="video">Viral Videos Only (Shorts, Reels, YouTube)</option>
              <option value="social">Social Media Posts (Carousels &amp; Threads)</option>
              <option value="business">Online Businesses &amp; Micro-Products</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Primary Goal
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 cursor-pointer min-h-[46px]"
            >
              <option value="all">Balanced (Fast Growth + Monetization)</option>
              <option value="viral">Viral Top-of-Funnel Reach</option>
              <option value="monetize">Direct Digital Product Sales / Cashflow</option>
              <option value="authority">Deep Authority &amp; Brand Equity</option>
            </select>
          </div>
        </div>

        {/* Error message with Retry and Demo Fallback */}
        {error && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-bold text-white text-sm">Generation Error</p>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>

            {/* Action Bar for Error Recovery */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-500/20">
              <RetryButton
                onRetry={() => handleGenerate()}
                isLoading={loading}
                delaySeconds={3}
                attemptCount={retryAttempts}
              />

              <button
                type="button"
                onClick={() => handleGenerateDemo()}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-950/30 transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px]"
              >
                <Zap size={14} className="fill-slate-950 text-slate-950" />
                <span>Generate with Demo Mode Instead</span>
              </button>

              {!status.configured && (
                <button
                  type="button"
                  onClick={onOpenSetup}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 cursor-pointer min-h-[40px]"
                >
                  Configure Key
                </button>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base shadow-xl border transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[52px] ${
              demoMode
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border-amber-400/40 shadow-amber-950/40'
                : 'bg-gradient-to-r from-amber-600 via-purple-600 to-blue-600 hover:from-amber-500 hover:to-blue-500 text-white border-amber-400/30 shadow-amber-950/40'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Generating High-Growth Concepts...</span>
              </>
            ) : demoMode ? (
              <>
                <Zap size={20} className="fill-slate-950" />
                <span>Generate Instant Demo Concepts (No API Required)</span>
              </>
            ) : (
              <>
                <Lightbulb size={20} />
                <span>Generate Content &amp; Business Ideas</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Header */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {result.niche} Ideas
                </span>
                <DemoBadge isDemo={isDemoResult} />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                💡 <strong className="text-white">Market Insight:</strong> {result.marketInsight}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[44px]"
            >
              {savedSuccess ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  <span>Save Ideas</span>
                </>
              )}
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter size={14} /> Filter:
            </span>
            {(['all', 'video', 'social', 'business'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setIdeaCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[36px] ${
                  ideaCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat === 'all' && 'All Concepts'}
                {cat === 'video' && '🎥 Video Ideas'}
                {cat === 'social' && '📱 Social Posts'}
                {cat === 'business' && '💼 Business & Products'}
              </button>
            ))}
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredIdeas.map((idea) => {
              const typeIcons = {
                video: <Video size={16} className="text-purple-400" />,
                social: <MessageSquare size={16} className="text-blue-400" />,
                business: <Briefcase size={16} className="text-amber-400" />,
              };

              const typeBadge = {
                video: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                social: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                business: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
              };

              return (
                <div
                  key={idea.id}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Pill Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${typeBadge[idea.type]}`}>
                          {typeIcons[idea.type]}
                          {idea.type.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {idea.format}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        idea.difficulty === 'Easy' 
                          ? 'bg-emerald-500/20 text-emerald-300' 
                          : idea.difficulty === 'Medium' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        {idea.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {idea.title}
                    </h3>

                    {/* Hook Callout */}
                    <div className="p-3 rounded-xl bg-purple-950/25 border border-purple-900/40">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-0.5">
                        Opening Scroll-Stopping Hook:
                      </span>
                      <p className="text-xs sm:text-sm font-medium text-slate-100 italic">
                        &quot;{idea.hook}&quot;
                      </p>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {idea.conceptSummary}
                    </p>

                    {/* Why It Works & Monetization Angle */}
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <strong className="text-purple-300 block mb-0.5">🧠 Why it works:</strong>
                        <span className="text-slate-400">{idea.whyItWorks}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                        <strong className="text-emerald-300 block mb-0.5">💰 Monetization Angle:</strong>
                        <span className="text-slate-400">{idea.monetizationAngle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons to send to other tools */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <CopyButton
                      text={`Idea: ${idea.title}\nHook: "${idea.hook}"\nSummary: ${idea.conceptSummary}\nMonetization: ${idea.monetizationAngle}`}
                      label="Copy Idea"
                      size="sm"
                    />

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onTransferToTool('script-generator', idea.title)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-bold border border-purple-500/30 transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
                      >
                        <Video size={12} />
                        <span>Script This</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onTransferToTool('video-planner', idea.title)}
                        className="px-2.5 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer min-h-[36px]"
                      >
                        <Layers size={12} />
                        <span>Plan This</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
