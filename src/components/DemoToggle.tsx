import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

interface DemoToggleProps {
  demoMode: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const DemoToggle: React.FC<DemoToggleProps> = ({
  demoMode,
  onToggle,
  className = '',
  size = 'md',
}) => {
  return (
    <div
      onClick={() => onToggle(!demoMode)}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer select-none transition-all ${
        demoMode
          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-md shadow-amber-950/30'
          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
      } ${className}`}
      title={demoMode ? 'Demo Mode is active (no API key needed)' : 'Switch to Demo Mode to test without AI requests'}
    >
      <div className="flex items-center gap-1.5">
        <Zap size={size === 'sm' ? 12 : 14} className={demoMode ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-slate-400'} />
        <span className={`font-bold tracking-tight ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
          Demo Mode:
        </span>
      </div>

      <div className={`relative w-8 h-4.5 rounded-full transition-colors flex items-center p-0.5 ${
        demoMode ? 'bg-amber-500' : 'bg-slate-700'
      }`}>
        <div className={`w-3.5 h-3.5 rounded-full bg-slate-950 shadow-sm transition-transform transform ${
          demoMode ? 'translate-x-3.5' : 'translate-x-0'
        }`} />
      </div>

      <span className={`text-[10px] font-bold uppercase tracking-wider ${demoMode ? 'text-amber-300' : 'text-slate-500'}`}>
        {demoMode ? 'ON' : 'OFF'}
      </span>
    </div>
  );
};

export const DemoBadge: React.FC<{ isDemo?: boolean; className?: string }> = ({
  isDemo = false,
  className = '',
}) => {
  if (isDemo) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-950/20 ${className}`}>
        <Zap size={13} className="text-amber-400 fill-amber-400" />
        <span>DEMO MODE SAMPLE (NO API REQUIRED)</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-950/20 ${className}`}>
      <Sparkles size={13} className="text-purple-400" />
      <span>AI GENERATED (GEMINI 3.8 FLASH)</span>
    </span>
  );
};
