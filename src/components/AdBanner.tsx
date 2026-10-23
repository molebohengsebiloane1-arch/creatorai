import React, { useState } from 'react';
import { Megaphone, ExternalLink, ShieldCheck, ChevronDown, ChevronUp, Info, CheckCircle2 } from 'lucide-react';

interface AdBannerProps {
  placement?: 'dashboard' | 'footer' | 'sidebar';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement = 'dashboard',
  className = '',
}) => {
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <aside 
      aria-label="Advertising and sponsorship space"
      className={`relative rounded-2xl bg-gradient-to-r from-slate-900/95 via-[#0c1222] to-slate-900/95 border border-slate-800 p-4 sm:p-5 transition-all shadow-md ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
            <Megaphone size={18} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                Reserved Ad Space
              </span>
              <span className="text-[10px] font-semibold text-purple-400/90 flex items-center gap-1">
                <ShieldCheck size={12} />
                Integration Ready (AdSense / Carbon Ads)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
              This slot is prepared for certified ad networks. No fake ads, deceptive trackers, or fabricated promotions are served.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px]"
          >
            <Info size={13} className="text-purple-400" />
            <span>{showSetupGuide ? 'Hide Setup Guide' : 'Ad Provider Setup'}</span>
            {showSetupGuide ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 text-xs transition-colors cursor-pointer"
            title="Dismiss reserved slot"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expandable Legitimate Ad Provider Setup Guide (Requirement 5) */}
      {showSetupGuide && (
        <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-white font-bold">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>How to Connect a Legitimate Ad Network to CreatorAI:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">1. Publisher Approval</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Apply with Google AdSense, Carbon Ads, or EthicalAds using your custom domain.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">2. Host ads.txt</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Place your verified publisher string in <code className="text-purple-300 font-mono">public/ads.txt</code> to validate domain ownership.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">3. Client Script</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Insert your provider script tag with <code className="text-purple-300 font-mono">data-ad-client</code> into <code className="text-purple-300 font-mono">index.html</code>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">4. Server Flag</span>
              <p className="text-[11px] text-slate-400 leading-normal">
                Set <code className="text-purple-300 font-mono">ENABLE_ADS=true</code> in your environment to serve live responsive ad units.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
