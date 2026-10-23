import React from 'react';
import { 
  X, 
  Sparkles, 
  Key, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ExternalLink, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { AIStatus } from '../types';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: AIStatus;
  onRefreshStatus: () => void;
  isChecking: boolean;
}

export const SetupModal: React.FC<SetupModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
  isChecking,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close setup modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Engine Setup & Testing</h2>
            <p className="text-xs text-slate-400">CreatorAI is powered by Google Gemini 3.8 Flash</p>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className={`p-4 rounded-xl border mb-6 flex items-start justify-between gap-3 ${
          status.configured 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-start gap-2.5">
            {status.configured ? (
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {status.configured ? 'AI Integration Active & Connected' : 'Configuration Required for Live AI Generation'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">
                {status.configured 
                  ? `Connected securely to Google ${status.provider} (${status.model}). All generation features are fully operational.`
                  : 'GEMINI_API_KEY is not detected in your environment. You can use Sample Mode or add your key below.'}
              </p>
            </div>
          </div>
          <button
            onClick={onRefreshStatus}
            disabled={isChecking}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
          >
            <RefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
            Check
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Key size={16} className="text-purple-400" />
            How to Connect Your Free Gemini API Key
          </h3>

          <div className="space-y-3 text-xs md:text-sm text-slate-300">
            <div className="flex gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
              <div>
                <p className="font-medium text-white">Get a Free Google Gemini API Key</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Visit Google AI Studio (<a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">aistudio.google.com <ExternalLink size={10} /></a>) and click <strong>Get API Key</strong>. Free tier provides generous quotas at $0 cost.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
              <div>
                <p className="font-medium text-white">Add to Secrets / Environment</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  In AI Studio, open the left panel or <strong>Settings &gt; Secrets</strong>, add the variable name <code className="bg-slate-900 px-1.5 py-0.5 rounded text-purple-300 font-mono text-[11px]">GEMINI_API_KEY</code>, and paste your key.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
              <div>
                <p className="font-medium text-white">Instant Safe Execution</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  CreatorAI runs queries strictly through our backend server (<code className="bg-slate-900 px-1 py-0.5 rounded text-blue-300 font-mono text-[11px]">server.ts</code>). Your API key is <strong>never</strong> transmitted or exposed in the client browser.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Free Limits & Cost Transparency */}
        <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl mb-6">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            Cost & Free Development Options
          </h4>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li><strong className="text-slate-200">100% Free Development:</strong> Gemini 3.8 Flash includes a free tier without billing requirements for rapid prototyping.</li>
            <li><strong className="text-slate-200">Usage Limits:</strong> Free tier permits up to 15 Requests Per Minute (RPM) and 1,500 Requests Per Day (RPD).</li>
            <li><strong className="text-slate-200">Sample Preview Mode:</strong> Each generator in CreatorAI includes realistic sample templates so you can test all features and copy functions immediately even without an API key.</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-purple-900/30 transition-all cursor-pointer min-h-[44px]"
          >
            Got it, Let&apos;s Create
          </button>
        </div>
      </div>
    </div>
  );
};
