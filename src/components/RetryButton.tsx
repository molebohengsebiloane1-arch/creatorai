import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, Zap } from 'lucide-react';

interface RetryButtonProps {
  onRetry: () => void;
  isLoading: boolean;
  delaySeconds?: number;
  label?: string;
  className?: string;
  attemptCount?: number;
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  isLoading,
  delaySeconds = 3,
  label = 'Retry AI Generation',
  className = '',
  attemptCount = 0,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((c) => (c !== null ? c - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      onRetry();
    }
    return () => clearTimeout(timer);
  }, [countdown, onRetry]);

  const handleStartCountdown = () => {
    if (isLoading) return;
    setCountdown(delaySeconds);
  };

  const handleImmediateRetry = () => {
    setCountdown(null);
    onRetry();
  };

  if (countdown !== null && countdown > 0) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleImmediateRetry}
          className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          title="Click to retry immediately without waiting"
        >
          <RefreshCw size={14} className="animate-spin text-purple-400" />
          <span>Retrying in {countdown}s... (Click for Now)</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleStartCountdown}
      disabled={isLoading}
      className={`px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-950/40 border border-purple-400/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 min-h-[40px] ${className}`}
    >
      <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
      <span>{isLoading ? 'Retrying...' : label}</span>
      {attemptCount > 0 && (
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
          #{attemptCount + 1}
        </span>
      )}
    </button>
  );
};
