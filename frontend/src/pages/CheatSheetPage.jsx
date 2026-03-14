import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Printer, CheckCircle2, Bot, Sparkles, Terminal, UserCog, ArrowRight } from 'lucide-react';

export default function CheatSheetPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in print-content" data-testid="cheatsheet-page">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Шпаргалка</span>
          </div>
          <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white">Краткий справочник</h1>
          <p className="text-zinc-400 text-sm mt-1">Всё важное на одной странице. Сохраните или распечатайте.</p>
        </div>
        <button onClick={() => window.print()} data-testid="print-btn"
          className="no-print flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          <Printer size={16} />
          Печать
        </button>
      </div>

      {/* 10 Rules */}
      <div className="print-card border border-yellow-500/30 bg-yellow-500/5 rounded-2xl p-5">
        <h2 className="font-heading text-lg font-bold text-yellow-400 mb-4">10 правил эффективного промтинга</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Будьте конкретны — чем детальнее запрос, тем лучше ответ',
            'Используйте формулу: Роль + Цель + Контекст + Ограничения + Формат',
            'Задавайте роль: "Ты — опытный маркетолог..."',
            'Указывайте аудиторию: "для новичка без опыта"',
            'Задавайте формат: список, таблица, абзацы, шаги',
            'Итерируйте: уточняйте и улучшайте ответ',
            'Просите примеры: "приведи конкретный пример из жизни"',
            'Указывайте длину: "до 5 предложений", "150 слов"',
            'Задавайте тон: официальный, дружелюбный, нейтральный',
            'Проверяйте факты: AI может ошибаться — перепроверяйте важное',
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center shrink-0">
                <span className="text-yellow-400 text-[10px] font-bold">{i + 1}</span>
              </div>
              <p className="text-zinc-300 text-sm">{rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* When to use */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="print-card border border-green-500/30 bg-green-500/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bot size={16} className="text-green-400" />
            <h3 className="font-semibold text-white">Используйте ChatGPT когда...</h3>
          </div>
          {[
            'Пишете длинные тексты или статьи',
            'Нужна помощь с кодом',
            'Творческий контент: сценарии, истории',
            'Работаете не в Google-экосистеме',
            'Нужны широкие возможности плагинов',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-zinc-300 py-1">
              <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
        <div className="print-card border border-blue-500/30 bg-blue-500/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-blue-400" />
            <h3 className="font-semibold text-white">Используйте Gemini когда...</h3>
          </div>
          {[
            'Активно используете Gmail, Docs, Drive',
            'Нужна актуальная информация из интернета',
            'Работаете с очень длинными документами',
            'Нужна помощь прямо внутри Google-сервисов',
            'Уже платите за Google Workspace',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-zinc-300 py-1">
              <CheckCircle2 size={12} className="text-blue-400 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Formula */}
      <div className="print-card border border-zinc-700 bg-zinc-900/50 rounded-2xl p-5">
        <h2 className="font-heading text-base font-bold text-white mb-4">Формула сильного промта</h2>
        <div className="flex flex-wrap gap-2 items-center text-sm mb-4">
          {[
            { label: 'Роль', color: 'blue' },
            { label: '+', color: 'zinc' },
            { label: 'Цель', color: 'green' },
            { label: '+', color: 'zinc' },
            { label: 'Контекст', color: 'yellow' },
            { label: '+', color: 'zinc' },
            { label: 'Ограничения', color: 'yellow' },
            { label: '+', color: 'zinc' },
            { label: 'Формат', color: 'green' },
          ].map((item, i) => (
            <span key={i} className={item.label === '+' ? 'text-zinc-500' : `font-bold text-${item.color}-400`}>
              {item.label}
            </span>
          ))}
        </div>
        <div className="bg-[#0D0D0D] border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-300 font-mono text-sm leading-relaxed">
            <span className="text-blue-400">Ты — опытный маркетолог.</span>{' '}
            <span className="text-green-400">Напиши 5 идей для постов в Instagram.</span>{' '}
            <span className="text-yellow-400">Аккаунт о здоровом питании, аудитория — молодые мамы 25-35 лет.</span>{' '}
            <span className="text-yellow-400">Без рекламных слоганов, простой язык.</span>{' '}
            <span className="text-green-400">Каждая идея: тема + 1 предложение описания.</span>
          </p>
        </div>
      </div>

      {/* Role examples */}
      <div className="print-card border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <UserCog size={16} className="text-yellow-400" />
          <h3 className="font-semibold text-white">Шаблоны ролей</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { role: 'Ты — преподаватель по [предмет]', use: 'объяснить сложное просто' },
            { role: 'Ты — опытный маркетолог', use: 'продвижение и контент' },
            { role: 'Ты — строгий редактор', use: 'улучшить и проверить текст' },
            { role: 'Ты — бизнес-консультант', use: 'стратегия и анализ' },
            { role: 'Ты — HR-специалист', use: 'резюме и интервью' },
            { role: 'Ты — финансовый аналитик', use: 'деньги и инвестиции' },
          ].map((r, i) => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
              <p className="text-yellow-400 font-mono text-xs">{r.role}</p>
              <p className="text-zinc-500 text-xs mt-0.5">→ {r.use}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Templates */}
      <div className="print-card border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={16} className="text-green-400" />
          <h3 className="font-semibold text-white">Готовые шаблоны промтов</h3>
        </div>
        <div className="space-y-2">
          {[
            '"Объясни [тема] простыми словами с аналогией из жизни"',
            '"Сделай краткое резюме текста в 5 пунктах: [текст]"',
            '"Напиши вежливое письмо [получателю] по поводу [тема], тон: [стиль]"',
            '"Составь план изучения [тема] для начинающего на [срок]"',
            '"Перепиши этот текст более профессионально: [текст]"',
            '"Придумай 10 идей для [задача], предлагай разнообразные варианты"',
            '"Сравни [вариант 1] и [вариант 2]: плюсы, минусы, для кого"',
            '"Разбей задачу [задача] на конкретные шаги"',
          ].map((tpl, i) => (
            <div key={i} className="bg-[#0D0D0D] border border-zinc-800 rounded-lg px-3 py-2">
              <p className="text-zinc-300 font-mono text-xs">{tpl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="print-card border border-blue-500/20 bg-blue-500/5 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-3">Чек-лист перед отправкой промта</h3>
        <div className="space-y-2">
          {[
            'Я задал(а) роль AI (кем он должен выступать)?',
            'Я указал(а) конкретную цель (что нужно сделать)?',
            'Я дал(а) контекст (для кого, в какой ситуации)?',
            'Я указал(а) ограничения (тон, длину, что не нужно)?',
            'Я задал(а) формат (список, таблица, абзацы)?',
            'Готов(а) итерировать если первый ответ не идеален?',
          ].map((item, i) => (
            <label key={i} className="flex items-start gap-2.5 text-sm text-zinc-300 cursor-pointer group">
              <div className="w-4 h-4 mt-0.5 border border-zinc-600 rounded shrink-0 group-hover:border-blue-400 transition-colors" />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="no-print flex justify-center pt-2">
        <button onClick={() => navigate('/print-center')} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
          Перейти в центр печати <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
