import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Cpu, MessageSquare, Sparkles, ArrowLeftRight, Terminal, Presentation, Dumbbell, FileText, Printer, CheckCircle2, ArrowRight, Wrench, Library, UserCog, Globe, Layers, Play, ChevronRight, Zap } from 'lucide-react';
import { MODULES, TOOLS_SECTION } from '../data/courseData';
import { useProgress } from '../hooks/useProgress';

const ICON_MAP = { Cpu, MessageSquare, Sparkles, ArrowLeftRight, Terminal, Wrench, Library, UserCog, Globe, Layers, Presentation, Dumbbell, FileText, Printer, BookOpen, Zap };

export default function HomePage() {
  const navigate = useNavigate();
  const { isComplete, getProgressPercent } = useProgress();
  const progressPct = getProgressPercent(MODULES.length);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in" data-testid="home-page">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 via-[#0D0D0D] to-[#0A0A0A] p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent)]" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Бесплатный курс
            </span>
            <span className="text-xs text-zinc-500">2 часа · Для начинающих · Русский язык</span>
          </div>
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            AI Basics: ChatGPT,<br />
            <span className="text-blue-400">Gemini</span> и Промтинг
          </h1>
          <p className="text-zinc-400 text-base max-w-xl mb-6">
            Полный практический курс по AI-ассистентам для начинающих. Научитесь пользоваться ChatGPT и Gemini, писать эффективные промты и использовать AI в повседневной работе.
          </p>

          {/* Progress bar */}
          {progressPct > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                <span>Ваш прогресс</span>
                <span className="text-blue-400 font-semibold">{progressPct}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              data-testid="start-learning-btn"
              onClick={() => navigate('/module/intro')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25"
            >
              <Play size={16} />
              Начать обучение
            </button>
            <button
              data-testid="teaching-mode-btn"
              onClick={() => navigate('/teaching-mode')}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
            >
              <Presentation size={16} />
              Режим преподавателя
            </button>
            <button
              data-testid="practice-btn"
              onClick={() => navigate('/practice')}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
            >
              <Dumbbell size={16} />
              Практика
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Модулей', value: '10', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Промтов в библиотеке', value: '120+', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { label: 'Упражнений', value: '5', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
          { label: 'Инструментов', value: '5', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
            <div className={`font-heading text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-zinc-400 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-white">Модули курса</h2>
          <span className="text-xs text-zinc-500">{MODULES.filter(m => isComplete(m.id)).length}/{MODULES.length} завершено</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {MODULES.map((mod) => {
            const Icon = ICON_MAP[mod.icon] || BookOpen;
            const done = isComplete(mod.id);
            return (
              <button
                key={mod.id}
                data-testid={`module-card-${mod.id}`}
                onClick={() => navigate(mod.path)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group ${
                  done
                    ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50'
                    : `${mod.borderColor} ${mod.bgColor} hover:shadow-${mod.color}-900/20`
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${mod.bgColor} border ${mod.borderColor}`}>
                    {done ? <CheckCircle2 size={16} className="text-green-400" /> : <Icon size={16} className={mod.textColor} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${mod.textColor}`}>{mod.tag}</span>
                    <span className="text-[10px] text-zinc-600">{mod.duration}</span>
                  </div>
                </div>
                <div className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${mod.textColor}`}>
                  Модуль {mod.number}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5 group-hover:text-zinc-100">{mod.title}</h3>
                <p className="text-zinc-500 text-xs line-clamp-2">{mod.description}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  <span>Открыть</span>
                  <ArrowRight size={12} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Section */}
      <div>
        <h2 className="font-heading text-lg font-bold text-white mb-4">Инструменты платформы</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOOLS_SECTION.map((tool) => {
            const Icon = ICON_MAP[tool.icon] || BookOpen;
            return (
              <button
                key={tool.path}
                data-testid={`tool-card-${tool.path.replace('/', '')}`}
                onClick={() => navigate(tool.path)}
                className={`text-left p-4 rounded-xl border ${tool.borderColor} ${tool.bgColor} hover:brightness-110 transition-all duration-200 hover:-translate-y-0.5 group`}
              >
                <Icon size={20} className={`${tool.textColor} mb-3`} />
                <div className="text-white font-semibold text-sm mb-1">{tool.title}</div>
                <p className="text-zinc-500 text-xs">{tool.description}</p>
                {tool.path === '/teaching-mode' && (
                  <span className="mt-2 inline-block text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded">LIVE</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcomes */}
      <div className="border border-zinc-800 bg-zinc-900/30 rounded-2xl p-6">
        <h2 className="font-heading text-lg font-bold text-white mb-4">Чему вы научитесь</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Что такое ChatGPT и как начать им пользоваться',
            'Что такое Gemini и как использовать его в Gmail и Docs',
            'Чем отличаются ChatGPT и Gemini, когда что использовать',
            'Как писать эффективные промты по формуле',
            'Как использовать роли для профессиональных ответов',
            'Практическую библиотеку из 120+ готовых промтов',
            'Как встроить AI в повседневные рабочие задачи',
            'Что такое Google AI Pro и Google AI-экосистема',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
              <span className="text-zinc-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
