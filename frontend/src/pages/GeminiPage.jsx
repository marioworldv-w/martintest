import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle2, ArrowRight, Copy, Check } from 'lucide-react';
import { TipBox, WarningBox, InfoBox } from '../components/shared/TipBox';
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

function PromptEx({ title, prompt, tag }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(prompt).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="bg-[#0D0D0D] border border-blue-500/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-blue-400 font-semibold text-sm">{title}</span>
        {tag && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">{tag}</span>}
      </div>
      <p className="text-zinc-300 text-sm font-mono leading-relaxed mb-2">{prompt}</p>
      <button onClick={copy} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300">
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        {copied ? 'Скопировано!' : 'Копировать'}
      </button>
    </div>
  );
}

export default function GeminiPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('gemini');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="gemini-page">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Модуль 3 · Gemini</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Gemini: AI от Google</h1>
            <p className="text-zinc-400">Что такое Gemini, как он работает, интеграция с Google, практическое применение.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">20 мин</span>
        </div>
      </div>

      <Section title="Что такое Gemini?" defaultOpen={true}>
        <p className="text-zinc-300 text-sm leading-relaxed">
          <strong className="text-white">Gemini</strong> — это AI-ассистент от компании <strong className="text-blue-400">Google DeepMind</strong>. Раньше он назывался <em>Bard</em> — в 2024 году Google переименовал его в Gemini.
        </p>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Gemini — это не просто чат-бот. Это AI, который глубоко интегрирован в экосистему Google: Gmail, Google Docs, Drive, Таблицы, Презентации, Calendar. Если вы уже используете эти инструменты — Gemini будет для вас особенно полезен.
        </p>
        <InfoBox title="Ключевое отличие от ChatGPT">
          Gemini встроен прямо в Google-сервисы. Вы можете попросить его помочь прямо в Gmail (написать ответ) или в Google Docs (продолжить текст) — без переключения между вкладками.
        </InfoBox>
      </Section>

      <Section title="Где доступен Gemini?">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { where: 'gemini.google.com', desc: 'Основной интерфейс — как ChatGPT, только от Google', icon: '🌐', color: 'blue' },
            { where: 'Gmail', desc: 'Кнопка "Помощь от Gemini" в окне написания письма', icon: '📧', color: 'blue' },
            { where: 'Google Docs', desc: 'Боковая панель Gemini для написания и редактирования', icon: '📄', color: 'blue' },
            { where: 'Google Drive', desc: 'Анализ документов и файлов в вашем Drive', icon: '💾', color: 'blue' },
            { where: 'Google Таблицы', desc: 'Помощь с формулами и анализом данных', icon: '📊', color: 'blue' },
            { where: 'Android', desc: 'Голосовой помощник вместо (или вместе с) Google Assistant', icon: '📱', color: 'blue' },
          ].map((item, i) => (
            <div key={i} className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-3 flex gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-blue-400 font-semibold text-sm">{item.where}</div>
                <p className="text-zinc-400 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <TipBox title="Как найти Gemini в Gmail">
          Откройте Gmail → нажмите "Написать" → в правом нижнем углу появится кнопка со значком Gemini (звёздочки). Нажмите её чтобы получить помощь.
        </TipBox>
      </Section>

      <Section title="Особенности Gemini">
        <div className="space-y-3">
          {[
            { title: 'Поиск в интернете в реальном времени', desc: 'В отличие от ChatGPT (бесплатная версия), Gemini может искать актуальную информацию в Google. Это означает свежие новости, актуальные цены и текущие данные.', good: true },
            { title: 'Google Lens интеграция', desc: 'Можно загрузить изображение и задать вопросы о нём. Gemini "видит" и анализирует картинки, схемы, документы.', good: true },
            { title: 'Multimodal — работа с разными форматами', desc: 'Gemini работает с текстом, изображениями, аудио и видео (в зависимости от версии). Это открывает широкие возможности.', good: true },
            { title: 'Длинный контекст', desc: 'Gemini может обрабатывать очень длинные документы — книги, отчёты, большие файлы. ChatGPT (бесплатная) имеет ограничения.', good: true },
          ].map((feat, i) => (
            <div key={i} className={`border ${feat.good ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'} rounded-xl p-4`}>
              <div className={`font-semibold text-sm mb-1 ${feat.good ? 'text-green-400' : 'text-red-400'}`}>{feat.title}</div>
              <p className="text-zinc-400 text-xs">{feat.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Как использовать Gemini в Google Docs">
        <div className="space-y-3">
          {[
            { step: '1', text: 'Откройте Google Docs и создайте или откройте документ' },
            { step: '2', text: 'Нажмите на значок Gemini (звёздочки) в правой части экрана или в меню "Инструменты → Gemini"' },
            { step: '3', text: 'Появится боковая панель. Введите запрос: "Напиши введение для статьи о..." или "Сделай этот текст короче"' },
            { step: '4', text: 'Gemini предложит текст. Нажмите "Вставить" чтобы добавить его в документ или "Попробуй ещё раз" для нового варианта' },
          ].map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <span className="text-blue-400 text-xs font-bold">{s.step}</span>
              </div>
              <p className="text-zinc-300 text-sm pt-1">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Практические примеры промтов в Gemini">
        <div className="space-y-3">
          <PromptEx title="Помощь в Gmail" tag="Email" prompt={'Напиши профессиональный ответ на это письмо. Тон: дружелюбный, конкретный. Подтверди получение и скажи что отвечу подробнее в течение 24 часов.'} />
          <PromptEx title="В Google Docs" tag="Docs" prompt={'Я пишу статью о преимуществах удалённой работы. Напиши вступительный абзац (3-4 предложения), который захватит внимание читателя и объяснит почему тема актуальна в 2024 году.'} />
          <PromptEx title="Анализ документа" tag="Drive" prompt={'Прочитай этот документ и выдели: 1) Главные выводы, 2) Ключевые риски, 3) Рекомендованные следующие шаги. Формат: маркированные списки.'} />
        </div>
      </Section>

      <Section title="Gemini Advanced vs бесплатный Gemini">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-zinc-700 bg-zinc-900/30 rounded-xl p-4">
            <div className="text-zinc-400 font-semibold text-sm mb-3">Бесплатный Gemini</div>
            <div className="space-y-1.5">
              {['Базовый доступ к Gemini', 'Текстовые запросы', 'Поиск в интернете', 'Базовые изображения (Imagen)'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-400"><CheckCircle2 size={12} className="text-green-500" />{f}</div>
              ))}
            </div>
          </div>
          <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-4">
            <div className="text-blue-400 font-semibold text-sm mb-3">Google AI Pro (платный)</div>
            <div className="space-y-1.5">
              {['Gemini Advanced (мощная модель)', 'Очень длинный контекст', 'Интеграция в весь Google Workspace', 'Приоритетный доступ к новым функциям'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-blue-300"><CheckCircle2 size={12} className="text-blue-400" />{f}</div>
              ))}
            </div>
          </div>
        </div>
        <WarningBox title="Важно">
          Функции и доступность Google AI Pro могут варьироваться по стране и меняться со временем. Всегда проверяйте актуальную информацию на официальном сайте Google.
        </WarningBox>
      </Section>

      <QuizBlock
        question="Какое ключевое преимущество Gemini перед ChatGPT для пользователя Gmail?"
        options={
          ['Gemini лучше пишет стихи', 'Gemini встроен прямо в Gmail и другие Google-сервисы', 'Gemini бесплатен всегда', 'Gemini быстрее печатает']
        }
        correct="Gemini встроен прямо в Gmail и другие Google-сервисы"
        explanation="Главное преимущество Gemini — бесшовная интеграция с Google Workspace. Вы можете получить помощь прямо в Gmail не выходя из почты."
        color="blue"
      />

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('gemini')} data-testid="mark-complete-gemini"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/module/comparison')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Следующий модуль <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
