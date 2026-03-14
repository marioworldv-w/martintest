import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Copy, Check, ChevronRight, Star, Printer, BookOpen, Bot, Sparkles, UserCog, ArrowUpRight, Search } from 'lucide-react';

const QUALITY_PROMPTS = [
  {
    task: 'Написать письмо клиенту',
    bad: 'Напиши письмо клиенту',
    average: 'Напиши вежливое письмо клиенту об извинениях за задержку',
    strong: 'Ты — менеджер по работе с клиентами. Напиши вежливое письмо клиенту Марине с извинениями за задержку доставки на 3 дня. Предложи скидку 10% на следующий заказ. Тон: искренний, профессиональный. Длина: 4-5 предложений.',
    premium: 'Ты — старший менеджер по работе с ключевыми клиентами luxury-бренда. Напиши персонализированное письмо клиентке Марине Соколовой с искренними извинениями за задержку доставки на 3 дня. Подчеркни ценность клиента, объясни причину (технические неполадки на складе), предложи: скидку 10% + приоритетная доставка следующего заказа. Тон: тёплый, уважительный, без канцеляризмов. Структура: открытие, признание проблемы, объяснение, компенсация, заверение.',
    insight: 'Чем больше контекста — тем более персонализированный и профессиональный результат.',
  },
  {
    task: 'Объяснить сложную тему',
    bad: 'Объясни нейросети',
    average: 'Объясни нейронные сети простым языком',
    strong: 'Объясни нейронные сети простыми словами для человека без технического фона. Используй аналогию из повседневной жизни. Формат: 3 абзаца.',
    premium: 'Ты — преподаватель IT для гуманитариев с 8-летним опытом. Объясни нейронные сети человеку, который никогда не изучал программирование. Используй 2 разных аналогии (одну из кулинарии, одну из спорта). Структура: 1) Что это? (1 предложение), 2) Как это работает? (аналогия), 3) Зачем нам это? (2-3 примера из жизни). В конце задай 1 вопрос проверки понимания.',
    insight: 'Роль + конкретные аналогии + структура + проверочный вопрос = полноценный обучающий материал.',
  },
  {
    task: 'Составить план проекта',
    bad: 'Помоги с проектом',
    average: 'Составь план запуска онлайн-курса',
    strong: 'Составь пошаговый план запуска онлайн-курса по инвестициям для начинающих. Разбей на этапы: подготовка, создание, запуск, продвижение. Для каждого этапа — сроки и ключевые задачи.',
    premium: 'Ты — опытный продюсер онлайн-образования. Составь детальный план запуска курса "Инвестиции для начинающих". Аудитория: молодые специалисты 25-35 лет. Бюджет: минимальный. Формат: таблица с 4 фазами (подготовка, производство, запуск, масштабирование). Для каждой фазы: задачи, сроки, бюджет, KPI. Добавь раздел "частые ошибки" с 3 пунктами.',
    insight: 'Чёткая роль + конкретная аудитория + бюджетные ограничения + структура = рабочий план, а не общие советы.',
  },
];

