import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, CheckCircle2, ArrowRight, Copy, Check, Search } from 'lucide-react';
import { PROMPT_CATEGORIES } from '../data/promptLibrary';
import { useProgress } from '../hooks/useProgress';

const ICON_MAP = {
  GraduationCap: () => <span>🎓</span>,
  Briefcase: () => <span>💼</span>,
  TrendingUp: () => <span>📈</span>,
  PenLine: () => <span>✍️</span>,
  Mail: () => <span>📧</span>,
  BarChart3: () => <span>📊</span>,
  Lightbulb: () => <span>💡</span>,
  CalendarDays: () => <span>📅</span>,
  UserCog: () => <span>👤</span>,
  BookOpen: () => <span>📖</span>,
};

function PromptCard({ prompt, color }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(prompt.template).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div data-testid="prompt-card" className={`border border-${color}-500/20 bg-${color}-500/5 rounded-xl p-4 hover:border-${color}-500/40 transition-all`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className={`text-${color}-400 font-semibold text-sm`}>{prompt.title}</h4>
        <div className="flex gap-1 shrink-0">
          {prompt.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className={`text-[10px] bg-${color}-500/10 text-${color}-400 px-1.5 py-0.5 rounded`}>{tag}</span>
          ))}
        </div>
      </div>
      <p className="text-zinc-300 text-xs font-mono leading-relaxed mb-3 line-clamp-3">{prompt.template}</p>
      {expanded && (
        <div className="mb-3 p-3 bg-zinc-900/60 rounded-lg border border-zinc-800">
          <div className="text-zinc-500 text-[10px] font-semibold mb-1 uppercase">Пример:</div>
          <p className="text-zinc-400 text-xs font-mono">{prompt.example}</p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button onClick={copy} data-testid="copy-library-prompt"
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${copied ? 'border-green-500/30 text-green-400 bg-green-500/10' : `border-${color}-500/20 text-${color}-400 hover:bg-${color}-500/10`}`}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Скопировано!' : 'Копировать'}
        </button>
        <button onClick={() => setExpanded(!expanded)}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline">
          {expanded ? 'Скрыть пример' : 'Пример'}
        </button>
      </div>
    </div>
  );
}

export default function PromptLibraryPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('prompt-library');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = PROMPT_CATEGORIES.filter(cat =>
    activeCategory === 'all' || cat.id === activeCategory
  ).map(cat => ({
    ...cat,
    prompts: cat.prompts.filter(p =>
      !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.template.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(cat => cat.prompts.length > 0);

  const totalPrompts = PROMPT_CATEGORIES.reduce((acc, cat) => acc + cat.prompts.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in" data-testid="prompt-library-page">
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Library size={20} className="text-green-400" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Модуль 7 · Ресурс</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Библиотека промтов</h1>
            <p className="text-zinc-400">{totalPrompts}+ готовых промтов по категориям. Копируйте, адаптируйте, используйте.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">20 мин</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Найти промт..."
          data-testid="prompt-search"
          className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveCategory('all')} data-testid="filter-all"
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeCategory === 'all' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200'}`}>
          Все категории
        </button>
        {PROMPT_CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.icon];
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} data-testid={`filter-${cat.id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${activeCategory === cat.id ? `bg-${cat.color}-500/20 text-${cat.color}-400 border border-${cat.color}-500/30` : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200'}`}>
              {IconComp && <IconComp />}
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Prompt Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">Промты не найдены. Попробуйте изменить поиск.</div>
      ) : (
        <div className="space-y-6">
          {filtered.map((cat) => {
            const IconComp = ICON_MAP[cat.icon];
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-2 mb-3">
                  {IconComp && <span className="text-lg"><IconComp /></span>}
                  <h2 className={`font-heading text-base font-bold ${cat.textColor}`}>{cat.title}</h2>
                  <span className="text-xs text-zinc-600">{cat.prompts.length} промтов</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {cat.prompts.map((prompt, i) => (
                    <PromptCard key={i} prompt={prompt} color={cat.color} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('prompt-library')} data-testid="mark-complete-library"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/module/roles')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Следующий модуль <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
