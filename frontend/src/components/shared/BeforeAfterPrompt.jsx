import React, { useState } from 'react';
import { ArrowRight, Copy, Check } from 'lucide-react';

// Before/After prompt comparison component
export default function BeforeAfterPrompt({ before, after, beforeLabel = 'Слабый промт', afterLabel = 'Сильный промт' }) {
  const [copied, setCopied] = useState(false);

  const copyAfter = () => {
    navigator.clipboard.writeText(after).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div data-testid="before-after-block" className="space-y-3">
      {/* Before */}
      <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded uppercase tracking-wide">
            {beforeLabel}
          </span>
        </div>
        <p className="text-zinc-300 text-sm font-mono">{before}</p>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <ArrowRight size={18} className="text-zinc-600" />
      </div>

      {/* After */}
      <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded uppercase tracking-wide">
            {afterLabel}
          </span>
          <button
            onClick={copyAfter}
            data-testid="copy-prompt-btn"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
        </div>
        <p className="text-zinc-200 text-sm font-mono whitespace-pre-wrap">{after}</p>
      </div>
    </div>
  );
}
