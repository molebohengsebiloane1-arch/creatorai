import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Youtube, 
  MessageSquare, 
  Film, 
  Lightbulb, 
  CreditCard, 
  History, 
  Menu, 
  X, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  Zap
} from 'lucide-react';
import { AppTab, AIStatus, UserUsageState } from '../types';
import { DemoToggle } from './DemoToggle';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  status: AIStatus;
  onOpenSetup: () => void;
  historyCount: number;
  onOpenHistory: () => void;
  demoMode: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
  usage?: UserUsageState;
  onOpenUsageModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  onOpenSetup,
  historyCount,
  onOpenHistory,
  demoMode,
  onToggleDemoMode,
  usage,
  onOpenUsageModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { tab: AppTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { tab: 'script-generator', label: 'Video Scripts', icon: <Video size={16} /> },
    { tab: 'youtube-assistant', label: 'YouTube SEO', icon: <Youtube size={16} /> },
    { tab: 'social-captions', label: 'Social Captions', icon: <MessageSquare size={16} /> },
    { tab: 'video-planner', label: 'Video Planner', icon: <Film size={16} /> },
    { tab: 'content-ideas', label: 'Ideas Hub', icon: <Lightbulb size={16} /> },
    { tab: 'pricing', label: 'Pricing', icon: <CreditCard size={16} /> },
  ];

  const handleNavClick = (tab: AppTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B14]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-purple-900/30 group-hover:shadow-purple-700/50 transition-all">
              <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
                <Sparkles size={20} className="text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-sans">
                  Creator<span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-purple-500/10 text-purple-300 rounded border border-purple-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Create Smarter. Grow Faster.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-inner shadow-purple-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-purple-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Install PWA Button */}
            <PWAInstallButton />

            {/* Demo Mode Switch */}
            <div className="hidden xs:block">
              <DemoToggle
                demoMode={demoMode}
                onToggle={onToggleDemoMode}
                size="sm"
              />
            </div>

            {/* Daily Generations Remaining Quota Badge (Requirement 1) */}
            <button
              onClick={onOpenUsageModal}
              title="Daily generations remaining - Click to view cost & quota details"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                (usage?.dailyRemaining ?? 5) > 2
                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
                  : (usage?.dailyRemaining ?? 5) > 0
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25 animate-pulse'
              }`}
            >
              <Zap size={13} className="text-purple-400" />
              <span className="font-mono text-[11px]">
                {usage ? `${usage.dailyRemaining}/${usage.dailyLimit}` : '5/5'}
              </span>
              <span className="hidden sm:inline text-[11px] font-normal text-slate-300">
                left
              </span>
            </button>

            {/* AI Status Pill */}
            <button
              onClick={onOpenSetup}
              title="Click to view AI setup and model details"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                status.configured
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status.configured ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}`} />
              <span className="hidden md:inline font-mono text-[11px]">
                {status.configured ? 'Gemini 3.8 Flash' : 'AI Setup'}
              </span>
              <span className="md:hidden text-[11px]">
                {status.configured ? 'AI Ready' : 'Setup'}
              </span>
            </button>

            {/* Saved Work / History Button */}
            <button
              onClick={onOpenHistory}
              title="Saved generations history"
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <History size={18} />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#080B14]">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60 transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu for Tablets / Foldables */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0A0E1A]/95 px-4 pt-3 pb-4 space-y-1 animate-in slide-in-from-top-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">
            Creation Tools
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-purple-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
