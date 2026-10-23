import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  X, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isStandalone, triggerInstall } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  const handleInstallClick = async () => {
    if (isIOS) {
      setModalOpen(true);
      return;
    }

    const installed = await triggerInstall();
    if (installed) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    } else {
      // If prompt was not immediately triggered by browser, show guide modal
      setModalOpen(true);
    }
  };

  // If already running standalone and installed, show installed badge
  if (isStandalone || isInstalled) {
    return (
      <div 
        title="CreatorAI is installed and running in App Mode" 
        className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold"
      >
        <CheckCircle2 size={13} className="text-emerald-400" />
        <span>App Installed</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Install CreatorAI on your phone or desktop for quick access"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600/30 to-blue-600/30 hover:from-purple-600/50 hover:to-blue-600/50 text-purple-200 border border-purple-500/40 hover:border-purple-400 shadow-sm transition-all cursor-pointer select-none active:scale-95"
      >
        <Download size={13} className="text-purple-400" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Installation Guide & Android / iOS Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F1423] border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close install modal"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 p-0.5 shadow-lg shadow-purple-900/40">
                <div className="w-full h-full bg-[#0F1423] rounded-[14px] flex items-center justify-center">
                  <Smartphone size={24} className="text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Install CreatorAI App
                </h3>
                <p className="text-xs text-slate-400">
                  Full-screen experience on Android, iOS &amp; Desktop
                </p>
              </div>
            </div>

            {/* Platform Instructions */}
            <div className="space-y-4">
              {/* Android Instructions */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <Smartphone size={16} />
                  <span>On Android (Chrome / Brave / Edge / Samsung Internet):</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1">
                  <li>
                    Tap the <strong>three dots menu (⋮)</strong> at the top right of your browser.
                  </li>
                  <li>
                    Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>
                    CreatorAI will be added to your home screen and app drawer with a dedicated app icon and standalone window.
                  </li>
                </ol>
                <button
                  onClick={async () => {
                    const done = await triggerInstall();
                    if (done) setModalOpen(false);
                  }}
                  className="mt-2 w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-purple-950/40"
                >
                  <Download size={14} />
                  <span>Trigger Instant Browser Install Prompt</span>
                </button>
              </div>

              {/* iOS Instructions */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
                  <Share size={16} />
                  <span>On iPhone / iPad (Safari):</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1">
                  <li>
                    Tap the <strong>Share</strong> button <Share size={12} className="inline mx-1 text-blue-400" /> in Safari's bottom toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare size={12} className="inline mx-1 text-slate-300" />.
                  </li>
                  <li>
                    Tap <strong>"Add"</strong> in the top-right corner.
                  </li>
                </ol>
              </div>

              {/* Desktop Chrome/Edge Instructions */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-purple-400">
                  <Download size={16} />
                  <span>On Desktop (Chrome, Edge, Brave):</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click the install icon in the URL bar (top right) or press the button below to install as a standalone desktop window.
                </p>
              </div>

              {/* Clear Offline Capabilities Disclosure (Requirement 2 & Constraints) */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <WifiOff size={15} />
                  <span>Offline vs. Online Capabilities Notice</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>What works offline:</strong> The complete app interface, saved project history, export/copy tools, and <strong>Demo Mode</strong> (sample templates tailored to your topics) work seamlessly without an internet connection.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong>What requires internet:</strong> Live AI generation via Google Gemini Flash requires an active network connection to query our secure server-side proxy.
                </p>
              </div>

              {/* Security statement */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Zero client-side secrets. API credentials never leak to installed device.</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
