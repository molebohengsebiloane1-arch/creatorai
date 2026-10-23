import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  variant = 'secondary',
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs min-h-[36px]',
    md: 'px-3.5 py-2 text-sm min-h-[44px]',
    lg: 'px-5 py-3 text-base min-h-[48px] font-semibold',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? copiedLabel : label}
        aria-label={copied ? copiedLabel : label}
        className={`inline-flex items-center justify-center p-2 rounded-lg transition-all min-w-[40px] min-h-[40px] ${
          copied
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50'
        } ${className}`}
      >
        {copied ? (
          <Check size={iconSizes[size]} className="animate-in zoom-in-50 text-emerald-400" />
        ) : (
          <Copy size={iconSizes[size]} />
        )}
      </button>
    );
  }

  const variantClasses = {
    primary: copied
      ? 'bg-emerald-600 text-white border-emerald-500'
      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/30 border border-purple-400/30',
    secondary: copied
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 hover:border-slate-600',
    ghost: copied
      ? 'text-emerald-400 bg-emerald-500/10'
      : 'text-slate-300 hover:text-white hover:bg-slate-800/60',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all font-medium active:scale-95 cursor-pointer ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {copied ? (
        <>
          <Check size={iconSizes[size]} className="text-emerald-300" />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy size={iconSizes[size]} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
