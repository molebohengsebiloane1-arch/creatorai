import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Hash, 
  Share2, 
  TrendingUp, 
  Bookmark, 
  Check, 
  AlertCircle, 
  Layers, 
  Clock, 
  Send,
  Zap,
  Target
} from 'lucide-react';
import { SocialCaptionsData, AIStatus } from '../types';
import { generateSocialCaptions } from '../services/api';
import { SAMPLE_SOCIAL_CAPTIONS } from '../data/samples';
import { CopyButton } from './CopyButton';
import { RetryButton } from './RetryButton';
import { DemoToggle, DemoBadge } from './DemoToggle';
import { generateDemoSocialCaptions } from '../services/demoGenerator';

interface SocialCaptionGeneratorProps {
  status: AIStatus;
  onOpenSetup: () => void;
  onSaveHistory: (type: 'social', title: string, topic: string, data: SocialCaptionsData, isDemo?: boolean) => void;
  initialTopic?: string;
  demoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
}

export const SocialCaptionGenerator: React.FC<SocialCaptionGeneratorProps> = ({
  status,
  onOpenSetup,
  onSaveHistory,
  initialTopic = '',
  demoMode,
  onToggleDemoMode,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Engaging & Conversational');
  const [goal, setGoal] = useState('Maximum Comments & Saves');
  const [extraKeywords, setExtraKeywords] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SocialCaptionsData | null>(null);
  const [isDemoResult, setIsDemoResult] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const socialPlatforms = ['Instagram', 'TikTok', 'Twitter / X', 'LinkedIn', 'Facebook'];

  const goals = [
    'Maximum Comments & Saves',
    'Drive Link in Bio Clicks',
    'Authority & Professional Credibility',
    'Viral Shares & Reposts',
  ];

  // Instant Demo generator
  const handleGenerateDemo = (customTopic?: string) => {
    const topicToUse = customTopic || topic || 'Why systems beat willpower for content creators';
    if (!topic && customTopic) {
      setTopic(customTopic);
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const demoData = generateDemoSocialCaptions({
        topic: topicToUse,
        platform,
        tone,
        goal,
      });
      setResult(demoData);
      setIsDemoResult(true);
      setLoading(false);
      onSaveHistory('social', topicToUse || `${platform} Captions`, topicToUse, demoData, true);
    }, 250);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      setError('Please enter your post topic or core concept.');
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
      const data = await generateSocialCaptions({
        topic: cleanTopic,
        platform,
        tone,
        goal,
        extraKeywords,
      });
      setResult(data);
      setIsDemoResult(false);
      setRetryAttempts(0);
      onSaveHistory('social', cleanTopic, cleanTopic, data, false);
    } catch (err: any) {
      setRetryAttempts((prev) => prev + 1);
      setError(err?.message || 'Failed to generate captions. Upstream model is experiencing high demand.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveHistory('social', topic || `${platform} Captions`, topic, result, isDemoResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <MessageSquare size={14} />
            <span>Social Copywriting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Social Media Caption Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate high-converting captions, curated hashtags, and promotional posts.
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
            <Sparkles size={14} className="text-blue-400" />
            <span>Load Sample Topic</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        
        {/* Platform Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Select Social Platform
            </label>
            {demoMode && (
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                ⚡ Demo Mode Active (Instant)
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {socialPlatforms.map((p) => {
              const selected = platform === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer min-h-[44px] ${
                    selected
                      ? 'bg-blue-600/25 border-blue-500 text-white shadow-md shadow-blue-950/40 ring-1 ring-blue-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Post Topic */}
        <div>
          <label htmlFor="caption-topic" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            2. What are you posting about?
          </label>
          <textarea
            id="caption-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 3 content creation rules I wish I knew before spending 2 years getting zero views..."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all resize-none min-h-[80px]"
          />
        </div>

        {/* Tone and Goal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Tone &amp; Style
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer min-h-[46px]"
            >
              <option value="Engaging & Conversational">Engaging &amp; Conversational</option>
              <option value="Punchy & Short (Viral)">Punchy &amp; Short (Viral)</option>
              <option value="Storytelling & Vulnerable">Storytelling &amp; Relatable</option>
              <option value="Authoritative & Educational">Authoritative &amp; Educational</option>
              <option value="Direct & Promotional">Direct &amp; Sales-Oriented</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Primary Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 cursor-pointer min-h-[46px]"
            >
              {goals.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
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
                  <span>Generating Demo Captions...</span>
                </>
              ) : (
                <>
                  <Zap size={20} className="fill-slate-950 text-slate-950" />
                  <span>Generate Demo Captions (Instant &bull; No API Key)</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.99] text-white font-black text-base shadow-xl shadow-blue-950/40 border border-blue-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[52px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Crafting Viral Captions with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <MessageSquare size={20} />
                  <span>Generate Social Captions &amp; Hashtags</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {result.platform} Package
              </span>
              <DemoBadge isDemo={isDemoResult} />
            </div>
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

          {/* 1. Multi-Style Caption Options */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Layers size={18} className="text-blue-400" />
              3 Tailored Caption Variations
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {result.captions.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Style {idx + 1}: {cap.style}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {cap.characterCount} chars • {cap.bestFor}
                      </span>
                    </div>
                    <CopyButton
                      text={cap.caption}
                      label="Copy Caption"
                      variant="primary"
                      size="sm"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-normal">
                    {cap.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Promotional Post Draft */}
          {result.promotionalPost && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                  <Target size={18} className="text-purple-400" />
                  High-Converting Promotional Post
                </h3>
                <CopyButton
                  text={`${result.promotionalPost.headline}\n\n${result.promotionalPost.body}\n\n${result.promotionalPost.callToAction}`}
                  label="Copy Promo Post"
                  variant="secondary"
                  size="sm"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 space-y-2">
                <p className="font-bold text-purple-300">{result.promotionalPost.headline}</p>
                <p className="whitespace-pre-line text-slate-300 leading-relaxed">{result.promotionalPost.body}</p>
                <p className="font-semibold text-emerald-400 pt-1">{result.promotionalPost.callToAction}</p>
              </div>
            </div>
          )}

          {/* 3. Hashtags */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Hash size={18} className="text-cyan-400" />
                Curated Hashtags
              </h3>
              <CopyButton
                text={result.hashtags.allCombined}
                label="Copy All Hashtags"
                variant="primary"
                size="sm"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-blue-300 font-mono leading-relaxed break-all">
              {result.hashtags.allCombined}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-300 block mb-1">Trending:</strong>
                <span className="text-slate-400">{result.hashtags.trending.join(' ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-300 block mb-1">Niche Targeted:</strong>
                <span className="text-slate-400">{result.hashtags.niche.join(' ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-300 block mb-1">Community:</strong>
                <span className="text-slate-400">{result.hashtags.community.join(' ')}</span>
              </div>
            </div>
          </div>

          {/* 4. Algorithm Advice & Comment Questions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock size={16} className="text-emerald-400" />
                Algorithm &amp; Timing Advice
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.bestTimeTip}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare size={16} className="text-purple-400" />
                Engagement Spark Questions
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {result.engagementQuestions?.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
