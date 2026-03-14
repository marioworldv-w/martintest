import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, CheckCircle2, ArrowRight, Copy, Check, RefreshCw } from 'lucide-react';
import { TipBox } from '../components/shared/TipBox';
import { useProgress } from '../hooks/useProgress';

const TEMPLATES = [
  {
    label: 'Деловое письмо',
    role: 'Ты — менеджер по работе с клиентами',
    goal: 'Напиши вежливое письмо клиенту с извинениями за задержку',
    context: 'Клиент: [имя], заказ задержан на 3 дня из-за технических проблем',
    constraints: 'Предложи компенсацию — скидку 10%, тон искренний',
    format: 'До 5 предложений, профессиональный стиль',
  },
  {
    label: 'Контент-план',
    role: 'Ты — опытный SMM-менеджер',
    goal: 'Создай контент-план на 7 дней для Instagram',
    context: 'Тема аккаунта: [тема], аудитория: [кто читает]',
    constraints: 'Разнообразные форматы: пост, сторис, рилс, опрос',
    format: 'Таблица: день | формат | тема | цель публикации',
  },
  {
    label: 'Объяснение темы',
    role: 'Ты — преподаватель по [предмет]',
    goal: 'Объясни тему "[тема]" начинающему',
    context: 'Студент без технического фона, первый раз слышит тему',
    constraints: 'Без сложных терминов, с аналогией из жизни',
    format: '3 абзаца + 3 ключевых пункта в виде списка',
  },
  {
    label: 'Анализ ситуации',
    role: 'Ты — бизнес-консультант с 10-летним опытом',
    goal: 'Проанализируй следующую ситуацию и дай рекомендации',
    context: '[опишите вашу ситуацию или задачу]',
    constraints: 'Конкретные, выполнимые шаги, не общие советы',
    format: 'Проблема → Причины → 3 конкретных рекомендации',
  },
  {
    label: 'Продающий текст',
    role: 'Ты — копирайтер с опытом в прямых продажах',
    goal: 'Напиши продающее описание для [продукт/услуга]',
    context: 'Целевая аудитория: [описание аудитории], главная боль: [проблема]',
    constraints: 'Техника AIDA, без клише и банальностей',
    format: 'До 200 слов, призыв к действию в конце',
  },
];

const PARTS = [
  { key: 'role', label: 'Роль', desc: 'Кем должен выступать AI?', color: 'blue', placeholder: 'Ты — опытный преподаватель по маркетингу...' },
  { key: 'goal', label: 'Цель', desc: 'Что нужно сделать?', color: 'green', placeholder: 'Объясни что такое воронка продаж...' },
  { key: 'context', label: 'Контекст', desc: 'Для кого? Какая ситуация?', color: 'yellow', placeholder: 'Для начинающего предпринимателя без опыта...' },
  { key: 'constraints', label: 'Ограничения', desc: 'Что важно учесть?', color: 'yellow', placeholder: 'Без технических терминов, с примерами...' },
  { key: 'format', label: 'Формат', desc: 'Как выглядит идеальный ответ?', color: 'green', placeholder: '3 абзаца + маркированный список советов...' },
];

export default function PromptBuilderPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('prompt-builder');

  const [inputs, setInputs] = useState({ role: '', goal: '', context: '', constraints: '', format: '' });
  const [copied, setCopied] = useState(false);

  const buildPrompt = () => {
    const parts = [];
    if (inputs.role) parts.push(inputs.role.trim() + '.');
    if (inputs.goal) parts.push(inputs.goal.trim() + '.');
    if (inputs.context) parts.push('Контекст: ' + inputs.context.trim() + '.');
    if (inputs.constraints) parts.push('Важно учесть: ' + inputs.constraints.trim() + '.');
    if (inputs.format) parts.push('Формат ответа: ' + inputs.format.trim() + '.');
    return parts.join(' ');
  };

  const loadTemplate = (tpl) => {
    setInputs({ role: tpl.role, goal: tpl.goal, context: tpl.context, constraints: tpl.constraints, format: tpl.format });
  };

  const clear = () => setInputs({ role: '', goal: '', context: '', constraints: '', format: '' });

  const copyPrompt = () => {
    const p = buildPrompt();
    if (p) { navigator.clipboard.writeText(p).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const filledCount = Object.values(inputs).filter(v => v.trim()).length;
  const prompt = buildPrompt();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="prompt-builder-page">
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench size={20} className="text-green-400" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Модуль 6 · Интерактив</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Конструктор промтов</h1>
            <p className="text-zinc-400">Собирайте промты по формуле. Используйте шаблоны или создайте свой.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">15 мин</span>
        </div>
      </div>

      {/* Templates */}
      <div>
        <h3 className="text-white font-semibold mb-3">Быстрые шаблоны</h3>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((tpl, i) => (
            <button key={i} onClick={() => loadTemplate(tpl)} data-testid={`template-${i}`}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-sm transition-all">
              {tpl.label}
            </button>
          ))}
          <button onClick={clear} className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-500 hover:text-zinc-300 px-3 py-1.5 rounded-lg text-sm transition-all">
            <RefreshCw size={12} />
            Очистить
          </button>
        </div>
      </div>

      {/* Builder Form */}
      <div className="grid gap-4">
        {PARTS.map((part) => (
          <div key={part.key} className={`border ${
            inputs[part.key] ? `border-${part.color}-500/40 bg-${part.color}-500/5` : 'border-zinc-800 bg-zinc-900/30'
          } rounded-xl p-4 transition-all`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full bg-${part.color}-500`} />
              <span className={`font-semibold text-sm ${inputs[part.key] ? `text-${part.color}-400` : 'text-zinc-400'}`}>{part.label}</span>
              <span className="text-zinc-600 text-xs">{part.desc}</span>
            </div>
            <textarea
              value={inputs[part.key]}
              onChange={(e) => setInputs(prev => ({ ...prev, [part.key]: e.target.value }))}
              placeholder={part.placeholder}
              data-testid={`builder-${part.key}`}
              rows={2}
              className="w-full bg-zinc-900/70 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full transition-all duration-300" style={{ width: `${(filledCount / 5) * 100}%` }} />
        </div>
        <span className="text-xs text-zinc-500 shrink-0">{filledCount}/5 заполнено</span>
      </div>

      {/* Live Preview */}
      <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-green-400 font-semibold text-sm">Результат</h3>
          <button
            onClick={copyPrompt}
            disabled={!prompt}
            data-testid="copy-built-prompt"
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              prompt ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Скопировано!' : 'Копировать промт'}
          </button>
        </div>
        <div className="prompt-block min-h-[80px]">
          {prompt || 'Начните заполнять поля выше — промт сформируется автоматически...'}
        </div>
        {prompt && (
          <p className="text-zinc-500 text-xs mt-2">Вставьте этот промт в ChatGPT или Gemini и нажмите Enter</p>
        )}
      </div>

      <TipBox title="Совет по использованию">
        Начните с шаблона, адаптируйте под вашу задачу, скопируйте и вставьте в ChatGPT или Gemini. Сохраните удачные промты в заметки — они пригодятся снова.
      </TipBox>

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('prompt-builder')} data-testid="mark-complete-builder"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/module/prompt-library')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Следующий модуль <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
