import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Youtube, 
  Film, 
  Lightbulb, 
  Sparkles 
} from 'lucide-react';
import { AppTab } from '../types';

interface MobileBottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navTabs: { tab: AppTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
    { tab: 'script-generator', label: 'Scripts', icon: <Video size={20} /> },
    { tab: 'youtube-assistant', label: 'YouTube', icon: <Youtube size={20} /> },
    { tab: 'video-planner', label: 'Planner', icon: <Film size={20} /> },
    { tab: 'content-ideas', label: 'Ideas', icon: <Lightbulb size={20} /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090D18]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shadow-2xl safe-area-pb">
      <div className="grid grid-cols-5 gap-1 items-center max-w-md mx-auto">
        {navTabs.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer select-none min-h-[52px] ${
                isActive
                  ? 'text-purple-400 bg-purple-500/10 font-bold'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full shadow-sm shadow-purple-400" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
