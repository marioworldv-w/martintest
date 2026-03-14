import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, CheckCircle2, ArrowRight, Bot, Sparkles } from 'lucide-react';
import { TipBox, InfoBox } from '../components/shared/TipBox';
import { useProgress } from '../hooks/useProgress';

const scenarios = [
  { task: 'Написать длинную статью или эссе', gpt: 5, gemini: 3, reason: 'ChatGPT традиционно сильнее в длинных структурированных текстах и сохраняет стиль на протяжении всего документа.' },
  { task: 'Ответить на письмо прямо в Gmail', gpt: 2, gemini: 5, reason: 'Gemini встроен в Gmail — не нужно переключаться. Нажали кнопку — получили ответ прямо в письме.' },
  { task: 'Узнать актуальные новости и события', gpt: 2, gemini: 5, reason: 'Gemini имеет доступ к актуальному поиску Google. Бесплатный ChatGPT ограничен датой обучения.' },
  { task: 'Создать структуру презентации', gpt: 4, gemini: 4, reason: 'Оба справляются хорошо. Преимущество Gemini — сразу интегрировать в Google Slides.' },
  { task: 'Написать и улучшить код', gpt: 5, gemini: 4, reason: 'ChatGPT имеет более богатую экосистему для разработчиков. Оба умеют помогать с кодом.' },
  { task: 'Сделать резюме длинного PDF', gpt: 4, gemini: 5, reason: 'Gemini Advanced обрабатывает очень длинные документы. Это одна из его сильнейших сторон.' },
  { task: 'Придумать творческие идеи для кампании', gpt: 5, gemini: 4, reason: 'ChatGPT немного сильнее в творческих и незаурядных идеях. Оба дадут отличный результат.' },
  { task: 'Перевести деловой текст', gpt: 4, gemini: 4, reason: 'Оба инструмента хорошо переводят. Здесь нет явного победителя — используйте тот что удобнее.' },
];

const comparisons = [
  { aspect: 'Разработчик', gpt: 'OpenAI (США)', gemini: 'Google DeepMind' },
  { aspect: 'Запуск', gpt: 'Ноябрь 2022', gemini: '2023 (как Bard), 2024 (как Gemini)' },
  { aspect: 'Лучшие задачи', gpt: 'Длинные тексты, код, творчество', gemini: 'Google-интеграция, поиск, документы' },
  { aspect: 'Поиск в интернете', gpt: 'Только в платной версии', gemini: 'Да, бесплатно' },
  { aspect: 'Интеграция с сервисами', gpt: 'Plugins, GPT Store', gemini: 'Gmail, Docs, Drive, Sheets' },
  { aspect: 'Длина контекста', gpt: 'Хороший (лимиты зависят от версии)', gemini: 'Очень длинный (особенно Advanced)' },
  { aspect: 'Персонализация', gpt: 'Custom Instructions, Memory', gemini: 'Extensions, Google Workspace' },
  { aspect: 'Картинки', gpt: 'DALL-E (платная)', gemini: 'Imagen (некоторые версии)' },
  { aspect: 'Цена', gpt: 'Бесплатно / $20/мес Plus', gemini: 'Бесплатно / AI Pro (зависит от страны)' },
];

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('comparison');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('table');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in" data-testid="comparison-page">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeftRight size={20} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Модуль 4 · Сравнение</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">GPT vs Gemini</h1>
            <p className="text-zinc-400">Практическое сравнение двух инструментов. Никаких победителей — только полезный выбор для вашей задачи.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">20 мин</span>
        </div>
      </div>

      {/* Quick Verdict */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Bot size={18} className="text-green-400" />
            </div>
            <div>
              <div className="text-white font-bold">ChatGPT</div>
              <div className="text-green-400 text-xs">Выбирайте если...</div>
            </div>
          </div>
          <ul className="space-y-1.5">
            {[
              'Пишете длинные тексты, статьи, сценарии',
              'Нужна помощь с кодом и программированием',
              'Хотите творческий, нестандартный контент',
              'Нужен широкий выбор плагинов и расширений',
              'Работаете не в Google-экосистеме',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 size={13} className="text-green-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Sparkles size={18} className="text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold">Gemini</div>
              <div className="text-blue-400 text-xs">Выбирайте если...</div>
            </div>
          </div>
          <ul className="space-y-1.5">
            {[
              'Активно используете Gmail, Docs, Drive',
              'Нужна актуальная информация из интернета',
              'Работаете с очень длинными документами',
              'Хотите помощь прямо внутри Google-сервисов',
              'Уже платите за Google Workspace',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <CheckCircle2 size={13} className="text-blue-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {[{ id: 'table', label: 'Таблица сравнения' }, { id: 'scenarios', label: 'По сценариям' }].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} data-testid={`view-${v.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === v.id ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      {view === 'table' && (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 bg-zinc-900/60 border-b border-zinc-800">
            <div className="p-4 text-zinc-500 font-semibold text-sm">Параметр</div>
            <div className="p-4 text-green-400 font-semibold text-sm flex items-center gap-2"><Bot size={14} />ChatGPT</div>
            <div className="p-4 text-blue-400 font-semibold text-sm flex items-center gap-2"><Sparkles size={14} />Gemini</div>
          </div>
          {comparisons.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-900/20'}`}>
              <div className="p-4 text-zinc-400 text-sm font-medium">{row.aspect}</div>
              <div className="p-4 text-zinc-300 text-sm">{row.gpt}</div>
              <div className="p-4 text-zinc-300 text-sm">{row.gemini}</div>
            </div>
          ))}
        </div>
      )}

      {/* Scenarios */}
      {view === 'scenarios' && (
        <div className="space-y-3">
          <p className="text-zinc-400 text-sm">Нажмите на задачу чтобы увидеть рекомендацию:</p>
          {scenarios.map((sc, i) => (
            <div key={i}
              data-testid={`scenario-${i}`}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${selected === i ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'}`}>
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">{sc.task}</span>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <div className="flex items-center gap-1">
                    <Bot size={12} className="text-green-400" />
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <div key={s} className={`w-2 h-2 rounded-sm ${s <= sc.gpt ? 'bg-green-500' : 'bg-zinc-700'}`} />)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={12} className="text-blue-400" />
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <div key={s} className={`w-2 h-2 rounded-sm ${s <= sc.gemini ? 'bg-blue-500' : 'bg-zinc-700'}`} />)}
                    </div>
                  </div>
                </div>
              </div>
              {selected === i && (
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <div className="flex items-center gap-2 mb-1">
                    {sc.gpt >= sc.gemini ? <Bot size={14} className="text-green-400" /> : <Sparkles size={14} className="text-blue-400" />}
                    <span className={`text-sm font-semibold ${sc.gpt >= sc.gemini ? 'text-green-400' : 'text-blue-400'}`}>
                      {sc.gpt > sc.gemini ? 'ChatGPT' : sc.gemini > sc.gpt ? 'Gemini' : 'Оба одинаково хороши'}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm">{sc.reason}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <InfoBox title="Главный совет">
        Не нужно выбирать один инструмент навсегда. Профессионалы используют оба. ChatGPT для одних задач, Gemini — для других. Ключ — понять где каждый сильнее.
      </InfoBox>

      <TipBox title="Задание для студентов">
        Задайте один и тот же вопрос в ChatGPT и Gemini прямо сейчас. Например: "Составь план личного бюджета на месяц". Сравните ответы — что вам больше нравится?
      </TipBox>

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('comparison')} data-testid="mark-complete-comparison"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/module/prompts')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Следующий модуль <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
