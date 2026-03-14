import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Copy, Check, ChevronRight, Star } from 'lucide-react';

const QUALITY_PROMPTS = [
  {
    task: 'Написать письмо клиенту',
    bad: 'Напиши письмо клиенту',
    average: 'Напиши вежливое письмо клиенту об извинениях за задержку',
    strong: 'Ты — менеджер по работе с клиентами. Напиши вежливое письмо клиенту Марине с извинениями за задержку доставки на 3 дня. Предложи скидку 10% на следующий заказ. Тон: искренний, профессиональный. Длина: 4-5 предложений.',
    premium: 'Ты — старший менеджер по работе с ключевыми клиентами luxury-бренда. Напиши персонализированное письмо клиентке Марине Соколовой с искренними извинениями за задержку доставки на 3 дня. Подчеркни ценность клиента, объясни причину (технические неполадки на складе), предложи: скидку 10% + приоритетная доставка следующего заказа. Тон: тёплый, уважительный, без канцеляризмов. Структура: открытие → признание проблемы → объяснение → компенсация → заверение.',
    insight: 'Чем больше контекста (роль, получатель, причина, что предложить, тон, структура) — тем более персонализированный и профессиональный результат.',
  },
  {
    task: 'Объяснить сложную тему',
    bad: 'Объясни нейросети',
    average: 'Объясни нейронные сети простым языком',
    strong: 'Объясни нейронные сети простыми словами для человека без технического фона. Используй аналогию из повседневной жизни. Формат: 3 абзаца.',
    premium: 'Ты — преподаватель IT для гуманитариев с 8-летним опытом. Объясни нейронные сети человеку, который никогда не изучал программирование. Используй 2 разных аналогии (одну из кулинарии, одну из спорта). Структура: 1) Что это? (1 предложение), 2) Как это работает? (аналогия), 3) Зачем нам это? (2-3 примера из жизни). В конце задай 1 вопрос проверки понимания.',
    insight: 'Роль + конкретные аналогии + структура + проверочный вопрос = полноценный обучающий материал вместо Wikipedia-статьи.',
  },
];

