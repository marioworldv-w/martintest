import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from 'lucide-react';
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

export default function IntroPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('intro');

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="intro-page">
      {/* Header */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Cpu size={20} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Модуль 1 · Теория</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Введение в AI-ассистенты</h1>
            <p className="text-zinc-400">Что такое AI-ассистенты, как они работают и почему они изменили то, как мы работаем.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">10 мин</span>
        </div>
      </div>

      {/* Key Points */}
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: '🧠', text: 'AI — это инструмент, не магия', color: 'text-blue-400' },
          { icon: '📚', text: 'Обучены на миллиардах текстов', color: 'text-blue-400' },
          { icon: '💬', text: 'Предсказывают следующее слово', color: 'text-blue-400' },
          { icon: '✍️', text: 'Качество ответа = качество вопроса', color: 'text-yellow-400' },
        ].map((k, i) => (
          <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
            <span className="text-xl">{k.icon}</span>
            <span className={`text-sm font-medium ${k.color}`}>{k.text}</span>
          </div>
        ))}
      </div>

      <Section title="Что такое AI-ассистент?" defaultOpen={true}>
        <p className="text-zinc-300 text-sm leading-relaxed">
          AI-ассистент — это программа, которая может отвечать на вопросы, писать тексты, объяснять сложные вещи и помогать с задачами. Самые известные — <strong className="text-white">ChatGPT</strong> (от компании OpenAI) и <strong className="text-white">Gemini</strong> (от Google).
        </p>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Представьте, что у вас есть очень умный и быстрый помощник, который прочитал миллионы книг, статей и веб-страниц. Теперь он готов помочь вам с любым вопросом, написать письмо, объяснить тему или придумать идеи — и всё это за секунды.
        </p>
        <TipBox title="Аналогия для новичка">
          AI-ассистент — это как Google Поиск, только вместо списка ссылок он сразу даёт вам готовый ответ, написанный специально для вашего вопроса.
        </TipBox>
      </Section>

      <Section title="Как AI на самом деле работает?">
        <p className="text-zinc-300 text-sm leading-relaxed">
          AI не "думает" как человек. Он не понимает смысл слов — он предсказывает, какое слово с большой вероятностью должно стоять следующим в тексте, основываясь на обучении.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mt-2">
          {[
            { step: '1', title: 'Обучение', desc: 'AI изучил огромный объём текстов — книги, статьи, сайты', color: 'blue' },
            { step: '2', title: 'Запрос', desc: 'Вы задаёте вопрос. AI анализирует его и начинает формировать ответ', color: 'yellow' },
            { step: '3', title: 'Ответ', desc: 'AI предсказывает наиболее подходящий текст для ответа на ваш запрос', color: 'green' },
          ].map((s, i) => (
            <div key={i} className={`bg-${s.color}-500/10 border border-${s.color}-500/20 rounded-xl p-3`}>
              <div className={`text-${s.color}-400 font-bold text-xs mb-1`}>Шаг {s.step}</div>
              <div className="text-white font-semibold text-sm mb-1">{s.title}</div>
              <p className="text-zinc-400 text-xs">{s.desc}</p>
            </div>
          ))}
        </div>
        <WarningBox title="Важно понимать">
          AI может ошибаться. Он уверенно говорит даже когда не прав. Всегда проверяйте важные факты в независимых источниках.
        </WarningBox>
      </Section>

      <Section title="Что AI умеет делать?">
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Отвечать на вопросы на любую тему',
            'Писать тексты, статьи, письма, описания',
            'Делать резюме длинных материалов',
            'Переводить на другие языки',
            'Объяснять сложные темы простым языком',
            'Составлять планы, списки и структуры',
            'Генерировать идеи для бизнеса и контента',
            'Редактировать и улучшать ваши тексты',
            'Помогать с анализом данных и документов',
            'Решать математические задачи',
          ].map((cap, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
              <span className="text-zinc-300">{cap}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Что AI не умеет (пока)?">
        <div className="space-y-2">
          {[
            { text: 'Гарантированно предоставлять точные факты — он может "галлюцинировать" (выдумывать)', color: 'red' },
            { text: 'Думать самостоятельно или иметь настоящее понимание мира', color: 'red' },
            { text: 'Заменить живого эксперта в критических ситуациях (медицина, юриспруденция)', color: 'red' },
            { text: 'Учиться на основе вашего разговора (как правило, каждый чат начинается заново)', color: 'red' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-red-400 shrink-0 mt-0.5">✗</span>
              <span className="text-zinc-300">{item.text}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="ChatGPT и Gemini — в чём разница?">
        <InfoBox title="Краткий обзор">
          <strong className="text-white">ChatGPT</strong> — создан компанией OpenAI. Сильный в написании текстов, анализе и технических задачах.
          <br /><br />
          <strong className="text-white">Gemini</strong> — создан компанией Google. Интегрирован с Gmail, Google Docs и другими Google-сервисами. Имеет доступ к актуальному интернету.
        </InfoBox>
        <p className="text-zinc-400 text-sm">На следующих уроках мы подробно разберём каждый из них и научимся выбирать правильный инструмент для каждой задачи.</p>
      </Section>

      <QuizBlock
        question="Что правда об AI-ассистентах?"
        options={['AI думает как человек', 'AI предсказывает текст на основе обучения', 'AI знает всё и никогда не ошибается', 'AI заменяет всех специалистов']}
        correct="AI предсказывает текст на основе обучения"
        explanation="AI — это статистическая модель, которая предсказывает следующее слово. Это не мышление в человеческом смысле, но результаты получаются очень полезными."
        color="blue"
      />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => { markComplete('intro'); }}
          data-testid="mark-complete-btn"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button
          onClick={() => navigate('/module/chatgpt')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          Следующий модуль
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
