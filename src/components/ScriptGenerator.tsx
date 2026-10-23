import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Clock, 
  Users, 
  Volume2, 
  Lightbulb, 
  Bookmark, 
  Share2, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Flame,
  FileText,
  Zap
} from 'lucide-react';
import { VideoScriptData, AIStatus } from '../types';
import { generateVideoScript } from '../services/api';
import { SAMPLE_VIDEO_SCRIPT } from '../data/samples';
import { CopyButton } from './CopyButton';
import { RetryButton } from './RetryButton';
import { DemoToggle, DemoBadge } from './DemoToggle';
import { generateDemoVideoScript } from '../services/demoGenerator';

interface ScriptGeneratorProps {
  status: AIStatus;
  onOpenSetup: () => void;
  onSaveHistory: (type: 'script', title: string, topic: string, data: VideoScriptData, isDemo?: boolean) => void;
  initialTopic?: string;
  demoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({
  status,
  onOpenSetup,
  onSaveHistory,
  initialTopic = '',
  demoMode,
  onToggleDemoMode,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [platform, setPlatform] = useState<'YouTube' | 'TikTok' | 'Instagram' | 'Facebook'>('YouTube');
  const [tone, setTone] = useState('Energetic & Punchy');
  const [duration, setDuration] = useState('60 seconds');
  const [audience, setAudience] = useState('General Creators & Beginners');
  const [extraNotes, setExtraNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoScriptData | null>(null);
  const [isDemoResult, setIsDemoResult] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const platforms = [
    { id: 'YouTube', name: 'YouTube', desc: 'High retention & CTR', color: 'hover:border-red-500/50' },
    { id: 'TikTok', name: 'TikTok', desc: 'Fast hook & algorithm tempo', color: 'hover:border-cyan-500/50' },
    { id: 'Instagram', name: 'Instagram', desc: 'Visual storytelling & Reels', color: 'hover:border-pink-500/50' },
    { id: 'Facebook', name: 'Facebook', desc: 'Relatable & shareable', color: 'hover:border-blue-500/50' },
  ];

  const quickIdeas = [
    '5 AI Tools to Automate Content Creation',
    'Why Most Creators Burn Out in 90 Days',
    'How I Edit Viral Videos in 15 Minutes',
    'The 3-Second Rule That Tripled My Views',
  ];

  // Instant Demo generator (no API request needed)
  const handleGenerateDemo = (customTopic?: string) => {
    const topicToUse = customTopic || topic || '5 AI Tools That Will Save You 10 Hours Every Single Week';
    if (!topic && customTopic) {
      setTopic(customTopic);
    }
    setError(null);
    setLoading(true);
    
    // Simulate natural brief latency for smooth feel
    setTimeout(() => {
      const demoData = generateDemoVideoScript({
        topic: topicToUse,
        platform,
        tone,
        duration,
        audience,
      });
      setResult(demoData);
      setIsDemoResult(true);
      setLoading(false);
      onSaveHistory('script', demoData.title, topicToUse, demoData, true);
    }, 250);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTop = topic.trim();
    if (!cleanTop) {
      setError('Please enter a video topic or question to script.');
      return;
    }

    // If Demo Mode is turned ON, generate instantly without API call
    if (demoMode) {
      handleGenerateDemo(cleanTop);
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
      const data = await generateVideoScript({
        topic: cleanTop,
        platform,
        tone,
        duration,
        audience,
        extraNotes,
      });
      setResult(data);
      setIsDemoResult(false);
      setRetryAttempts(0);
      onSaveHistory('script', data.title || cleanTop, cleanTop, data, false);
    } catch (err: any) {
      setRetryAttempts((prev) => prev + 1);
      setError(err?.message || 'Failed to generate script. Upstream model is experiencing high demand.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!result) return;
    onSaveHistory('script', result.title, topic || result.title, result, isDemoResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Build full script text for copying
  const getFullScriptText = () => {
    if (!result) return '';
    let text = `# ${result.title}\nPlatform: ${result.platform} | Target Duration: ${result.estimatedDuration}\nAudience: ${result.targetAudience}\n\n`;
    text += `## HOOK OPTIONS:\n`;
    result.hookOptions?.forEach((h, i) => {
      text += `Option ${i + 1} (${h.type}):\nSpoken: "${h.spokenLine}"\nVisual Action: [${h.visualAction}]\n\n`;
    });
    text += `## FULL SCENE SCRIPT:\n`;
    result.scriptSections?.forEach((sec) => {
      text += `[${sec.duration}] ${sec.sectionName}\nVisual: ${sec.visualNotes}\nOn-Screen Text: ${sec.screenText}\nVoiceover: "${sec.spokenWords}"\n\n`;
    });
    text += `## CALLS TO ACTION:\n`;
    result.callsToAction?.forEach((c) => {
      text += `- ${c.goal}: "${c.phrase}" (Visual: ${c.visualCue})\n`;
    });
    text += `\nMusic Vibe: ${result.audioAndMusicVibe}\n`;
    if (result.viralRetentionTips?.length) {
      text += `\nRetention Tips:\n` + result.viralRetentionTips.map((t) => `- ${t}`).join('\n');
    }
    return text;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Video size={14} />
            <span>AI Scriptwriter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Video Script Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate viral hooks, structured scene-by-scene narration, visual cues, and CTAs.
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
            <Sparkles size={14} className="text-purple-400" />
            <span>Load Sample Topic</span>
          </button>
        </div>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleGenerate} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        
        {/* Platform Selection */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Select Target Platform
            </label>
            {demoMode && (
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                ⚡ Demo Mode Active (Instant)
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {platforms.map((p) => {
              const selected = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[64px] flex flex-col justify-center ${
                    selected
                      ? 'bg-purple-600/25 border-purple-500 text-white shadow-md shadow-purple-950/40 ring-1 ring-purple-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-sm block">{p.name}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Topic Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="topic-input" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. What is your video about?
            </label>
            <span className="text-[11px] text-slate-400">Be as specific or simple as you like</span>
          </div>
          <textarea
            id="topic-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 5 free AI tools that save creators 10 hours a week, with step-by-step prompts..."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
          />

          {/* Quick Idea Chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Try ideas:</span>
            {quickIdeas.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => setTopic(idea)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Tone, Duration, Audience Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Tone &amp; Vibe
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-purple-500 cursor-pointer min-h-[46px]"
            >
              <option value="Energetic & Punchy">Energetic &amp; Punchy</option>
              <option value="Educational & Authority">Educational &amp; Authority</option>
              <option value="Storytelling & Vulnerable">Storytelling &amp; Relatable</option>
              <option value="Humorous & Entertaining">Humorous &amp; Witty</option>
              <option value="Urgent & Contrarian">Urgent &amp; Contrarian</option>
              <option value="Cinematic & Calm">Cinematic &amp; Calm</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-purple-500 cursor-pointer min-h-[46px]"
            >
              <option value="30 seconds">30 seconds (Quick Short/Reel)</option>
              <option value="60 seconds">60 seconds (Standard Short/Reel)</option>
              <option value="3 minutes">3 minutes (Deep Short / Mid-form)</option>
              <option value="8-10 minutes">8-10 minutes (Full YouTube Episode)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Beginners, freelancers, techies"
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-purple-500 min-h-[46px]"
            />
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

        {/* Generate Button (Large, mobile touch friendly) */}
        <div className="pt-2">
          {demoMode ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-[0.99] text-slate-950 font-black text-base shadow-xl shadow-amber-950/40 border border-amber-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[52px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Generating Demo Script...</span>
                </>
              ) : (
                <>
                  <Zap size={20} className="fill-slate-950 text-slate-950" />
                  <span>Generate Demo Video Script (Instant &bull; No API Key)</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 active:scale-[0.99] text-white font-black text-base shadow-xl shadow-purple-900/40 border border-purple-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[52px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Writing Viral Script with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate Video Script</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Script Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Result Header & Actions */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {result.platform}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {result.estimatedDuration}
                </span>
                <DemoBadge isDemo={isDemoResult} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {result.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <CopyButton
                text={getFullScriptText()}
                label="Copy Full Script"
                variant="primary"
                size="md"
              />
              <button
                type="button"
                onClick={handleSaveToHistory}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
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

          {/* 1. Viral Hook Options */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Flame size={18} className="text-purple-400" />
                3 Scroll-Stopping Hook Variations (First 3-5 Seconds)
              </h3>
              <span className="text-xs text-slate-400">Test different openings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {result.hookOptions?.map((hook, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                        Option {idx + 1}: {hook.type}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed mb-3">
                      &quot;{hook.spokenLine}&quot;
                    </p>
                    <div className="text-[11px] text-slate-400 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <strong className="text-slate-300">Visual Cue:</strong> {hook.visualAction}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                    <CopyButton
                      text={hook.spokenLine}
                      label="Copy Hook"
                      variant="ghost"
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Scene by Scene Verbatim Script */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <FileText size={18} className="text-blue-400" />
                Scene-by-Scene Script &amp; Visual Notes
              </h3>
              <span className="text-xs text-slate-400">Verbatim dialogue</span>
            </div>

            <div className="space-y-4">
              {result.scriptSections?.map((section, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        {section.sectionName}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {section.duration}
                      </span>
                      <CopyButton
                        text={section.spokenWords}
                        variant="icon"
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Spoken Narration */}
                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/30 text-slate-100 text-xs sm:text-sm font-medium leading-relaxed">
                    <span className="text-purple-400 font-bold block text-[10px] uppercase tracking-wider mb-1">
                      Spoken Script:
                    </span>
                    &quot;{section.spokenWords}&quot;
                  </div>

                  {/* Visual and On-Screen Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <strong className="text-slate-300">Visual Notes:</strong> {section.visualNotes}
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <strong className="text-slate-300">On-Screen Text:</strong> {section.screenText}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Calls to Action */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Share2 size={18} className="text-emerald-400" />
              High-Conversion Calls to Action (CTAs)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {result.callsToAction?.map((cta, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      {cta.goal}
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-100 mb-2">
                      &quot;{cta.phrase}&quot;
                    </p>
                    <p className="text-[11px] text-slate-400">
                      <strong className="text-slate-300">Visual action:</strong> {cta.visualCue}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-end">
                    <CopyButton text={cta.phrase} label="Copy CTA" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Vibe & Retention Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Volume2 size={16} className="text-cyan-400" />
                Recommended Audio / Music Vibe
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {result.audioAndMusicVibe}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb size={16} className="text-amber-400" />
                Algorithm Retention Tips
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {result.viralRetentionTips?.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
