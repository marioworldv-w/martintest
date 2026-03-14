import React, { useState } from 'react';
import { Dumbbell, CheckCircle2, XCircle, ArrowRight, RotateCcw, ChevronRight } from 'lucide-react';
import { EXERCISES } from '../data/practiceData';

function RewriteExercise({ exercise }) {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const sc = exercise.scenarios[scenarioIdx];

  const reset = () => { setAnswer(''); setRevealed(false); };

  return (
    <div className="space-y-4">
      {exercise.scenarios.length > 1 && (
        <div className="flex gap-2">
          {exercise.scenarios.map((_, i) => (
            <button key={i} onClick={() => { setScenarioIdx(i); reset(); }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${scenarioIdx === i ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
              Вариант {i + 1}
            </button>
          ))}
        </div>
      )}
      <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4">
        <div className="text-red-400 text-xs font-semibold mb-1 uppercase">Слабый промт:</div>
        <p className="text-zinc-200 font-mono text-sm">{sc.weak}</p>
      </div>
      <div>
        <label className="text-zinc-400 text-sm font-medium block mb-2">Ваш улучшенный промт:</label>
        <textarea value={answer} onChange={e => setAnswer(e.target.value)}
          placeholder="Напишите улучшенную версию промта..."
          rows={4}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-yellow-500/50 resize-none" />
      </div>
      {answer.trim() && !revealed && (
        <button onClick={() => setRevealed(true)} className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold">
          Показать эталонный ответ
        </button>
      )}
      {revealed && (
        <div className="space-y-3">
          <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-4">
            <div className="text-green-400 text-xs font-semibold mb-1 uppercase">Сильный промт (эталон):</div>
            <p className="text-zinc-200 font-mono text-sm">{sc.strong}</p>
          </div>
          <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-3">
            <div className="text-blue-400 text-xs font-semibold mb-1">Подсказка:</div>
            <p className="text-zinc-300 text-sm">{sc.hint}</p>
          </div>
          <button onClick={reset} className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-sm">
            <RotateCcw size={14} /> Попробовать ещё раз
          </button>
        </div>
      )}
    </div>
  );
}

function ChooseExercise({ exercise }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  const choose = (qIdx, choice) => {
    setAnswers(prev => ({ ...prev, [qIdx]: choice }));
    setRevealed(prev => ({ ...prev, [qIdx]: true }));
  };

  return (
    <div className="space-y-4">
      {exercise.questions.map((q, i) => {
        const chosen = answers[i];
        const isRevealed = revealed[i];
        const isCorrect = chosen === q.correct;
        return (
          <div key={i} className={`border rounded-xl p-4 transition-all ${isRevealed ? (isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5') : 'border-zinc-800 bg-zinc-900/30'}`}>
            <p className="text-white font-medium text-sm mb-3">{i + 1}. {q.task}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {['chatgpt', 'gemini'].map(option => (
                <button key={option} onClick={() => !isRevealed && choose(i, option)}
                  disabled={isRevealed}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                    isRevealed && option === q.correct ? 'border-green-500 bg-green-500/10 text-green-400' :
                    isRevealed && option === chosen && option !== q.correct ? 'border-red-500 bg-red-500/10 text-red-400' :
                    isRevealed ? 'border-zinc-800 text-zinc-600' :
                    'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500 cursor-pointer'
                  }`}>
                  {option === 'chatgpt' ? '🤖 ChatGPT' : '✨ Gemini'}
                </button>
              ))}
            </div>
            {isRevealed && (
              <div className="mt-3 flex items-start gap-2">
                {isCorrect ? <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />}
                <p className="text-zinc-300 text-sm">{isCorrect ? q.explanation : q.wrongExplanation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RoleExercise({ exercise }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});

  return (
    <div className="space-y-4">
      {exercise.questions.map((q, i) => {
        const chosen = answers[i];
        const isRevealed = revealed[i];
        const isCorrect = chosen === q.correct;
        const choose = (opt) => { if (!isRevealed) { setAnswers(p => ({ ...p, [i]: opt })); setRevealed(p => ({ ...p, [i]: true })); }};
        return (
          <div key={i} className={`border rounded-xl p-4 transition-all ${isRevealed ? (isCorrect ? 'border-green-500/30 bg-green-500/5' : 'border-orange-500/30 bg-orange-500/5') : 'border-zinc-800 bg-zinc-900/30'}`}>
            <p className="text-white font-medium text-sm mb-3">{i + 1}. {q.task}</p>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map(opt => (
                <button key={opt} onClick={() => choose(opt)} disabled={isRevealed}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                    isRevealed && opt === q.correct ? 'border-green-500 bg-green-500/10 text-green-400' :
                    isRevealed && opt === chosen ? 'border-orange-500 bg-orange-500/10 text-orange-400' :
                    isRevealed ? 'border-zinc-800 text-zinc-600' :
                    'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
            {isRevealed && <p className="text-zinc-300 text-sm mt-3">{q.explanation}</p>}
          </div>
        );
      })}
    </div>
  );
}

function CompareExercise({ exercise }) {
  const [revealed, setRevealed] = useState(false);
  const [vote, setVote] = useState(null);
  const comp = exercise.comparisons[0];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {[comp.prompt1, comp.prompt2].map((p, i) => (
          <div key={i} className={`border rounded-xl p-4 ${i === 0 ? 'border-red-500/20 bg-red-500/5' : 'border-green-500/20 bg-green-500/5'}`}>
            <div className={`font-semibold text-xs mb-2 uppercase ${i === 0 ? 'text-red-400' : 'text-green-400'}`}>{p.label}</div>
            <div className="text-zinc-400 text-xs mb-2 italic">Промт: "{p.text}"</div>
            <p className="text-zinc-300 text-sm font-mono leading-relaxed whitespace-pre-line">{p.response}</p>
          </div>
        ))}
      </div>
      <p className="text-zinc-300 text-sm font-medium">Какой ответ лучше и почему?</p>
      {!revealed && (
        <div className="flex gap-2">
          {['A', 'B'].map(v => (
            <button key={v} onClick={() => { setVote(v); setRevealed(true); }}
              className={`px-6 py-2.5 rounded-lg font-bold border transition-all ${vote === v ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500'}`}>
              Ответ {v}
            </button>
          ))}
        </div>
      )}
      {revealed && (
        <div className={`border rounded-xl p-4 ${vote === comp.winner ? 'border-green-500/30 bg-green-500/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
          <div className="flex items-center gap-2 mb-2">
            {vote === comp.winner ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-orange-400" />}
            <span className={`font-semibold text-sm ${vote === comp.winner ? 'text-green-400' : 'text-orange-400'}`}>
              {vote === comp.winner ? 'Верно!' : `Не совсем — правильный ответ: Промт ${comp.winner}`}
            </span>
          </div>
          <p className="text-zinc-300 text-sm">{comp.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function PracticePage() {
  const [activeEx, setActiveEx] = useState(0);

  const renderExercise = (ex) => {
    if (ex.type === 'rewrite') return <RewriteExercise exercise={ex} />;
    if (ex.type === 'choose') return <ChooseExercise exercise={ex} />;
    if (ex.type === 'assign-role') return <RoleExercise exercise={ex} />;
    if (ex.type === 'build-prompt') return <BuildPromptExercise exercise={ex} />;
    if (ex.type === 'compare') return <CompareExercise exercise={ex} />;
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="practice-page">
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Dumbbell size={20} className="text-green-400" />
          <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Практические упражнения</span>
        </div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Проверьте свои знания</h1>
        <p className="text-zinc-400">Интерактивные упражнения для закрепления материала по всем темам курса.</p>
      </div>

      {/* Exercise Nav */}
      <div className="flex flex-wrap gap-2">
        {EXERCISES.map((ex, i) => (
          <button key={i} onClick={() => setActiveEx(i)} data-testid={`exercise-tab-${i}`}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${activeEx === i ? `bg-${ex.color}-500/20 text-${ex.color}-400 border border-${ex.color}-500/30` : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200'}`}>
            <span>{i + 1}.</span>
            <span className="hidden sm:inline">{ex.title}</span>
            <span className="sm:hidden">Упр.{i+1}</span>
          </button>
        ))}
      </div>

      {/* Active Exercise */}
      {EXERCISES.map((ex, i) => (
        activeEx === i && (
          <div key={i} data-testid={`exercise-content-${i}`} className={`border ${ex.borderColor} ${ex.bgColor} rounded-2xl p-5 space-y-4 animate-fade-in`}>
            <div>
              <div className={`flex items-center gap-2 mb-1`}>
                <span className={`text-[10px] font-bold ${ex.textColor} uppercase tracking-wider`}>Упражнение {i + 1}</span>
              </div>
              <h2 className="text-white font-bold text-xl">{ex.title}</h2>
              <p className="text-zinc-400 text-sm mt-1">{ex.instruction}</p>
            </div>
            {renderExercise(ex)}
          </div>
        )
      ))}

      {/* Nav between exercises */}
      <div className="flex justify-between">
        {activeEx > 0 ? (
          <button onClick={() => setActiveEx(activeEx - 1)} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-semibold border border-zinc-700 transition-all">
            ← Предыдущее
          </button>
        ) : <div />}
        {activeEx < EXERCISES.length - 1 ? (
          <button onClick={() => setActiveEx(activeEx + 1)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            Следующее <ArrowRight size={16} />
          </button>
        ) : (
          <div className="text-green-400 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            Все упражнения пройдены!
          </div>
        )}
      </div>
    </div>
  );
}

// Simple placeholder for build-prompt exercise
function BuildPromptExercise({ exercise }) {
  const sc = exercise.scenarios[0];
  const [inputs, setInputs] = useState({ role: '', goal: '', context: '', constraints: '', format: '' });
  const [revealed, setRevealed] = useState(false);
  const fields = Object.keys(sc.fields);
  return (
    <div className="space-y-3">
      <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-3">
        <div className="text-yellow-400 text-xs font-semibold mb-1">Расплывчатый запрос:</div>
        <p className="text-zinc-200 font-mono text-sm">"{sc.vague}"</p>
      </div>
      <p className="text-zinc-400 text-sm">Заполните поля формулы:</p>
      {fields.map(f => (
        <div key={f} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <span className="text-yellow-400 text-sm font-semibold w-28 capitalize shrink-0">{f}:</span>
          <input value={inputs[f]} onChange={e => setInputs(p => ({ ...p, [f]: e.target.value }))}
            placeholder={`Введите ${f}...`}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-yellow-500/50" />
        </div>
      ))}
      {Object.values(inputs).some(v => v.trim()) && !revealed && (
        <button onClick={() => setRevealed(true)} className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg text-sm font-semibold">
          Показать эталонный промт
        </button>
      )}
      {revealed && (
        <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-4">
          <div className="text-green-400 text-xs font-semibold mb-2">Эталонный промт:</div>
          <p className="text-zinc-200 font-mono text-sm">{sc.result}</p>
        </div>
      )}
    </div>
  );
}
