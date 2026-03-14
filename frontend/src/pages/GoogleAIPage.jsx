import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { TipBox, WarningBox, InfoBox } from '../components/shared/TipBox';
import { useProgress } from '../hooks/useProgress';

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/30 transition-colors text-left">
        <h3 className="font-semibold text-white">{title}</h3>
        {open ? <ChevronUp size={18} className="text-zinc-400" /> : <ChevronDown size={18} className="text-zinc-400" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-zinc-800/50 pt-4 space-y-4">{children}</div>}
    </div>
  );
};

const googleTools = [
  {
    tool: 'Gemini в Gmail',
    icon: '📧',
    color: 'blue',
    desc: 'Пишет и улучшает письма прямо в интерфейсе Gmail',
    scenarios: ['Ответить на длинное письмо в 2 клика', 'Резюмировать цепочку писем', 'Написать письмо на профессиональном языке'],
    prompt: 'Напиши вежливый профессиональный ответ на это письмо, подтверди получение и скажи что отвечу подробнее до конца дня.',
  },
  {
    tool: 'Gemini в Google Docs',
    icon: '📄',
    color: 'blue',
    desc: 'Помогает писать, редактировать и структурировать документы',
    scenarios: ['Написать черновик статьи или отчёта', 'Улучшить стиль и структуру текста', 'Создать оглавление автоматически'],
    prompt: 'Напиши введение для статьи о преимуществах удалённой работы. Объём: 2 абзаца, тон: профессиональный, но доступный.',
  },
  {
    tool: 'Gemini в Google Таблицах',
    icon: '📊',
    color: 'green',
    desc: 'Помогает с формулами, анализом данных и автоматизацией',
    scenarios: ['Создать формулу не зная Excel', 'Объяснить что делает сложная формула', 'Предложить способы анализа данных'],
    prompt: 'Напиши формулу для подсчёта суммы всех ячеек в столбце B, где значение в столбце A равно "Выполнено".',
  },
  {
    tool: 'Gemini в Google Slides',
    icon: '🎞️',
    color: 'yellow',
    desc: 'Создаёт структуру и контент для презентаций',
    scenarios: ['Создать структуру слайдов', 'Написать текст для конкретного слайда', 'Предложить визуальные концепции'],
    prompt: 'Создай структуру презентации "Годовые итоги команды маркетинга" на 8 слайдов с кратким описанием содержания каждого.',
  },
  {
    tool: 'Google NotebookLM',
    icon: '📒',
    color: 'green',
    desc: 'AI-инструмент для работы с вашими собственными документами',
    scenarios: ['Загрузите PDF/статьи и задавайте вопросы', 'Генерация резюме и ключевых тезисов', 'Создание подкаста из документов (аудио)'],
    prompt: 'Создай краткое резюме из загруженных материалов, выдели 5 ключевых инсайтов и сформируй список вопросов для дискуссии.',
  },
  {
    tool: 'Google AI Studio',
    icon: '🔧',
    color: 'blue',
    desc: 'Инструмент для разработчиков и продвинутых пользователей',
    scenarios: ['Тестировать разные модели Gemini', 'Настраивать системные инструкции', 'Эксперименты с промтами'],
    prompt: 'Для продвинутых пользователей: позволяет задать системные инструкции, выбрать модель и настроить параметры генерации.',
  },
];