const DEMO_SECTIONS = [
  {
    id: 'beginner',
    title: 'Для новичков',
    subtitle: 'Базовые демонстрации для начала урока',
    icon: BookOpen,
    color: 'blue',
    prompts: [
      { title: 'Что такое AI?', text: 'Объясни в 2-3 предложениях что такое искусственный интеллект — как будто объясняешь бабушке, которая никогда не слышала этот термин.' },
      { title: 'Что такое ChatGPT?', text: 'Объясни что такое ChatGPT простыми словами. Чем он отличается от обычного поиска в Google? Приведи 3 примера задач, которые ChatGPT решает лучше Google.' },
      { title: 'Что такое промт?', text: 'Что такое "промт"? Объясни начинающему пользователю ChatGPT. Приведи 2 примера: слабый промт и сильный промт на одну и ту же тему.' },
      { title: 'Первый запрос', text: 'Привет! Расскажи, что ты умеешь делать? Приведи 10 примеров задач, с которыми ты можешь помочь обычному человеку в повседневной жизни.' },
      { title: 'AI помощник в жизни', text: 'Я обычный офисный работник. Как AI-ассистент может помочь мне экономить 1-2 часа в день? Дай 5 конкретных примеров с реальными задачами.' },
    ],
  },
  {
    id: 'gpt',
    title: 'ChatGPT демо',
    subtitle: 'Демонстрация возможностей ChatGPT',
    icon: Bot,
    color: 'green',
    prompts: [
      { title: 'Творческое письмо', text: 'Напиши короткую мотивирующую историю (5-7 предложений) о человеке, который боялся технологий, но попробовал ChatGPT и это изменило его рабочий день. Стиль: тёплый, вдохновляющий.' },
      { title: 'Анализ текста', text: 'Проанализируй следующий текст коммерческого предложения. Найди 5 слабых мест и предложи конкретные улучшения для каждого:\n\nНаша компания предлагает качественные услуги. Мы работаем давно и у нас много клиентов. Обращайтесь к нам.' },
      { title: 'Структура презентации', text: 'Создай структуру 10-минутной презентации на тему "Как AI меняет малый бизнес". Для каждого слайда: заголовок + 2-3 ключевых тезиса. Аудитория: предприниматели без технического фона.' },
      { title: 'Код и таблицы', text: 'Создай простую таблицу в формате Markdown: сравнение 5 популярных AI-инструментов (ChatGPT, Gemini, Claude, Perplexity, Copilot) по параметрам: бесплатный доступ, сильные стороны, для кого.' },
      { title: 'Персонализация ответов', text: 'Я — начинающий предприниматель, открываю онлайн-магазин детских товаров. Составь мне список из 10 задач, где ChatGPT может помочь мне каждый день. Для каждой задачи приведи пример промта.' },
    ],
  },
  {
    id: 'gemini',
    title: 'Gemini демо',
    subtitle: 'Демонстрация возможностей Gemini',
    icon: Sparkles,
    color: 'blue',
    prompts: [
      { title: 'Актуальная информация', text: 'Найди актуальную информацию: какие новые функции появились в Google Workspace с AI за последний месяц? Структурируй ответ по сервисам: Gmail, Docs, Sheets, Drive.' },
      { title: 'Работа с Google Docs', text: 'Я использую Google Docs для работы. Расскажи 7 способов, как Gemini может помочь мне прямо внутри Google Docs. Для каждого — конкретный пример использования.' },
      { title: 'Анализ длинного документа', text: 'Представь, что я загрузил в Gemini длинный PDF-отчёт на 50 страниц. Какие 10 вопросов я могу задать Gemini по этому документу? Приведи примеры промтов для каждого.' },
      { title: 'Gmail помощник', text: 'Я получил деловое письмо с предложением о сотрудничестве. Помоги составить профессиональный ответ. Тон: заинтересованный, но не чрезмерно. Предложи встречу на следующей неделе.' },
      { title: 'Google Sheets + AI', text: 'Объясни 5 способов использования AI в Google Sheets для анализа данных. Для каждого способа приведи конкретный пример формулы или запроса к Gemini.' },
    ],
  },
  {
    id: 'roles',
    title: 'Ролевые демо',
    subtitle: 'Показать как роли меняют качество ответа',
    icon: UserCog,
    color: 'yellow',
    prompts: [
      { title: 'Без роли vs с ролью', text: 'БЕЗ роли: "Как увеличить продажи?"\n\nС ролью: "Ты — маркетолог-стратег с 10-летним опытом работы с малым бизнесом. Мой онлайн-магазин одежды теряет клиентов 3-й месяц. Оборот упал на 20%. Дай 5 конкретных действий для увеличения продаж в течение 30 дней. Бюджет на маркетинг: 50 000 рублей."' },
      { title: 'Преподаватель', text: 'Ты — опытный преподаватель по маркетингу с 10-летним стажем. Объясни понятие "воронка продаж" для студента-первокурсника. Используй аналогию из повседневной жизни. В конце задай 2 вопроса для проверки понимания.' },
      { title: 'Строгий редактор', text: 'Ты — строгий профессиональный редактор с 15-летним опытом. Найди ВСЕ слабые места в этом тексте и предложи конкретные улучшения:\n\n"Наша компания уже много лет делает очень хорошие продукты. Клиенты нас любят и всегда возвращаются снова. Мы гарантируем качество."' },
      { title: 'Бизнес-аналитик', text: 'Ты — бизнес-аналитик из McKinsey. Проанализируй ситуацию: кофейня в спальном районе Москвы. Средний чек 350 руб, 80 клиентов в день, аренда 200 000 руб/мес. Какие 3 главных рычага роста? Что проверить в первую очередь?' },
      { title: 'HR-специалист', text: 'Ты — опытный HR-менеджер. Я ищу работу маркетологом. Вот моё текущее резюме: "Работал маркетологом 3 года. Занимался рекламой и соцсетями. Умею работать в команде." Улучши это описание — сделай его конкретным, с цифрами и достижениями.' },
    ],
  },
  {
    id: 'improve',
    title: 'Улучшение промтов',
    subtitle: 'Показать как итерировать и улучшать запросы',
    icon: ArrowUpRight,
    color: 'red',
    prompts: [
      { title: 'Улучши мой промт', text: 'Улучши следующий промт так, чтобы AI дал более точный и полезный ответ. Объясни что именно ты изменил и почему:\n\n"Помоги мне с маркетингом"' },
      { title: 'Сделай короче', text: 'Сделай предыдущий ответ вдвое короче. Оставь только самое важное и практичное. Убери воду и очевидные вещи.' },
      { title: 'Измени формат', text: 'Перепиши предыдущий ответ в виде нумерованного списка из 7 пунктов. Каждый пункт: действие + ожидаемый результат. Формат: "1. [Действие] — [Результат]"' },
      { title: 'Добавь примеры', text: 'Хорошо объяснил! Теперь приведи 3 конкретных реальных примера из жизни, которые подтверждают каждый из твоих пунктов. Примеры должны быть из российского бизнеса.' },
      { title: 'Критический взгляд', text: 'Теперь посмотри на свой ответ критически. Какие 3 главных недостатка в твоих рекомендациях? Что может пойти не так? Какие риски я должен учитывать?' },
    ],
  },
];

