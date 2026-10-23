import React, { useEffect, useState } from 'react';
import { 
  X, 
  Activity, 
  Zap, 
  Sparkles, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  CreditCard,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { UserUsageState, CostSummary, AppTab } from '../types';
import { fetchUsageStats } from '../services/api';

interface UsageCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  usage: UserUsageState;
  onRefreshUsage: () => void;
  onNavigateToPricing: () => void;
}

export const UsageCostModal: React.FC<UsageCostModalProps> = ({
  isOpen,
  onClose,
  usage,
  onRefreshUsage,
  onNavigateToPricing,
}) => {
  const [costStats, setCostStats] = useState<CostSummary | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await fetchUsageStats();
      setCostStats(data);
    } catch (e) {
      console.error('Failed to load cost stats', e);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!isOpen) return null;

  const usagePercent = Math.min(100, Math.round((usage.dailyUsed / usage.dailyLimit) * 100));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close usage modal"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Activity size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Daily Quota &amp; Cost Control</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                {usage.planName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live server-enforced quotas, token consumption, and cost tracking.
            </p>
          </div>
        </div>

        {/* Quota Progress Bar Card */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Sparkles size={14} className="text-purple-400" />
              <span>Free Plan Daily Limit:</span>
            </div>
            <span className="font-mono text-xs">
              <strong className="text-purple-300 text-sm">{usage.dailyRemaining}</strong> / {usage.dailyLimit} remaining today
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercent >= 100 
                  ? 'bg-rose-500' 
                  : usagePercent >= 80 
                    ? 'bg-amber-500' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-500" />
              Resets daily at 00:00 UTC
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Zap size={12} className="fill-emerald-400" />
              Demo Mode: Unlimited (Consumes 0 quota)
            </span>
          </div>
        </div>

        {/* Server Cost & Token Monitoring (Requirement 7: Record actual AI usage for cost monitoring) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu size={14} className="text-blue-400" />
              <span>Real AI Cost &amp; Token Audit</span>
            </h3>
            <button
              onClick={loadStats}
              disabled={loadingStats}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} className={loadingStats ? 'animate-spin' : ''} />
              <span>Refresh Stats</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Today Requests</span>
              <span className="text-lg font-black text-white">{costStats?.todayRequests ?? usage.dailyUsed}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Total Tokens</span>
              <span className="text-lg font-black text-purple-300 font-mono">
                {costStats?.totalTokens ? costStats.totalTokens.toLocaleString() : '0'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Est. Gemini Cost</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                ${costStats?.totalEstimatedCostUSD ? costStats.totalEstimatedCostUSD.toFixed(4) : '0.0000'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-0.5">Active Model</span>
              <span className="text-xs font-bold text-slate-200 block truncate mt-1">Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>

        {/* Upgrade Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-slate-900 to-blue-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Need higher volume?</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Creator Pro includes 100 monthly generations for $9.99/mo. Business tier includes 300 for $19.99/mo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToPricing();
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-950/40 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[40px]"
          >
            <CreditCard size={14} />
            <span>View Subscription Plans</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
          <span className="flex items-center gap-1 text-[11px]">
            <ShieldCheck size={13} className="text-purple-400" />
            Server-validated security: Subscription &amp; limits verified per request.
          </span>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