export default function GoogleAIPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('google-ai');
  const [activeCard, setActiveCard] = useState(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="google-ai-page">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe size={20} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Модуль 9 · Платформа</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Google AI Pro и инструменты</h1>
            <p className="text-zinc-400">Что такое Google AI Pro, Gemini Advanced и как AI встроен в экосистему Google.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">20 мин</span>
        </div>
      </div>

      <WarningBox title="Важная оговорка">
        Информация об условиях, функциях и доступности Google AI Pro может меняться. Всегда проверяйте актуальные данные на официальном сайте Google. Мы используем формулировки "обычно включает", "может включать" — так как условия зависят от страны и тарифа.
      </WarningBox>

      <Section title="Что такое Google AI Pro?" defaultOpen={true}>
        <p className="text-zinc-300 text-sm leading-relaxed">
          <strong className="text-white">Google AI Pro</strong> (ранее Google One AI Premium) — это платная подписка от Google, которая обычно включает расширенный доступ к <strong className="text-blue-400">Gemini Advanced</strong> — наиболее мощной версии AI-ассистента Google.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="border border-zinc-700 bg-zinc-900/30 rounded-xl p-4">
            <div className="text-zinc-400 font-semibold text-sm mb-3">Бесплатный Gemini</div>
            {['Базовый чат с Gemini', 'Поиск в интернете', 'Базовые изображения', 'Ограниченный контекст'].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-zinc-400 py-1"><CheckCircle2 size={12} className="text-green-500" />{f}</div>
            ))}
          </div>
          <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-4">
            <div className="text-blue-400 font-semibold text-sm mb-3">Google AI Pro (типично включает)</div>
            {['Gemini Advanced — мощная модель', 'Очень длинный контекст (до 1M токенов)', 'Интеграция во весь Google Workspace', 'Приоритетный доступ к новым функциям', 'Google Drive интеграция'].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-blue-300 py-1"><CheckCircle2 size={12} className="text-blue-400" />{f}</div>
            ))}
          </div>
        </div>
        <InfoBox title="Актуальная информация">
          Функции и цены могут варьироваться по стране и меняться. Проверяйте на one.google.com или gemini.google.com.
        </InfoBox>
      </Section>

      <Section title="Google AI инструменты: полный обзор">
        <p className="text-zinc-300 text-sm mb-4">Нажмите на инструмент чтобы увидеть сценарии и пример промта:</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {googleTools.map((tool, i) => (
            <div key={i}
              data-testid={`google-tool-${i}`}
              onClick={() => setActiveCard(activeCard === i ? null : i)}
              className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                activeCard === i ? `border-${tool.color}-500/40 bg-${tool.color}-500/5` : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <div className={`font-semibold text-sm ${activeCard === i ? `text-${tool.color}-400` : 'text-white'}`}>{tool.tool}</div>
                  <p className="text-zinc-500 text-xs">{tool.desc}</p>
                </div>
              </div>
              {activeCard === i && (
                <div className="space-y-3 mt-3 pt-3 border-t border-zinc-700">
                  <div>
                    <div className="text-green-400 text-xs font-semibold mb-1">Практические сценарии:</div>
                    {tool.scenarios.map((sc, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs text-zinc-300 py-0.5">
                        <CheckCircle2 size={11} className="text-green-500 shrink-0" />
                        {sc}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-yellow-400 text-xs font-semibold mb-1">Пример промта:</div>
                    <p className="text-zinc-300 text-xs font-mono bg-zinc-900 rounded-lg p-2 leading-relaxed">{tool.prompt}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Типичный рабочий день с Google AI">
        <div className="space-y-3">
          {[
            { time: 'Утро', icon: '🌅', desc: 'Открываете Gmail → Gemini резюмирует важные письма за ночь → Отвечаете на приоритетные одним нажатием' },
            { time: 'Совещание', icon: '👥', desc: 'Google Meet записывает разговор → Gemini создаёт протокол с ключевыми решениями и задачами' },
            { time: 'Написание отчёта', icon: '📄', desc: 'В Google Docs Gemini помогает структурировать и написать черновик отчёта за 10 минут вместо часа' },
            { time: 'Работа с данными', icon: '📊', desc: 'В Google Sheets Gemini объясняет формулы и помогает автоматизировать рутинные расчёты' },
            { time: 'Презентация', icon: '🎞️', desc: 'Gemini помогает создать структуру и написать тексты слайдов для завтрашней презентации' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <div className="text-blue-400 font-semibold text-sm mb-0.5">{item.time}</div>
                <p className="text-zinc-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <TipBox title="Самый важный совет">
          Начните с одного Google-инструмента, который вы уже используете каждый день. Найдите в нём кнопку Gemini и попробуйте. Результаты вас удивят.
        </TipBox>
      </Section>

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('google-ai')} data-testid="mark-complete-google"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/module/tools')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Следующий модуль <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
