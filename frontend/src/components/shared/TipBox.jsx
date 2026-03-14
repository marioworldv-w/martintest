import React from 'react';
import { Lightbulb, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export function TipBox({ children, title = 'Совет' }) {
  return (
    <div data-testid="tip-box" className="border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-4 flex gap-3">
      <Lightbulb size={18} className="text-yellow-400 shrink-0 mt-0.5" />
      <div>
        {title && <p className="text-yellow-400 font-semibold text-sm mb-1">{title}</p>}
        <div className="text-zinc-300 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function WarningBox({ children, title = 'Частая ошибка' }) {
  return (
    <div data-testid="warning-box" className="border border-red-500/30 bg-red-500/5 rounded-xl p-4 flex gap-3">
      <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
      <div>
        {title && <p className="text-red-400 font-semibold text-sm mb-1">{title}</p>}
        <div className="text-zinc-300 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function SuccessBox({ children, title = 'Хорошо сделано' }) {
  return (
    <div data-testid="success-box" className="border border-green-500/30 bg-green-500/5 rounded-xl p-4 flex gap-3">
      <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
      <div>
        {title && <p className="text-green-400 font-semibold text-sm mb-1">{title}</p>}
        <div className="text-zinc-300 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function InfoBox({ children, title }) {
  return (
    <div data-testid="info-box" className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-4 flex gap-3">
      <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
      <div>
        {title && <p className="text-blue-400 font-semibold text-sm mb-1">{title}</p>}
        <div className="text-zinc-300 text-sm">{children}</div>
      </div>
    </div>
  );
}
