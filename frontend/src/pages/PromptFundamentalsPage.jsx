import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { TipBox, WarningBox, SuccessBox } from '../components/shared/TipBox';
import BeforeAfterPrompt from '../components/shared/BeforeAfterPrompt';
import QuizBlock from '../components/shared/QuizBlock';
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

const formulaParts = [
  { label: 'Роль', key: 'role', desc: 'Кем должен быть AI?', placeholder: 'Ты — опытный преподаватель...', color: 'blue' },
  { label: 'Цель', key: 'goal', desc: 'Что нужно сделать?', placeholder: 'Объясни тему X...', color: 'green' },
  { label: 'Контекст', key: 'context', desc: 'Для кого? Какая ситуация?', placeholder: 'Для начинающих без опыта...', color: 'yellow' },
  { label: 'Ограничения', key: 'constraints', desc: 'Что важно учесть?', placeholder: 'Без технических терминов, до 3 абзацев...', color: 'yellow' },
  { label: 'Формат', key: 'format', desc: 'Как должен выглядеть ответ?', placeholder: 'Маркированный список, таблица, абзацы...', color: 'green' },
];

export default function PromptFundamentalsPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('prompts');
  const [formulaInputs, setFormulaInputs] = useState({ role: '', goal: '', context: '', constraints: '', format: '' });
  const [showPreview, setShowPreview] = useState(false);

  const buildPrompt = () => {
    const parts = [];
    if (formulaInputs.role) parts.push(formulaInputs.role + '.');
    if (formulaInputs.goal) parts.push(formulaInputs.goal + '.');
    if (formulaInputs.context) parts.push('Контекст: ' + formulaInputs.context + '.');
    if (formulaInputs.constraints) parts.push('Важно: ' + formulaInputs.constraints + '.');
    if (formulaInputs.format) parts.push('Формат ответа: ' + formulaInputs.format + '.');
    return parts.join(' ') || 'Заполните поля выше чтобы увидеть результат...';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="prompts-page">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal size={20} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Модуль 5 · Навык</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Основы промтинга</h1>
            <p className="text-zinc-400">Как писать запросы к AI чтобы получать точные, полезные и профессиональные ответы.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">25 мин</span>
        </div>
      </div>

      {/* Core Principle */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-2xl p-6 text-center">
        <p className="text-2xl font-heading font-bold text-white mb-2">Слабый промт → размытый ответ</p>
        <p className="text-2xl font-heading font-bold text-yellow-400">Чёткий промт → точный результат</p>
        <p className="text-zinc-400 text-sm mt-3">Это главное правило промтинга. AI настолько хорош, насколько хорош ваш запрос.</p>
      </div>

      <Section title="Что такое промт?" defaultOpen={true}>
        <p className="text-zinc-300 text-sm leading-relaxed">
          <strong className="text-white">Промт</strong> (от англ. prompt — подсказка) — это ваш запрос или инструкция к AI-ассистенту. Это то, что вы пишете в поле ввода ChatGPT или Gemini.
        </p>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Промтинг — это навык составления таких запросов, чтобы получать максимально полезные и точные ответы. Хороший промтинг — это не магия, а понятная техника.
        </p>
        <TipBox title="Аналогия">
          Представьте что вы даёте задание новому сотруднику. Если скажете "сделай что-нибудь по маркетингу" — результат будет случайным. Если дадите чёткое задание с контекстом, целью и форматом — результат будет именно тем что нужно.
        </TipBox>
      </Section>

      <Section title="Формула сильного промта">
        <div className="grid sm:grid-cols-5 gap-2 mb-4">
          {formulaParts.map((part, i) => (
            <div key={i} className={`bg-${part.color}-500/10 border border-${part.color}-500/30 rounded-xl p-3 text-center`}>
              <div className={`text-${part.color}-400 font-bold text-sm`}>{part.label}</div>
              <p className={`text-${part.color}-300/70 text-xs mt-1`}>{part.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900/60 border border-zinc-700 rounded-xl p-4">
          <div className="text-zinc-400 text-xs font-semibold mb-2 uppercase tracking-wider">Пример полного промта:</div>
          <p className="text-zinc-200 text-sm font-mono leading-relaxed">
            <span className="text-blue-400">Ты — опытный маркетолог.</span>{' '}
            <span className="text-green-400">Напиши 5 идей для постов в Instagram.</span>{' '}
            <span className="text-yellow-400">Аккаунт о здоровом питании, аудитория — молодые мамы 25-35 лет.</span>{' '}
            <span className="text-yellow-400">Без рекламных слоганов, простой язык.</span>{' '}
            <span className="text-green-400">Каждая идея: тема + 1 предложение описания.</span>
          </p>
        </div>
      </Section>

      <BeforeAfterPrompt
        before="Напиши письмо клиенту"
        after={'Ты — менеджер по работе с клиентами. Напиши вежливое профессиональное письмо клиенту Марине с извинениями за задержку доставки на 3 дня. Объясни причину (технические неполадки на складе) и предложи компенсацию — скидку 10% на следующий заказ. Тон: искренний, профессиональный. Длина: 4-5 предложений.'}
      />

      <Section title="Как улучшать промты итеративно">
        <p className="text-zinc-300 text-sm">Промт не должен быть идеальным с первого раза. Используйте итеративный подход:</p>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Напишите базовый запрос и получите первый ответ', color: 'blue' },
            { step: '2', text: 'Оцените результат: что хорошо, что можно улучшить', color: 'yellow' },
            { step: '3', text: 'Уточните: "Сделай короче", "Измени тон на более официальный", "Добавь примеры"', color: 'green' },
            { step: '4', text: 'Продолжайте диалог до получения нужного результата', color: 'green' },
          ].map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className={`w-6 h-6 rounded-full bg-${s.color}-500/20 border border-${s.color}-500/30 flex items-center justify-center shrink-0 mt-0.5`}>
                <span className={`text-${s.color}-400 text-xs font-bold`}>{s.step}</span>
              </div>
              <p className="text-zinc-300 text-sm">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {[
            { cmd: '"Сделай это короче"', desc: 'Укороти ответ до 3 предложений' },
            { cmd: '"Переформатируй"', desc: 'Перепиши в виде таблицы / списка / шагов' },
            { cmd: '"Сделай более [тон]"', desc: 'Более официально / неформально / технически' },
            { cmd: '"Добавь примеры"', desc: 'Приведи 2-3 конкретных примера из жизни' },
            { cmd: '"Объясни проще"', desc: 'Объясни без технических терминов' },
            { cmd: '"Продолжи"', desc: 'Если ответ оборвался — продолжи с места остановки' },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
              <div className="text-yellow-400 font-mono text-xs font-semibold mb-1">{item.cmd}</div>
              <p className="text-zinc-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Примеры слабых vs сильных промтов">
        <div className="space-y-4">
          {[
            { weak: 'Напиши про SEO', strong: 'Ты — SEO-специалист. Объясни новичку (без технического фона) что такое SEO и как оно работает. Используй 2 простых аналогии. Формат: 3 абзаца + маркированный список из 5 практических советов.' },
            { weak: 'Помоги с резюме', strong: 'Ты — HR-специалист с 10-летним опытом. Улучши мой раздел "Опыт работы" для резюме на должность маркетолога. Сделай описания результат-ориентированными с цифрами. Тон: профессиональный, активные глаголы.' },
          ].map((pair, i) => (
            <BeforeAfterPrompt key={i} before={pair.weak} after={pair.strong} />
          ))}
        </div>
      </Section>

      <WarningBox title="Топ ошибок при промтинге">
        <ul className="space-y-1.5">
          <li>• Слишком короткий запрос без контекста: "помоги с маркетингом"</li>
          <li>• Задавать несколько разных вопросов в одном промте</li>
          <li>• Не указывать целевую аудиторию ("для кого этот текст?")</li>
          <li>• Не уточнять формат ("в виде чего ты хочешь получить ответ?")</li>
          <li>• Принимать первый ответ без итерации</li>
        </ul>
      </WarningBox>

      {/* Mini Interactive Builder */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Мини-конструктор: попробуйте формулу</h3>
        <div className="space-y-3">
          {formulaParts.map((part) => (
            <div key={part.key} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className={`text-${part.color}-400 font-semibold text-sm w-28 shrink-0`}>{part.label}:</div>
              <input
                value={formulaInputs[part.key]}
                onChange={(e) => setFormulaInputs(prev => ({ ...prev, [part.key]: e.target.value }))}
                placeholder={part.placeholder}
                data-testid={`formula-${part.key}`}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-yellow-500/50 focus:outline-none transition-colors"
              />
            </div>
          ))}
          <button
            onClick={() => setShowPreview(!showPreview)}
            data-testid="preview-prompt-btn"
            className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 py-2.5 rounded-lg font-semibold text-sm transition-colors mt-2"
          >
            {showPreview ? 'Скрыть' : 'Показать'} результирующий промт
          </button>
          {showPreview && (
            <div className="bg-[#0D0D0D] border border-zinc-700 rounded-xl p-4">
              <div className="text-zinc-500 text-xs mb-2 font-semibold uppercase">Ваш промт:</div>
              <p className="text-zinc-200 text-sm font-mono leading-relaxed">{buildPrompt()}</p>
            </div>
          )}
        </div>
      </div>

      <QuizBlock
        question="Какой из этих промтов даст наилучший результат?"
        options={['напиши текст', 'напиши пост', 'Ты — копирайтер. Напиши продающий Instagram-пост для онлайн-курса по фитнесу. Аудитория: женщины 25-40 лет. Тон: мотивирующий. Длина: 150-200 символов + 5 хэштегов.', 'помоги с постом для инсты']}
        correct="Ты — копирайтер. Напиши продающий Instagram-пост для онлайн-курса по фитнесу. Аудитория: женщины 25-40 лет. Тон: мотивирующий. Длина: 150-200 символов + 5 хэштегов."
        explanation="Этот промт содержит все элементы формулы: роль (копирайтер), цель (продающий пост), контекст (курс по фитнесу), аудитория, формат и ограничения."
        color="yellow"
      />

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('prompts')} data-testid="mark-complete-prompts"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/module/prompt-builder')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Следующий модуль <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
