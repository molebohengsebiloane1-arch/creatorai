import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Video, 
  Youtube, 
  MessageSquare, 
  Film, 
  Lightbulb, 
  Clock, 
  Copy, 
  ExternalLink,
  Sparkles,
  Zap,
  Filter
} from 'lucide-react';
import { HistoryRecord, AppTab } from '../types';
import { CopyButton } from './CopyButton';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  records: HistoryRecord[];
  onClearAll: () => void;
  onDeleteItem: (id: string) => void;
  onSelectRecord: (record: HistoryRecord) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  records,
  onClearAll,
  onDeleteItem,
  onSelectRecord,
}) => {
  const [filter, setFilter] = useState<'all' | 'ai' | 'demo'>('all');

  if (!isOpen) return null;

  const typeIcons = {
    script: <Video size={16} className="text-purple-400" />,
    youtube: <Youtube size={16} className="text-rose-400" />,
    social: <MessageSquare size={16} className="text-blue-400" />,
    planner: <Film size={16} className="text-cyan-400" />,
    ideas: <Lightbulb size={16} className="text-amber-400" />,
  };

  const typeLabels = {
    script: 'Video Script',
    youtube: 'YouTube Package',
    social: 'Social Captions',
    planner: 'Video Plan',
    ideas: 'Content Ideas',
  };

  const aiCount = records.filter((r) => !r.isDemo).length;
  const demoCount = records.filter((r) => r.isDemo).length;

  const displayedRecords = records.filter((rec) => {
    if (filter === 'ai') return !rec.isDemo;
    if (filter === 'demo') return !!rec.isDemo;
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md h-full bg-[#0A0E1A] border-l border-slate-800 flex flex-col justify-between shadow-2xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-black text-white">Saved Generations</h2>
              <p className="text-xs text-slate-400">{records.length} items saved locally</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close history drawer"
            >
              <X size={20} />
            </button>
          </div>

          {/* AI vs Demo Filter Tabs (Requirement 6: Keep demo content separate from real AI-generated content) */}
          <div className="pt-3 pb-2 flex items-center gap-1.5 border-b border-slate-800/60">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              All ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'ai'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-900 text-purple-300/80 hover:text-purple-200'
              }`}
            >
              <Sparkles size={12} className="text-purple-300" />
              <span>Real AI ({aiCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('demo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filter === 'demo'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-900 text-amber-400 hover:text-amber-300'
              }`}
            >
              <Zap size={12} />
              <span>Demo ({demoCount})</span>
            </button>
          </div>

          {/* List */}
          <div className="mt-3 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {displayedRecords.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <Clock size={32} className="mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-400">
                  {filter === 'demo' ? 'No Demo samples yet' : filter === 'ai' ? 'No AI generations yet' : 'No saved generations yet'}
                </p>
                <p className="text-xs">Generated scripts and plans will automatically appear here.</p>
              </div>
            ) : (
              displayedRecords.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onSelectRecord(rec)}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700/60">
                        {typeIcons[rec.type]}
                        {typeLabels[rec.type]}
                      </span>
                      {rec.isDemo ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                          <Zap size={9} />
                          DEMO
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                          <Sparkles size={9} />
                          AI
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                    {rec.title}
                  </h4>

                  <p className="text-xs text-slate-400 truncate">
                    Topic: {rec.topic}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-purple-400 font-semibold group-hover:underline flex items-center gap-1">
                      Open Tool <ExternalLink size={12} />
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(rec.id);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        {records.length > 0 && (
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer py-2"
            >
              <Trash2 size={14} />
              <span>Clear All History</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
