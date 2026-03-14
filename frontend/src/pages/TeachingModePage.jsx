import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Presentation, Clock, ChevronDown, ChevronUp, Play, RotateCcw,
  BookOpen, MessageSquare, Dumbbell, Zap, Library, FileText, Printer,
  ChevronRight, ChevronLeft, Eye, StickyNote, RotateCw, ArrowRight,
  Target, Lightbulb, Users, Copy, Check
} from 'lucide-react';
import { TEACHING_TIMELINE, MODULES } from '../data/courseData';

const BLOCK_EXTRAS = {
  block1: {
    showLive: [
      'Откройте ChatGPT в браузере — покажите интерфейс',
      'Задайте: "Привет! Что ты умеешь делать?" — покажите ответ',
      'Откройте Gemini — покажите интерфейс для сравнения',
    ],
    sayToStudent: [
      'Сегодня мы научимся пользоваться AI-ассистентами — это проще, чем вы думаете',
      'AI — это не робот из фильмов. Это инструмент, как калькулятор, только для текста',
      'Не бойтесь ошибаться — AI не обижается и не устаёт',
    ],
    miniPractice: 'Откройте ChatGPT или Gemini на своём телефоне/компьютере. Задайте любой вопрос. Поделитесь ответом с соседом.',
    recap: 'AI-ассистенты — это инструменты. ChatGPT от OpenAI, Gemini от Google. Качество ответа зависит от запроса.',
  },
  block2: {
    showLive: [
      'Покажите регистрацию в ChatGPT (chat.openai.com)',
      'Продемонстрируйте: простой запрос → сложный запрос',
      'Покажите историю чатов, как начать новый чат',
      'Покажите разницу: "напиши текст" vs детальный промт',
    ],
    sayToStudent: [
      'ChatGPT — самый популярный AI-ассистент в мире',
      'Бесплатная версия достаточна для большинства задач',
      'Главный секрет: чем подробнее вы спрашиваете, тем лучше ответ',
    ],
    miniPractice: 'Попросите ChatGPT объяснить вашу профессию 5-летнему ребёнку. Оцените результат: понятно ли?',
    recap: 'ChatGPT умеет писать, объяснять, анализировать. Работает через chat.openai.com. Бесплатный доступ достаточен.',
  },
  block3: {
    showLive: [
      'Откройте gemini.google.com — покажите интерфейс',
      'Покажите Gemini в Gmail — кнопку "Помощь от Gemini"',
      'В Google Docs: создайте документ → попросите Gemini написать текст',
      'Покажите, как Gemini ищет актуальную информацию',
    ],
    sayToStudent: [
      'Gemini от Google — значит он уже встроен в ваш Gmail и Google Docs',
      'Главное отличие: Gemini знает актуальные новости, ChatGPT может не знать',
      'Если вы используете Google — Gemini уже у вас под рукой',
    ],
    miniPractice: 'Откройте Gemini и спросите то, что обычно ищете в Google. Сравните: что удобнее?',
    recap: 'Gemini от Google. Встроен в Gmail, Docs, Drive. Знает актуальную информацию. Особенно удобен для пользователей Google.',
  },
  block4: {
    showLive: [
      'Откройте ChatGPT и Gemini рядом (2 вкладки/окна)',
      'Задайте одинаковый промт в оба: "Составь план дня для фрилансера"',
      'Покажите оба ответа на экране — пусть студенты сравнивают',
      'Обсудите: где какой ответ лучше и почему',
    ],
    sayToStudent: [
      'Нет "лучшего" AI — есть лучший для конкретной задачи',
      'ChatGPT сильнее в творчестве и длинных текстах',
      'Gemini удобнее если вы уже в Google-экосистеме',
      'Профессионалы используют оба инструмента',
    ],
    miniPractice: 'Выберите задачу из своей жизни. Решите: ChatGPT или Gemini лучше подходит? Обоснуйте выбор соседу.',
    recap: 'Оба инструмента хорошие. ChatGPT = творчество, код, длинные тексты. Gemini = Google, актуальность, документы.',
  },
  block5: {
    showLive: [
      'Покажите трансформацию промта вживую:',
      'Слабый: "Напиши письмо" → покажите результат',
      'Сильный: "Ты — менеджер. Напиши письмо клиенту Алексею..." → покажите результат',
      'Разница очевидна — это wow-момент урока!',
      'Откройте страницу "Демо-промты" → раздел "Уровни качества"',
    ],
    sayToStudent: [
      'Формула: Роль + Цель + Контекст + Ограничения + Формат',
      'Запомните: AI не умеет читать мысли — чем подробнее, тем лучше',
      'Промт можно улучшать — не нужно сразу писать идеально',
    ],
    miniPractice: 'Возьмите свой первый простой запрос из начала урока. Улучшите его по формуле: добавьте роль, контекст, формат.',
    recap: 'Промт = запрос к AI. Формула: Роль + Цель + Контекст + Ограничения + Формат. Итерируйте — улучшайте ответ.',
  },
  block6: {
    showLive: [
      'Задайте вопрос БЕЗ роли: "Как увеличить продажи?"',
      'Задайте тот же вопрос С ролью: "Ты — маркетолог с 10-летним опытом. Как увеличить продажи малому бизнесу?"',
      'Покажите оба ответа рядом — разница поразительная',
      'Откройте страницу "Демо-промты" → "Ролевые демо"',
    ],
    sayToStudent: [
      'Роль — это "персонаж" для AI. Как актёр в фильме.',
      '"Действуй как..." — волшебные слова',
      'Разные роли = разные ответы на один вопрос',
    ],
    miniPractice: 'Задайте свой вопрос с ролью "преподаватель" и без роли. Какая разница? Поделитесь с группой.',
    recap: 'Роли меняют тон, стиль и глубину ответа. "Действуй как..." + профессия = профессиональный результат.',
  },
  block7: {
    showLive: [
      'Покажите страницу google.com/ai — обзор Google AI',
      'Откройте Gmail → покажите кнопку "Помощь от Gemini"',
      'В Google Docs → покажите как Gemini помогает писать',
      'Покажите Google Drive + Gemini (анализ документов)',
    ],
    sayToStudent: [
      'Google AI Pro — это расширенный Gemini для тех, кто много работает с Google',
      'Бесплатный Gemini уже даёт многое — платная версия для продвинутых',
      'Всё, что мы изучили про промты — работает и в Gemini',
    ],
    miniPractice: 'Найдите кнопку Gemini в одном из ваших Google-инструментов (Gmail, Docs). Попробуйте её использовать.',
    recap: 'Google AI Pro = расширенный Gemini. Встроен в Gmail, Docs, Drive. Удобен для пользователей Google Workspace.',
  },
  block8: {
    showLive: [
      'Покажите шпаргалку на экране (/cheatsheet)',
      'Пройдитесь по формуле промта ещё раз',
      'Покажите библиотеку промтов — пусть каждый найдёт что-то для себя',
      'Попросите 2-3 студентов поделиться своим лучшим промтом за урок',
    ],
    sayToStudent: [
      'Главное — практикуйтесь каждый день, хотя бы 10 минут',
      'Шпаргалка и библиотека промтов — ваши помощники после урока',
      'AI не заменит вас — он усилит вас. Вы + AI > AI без вас',
    ],
    miniPractice: 'Напишите промт для РЕАЛЬНОЙ задачи из вашей жизни/работы. Используйте формулу. Протестируйте прямо сейчас.',
    recap: 'ChatGPT + Gemini — два мощных инструмента. Формула промта — ваш ключ. Практикуйтесь каждый день!',
  },
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-all ${copied ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}>
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Скопировано' : 'Копировать'}
    </button>
  );
}

