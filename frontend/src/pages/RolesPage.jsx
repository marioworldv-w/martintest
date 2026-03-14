import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';
import { TipBox, InfoBox } from '../components/shared/TipBox';
import { useProgress } from '../hooks/useProgress';

const ROLES = [
  {
    role: 'Преподаватель',
    icon: '👨‍🏫',
    color: 'blue',
    desc: 'Объясняет просто, с примерами, проверяет понимание',
    howToUse: 'Ты — преподаватель по [предмет]. Объясни [тема] для новичка с примерами.',
    task: 'Как работают нейронные сети?',
    withoutRole: 'Нейронные сети — это математические модели, вдохновлённые биологическими нейронами. Они состоят из слоёв узлов, которые обрабатывают информацию через веса и смещения...',
    withRole: 'Представьте, что у вас есть очень много маленьких помощников (нейронов), которые передают записки друг другу. Каждый помощник смотрит на записку и решает: "Важно это или нет?". Если важно — передаёт дальше. Тысячи таких помощников вместе и есть нейронная сеть! Давайте я задам вам 2 вопроса чтобы проверить понимание...',
  },
  {
    role: 'Маркетолог',
    icon: '📊',
    color: 'red',
    desc: 'Мыслит с точки зрения аудитории, конверсий и роста',
    howToUse: 'Ты — опытный маркетолог. [задача]. Дай конкретные рекомендации.',
    task: 'Как мне привлечь первых клиентов для онлайн-курса?',
    withoutRole: 'Чтобы привлечь клиентов, вам нужно использовать маркетинговые каналы. Рассмотрите социальные сети, контент-маркетинг, email-рассылки и платную рекламу...',
    withRole: 'Первые клиенты — это "горячие" контакты. Конкретный план: 1) Свяжитесь с 20 знакомыми, которым тема актуальна — это бесплатно и работает лучше всего. 2) Запустите бесплатный вебинар для 50 человек — покажите ценность. 3) Попросите 3 знакомых стать бета-тестерами за скидку 70%. 4) Только после первых отзывов запускайте платный трафик.',
  },
  {
    role: 'Строгий редактор',
    icon: '✏️',
    color: 'yellow',
    desc: 'Находит ошибки, улучшает стиль, не оставляет слабых мест',
    howToUse: 'Ты — строгий редактор. Проверь мой текст и укажи все ошибки и слабые места.',
    task: 'Проверь и улучши: "Наша компания уже много лет делает хорошие продукты и клиенты нас любят"',
    withoutRole: 'Текст читается нормально. Можно добавить конкретные детали для большей убедительности.',
    withRole: 'Слабые места: 1) "Много лет" — неконкретно. Сколько лет? Напишите цифру. 2) "Хорошие продукты" — пустое слово. Замените на конкретное преимущество. 3) "Клиенты нас любят" — голословно. Добавьте: "95% клиентов рекомендуют нас" или цитату. Исправленный вариант: "14 лет мы создаём [конкретный продукт] — 4700+ клиентов доверяют нам свои [конкретная задача]."',
  },
  {
    role: 'Бизнес-консультант',
    icon: '💼',
    color: 'green',
    desc: 'Анализирует ситуацию, даёт структурированные рекомендации',
    howToUse: 'Ты — бизнес-консультант с 10-летним опытом. Проанализируй [ситуацию] и дай 3 конкретных шага.',
    task: 'Мой интернет-магазин теряет клиентов. Что делать?',
    withoutRole: 'Потеря клиентов может быть связана с разными факторами. Нужно проанализировать конкурентов, цены, качество обслуживания...',
    withRole: 'Диагностика нужна сразу по 3 направлениям: 1) Данные — смотрите в аналитике где "ломается" воронка. Корзина бросается? Уходят со страницы товара? 2) Отзывы — прочитайте последние 20 негативных. Там паттерн. 3) Конкуренты — купите у них один раз. Что они делают лучше? После диагностики — возвращайтесь, дам план.',
  },
  {
    role: 'Аналитик',
    icon: '🔬',
    color: 'blue',
    desc: 'Структурирует данные, выявляет паттерны, делает выводы',
    howToUse: 'Ты — аналитик данных. Проанализируй [данные/ситуацию] и сделай выводы.',
    task: 'Продажи в марте упали на 30% по сравнению с февралём',
    withoutRole: 'Снижение продаж может быть связано с сезонностью или другими факторами. Нужно больше данных для анализа.',
    withRole: 'Для диагностики нужно 5 метрик: 1) Трафик — вырос/упал? 2) Конверсия — изменился ли % покупок. 3) Средний чек — стал меньше? 4) Возвраты — выросли? 5) Источники трафика — какой канал "просел"? Март обычно сезонный. Сравните с мартом прошлого года. Если год к году тоже -30% — проблема структурная.',
  },
  {
    role: 'Копирайтер',
    icon: '📝',
    color: 'yellow',
    desc: 'Создаёт тексты, которые вовлекают и продают',
    howToUse: 'Ты — опытный копирайтер. Напиши [тип текста] для [аудитория], который [цель].',
    task: 'Напиши заголовок для курса по личным финансам',
    withoutRole: 'Вот несколько вариантов заголовков для курса по личным финансам. Выберите подходящий.',
    withRole: '5 вариантов с разными крючками: 1) Боль: "Деньги заканчиваются за 2 недели до зарплаты?" 2) Результат: "От хаоса к финансовой подушке за 90 дней" 3) Простота: "Личные финансы без таблиц, банков и скуки" 4) Авторитет: "Система, которую используют 12 000 учеников" 5) Любопытство: "Почему умные люди остаются без сбережений (и как это исправить)"',
  },
];

