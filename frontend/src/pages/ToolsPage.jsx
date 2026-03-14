import React, { useState } from 'react';
import { Layers, CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TipBox } from '../components/shared/TipBox';
import { useProgress } from '../hooks/useProgress';

const workflows = [
  {
    title: 'Создание контента',
    icon: '✍️',
    color: 'green',
    steps: ['Идея (ваша)', 'Промт (описать задачу)', 'Черновик (AI)', 'Редактура (вы)', 'Финальный текст'],
    example: 'Написать статью: → Задаёте тему и формат → ChatGPT пишет черновик → Вы редактируете и добавляете личный опыт → Готовая статья за 20 мин вместо 2 часов',
  },
  {
    title: 'Обучение и исследование',
    icon: '🔍',
    color: 'blue',
    steps: ['Вопрос (ваш)', 'AI-объяснение', 'Уточнение', 'Конспект', 'Применение'],
    example: 'Изучить маркетинг: → Просите объяснить концепцию → AI объясняет с примерами → Уточняете непонятное → Конспектируете ключевое → Применяете в работе',
  },
  {
    title: 'Деловая переписка',
    icon: '📧',
    color: 'yellow',
    steps: ['Задача (ваша)', 'Промт с контекстом', 'Черновик (AI)', 'Правки (вы)', 'Отправка'],
    example: 'Написать письмо: → Описываете получателя и цель → AI пишет вежливый текст → Добавляете конкретику → Отправляете за 5 минут',
  },
  {
    title: 'Анализ и решения',
    icon: '📊',
    color: 'red',
    steps: ['Ситуация (ваша)', 'Описать AI', 'Анализ (AI)', 'Обдумать (вы)', 'Решение'],
    example: 'Решить бизнес-задачу: → Описываете ситуацию → AI анализирует и предлагает варианты → Вы оцениваете варианты → Принимаете взвешенное решение',
  },
];

const useCases = [
  { task: 'Написание текстов', tools: 'ChatGPT / Gemini', icon: '✍️', color: 'green' },
  { task: 'Резюме документов', tools: 'ChatGPT / Gemini', icon: '📋', color: 'blue' },
  { task: 'Идеи и мозговой штурм', tools: 'ChatGPT', icon: '💡', color: 'yellow' },
  { task: 'Перевод', tools: 'Оба хороши', icon: '🌐', color: 'blue' },
  { task: 'Исследования', tools: 'Gemini (актуальный поиск)', icon: '🔬', color: 'blue' },
  { task: 'Планирование', tools: 'ChatGPT / Gemini', icon: '📅', color: 'green' },
  { task: 'Деловые письма', tools: 'Gemini в Gmail', icon: '📧', color: 'blue' },
  { task: 'Учёба', tools: 'ChatGPT (объяснения)', icon: '🎓', color: 'yellow' },
  { task: 'Контент для соцсетей', tools: 'ChatGPT', icon: '📱', color: 'red' },
  { task: 'Анализ данных', tools: 'Оба умеют', icon: '📈', color: 'green' },
  { task: 'Помощь с кодом', tools: 'ChatGPT', icon: '💻', color: 'green' },
  { task: 'Работа в Google Docs', tools: 'Gemini', icon: '📄', color: 'blue' },
];

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

export default function ToolsPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('tools');
  const [expandedWf, setExpandedWf] = useState(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="tools-page">
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers size={20} className="text-green-400" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Модуль 10 · Практика</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Инструменты и воркфлоу</h1>
            <p className="text-zinc-400">Как встроить AI в рабочие процессы. Схемы, воркфлоу и сценарии использования.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">15 мин</span>
        </div>
      </div>

      <Section title="Воркфлоу с AI" defaultOpen={true}>
        <p className="text-zinc-300 text-sm mb-4">Нажмите на воркфлоу чтобы увидеть пример:</p>
        <div className="space-y-3">
          {workflows.map((wf, i) => (
            <div key={i} data-testid={`workflow-${i}`}
              onClick={() => setExpandedWf(expandedWf === i ? null : i)}
              className={`border rounded-xl cursor-pointer transition-all duration-200 ${expandedWf === i ? `border-${wf.color}-500/40 bg-${wf.color}-500/5` : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'}`}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{wf.icon}</span>
                  <span className={`font-semibold ${expandedWf === i ? `text-${wf.color}-400` : 'text-white'}`}>{wf.title}</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {wf.steps.map((step, j) => (
                    <React.Fragment key={j}>
                      <span className={`text-xs px-2 py-1 rounded ${expandedWf === i ? `bg-${wf.color}-500/10 text-${wf.color}-300 border border-${wf.color}-500/20` : 'bg-zinc-800 text-zinc-400'}`}>{step}</span>
                      {j < wf.steps.length - 1 && <ArrowRight size={12} className="text-zinc-600 shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {expandedWf === i && (
                <div className="px-4 pb-4 border-t border-zinc-800/50 pt-3">
                  <p className="text-zinc-300 text-sm">{wf.example}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Таблица: задача → инструмент">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {useCases.map((uc, i) => (
            <div key={i} className={`bg-${uc.color}-500/5 border border-${uc.color}-500/15 rounded-xl p-3`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{uc.icon}</span>
                <span className={`text-${uc.color}-400 font-semibold text-sm`}>{uc.task}</span>
              </div>
              <p className="text-zinc-500 text-xs">{uc.tools}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Как начать использовать AI в работе">
        <div className="space-y-3">
          {[
            { step: '1', title: 'Выберите одну задачу', desc: 'Найдите задачу, которую вы делаете каждую неделю и которая занимает много времени — письма, отчёты, планы.' },
            { step: '2', title: 'Опишите её AI', desc: 'Сформулируйте задачу по формуле: роль + цель + контекст + формат. Получите первый результат.' },
            { step: '3', title: 'Итерируйте 3 раза', desc: 'Уточняйте пока результат не будет вас устраивать. С каждым разом вы будете лучше понимать как формулировать.' },
            { step: '4', title: 'Сохраните удачный промт', desc: 'Запишите промт который сработал в заметки. Используйте его снова для похожих задач.' },
            { step: '5', title: 'Добавьте ещё одну задачу', desc: 'Через неделю найдите ещё одну задачу для AI. Постепенно AI станет частью вашего рабочего процесса.' },
          ].map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                <span className="text-green-400 text-xs font-bold">{s.step}</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{s.title}</div>
                <p className="text-zinc-400 text-xs mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <TipBox title="Главный принцип">
          Не пытайтесь использовать AI для всего сразу. Начните с одной задачи, освойте её, потом добавьте следующую. Через месяц AI будет экономить вам 1-2 часа в день.
        </TipBox>
      </Section>

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('tools')} data-testid="mark-complete-tools"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/practice')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Перейти к практике <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