export default function TeachingModePage() {
  const navigate = useNavigate();
  const [activeBlock, setActiveBlock] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState({});
  const blockRefs = useRef({});

  const totalMinutes = 120;
  const currentBlock = TEACHING_TIMELINE.find(b => currentTime >= b.timeStart && currentTime < b.timeEnd);

  const tabMap = {
    explain: { label: 'Объяснять', icon: BookOpen },
    showLive: { label: 'Показать', icon: Eye },
    sayToStudent: { label: 'Сказать', icon: Users },
    demo: { label: 'Демо-промт', icon: Play },
    task: { label: 'Практика', icon: Dumbbell },
    recap: { label: 'Итог', icon: RotateCw },
  };

  const getTab = (blockId) => activeTab[blockId] || 'explain';
  const setTab = (blockId, tab) => setActiveTab(prev => ({ ...prev, [blockId]: tab }));

  const scrollToBlock = (idx) => {
    setActiveBlock(idx);
    blockRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in" data-testid="teaching-mode-page">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6" style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(10,10,28,0.95) 60%)',
        border: '1px solid rgba(239,68,68,0.25)'
      }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Presentation size={20} className="text-red-400" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Режим преподавателя</span>
              <span className="badge-premium" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(239,68,68,0.15))', borderColor: 'rgba(239,68,68,0.35)', color: '#FCA5A5' }}>LIVE</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">2-часовой план урока</h1>
            <p className="text-zinc-400 text-sm">Полный поминутный план с подсказками, демо, заданиями и итогами для каждого блока.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => { setStarted(true); setCurrentTime(0); }} data-testid="start-lesson-btn"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-red-600/25">
              <Play size={16} /> Начать урок
            </button>
            <button onClick={() => { setStarted(false); setCurrentTime(0); }}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-white transition-colors" style={{ background: 'rgba(15,15,30,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RotateCcw size={16} />
            </button>
            <button onClick={() => window.print()}
              className="no-print p-2.5 rounded-xl text-zinc-400 hover:text-white transition-colors" style={{ background: 'rgba(15,15,30,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Printer size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Toolbar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 no-print" data-testid="quick-access-toolbar">
        {[
          { label: 'Демо-промты', icon: Zap, path: '/demo-prompts', color: 'yellow', desc: 'Промты для показа' },
          { label: 'Библиотека', icon: Library, path: '/module/prompt-library', color: 'green', desc: '120+ готовых промтов' },
          { label: 'Шпаргалка', icon: FileText, path: '/cheatsheet', color: 'blue', desc: 'Формулы и правила' },
          { label: 'Печать', icon: Printer, path: '/print-center', color: 'zinc', desc: 'Материалы для печати' },
        ].map((item, i) => (
          <button key={i} onClick={() => navigate(item.path)} data-testid={`quick-${item.label}`}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:-translate-y-0.5 text-left group`}
            style={{ background: 'rgba(10,10,26,0.80)', border: `1px solid rgba(var(--tw-${item.color}), 0.15)` }}>
            <item.icon size={18} className={`text-${item.color}-400 shrink-0`} />
            <div>
              <div className={`text-sm font-semibold text-${item.color === 'zinc' ? 'zinc-300' : item.color + '-400'} group-hover:text-white transition-colors`}>{item.label}</div>
              <div className="text-[10px] text-zinc-600">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Block Navigation */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-print" data-testid="block-nav">
        {TEACHING_TIMELINE.map((block, idx) => {
          const isActive = started && currentTime >= block.timeStart && currentTime < block.timeEnd;
          const isPast = started && currentTime >= block.timeEnd;
          return (
            <button key={idx} onClick={() => scrollToBlock(idx)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isActive ? `bg-${block.color}-500/20 text-${block.color}-400 border-${block.color}-500/30` :
                isPast ? 'bg-zinc-900/30 text-zinc-600 border-zinc-800' :
                activeBlock === idx ? 'bg-zinc-800 text-zinc-200 border-zinc-600' :
                'bg-zinc-900/30 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-600'
              }`}>
              {block.timeStart}′ {block.title.split(':')[0]}
            </button>
          );
        })}
      </div>

      {/* Timeline Progress */}
      {started && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(10,10,26,0.85)', border: '1px solid rgba(239,68,68,0.12)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-red-400" />
              <span className="text-white font-semibold text-sm">Минута: {currentTime}</span>
              {currentBlock && (
                <span className={`text-xs text-${currentBlock.color}-400 font-medium`}>— {currentBlock.title}</span>
              )}
            </div>
            <span className="text-zinc-500 text-xs">{currentTime}/{totalMinutes} мин</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / totalMinutes) * 100}%` }} />
          </div>
          <input type="range" min="0" max="120" value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            data-testid="time-slider"
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-red-500" />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            {[0, 15, 30, 45, 60, 75, 90, 105, 120].map(t => <span key={t}>{t}′</span>)}
          </div>
        </div>
      )}

      {/* Lesson Blocks */}
      <div className="space-y-3">
        {TEACHING_TIMELINE.map((block, idx) => {
          const isActive = started && currentTime >= block.timeStart && currentTime < block.timeEnd;
          const isPast = started && currentTime >= block.timeEnd;
          const isOpen = activeBlock === idx;
          const tab = getTab(block.id);
          const extras = BLOCK_EXTRAS[block.id] || {};
          const module = MODULES.find(m => m.id === block.moduleRef);

          return (
            <div key={block.id} ref={el => blockRefs.current[idx] = el}
              data-testid={`teaching-block-${idx}`}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isActive ? 'ring-1 ring-' + block.color + '-500/50 shadow-lg' :
                isPast ? 'opacity-50' : ''
              }`}
              style={{ background: 'rgba(8,8,22,0.85)', border: isActive ? `1px solid rgba(var(--tw-${block.color}), 0.4)` : '1px solid rgba(255,255,255,0.05)' }}>

              {/* Block Header */}
              <button onClick={() => setActiveBlock(isOpen ? null : idx)}
                className="w-full flex items-center gap-4 p-4 lg:p-5 text-left transition-colors hover:bg-white/[0.02]">
                <div className={`shrink-0 w-16 text-center px-2 py-1.5 rounded-lg ${isActive ? `bg-${block.color}-500/15 border border-${block.color}-500/25` : 'bg-zinc-900/60 border border-zinc-800'}`}>
                  <div className={`text-xs font-bold ${isActive ? `text-${block.color}-400` : 'text-zinc-400'}`}>{block.timeStart}–{block.timeEnd}</div>
                  <div className="text-zinc-600 text-[10px]">мин</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm truncate ${isActive ? `text-${block.color}-400` : 'text-white'}`}>{block.title}</h3>
                    {isActive && <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 shrink-0 animate-pulse">СЕЙЧАС</span>}
                  </div>
                  <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{block.goal}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-zinc-600 text-xs">{block.timeEnd - block.timeStart} мин</span>
                  {isOpen ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
                </div>
              </button>

              {/* Block Content */}
              {isOpen && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  {/* Teacher Note Banner */}
                  {module?.teacherNote && (
                    <div className="mx-4 mt-4 flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.12)' }}>
                      <StickyNote size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                      <p className="text-yellow-300/80 text-xs">{module.teacherNote}</p>
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="flex overflow-x-auto mx-4 mt-3 gap-1 pb-1">
                    {Object.entries(tabMap).map(([key, { label, icon: Icon }]) => (
                      <button key={key} onClick={() => setTab(block.id, key)} data-testid={`tab-${key}-${idx}`}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                          tab === key
                            ? `bg-${block.color}-500/15 text-${block.color}-400 border border-${block.color}-500/25`
                            : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                        }`}>
                        <Icon size={12} />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-4">
                    {tab === 'explain' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <Target size={14} className={`text-${block.color}-400`} />
                          <p className={`text-${block.color}-400 font-semibold text-xs`}>Цель: {block.goal}</p>
                        </div>
                        {block.explain.map((point, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className={`w-5 h-5 rounded-full bg-${block.color}-500/15 border border-${block.color}-500/20 flex items-center justify-center shrink-0 mt-0.5`}>
                              <span className={`text-${block.color}-400 text-[10px] font-bold`}>{i + 1}</span>
                            </div>
                            <p className="text-zinc-300 text-sm">{point}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === 'showLive' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye size={14} className="text-blue-400" />
                          <span className="text-blue-400 font-semibold text-xs uppercase tracking-wide">Что показать на экране</span>
                        </div>
                        {(extras.showLive || []).map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.08)' }}>
                            <ChevronRight size={12} className="text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-zinc-300 text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === 'sayToStudent' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={14} className="text-green-400" />
                          <span className="text-green-400 font-semibold text-xs uppercase tracking-wide">Что сказать студентам</span>
                        </div>
                        {(extras.sayToStudent || []).map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.08)' }}>
                            <MessageSquare size={12} className="text-green-400 shrink-0 mt-0.5" />
                            <p className="text-zinc-300 text-sm">"{item}"</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === 'demo' && (
                      <div className="space-y-3">
                        <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-400 font-semibold text-xs uppercase tracking-wide">Демо-промт</span>
                            <CopyButton text={block.demo} />
                          </div>
                          <p className="text-zinc-200 font-mono text-sm leading-relaxed">{block.demo}</p>
                          <p className="text-zinc-500 text-xs mt-3">Откройте ChatGPT или Gemini → вставьте промт → покажите результат</p>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: 'rgba(234,179,8,0.04)', border: '1px solid rgba(234,179,8,0.10)' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare size={12} className="text-yellow-400" />
                            <span className="text-yellow-400 font-semibold text-xs">Вопрос студентам:</span>
                          </div>
                          <p className="text-zinc-300 text-sm">"{block.question}"</p>
                        </div>
                      </div>
                    )}

                    {tab === 'task' && (
                      <div className="space-y-3">
                        <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Dumbbell size={14} className="text-green-400" />
                            <span className="text-green-400 font-semibold text-xs uppercase tracking-wide">Задание студентам</span>
                          </div>
                          <p className="text-zinc-200 text-sm leading-relaxed">{block.task}</p>
                          <p className="text-zinc-500 text-xs mt-3">Дайте 3-5 минут на выполнение. Обсудите результаты.</p>
                        </div>
                        {extras.miniPractice && (
                          <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb size={14} className="text-indigo-400" />
                              <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wide">Мини-практика</span>
                            </div>
                            <p className="text-zinc-300 text-sm">{extras.miniPractice}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {tab === 'recap' && (
                      <div className="space-y-3">
                        <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <RotateCw size={14} className="text-violet-400" />
                            <span className="text-violet-400 font-semibold text-xs uppercase tracking-wide">Краткое повторение</span>
                          </div>
                          <p className="text-zinc-200 text-sm leading-relaxed font-medium">{extras.recap || 'Подведите итоги этого блока перед переходом к следующему.'}</p>
                        </div>
                        <p className="text-zinc-500 text-xs">Скажите это перед переходом к следующей части. Повторение закрепляет знания.</p>
                      </div>
                    )}
                  </div>

                  {/* Block Footer Nav */}
                  <div className="flex items-center justify-between px-4 pb-4 no-print">
                    {idx > 0 ? (
                      <button onClick={() => scrollToBlock(idx - 1)} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        <ChevronLeft size={14} /> Предыдущий блок
                      </button>
                    ) : <div />}
                    {idx < TEACHING_TIMELINE.length - 1 && (
                      <button onClick={() => scrollToBlock(idx + 1)} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        Следующий блок <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Links for Teacher */}
      <div className="rounded-2xl p-5 no-print" style={{ background: 'rgba(8,8,22,0.85)', border: '1px solid rgba(239,68,68,0.12)' }}>
        <h3 className="text-red-400 font-semibold mb-3 text-sm flex items-center gap-2">
          <Target size={14} /> Быстрые ссылки преподавателя
        </h3>
        <div className="grid sm:grid-cols-3 gap-2">
          {[
            { label: 'Демо-промты для показа', path: '/demo-prompts', icon: Zap, color: 'yellow' },
            { label: 'Библиотека 120+ промтов', path: '/module/prompt-library', icon: Library, color: 'green' },
            { label: 'Шпаргалка для раздачи', path: '/cheatsheet', icon: FileText, color: 'blue' },
          ].map((link, i) => (
            <button key={i} onClick={() => navigate(link.path)}
              className={`flex items-center gap-2 p-3 rounded-xl text-left border border-${link.color}-500/15 bg-${link.color}-500/5 hover:bg-${link.color}-500/10 transition-all`}>
              <link.icon size={14} className={`text-${link.color}-400`} />
              <span className={`text-sm text-${link.color}-400`}>{link.label}</span>
              <ArrowRight size={12} className="text-zinc-600 ml-auto" />
            </button>
          ))}
        </div>
      </div>

      {/* Teacher Tips */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(8,8,22,0.85)', border: '1px solid rgba(239,68,68,0.12)' }}>
        <h3 className="text-red-400 font-semibold mb-3 text-sm">Советы преподавателю</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Держите ChatGPT и Gemini открытыми — используйте вживую',
            'Не торопитесь — пауза после демо лучше быстрого перехода',
            'Задавайте вопросы каждые 10-15 минут',
            'Если студент спрашивает — превращайте в демонстрацию',
            'Распечатайте шпаргалку заранее — раздайте в конце',
            'Практика в конце — самый важный момент урока',
            'Используйте страницу "Демо-промты" для живых примеров',
            'Сохраняйте удачные ответы AI на экране — это мотивирует',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <ChevronRight size={12} className="text-red-400 shrink-0 mt-1" />
              <span className="text-zinc-300">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