export default function RolesPage() {
  const navigate = useNavigate();
  const { markComplete, isComplete } = useProgress();
  const done = isComplete('roles');
  const [selected, setSelected] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in" data-testid="roles-page">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserCog size={20} className="text-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Модуль 8 · Техника</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Роли в промтинге</h1>
            <p className="text-zinc-400">Как назначить AI нужную роль и почему это кардинально меняет качество ответа.</p>
          </div>
          <span className="text-zinc-500 text-sm shrink-0">15 мин</span>
        </div>
      </div>

      {/* Concept */}
      <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3">Что такое роль в промтинге?</h3>
        <p className="text-zinc-300 text-sm leading-relaxed mb-3">
          Роль — это "персонаж", которого вы даёте AI. Фраза <strong className="text-yellow-400">"Действуй как..."</strong> или <strong className="text-yellow-400">"Ты — ..."</strong> задаёт экспертизу, тон, стиль и угол зрения ответа.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { without: 'Как увеличить продажи?', with: 'Ты — маркетолог. Как увеличить продажи?', diff: 'Конкретные инструменты, стратегии роста' },
            { without: 'Объясни инфляцию', with: 'Ты — преподаватель. Объясни инфляцию новичку.', diff: 'Простые аналогии, без жаргона' },
            { without: 'Проверь мой текст', with: 'Ты — строгий редактор. Проверь текст.', diff: 'Конкретные правки, не общие слова' },
          ].map((ex, i) => (
            <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
              <div className="text-red-400 text-xs font-mono mb-1">Без роли: "{ex.without}"</div>
              <div className="text-green-400 text-xs font-mono mb-1">С ролью: "{ex.with}"</div>
              <div className="text-yellow-400 text-xs">Эффект: {ex.diff}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Cards */}
      <div>
        <h3 className="text-white font-semibold mb-3">Нажмите на роль чтобы увидеть пример "до/после"</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLES.map((r, i) => (
            <button
              key={i}
              data-testid={`role-card-${i}`}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                selected === i
                  ? `border-${r.color}-500/50 bg-${r.color}-500/10`
                  : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{r.icon}</span>
                <span className={`font-bold text-sm ${selected === i ? `text-${r.color}-400` : 'text-white'}`}>{r.role}</span>
              </div>
              <p className="text-zinc-400 text-xs">{r.desc}</p>
              {selected === i && (
                <div className="mt-2 flex items-center gap-1 text-xs text-yellow-400">
                  <ChevronRight size={12} />
                  Показать пример
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Block */}
      {selected !== null && (
        <div className="border border-zinc-700 rounded-2xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ROLES[selected].icon}</span>
            <div>
              <h3 className="text-white font-bold">{ROLES[selected].role}</h3>
              <p className="text-zinc-500 text-xs">Как использовать: <span className="text-yellow-400 font-mono">{ROLES[selected].howToUse}</span></p>
            </div>
          </div>
          <p className="text-zinc-400 text-sm border-l-2 border-zinc-700 pl-3">
            Задача: <strong className="text-white">{ROLES[selected].task}</strong>
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4">
              <div className="text-red-400 font-semibold text-xs mb-2 uppercase tracking-wide">Без роли</div>
              <p className="text-zinc-300 text-sm leading-relaxed">{ROLES[selected].withoutRole}</p>
            </div>
            <div className="border border-green-500/20 bg-green-500/5 rounded-xl p-4">
              <div className="text-green-400 font-semibold text-xs mb-2 uppercase tracking-wide">С ролью "{ROLES[selected].role}"</div>
              <p className="text-zinc-200 text-sm leading-relaxed">{ROLES[selected].withRole}</p>
            </div>
          </div>
        </div>
      )}

      <TipBox title="Как усилить роль">
        Добавьте характер: "строгий редактор" vs "редактор". Добавьте опыт: "маркетолог с 10-летним опытом в малом бизнесе". Чем конкретнее роль — тем точнее ответ.
      </TipBox>

      <InfoBox title="Полезные роли для повседневных задач">
        <div className="grid sm:grid-cols-2 gap-2 mt-2">
          {[
            'Преподаватель — объяснить сложное',
            'Редактор — улучшить текст',
            'Маркетолог — продвижение и контент',
            'HR-специалист — резюме и интервью',
            'Финансовый аналитик — анализ денег',
            'Бизнес-консультант — стратегия',
            'Юрист — разобраться в документах',
            'Переводчик — точный перевод с контекстом',
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
              <CheckCircle2 size={12} className="text-blue-400 shrink-0" />
              {r}
            </div>
          ))}
        </div>
      </InfoBox>

      <div className="flex items-center justify-between pt-4">
        <button onClick={() => markComplete('roles')} data-testid="mark-complete-roles"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`}>
          <CheckCircle2 size={16} />
          {done ? 'Завершено' : 'Отметить как завершённое'}
        </button>
        <button onClick={() => navigate('/module/google-ai')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all">
          Следующий модуль <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