function CopyBtn({ text, size = 'sm' }) {
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} data-testid="demo-copy-btn"
      className={`flex items-center gap-1 ${size === 'sm' ? 'text-xs px-2.5 py-1.5' : 'text-sm px-3 py-2'} rounded-lg border transition-all ${copied ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'}`}>
      {copied ? <Check size={size === 'sm' ? 11 : 14} /> : <Copy size={size === 'sm' ? 11 : 14} />}
      {copied ? 'Скопировано' : 'Копировать'}
    </button>
  );
}

export default function DemoPromptsPage() {
  const navigate = useNavigate();
  const [activeQuality, setActiveQuality] = useState(0);
  const [activeSection, setActiveSection] = useState('beginner');
  const [search, setSearch] = useState('');

  const currentSection = DEMO_SECTIONS.find(s => s.id === activeSection);
  const filteredPrompts = currentSection?.prompts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.text.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in print-content" data-testid="demo-prompts-page">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl p-6" style={{
        background: 'linear-gradient(135deg, rgba(234,179,8,0.10) 0%, rgba(10,10,28,0.95) 60%)',
        border: '1px solid rgba(234,179,8,0.25)'
      }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Демо-промты</span>
              <span className="badge-premium" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.25), rgba(234,179,8,0.15))', borderColor: 'rgba(234,179,8,0.35)', color: '#FDE047' }}>LIVE</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Промты для демонстрации</h1>
            <p className="text-zinc-400 text-sm max-w-xl">Готовые промты для живого показа на уроке. Копируйте одним кликом и демонстрируйте в ChatGPT или Gemini.</p>
          </div>
          <div className="flex gap-2 shrink-0 no-print">
            <button onClick={() => navigate('/teaching-mode')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-red-500/25 text-red-400 hover:bg-red-500/10 transition-all">
              К плану урока
            </button>
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/10 transition-all">
              <Printer size={14} /> Печать
            </button>
          </div>
        </div>
      </div>

      {/* Prompt Quality Comparison */}
      <div className="print-card" data-testid="quality-section">
        <h2 className="font-heading text-base font-bold text-white mb-1">Уровни качества промта</h2>
        <p className="text-zinc-500 text-xs mb-4">Один и тот же запрос — 4 уровня. Покажите разницу студентам вживую.</p>
        <div className="flex gap-2 mb-4 flex-wrap">
          {QUALITY_PROMPTS.map((q, i) => (
            <button key={i} onClick={() => setActiveQuality(i)} data-testid={`quality-task-${i}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${activeQuality === i ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/8' : 'text-zinc-500 border-zinc-800 hover:text-zinc-300'}`}>
              {q.task}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: 'Слабый', level: 'bad', color: 'red', stars: 1 },
            { label: 'Средний', level: 'average', color: 'yellow', stars: 2 },
            { label: 'Сильный', level: 'strong', color: 'blue', stars: 3 },
            { label: 'Премиум', level: 'premium', color: 'green', stars: 4 },
          ].map(({ label, level, color, stars }) => {
            const text = QUALITY_PROMPTS[activeQuality][level];
            return (
              <div key={level} className="rounded-xl p-3 flex flex-col gap-2 print-card" data-testid={`quality-${level}`}
                style={{ background: 'rgba(10,10,26,0.90)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <span className={`text-${color}-400 font-bold text-[10px] uppercase tracking-wide`}>{label}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Star key={i} size={9} className={i < stars ? `text-${color}-400 fill-current` : 'text-zinc-700'} />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-300 text-xs font-mono leading-relaxed flex-1">{text}</p>
                <CopyBtn text={text} />
              </div>
            );
          })}
        </div>
        <div className="mt-3 rounded-lg p-3 text-xs" style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.12)' }}>
          <span className="text-yellow-400 font-semibold">Инсайт: </span>
          <span className="text-zinc-300">{QUALITY_PROMPTS[activeQuality].insight}</span>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="no-print">
        <div className="flex flex-wrap gap-2 mb-3" data-testid="section-nav">
          {DEMO_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button key={sec.id} onClick={() => { setActiveSection(sec.id); setSearch(''); }}
                data-testid={`section-${sec.id}`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  active ? `text-${sec.color}-400 border-${sec.color}-500/30 bg-${sec.color}-500/8` : 'text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-600'
                }`}>
                <Icon size={13} />
                {sec.title}
              </button>
            );
          })}
        </div>
        {/* Search within section */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти промт в разделе..."
            data-testid="demo-search"
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
        </div>
      </div>

      {/* Demo Prompts - Active Section */}
      {currentSection && (
        <div data-testid="demo-prompts-section">
          <div className="flex items-center gap-2 mb-3">
            <currentSection.icon size={16} className={`text-${currentSection.color}-400`} />
            <h2 className={`font-heading text-base font-bold text-${currentSection.color}-400`}>{currentSection.title}</h2>
            <span className="text-zinc-600 text-xs">{currentSection.subtitle}</span>
          </div>

          <div className="space-y-3">
            {filteredPrompts.map((p, i) => (
              <div key={i} data-testid={`demo-prompt-${i}`}
                className="rounded-xl p-4 transition-all duration-200 hover-glow-blue print-card"
                style={{ background: 'rgba(8,8,22,0.90)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className={`text-${currentSection.color}-400 font-semibold text-sm`}>{p.title}</h4>
                  <CopyBtn text={p.text} />
                </div>
                <div className="prompt-block">{p.text}</div>
              </div>
            ))}
            {filteredPrompts.length === 0 && (
              <div className="text-center py-8 text-zinc-600 text-sm">Ничего не найдено. Попробуйте другой поиск.</div>
            )}
          </div>
        </div>
      )}

      {/* All Sections for Print */}
      <div className="hidden print:block space-y-6">
        {DEMO_SECTIONS.filter(s => s.id !== activeSection).map(sec => (
          <div key={sec.id}>
            <h2 className="font-heading text-base font-bold mb-3">{sec.title}</h2>
            <div className="space-y-2">
              {sec.prompts.map((p, i) => (
                <div key={i} className="print-card p-3">
                  <h4 className="font-semibold text-sm mb-1">{p.title}</h4>
                  <p className="text-sm font-mono whitespace-pre-wrap">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Teacher Tips */}
      <div className="rounded-2xl p-5 no-print" style={{ background: 'rgba(8,8,22,0.85)', border: '1px solid rgba(239,68,68,0.12)' }}>
        <h3 className="text-red-400 font-semibold mb-3 text-sm flex items-center gap-2">
          <Zap size={14} /> Подсказки для живого показа
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Копируйте промт одним кликом, вставляйте в ChatGPT, комментируйте ответ вслух',
            'Сначала покажите слабый промт, потом сильный — разница очевидна (раздел "Уровни качества")',
            'После каждого демо спрашивайте: "Что бы вы добавили в этот промт?"',
            'Давайте 2-3 минуты после демо — пусть студенты повторят сами',
            'Используйте "Ролевые демо" для wow-эффекта — разница с ролью и без впечатляет',
            'Сохраняйте удачные ответы AI на экране — это мотивирует студентов',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <ChevronRight size={12} className="text-red-400 shrink-0 mt-1" />
              <span className="text-zinc-300">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between no-print">
        <button onClick={() => navigate('/teaching-mode')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
          <ChevronRight size={14} className="rotate-180" /> План урока
        </button>
        <button onClick={() => navigate('/module/prompt-library')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all">
          Библиотека промтов <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
