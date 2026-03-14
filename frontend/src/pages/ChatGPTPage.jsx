import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ChevronDown, ChevronUp, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { TipBox, WarningBox, InfoBox, SuccessBox } from '../components/shared/TipBox';
import BeforeAfterPrompt from '../components/shared/BeforeAfterPrompt';
import QuizBlock from '../components/shared/QuizBlock';
import { useProgress } from '../hooks/useProgress';

const Section = ({ title, children, defaultOpen = false, color = 'green' }) => {
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

function PromptExample({ title, prompt, tag }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(prompt).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="bg-[#0D0D0D] border border-green-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-green-400 font-semibold text-sm">{title}</span>
        {tag && <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">{tag}</span>}
      </div>
      <p className="text-zinc-300 text-sm font-mono leading-relaxed mb-2">{prompt}</p>
      <button onClick={copy} data-testid="copy-prompt" className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        {copied ? 'Скопировано!' : 'Копировать промт'}
      </button>
    </div>
  );
}

export default function ChatGPTPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('chatgpt');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="chatgpt-page">
      {/* Header */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={20} className="text-green-400" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Модуль 2 · ChatGPT</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">ChatGPT: полное руководство</h1>
            <p className="text-zinc-400">Всё о ChatGPT от OpenAI — что умеет, как начать, как писать промты, как настроить под себя.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">30 мин</span>
        </div>
      </div>

      <Section title="Что такое ChatGPT?" defaultOpen={true}>
        <p className="text-zinc-300 text-sm leading-relaxed">
          <strong className="text-white">ChatGPT</strong> — это чат-бот от американской компании <strong className="text-green-400">OpenAI</strong>, запущенный в ноябре 2022 года. Он произвёл революцию в том, как люди взаимодействуют с AI.
        </p>
        <p className="text-zinc-300 text-sm leading-relaxed">
          <strong className="text-white">GPT</strong> расшифровывается как <strong className="text-green-400">Generative Pre-trained Transformer</strong> — это тип языковой модели. ChatGPT — это интерфейс (чат) поверх этой модели.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mt-3">
          {[
            { label: 'G — Generative', desc: 'Генерирует текст, не просто ищет его', color: 'green' },
            { label: 'P — Pre-trained', desc: 'Предварительно обучен на огромных данных', color: 'yellow' },
            { label: 'T — Transformer', desc: 'Архитектура нейронной сети для языка', color: 'blue' },
          ].map((item, i) => (
            <div key={i} className={`bg-${item.color}-500/10 border border-${item.color}-500/20 rounded-xl p-3`}>
              <div className={`text-${item.color}-400 font-bold text-xs mb-1`}>{item.label}</div>
              <p className="text-zinc-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
        <InfoBox title="Простое объяснение">
          ChatGPT — это как очень умный текстовый помощник. Вы пишете ему вопрос или задание — он отвечает развёрнутым текстом. Всё общение происходит в виде чата, как в мессенджере.
        </InfoBox>
      </Section>

      <Section title="Что ChatGPT умеет делать?">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { cat: 'Письма и тексты', items: ['Деловые и личные письма', 'Статьи и посты для соцсетей', 'Продающие описания', 'Резюме и сопроводительные письма'] },
            { cat: 'Объяснение и обучение', items: ['Объяснить тему простым языком', 'Составить план изучения', 'Ответить на любой вопрос', 'Создать тест или квиз'] },
            { cat: 'Анализ и структура', items: ['Краткое резюме текста', 'Сравнить варианты', 'Выделить ключевые идеи', 'SWOT-анализ'] },
            { cat: 'Творчество и идеи', items: ['Мозговой штурм идей', 'Сценарии и истории', 'Слоганы и названия', 'Контент-планы'] },
          ].map((cat, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
              <div className="text-green-400 font-semibold text-sm mb-2">{cat.cat}</div>
              {cat.items.map((item, j) => (
                <div key={j} className="flex items-center gap-2 text-xs text-zinc-400 py-0.5">
                  <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Как начать использовать ChatGPT">
        <div className="space-y-3">
          {[
            { step: '1', title: 'Зарегистрируйтесь', desc: 'Перейдите на chat.openai.com → нажмите "Sign Up" → введите email и создайте пароль или войдите через Google.' },
            { step: '2', title: 'Выберите версию', desc: 'Бесплатная версия (GPT-3.5/4o mini) хорошо справляется с большинством задач. Платная ChatGPT Plus ($20/мес) даёт GPT-4 и расширенные функции.' },
            { step: '3', title: 'Напишите первый запрос', desc: 'В поле ввода напишите ваш вопрос или задание. Нажмите Enter или кнопку "Отправить".' },
            { step: '4', title: 'Продолжайте разговор', desc: 'ChatGPT помнит контекст разговора. Можно уточнять, задавать дополнительные вопросы, просить переделать.' },
          ].map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
                <span className="text-green-400 text-xs font-bold">{s.step}</span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm mb-0.5">{s.title}</div>
                <p className="text-zinc-400 text-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <TipBox title="Совет преподавателя">
          Откройте ChatGPT прямо сейчас и покажите интерфейс. Задайте простой вопрос вживую — так студенты увидят как это работает.
        </TipBox>
      </Section>

      <Section title="Как улучшать ответы — практические советы">
        <div className="space-y-3">
          {[
            { label: '"Переделай это..."', desc: 'Попросите переформатировать: "Перепиши в виде списка", "Сделай короче", "Добавь примеры"' },
            { label: '"Продолжи..."', desc: 'Если ответ обрезан: "Продолжи с того места где остановился"' },
            { label: '"Объясни проще"', desc: 'Если непонятно: "Объясни это как будто мне 10 лет" или "Объясни без технических терминов"' },
            { label: '"Дай пример"', desc: 'Всегда просите примеры: "Приведи конкретный пример из реальной жизни"' },
            { label: '"Исправь это"', desc: 'Скажите что не нравится: "В ответе слишком официальный тон, сделай теплее и дружелюбнее"' },
          ].map((tip, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
              <span className="text-green-400 font-mono text-sm font-semibold">{tip.label}</span>
              <p className="text-zinc-400 text-xs mt-1">{tip.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Как настроить ChatGPT под себя">
        <p className="text-zinc-300 text-sm">ChatGPT можно персонализировать — сказать ему кто вы и как вы хотите получать ответы.</p>
        <div className="bg-[#0D0D0D] border border-green-500/20 rounded-xl p-4 space-y-3">
          <div>
            <div className="text-green-400 font-semibold text-sm mb-1">Settings → Personalization → Custom Instructions</div>
            <p className="text-zinc-400 text-xs">Здесь можно написать кто вы (профессия, интересы) и как вы хотите получать ответы (стиль, язык, уровень детализации).</p>
          </div>
          <div className="bg-zinc-800/40 rounded-lg p-3">
            <div className="text-yellow-400 text-xs font-semibold mb-1">Пример настройки:</div>
            <p className="text-zinc-300 text-xs font-mono">"Я маркетолог из России. Отвечай на русском языке. Используй примеры из российского бизнеса. Будь конкретным, избегай общих фраз."</p>
          </div>
        </div>
        <TipBox title="Персонализация экономит время">
          Один раз настроив, вам не нужно каждый раз объяснять кто вы. ChatGPT будет учитывать ваш контекст автоматически.
        </TipBox>
      </Section>

      <Section title="Примеры промтов для ChatGPT">
        <div className="space-y-3">
          <PromptExample title="Деловое письмо" tag="Email" prompt="Напиши вежливое письмо клиенту Алексею с извинениями за задержку доставки на 3 дня. Предложи компенсацию — скидку 10% на следующий заказ. Тон: профессиональный, тёплый. Длина: до 5 предложений." />
          <PromptExample title="Объяснение темы" tag="Учёба" prompt="Объясни что такое инфляция простым языком для человека без экономического образования. Используй аналогию из повседневной жизни. Затем приведи 2 конкретных примера как она влияет на обычного человека." />
          <PromptExample title="Контент-план" tag="SMM" prompt="Ты — опытный SMM-менеджер. Создай контент-план на 7 дней для Telegram-канала о личных финансах. Аудитория: молодые специалисты 25-35 лет. Для каждого дня укажи: тему поста, формат (текст/опрос/факт) и краткое описание." />
        </div>
      </Section>

      <BeforeAfterPrompt
        before="Напиши про маркетинг"
        after={'Ты — преподаватель маркетинга с 10-летним опытом. Объясни что такое "воронка продаж" начинающему предпринимателю без опыта в маркетинге. Используй 2 реальных примера из малого бизнеса. Формат: 3-4 абзаца, без жаргона и сложных терминов.'}
      />

      <WarningBox title="Частые ошибки новичков">
        <ul className="space-y-1">
          <li>• Слишком короткий запрос — "напиши пост" без контекста</li>
          <li>• Принимать ответ без проверки фактов</li>
          <li>• Не уточнять если ответ не подходит — просто спросите снова по-другому</li>
          <li>• Думать что один запрос = идеальный результат. Итерируйте!</li>
        </ul>
      </WarningBox>

      <QuizBlock
        question="Что нужно сделать если ответ ChatGPT не подходит?"
        options={['Ничего — AI всегда прав', 'Уточнить запрос и попросить переделать', 'Зарегистрироваться заново', 'Обновить страницу']}
        correct="Уточнить запрос и попросить переделать"
        explanation="ChatGPT можно итеративно улучшать. Скажите что именно не так и попросите переделать. Это нормальный рабочий процесс."
        color="green"
      />

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('chatgpt')} data-testid="mark-complete-chatgpt"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/module/gemini')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Следующий модуль <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