const DEMO_PROMPTS = [
  {
    category: 'Базовые объяснения',
    color: 'blue',
    icon: '🧠',
    prompts: [
      { title: 'Объяснить нейросеть', text: 'Объясни простыми словами, что такое нейросеть — как будто объясняешь школьнику. Используй аналогию из реальной жизни.' },
      { title: 'Что такое ChatGPT', text: 'Объясни в 2-3 предложениях что такое ChatGPT и чем он отличается от обычного поиска в Google.' },
      { title: 'Что такое промт', text: 'Что такое "промт"? Объясни начинающему пользователю ChatGPT. Приведи 2 примера: слабый промт и сильный промт.' },
      { title: 'Чем отличается GPT от Gemini', text: 'Объясни простыми словами разницу между ChatGPT и Gemini. Для кого каждый из них лучше подходит?' },
    ],
  },
  {
    category: 'Практические задачи',
    color: 'green',
    icon: '⚡',
    prompts: [
      { title: 'Краткое резюме текста', text: 'Сделай краткое резюме этого текста в 5 ключевых пунктах — только самое важное:\n\n[вставьте любой текст длиной 200-500 слов]' },
      { title: 'Перепиши профессионально', text: 'Перепиши это письмо в более вежливом и профессиональном стиле, сохрани смысл:\n\nПривет, я хотел спросить насчёт нашего проекта, ты когда сделаешь свою часть? Уже долго жду.' },
      { title: 'Составь план на 7 дней', text: 'Составь пошаговый план изучения темы "основы Excel" для начинающего на 7 дней. Для каждого дня: тема + конкретное упражнение.' },
      { title: 'Хаос в план', text: 'Преврати мои хаотичные мысли в чёткий план действий:\n\nМне нужно найти новых клиентов, сделать сайт получше, написать про нас в соцсетях, поднять цены, наладить учёт.' },
    ],
  },
  {
    category: 'Демонстрация ролей',
    color: 'yellow',
    icon: '🎭',
    prompts: [
      { title: 'Роль: преподаватель', text: 'Выступи как опытный преподаватель и объясни понятие "воронка продаж" новичку в маркетинге — просто, с реальным примером.' },
      { title: 'Роль: маркетолог', text: 'Ты — опытный маркетолог. Придумай 10 идей контента для Instagram-аккаунта об онлайн-образовании. Разные форматы: обучение, вовлечение, продажа.' },
      { title: 'Роль: аналитик', text: 'Ты — бизнес-аналитик. Проанализируй ситуацию: онлайн-магазин теряет клиентов 3-й месяц подряд. Какие 5 причин наиболее вероятны? Что проверить в первую очередь?' },
      { title: 'Роль: редактор', text: 'Ты — строгий редактор. Найди все слабые места в этом тексте и предложи конкретные улучшения:\n\nНаша компания уже много лет делает очень хорошие продукты. Клиенты нас любят и всегда возвращаются снова.' },
    ],
  },
  {
    category: 'Форматирование вывода',
    color: 'red',
    icon: '📋',
    prompts: [
      { title: 'Сравнительная таблица', text: 'Сделай таблицу сравнения ChatGPT и Gemini по параметрам: разработчик, сильные стороны, интеграции, доступ к интернету, цена.' },
      { title: '3 варианта ответа', text: 'Напиши ответ на возражение клиента "У вас слишком дорого" в 3 вариантах: 1) простой и прямой, 2) профессиональный и убедительный, 3) эмоциональный и человечный.' },
      { title: 'Шаги + таймлайн', text: 'Разбей задачу "запустить YouTube-канал" на конкретные шаги с временными рамками. Формат: таблица с колонками: шаг, что делать, сколько времени.' },
      { title: 'Задай уточняющие вопросы', text: 'Я хочу запустить онлайн-курс. Прежде чем давать советы, задай мне 5 уточняющих вопросов, которые помогут тебе дать более точные рекомендации.' },
    ],
  },
  {
    category: 'Итерация и улучшение',
    color: 'blue',
    icon: '🔄',
    prompts: [
      { title: 'Улучшить этот промт', text: 'Улучши следующий промт так, чтобы AI дал более точный и полезный ответ. Объясни что именно ты изменил и почему:\n\n"помоги мне с маркетингом"' },
      { title: 'Сделать короче', text: '[После получения длинного ответа]\nСделай этот ответ вдвое короче, оставь только самое важное.' },
      { title: 'Изменить тон', text: '[После получения ответа]\nПерепиши тот же ответ, но в более неформальном и дружелюбном тоне — как если бы объяснял другу.' },
      { title: 'Добавить примеры', text: '[После объяснения теории]\nХорошо! Теперь приведи 3 конкретных реальных примера из жизни, которые подтверждают эту теорию.' },
    ],
  },
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} data-testid="demo-copy-btn"
      className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${copied ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'}`}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Скопировано' : 'Копировать'}
    </button>
  );
}

