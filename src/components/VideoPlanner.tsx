import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  Clock, 
  Camera, 
  Mic, 
  Volume2, 
  Layers, 
  Check, 
  Bookmark, 
  AlertCircle, 
  Lightbulb, 
  Sliders,
  Wand2,
  Zap
} from 'lucide-react';
import { VideoPlanData, AIStatus } from '../types';
import { generateVideoPlan } from '../services/api';
import { SAMPLE_VIDEO_PLAN } from '../data/samples';
import { CopyButton } from './CopyButton';
import { RetryButton } from './RetryButton';
import { DemoToggle, DemoBadge } from './DemoToggle';
import { generateDemoVideoPlan } from '../services/demoGenerator';

interface VideoPlannerProps {
  status: AIStatus;
  onOpenSetup: () => void;
  onSaveHistory: (type: 'planner', title: string, topic: string, data: VideoPlanData, isDemo?: boolean) => void;
  initialConcept?: string;
  demoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
}

export const VideoPlanner: React.FC<VideoPlannerProps> = ({
  status,
  onOpenSetup,
  onSaveHistory,
  initialConcept = '',
  demoMode,
  onToggleDemoMode,
}) => {
  const [concept, setConcept] = useState(initialConcept);
  const [format, setFormat] = useState('Short-Form Reel / TikTok (60s)');
  const [targetDuration, setTargetDuration] = useState('60 seconds');
  const [visualStyle, setVisualStyle] = useState('Cinematic lighting, warm accents, smooth whip-pans');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoPlanData | null>(null);
  const [isDemoResult, setIsDemoResult] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const formats = [
    'Short-Form Reel / TikTok (60s)',
    'Long-Form YouTube Video (5-10m)',
    'Educational Explainer / Masterclass',
    'Day-in-the-Life Creator Vlog',
    'Product Launch Ad / Commercial',
  ];

  // Instant Demo generator
  const handleGenerateDemo = (customConcept?: string) => {
    const conceptToUse = customConcept || concept || 'The 30-Second Morning Productivity Reset';
    if (!concept && customConcept) {
      setConcept(customConcept);
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const demoData = generateDemoVideoPlan({
        concept: conceptToUse,
        format,
        targetDuration,
        visualStyle,
      });
      setResult(demoData);
      setIsDemoResult(true);
      setLoading(false);
      onSaveHistory('planner', demoData.projectTitle || conceptToUse, conceptToUse, demoData, true);
    }, 250);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanConcept = concept.trim();
    if (!cleanConcept) {
      setError('Please enter a video concept or narrative overview.');
      return;
    }

    if (demoMode) {
      handleGenerateDemo(cleanConcept);
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
      const data = await generateVideoPlan({
        concept: cleanConcept,
        format,
        targetDuration,
        visualStyle,
      });
      setResult(data);
      setIsDemoResult(false);
      setRetryAttempts(0);
      onSaveHistory('planner', data.projectTitle || cleanConcept, cleanConcept, data, false);
    } catch (err: any) {
      setRetryAttempts((prev) => prev + 1);
      setError(err?.message || 'Failed to generate video plan. Upstream model is experiencing high demand.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveHistory('planner', result.projectTitle || concept, concept, result, isDemoResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Compile full plan text for copying
  const getFullPlanText = () => {
    if (!result) return '';
    let text = `# PRODUCTION PLAN: ${result.projectTitle}\n`;
    text += `Target Duration: ${result.targetDuration} | Visual Style: ${result.visualStyle}\n`;
    text += `Synopsis: ${result.synopsis}\n\n`;
    text += `## SCENE BREAKDOWN:\n\n`;
    result.scenes.forEach((s) => {
      text += `### SCENE ${s.sceneNumber}: ${s.name} (${s.durationSeconds}s)\n`;
      text += `- Camera / Angle: ${s.cameraAngle}\n`;
      text += `- Visual Shot Prompt: ${s.visualPrompt}\n`;
      text += `- Voiceover Narration: "${s.voiceover}"\n`;
      text += `- Audio SFX & Music: ${s.audioSfx}\n`;
      text += `- On-Screen Graphics: ${s.onScreenGraphics}\n\n`;
    });
    text += `## DIRECTOR'S PRODUCTION TIPS:\n`;
    result.productionTips.forEach((tip) => {
      text += `- ${tip}\n`;
    });
    text += `\nRecommended Gear: ${result.gearRecommendations}\n`;
    return text;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <Film size={14} />
            <span>AI Director &amp; Storyboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            AI Video Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build scene-by-scene storyboards with visual prompts, voiceover, SFX, and timers.
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
            <Sparkles size={14} className="text-cyan-400" />
            <span>Load Sample Topic</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="planner-concept" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Video Concept &amp; Story Premise
            </label>
            {demoMode && (
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                ⚡ Demo Mode Active (Instant)
              </span>
            )}
          </div>
          <textarea
            id="planner-concept"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g. A fast-paced morning productivity routine showing how replacing phone scrolling with a 30-second water and priority list resets focus..."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-all resize-none min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Video Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 cursor-pointer min-h-[46px]"
            >
              {formats.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Target Duration
            </label>
            <select
              value={targetDuration}
              onChange={(e) => setTargetDuration(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 cursor-pointer min-h-[46px]"
            >
              <option value="30 seconds">30 seconds (5 scenes)</option>
              <option value="60 seconds">60 seconds (5-6 scenes)</option>
              <option value="90 seconds">90 seconds (7-8 scenes)</option>
              <option value="3 minutes">3 minutes (Deep overview)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Visual Aesthetic / Style
            </label>
            <input
              type="text"
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              placeholder="e.g. Moody cinematic, neon studio, minimalist"
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 min-h-[46px]"
            />
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
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 cursor-pointer min-h-[40px]"
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
                  <span>Generating Demo Video Plan...</span>
                </>
              ) : (
                <>
                  <Zap size={20} className="fill-slate-950 text-slate-950" />
                  <span>Generate Demo Video Plan (Instant &bull; No API Key)</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:scale-[0.99] text-white font-black text-base shadow-xl shadow-cyan-950/40 border border-cyan-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[52px]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Scene-by-Scene Plan with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Film size={20} />
                  <span>Create Scene-by-Scene Video Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {result.totalScenes} Production Scenes
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {result.targetDuration}
                </span>
                <DemoBadge isDemo={isDemoResult} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {result.projectTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {result.synopsis}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <CopyButton
                text={getFullPlanText()}
                label="Copy Full Plan"
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

          {/* Scene Breakdown Storyboard */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Layers size={18} className="text-cyan-400" />
              Scene-by-Scene Storyboard &amp; Directing Guide
            </h3>

            <div className="space-y-4">
              {result.scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3.5"
                >
                  {/* Scene Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-black flex items-center justify-center border border-cyan-500/30">
                        #{scene.sceneNumber}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-white text-sm sm:text-base">
                          {scene.name}
                        </h4>
                        <span className="text-[11px] text-cyan-400 font-mono">
                          {scene.cameraAngle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
                        ⏱️ {scene.durationSeconds}s
                      </span>
                      <CopyButton
                        text={`Scene ${scene.sceneNumber}: "${scene.voiceover}"\nVisual Shot: ${scene.visualPrompt}`}
                        variant="icon"
                        size="sm"
                      />
                    </div>
                  </div>

                  {/* Visual Prompt (Camera / B-Roll) */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Camera size={12} />
                      Visual Shot Prompt (B-Roll &amp; Action):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {scene.visualPrompt}
                    </p>
                  </div>

                  {/* Voiceover Narration */}
                  <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-900/30">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Mic size={12} />
                      Spoken Narration (Verbatim):
                    </span>
                    <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed italic">
                      &quot;{scene.voiceover}&quot;
                    </p>
                  </div>

                  {/* Audio SFX & On-Screen Text */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <strong className="text-amber-300 block mb-0.5">🎵 Audio &amp; SFX:</strong>
                      <span className="text-slate-400">{scene.audioSfx}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <strong className="text-emerald-300 block mb-0.5">🔤 On-Screen Text:</strong>
                      <span className="text-slate-400">{scene.onScreenGraphics}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Director's Tips & Gear */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb size={16} className="text-yellow-400" />
                Director&apos;s Production Tips
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {result.productionTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sliders size={16} className="text-purple-400" />
                Gear &amp; Lighting Recommendations
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.gearRecommendations}
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
