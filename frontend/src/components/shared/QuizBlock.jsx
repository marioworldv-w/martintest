import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Quiz block component - shows question, options, reveals answer on click
export default function QuizBlock({ question, options, correct, explanation, color = 'blue' }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const colorMap = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', correct: 'border-green-500 bg-green-500/10', wrong: 'border-red-500 bg-red-500/10' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', correct: 'border-green-500 bg-green-500/10', wrong: 'border-red-500 bg-red-500/10' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', correct: 'border-green-500 bg-green-500/10', wrong: 'border-red-500 bg-red-500/10' },
  };
  const c = colorMap[color] || colorMap.blue;

  const handleSelect = (option) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
  };

  const reset = () => { setSelected(null); setRevealed(false); };

  return (
    <div data-testid="quiz-block" className={`${c.bg} border ${c.border} rounded-xl p-5`}>
      <p className={`text-sm font-semibold ${c.text} mb-3`}>Проверьте себя</p>
      <p className="text-white font-medium mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => {
          let cls = 'border border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:border-zinc-500';
          if (revealed) {
            if (opt === correct) cls = `border ${c.correct} text-green-300`;
            else if (opt === selected) cls = `border ${c.wrong} text-red-300`;
            else cls = 'border border-zinc-800 bg-zinc-900/40 text-zinc-500';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              data-testid={`quiz-option-${i}`}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${cls} ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <div className="mt-4 p-3 rounded-lg bg-zinc-900/60 border border-zinc-700">
          <div className="flex items-center gap-2 mb-1">
            {selected === correct ? (
              <CheckCircle2 size={16} className="text-green-400" />
            ) : (
              <XCircle size={16} className="text-red-400" />
            )}
            <span className={`text-sm font-semibold ${selected === correct ? 'text-green-400' : 'text-red-400'}`}>
              {selected === correct ? 'Верно!' : 'Не совсем — правильный ответ: ' + correct}
            </span>
          </div>
          <p className="text-zinc-400 text-sm">{explanation}</p>
          <button onClick={reset} className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 underline">
            Попробовать ещё раз
          </button>
        </div>
      )}
    </div>
  );
}