export default function DemoPromptsPage() {
  const navigate = useNavigate();
  const [activeQuality, setActiveQuality] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in" data-testid="demo-prompts-page">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6" style={{
        background: 'linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(10,10,28,0.95) 60%)',
        border: '1px solid rgba(234,179,8,0.20)'
      }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Демо-промты</span>
              <span className="badge-premium">LIVE УРОК</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Промты для демонстрации</h1>
            <p className="text-zinc-400 text-sm max-w-xl">Готовые промты для живого показа на уроке. Копируйте и демонстрируйте вживую.</p>
          </div>
          <button onClick={() => window.print()} className="no-print shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/10 transition-all">
            Печать
          </button>
        </div>
      </div>

      {/* Prompt Quality Comparison */}
      <div>
        <h2 className="font-heading text-lg font-bold text-white mb-2">Уровни качества промта</h2>
        <p className="text-zinc-400 text-sm mb-4">Один и тот же запрос — 4 уровня промта. Покажите разницу студентам вживую.</p>
        <div className="flex gap-2 mb-4 flex-wrap">
          {QUALITY_PROMPTS.map((q, i) => (
            <button key={i} onClick={() => setActiveQuality(i)} data-testid={`quality-task-${i}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeQuality === i ? 'text-yellow-400 border-yellow-500/30' : 'text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}
              style={{ background: activeQuality === i ? 'rgba(234,179,8,0.08)' : 'rgba(15,15,30,0.6)', border: '1px solid' }}>
              {q.task}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Слабый', level: 'bad', color: 'red', star: 1 },
            { label: 'Средний', level: 'average', color: 'yellow', star: 2 },
            { label: 'Сильный', level: 'strong', color: 'blue', star: 3 },
            { label: 'Премиум', level: 'premium', color: 'green', star: 4 },
          ].map(({ label, level, color, star }) => {
            const text = QUALITY_PROMPTS[activeQuality][level];
            return (
              <div key={level} className="rounded-xl p-4 flex flex-col gap-2" style={{ background: 'rgba(12,12,30,0.85)', border: `1px solid rgba(var(--color), 0.18)` }}
                data-testid={`quality-${level}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-${color}-400 font-bold text-xs uppercase tracking-wide`}>{label}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star key={i} size={10} className={i < star ? `text-${color}-400 fill-current` : 'text-zinc-700'} />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-300 text-xs font-mono leading-relaxed flex-1">{text}</p>
                <CopyBtn text={text} />
              </div>
            );
          })}
        </div>

        <div className="mt-3 rounded-xl p-3 text-sm" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}>
          <span className="text-yellow-400 font-semibold">Инсайт: </span>
          <span className="text-zinc-300">{QUALITY_PROMPTS[activeQuality].insight}</span>
        </div>
      </div>

      {/* Demo Prompts by Category */}
      <div>
        <h2 className="font-heading text-lg font-bold text-white mb-2">Демо-промты по категориям</h2>
        <p className="text-zinc-400 text-sm mb-4">Выберите категорию → скопируйте → покажите в ChatGPT или Gemini</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {DEMO_PROMPTS.map((cat, i) => (
            <button key={i} onClick={() => setActiveCategory(i)} data-testid={`demo-cat-${i}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${activeCategory === i ? `text-${cat.color}-400 border-${cat.color}-500/30` : 'text-zinc-500 border-zinc-700/60 hover:text-zinc-300'}`}
              style={{ background: activeCategory === i ? `rgba(var(--bg-${cat.color}), 0.08)` : 'rgba(12,12,30,0.6)' }}>
              {cat.icon} {cat.category}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {DEMO_PROMPTS[activeCategory].prompts.map((p, i) => (
            <div key={i} data-testid={`demo-prompt-${i}`} className="rounded-xl p-4 flex flex-col gap-3 hover-glow-blue transition-all duration-300"
              style={{ background: 'rgba(10,10,26,0.90)', border: `1px solid rgba(59,130,246,0.10)` }}>
              <div className={`text-${DEMO_PROMPTS[activeCategory].color}-400 font-semibold text-sm`}>{p.title}</div>
              <p className="text-zinc-300 text-xs font-mono leading-relaxed flex-1 whitespace-pre-wrap">{p.text}</p>
              <CopyBtn text={p.text} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips for Teacher */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(8,8,22,0.85)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
          <span>🎯</span> Подсказки преподавателю
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Копируйте промт → вставляйте в ChatGPT → комментируйте ответ вслух',
            'Сначала покажите слабый промт, потом сильный — разница очевидна',
            'Спрашивайте студентов: "Что бы вы добавили в этот промт?"',
            'После каждого демо давайте 2 минуты — пусть повторят сами',
            'Сохраняйте удачные ответы AI прямо на экране — это мотивирует',
            'Раздел "Уровни качества" — лучший момент для wow-эффекта',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <ChevronRight size={14} className="text-red-400 shrink-0 mt-0.5" />
              <span className="text-zinc-300">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
