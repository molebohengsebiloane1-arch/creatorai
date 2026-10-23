import React, { useState } from 'react';
import { 
  Youtube, 
  Sparkles, 
  TrendingUp, 
  Hash, 
  Image as ImageIcon, 
  Key, 
  Bookmark, 
  Check, 
  AlertCircle, 
  Layers,
  Copy,
  ExternalLink,
  Zap
} from 'lucide-react';
import { YouTubePackageData, AIStatus } from '../types';
import { generateYouTubePackage } from '../services/api';
import { SAMPLE_YOUTUBE_PACKAGE } from '../data/samples';
import { CopyButton } from './CopyButton';
import { RetryButton } from './RetryButton';
import { DemoToggle, DemoBadge } from './DemoToggle';
import { generateDemoYouTubePackage } from '../services/demoGenerator';

interface YoutubeAssistantProps {
  status: AIStatus;
  onOpenSetup: () => void;
  onSaveHistory: (type: 'youtube', title: string, topic: string, data: YouTubePackageData, isDemo?: boolean) => void;
  initialTopic?: string;
  demoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
}

export const YoutubeAssistant: React.FC<YoutubeAssistantProps> = ({
  status,
  onOpenSetup,
  onSaveHistory,
  initialTopic = '',
  demoMode,
  onToggleDemoMode,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [channelNiche, setChannelNiche] = useState('Tech & AI Creation');
  const [audience, setAudience] = useState('Beginners & Solo Creators');
  const [videoType, setVideoType] = useState('Tutorial / Step-by-Step');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<YouTubePackageData | null>(null);
  const [isDemoResult, setIsDemoResult] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const niches = [
    'Tech & AI Creation',
    'Personal Finance & Side Hustles',
    'Gaming & Esports',
    'Fitness & Health',
    'Education & Productivity',
    'Entertainment & Commentary',
  ];

  // Instant Demo Generator
  const handleGenerateDemo = (customTopic?: string) => {
    const topicToUse = customTopic || topic || 'How to Automate YouTube Content with AI';
    if (!topic && customTopic) {
      setTopic(customTopic);
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const demoData = generateDemoYouTubePackage({
        topic: topicToUse,
        channelNiche,
        audience,
        videoType,
      });
      setResult(demoData);
      setIsDemoResult(true);
      setLoading(false);
      const titleToSave = demoData.titles?.[0]?.title || topicToUse;
      onSaveHistory('youtube', titleToSave, topicToUse, demoData, true);
    }, 250);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setError('Please enter a YouTube video topic.');
      return;
    }

    if (demoMode) {
      handleGenerateDemo(cleanTopic);
      return;
    }

    if (!status.configured) {
      setError('GEMINI_API_KEY is not configured on the server. Please click "Setup AI" to configure your key or click "Generate Instant Demo" below.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsDemoResult(false);

    try {
      const data = await generateYouTubePackage({
        topic: cleanTopic,
        channelNiche,
        audience,
        videoType,
      });
      setResult(data);
      setIsDemoResult(false);
      setRetryAttempts(0);
      const titleToSave = data.titles?.[0]?.title || cleanTopic;
      onSaveHistory('youtube', titleToSave, cleanTopic, data, false);
    } catch (err: any) {
      setRetryAttempts((prev) => prev + 1);
      setError(err?.message || 'Failed to generate YouTube package. Upstream model is experiencing high demand.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const titleToSave = result.titles?.[0]?.title || topic;
    onSaveHistory('youtube', titleToSave, topic, result, isDemoResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Compile full YouTube description
  const getFullDescriptionText = () => {
    if (!result?.description) return '';
    const d = result.description;
    let full = `${d.aboveTheFold}\n\n${d.summary}\n\nTIMESTAMPS:\n${d.chapters.join('\n')}\n\n${d.linksPlaceholder}\n\n${d.hashtags}`;
    return full;
  };

  // Compile full package for copying
  const getFullPackageText = () => {
    if (!result) return '';
    let text = `# YOUTUBE OPTIMIZATION PACKAGE: ${topic}\n\n`;
    text += `## RECOMMENDED TITLES:\n`;
    result.titles.forEach((t, i) => {
      text += `${i + 1}. ${t.title} [${t.style}] - ${t.reason}\n`;
    });
    text += `\n## DESCRIPTION:\n${getFullDescriptionText()}\n\n`;
    text += `## YOUTUBE STUDIO TAGS (Comma-separated):\n${result.tagsRaw || result.tags.join(', ')}\n\n`;
    text += `## THUMBNAIL TEXT & CONCEPTS:\n`;
    result.thumbnailIdeas.forEach((thumb, i) => {
      text += `Idea ${i + 1}: "${thumb.overlayText}"\nVisual: ${thumb.visualLayout}\nExpression: ${thumb.facialExpression}\nContrast: ${thumb.colorContrastAdvice}\n\n`;
    });
    return text;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
            <Youtube size={14} />
            <span>YouTube Growth &amp; SEO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            YouTube Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate viral titles, rich SEO descriptions, Studio tags, and thumbnail concepts.
          </p>
        </div>

        {/* Demo Mode Toggle & Quick Sample */}
        <div className="flex flex-wrap items-center gap-2">
          <DemoToggle
            demoMode={demoMode}
            onToggle={onToggleDemoMode}
          />
          <button
            type="button"
            onClick={() => handleGenerateDemo()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <Sparkles size={14} className="text-rose-400" />
            <span>Load Sample Topic</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="yt-topic" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Video Topic or Central Question
            </label>
            {demoMode && (
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                ⚡ Demo Mode Active (Instant)
              </span>
            )}
          </div>
          <input
            id="yt-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How to make YouTube videos 10x faster with AI in 2026..."
            className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 min-h-[48px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Channel Niche
            </label>
            <select
              value={channelNiche}
              onChange={(e) => setChannelNiche(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-rose-500 cursor-pointer min-h-[46px]"
            >
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Beginners, freelancers, techies"
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-rose-500 min-h-[46px]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Video Format
            </label>
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-rose-500 cursor-pointer min-h-[46px]"
            >
              <option value="Tutorial / Step-by-Step">Tutorial / Step-by-Step</option>
              <option value="Listicle (Top 5 / 10)">Listicle (Top 5 / 10)</option>
              <option value="Story / Case Study">Story / Case Study</option>
              <option value="Opinion / Commentary">Opinion / Commentary</option>
              <option value="Review / Comparison">Review / Comparison</option>
            </select>
          </div>
        </div>

        {/* Error notice with Retry and Demo fallback */}
        {error && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-bold text-white text-sm">Generation Error</p>
                <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>

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
          {demoMode ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-[0.99] text-slate-950 font-black text-base shadow-xl shadow-amber-950/40 border border-amber-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[52px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Generating Demo YouTube Package...</span>
                </>
              ) : (
                <>
                  <Zap size={20} className="fill-slate-950 text-slate-950" />
                  <span>Generate Demo YouTube Package (Instant &bull; No API Key)</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 hover:from-rose-500 hover:to-blue-500 active:scale-[0.99] text-white font-black text-base shadow-xl shadow-rose-950/40 border border-rose-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[52px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Optimizing YouTube Package with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Youtube size={20} />
                  <span>Generate Complete YouTube Package</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Bar Actions */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                YouTube Complete Suite
              </span>
              <DemoBadge isDemo={isDemoResult} />
            </div>
            <div className="flex items-center gap-2">
              <CopyButton
                text={getFullPackageText()}
                label="Copy Full Package"
                variant="primary"
                size="md"
              />
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                {savedSuccess ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 1. High CTR Titles */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-rose-400" />
                5 High-CTR Title Variations
              </h3>
              <span className="text-xs text-slate-400">Click to copy title</span>
            </div>

            <div className="space-y-3">
              {result.titles.map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {t.style}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400">
                        {t.estimatedCTR}
                      </span>
                    </div>
                    <p className="font-bold text-white text-sm sm:text-base leading-snug">
                      {t.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.reason}
                    </p>
                  </div>
                  <div className="shrink-0 self-end sm:self-center">
                    <CopyButton text={t.title} label="Copy Title" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Rich Description */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Layers size={18} className="text-purple-400" />
                Optimized Video Description
              </h3>
              <CopyButton
                text={getFullDescriptionText()}
                label="Copy Description"
                variant="secondary"
                size="sm"
              />
            </div>

            {/* Above the fold callout */}
            <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                Above the Fold Hook (First 2 Lines before &apos;Show More&apos;):
              </span>
              <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                {result.description.aboveTheFold}
              </p>
            </div>

            {/* Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Detailed Summary:
              </span>
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {result.description.summary}
              </p>
            </div>

            {/* Chapters / Timestamps */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Suggested Chapter Outline (Timestamps):
              </span>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                {result.description.chapters.map((ch, i) => (
                  <div key={i}>{ch}</div>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-purple-300 font-medium">
              {result.description.hashtags}
            </div>
          </div>

          {/* 3. YouTube Tags & Studio Copy */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Hash size={18} className="text-cyan-400" />
                YouTube Studio Tags (Ready to Paste)
              </h3>
              <CopyButton
                text={result.tagsRaw || result.tags.join(', ')}
                label="Copy All Tags"
                variant="primary"
                size="sm"
              />
            </div>

            {/* Raw copy box for YouTube Studio */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed break-all">
              {result.tagsRaw || result.tags.join(', ')}
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Keywords Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold block mb-1">Primary Keywords:</span>
                <span className="text-slate-200">{result.keywords?.primary?.join(', ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold block mb-1">Secondary Keywords:</span>
                <span className="text-slate-200">{result.keywords?.secondary?.join(', ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold block mb-1">Long-Tail Search:</span>
                <span className="text-slate-200">{result.keywords?.longTail?.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* 4. Thumbnail Text & Visual Ideas */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-amber-400" />
              Thumbnail Text Ideas &amp; Visual Concepts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.thumbnailIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Mock Card with Overlay Text */}
                    <div className="relative h-28 rounded-xl bg-gradient-to-tr from-purple-900/60 via-slate-900 to-blue-900/60 border border-purple-500/30 flex items-center justify-center p-3 text-center mb-3 shadow-inner">
                      <span className="text-base sm:text-lg font-black text-yellow-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-tight font-sans">
                        {idea.overlayText}
                      </span>
                      <span className="absolute bottom-1 right-2 text-[10px] font-mono text-slate-400">
                        Concept {idx + 1}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="text-slate-300">
                        <strong className="text-white">Layout:</strong> {idea.visualLayout}
                      </p>
                      <p className="text-slate-400">
                        <strong className="text-slate-300">Expression:</strong> {idea.facialExpression}
                      </p>
                      <p className="text-purple-300 text-[11px] bg-purple-950/20 p-2 rounded-lg border border-purple-900/30">
                        <strong>Contrast advice:</strong> {idea.colorContrastAdvice}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-end">
                    <CopyButton
                      text={idea.overlayText}
                      label="Copy Text"
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
