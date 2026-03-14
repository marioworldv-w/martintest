import React, { useState } from 'react';
import { Printer, FileText, Check } from 'lucide-react';

const PRINT_ITEMS = [
  {
    id: 'cheatsheet',
    title: 'Шпаргалка',
    desc: 'Формула промта, 10 правил, шаблоны, чек-лист',
    pages: 1,
    color: 'yellow',
  },
  {
    id: 'demo-prompts',
    title: 'Демо-промты',
    desc: 'Готовые промты для живой демонстрации на уроке',
    pages: 2,
    color: 'yellow',
  },
  {
    id: 'comparison',
    title: 'GPT vs Gemini',
    desc: 'Таблица сравнения, когда использовать каждый',
    pages: 1,
    color: 'blue',
  },
  {
    id: 'prompts',
    title: 'Библиотека промтов',
    desc: 'Готовые промты по категориям (120+)',
    pages: 3,
    color: 'green',
  },
  {
    id: 'roles',
    title: 'Роли для промтинга',
    desc: 'Шаблоны ролей и примеры использования',
    pages: 1,
    color: 'yellow',
  },
];

export default function PrintCenterPage() {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => setSelected(PRINT_ITEMS.map(i => i.id));
  const clearAll = () => setSelected([]);

  const printPage = (path) => {
    window.open(path, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 lg:p-6 animate-fade-in" data-testid="print-center-page">
      <div className="border border-blue-500/30 bg-blue-500/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Printer size={20} className="text-blue-400" />
          <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Центр печати</span>
        </div>
        <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">Материалы для печати</h1>
        <p className="text-zinc-400">Выберите материалы которые хотите распечатать для урока.</p>
      </div>

      <div className="flex gap-3">
        <button onClick={selectAll} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm rounded-lg transition-all">
          Выбрать все
        </button>
        <button onClick={clearAll} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm rounded-lg transition-all">
          Снять выбор
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {PRINT_ITEMS.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <div key={item.id}
              data-testid={`print-item-${item.id}`}
              onClick={() => toggle(item.id)}
              className={`border rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 ${isSelected ? `border-${item.color}-500/40 bg-${item.color}-500/5` : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${isSelected ? `bg-${item.color}-500/20 border-${item.color}-500/30` : 'bg-zinc-800 border-zinc-700'}`}>
                  {isSelected ? <Check size={16} className={`text-${item.color}-400`} /> : <FileText size={16} className="text-zinc-500" />}
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${isSelected ? `text-${item.color}-400` : 'text-white'}`}>{item.title}</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                  <span className="text-zinc-600 text-xs">{item.pages} стр.</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Print Buttons */}
      <div className="border border-zinc-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Быстрая печать отдельных страниц</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: 'Шпаргалка', path: '/cheatsheet', color: 'yellow' },
            { label: 'Демо-промты', path: '/demo-prompts', color: 'yellow' },
            { label: 'GPT vs Gemini', path: '/module/comparison', color: 'blue' },
            { label: 'Библиотека промтов', path: '/module/prompt-library', color: 'green' },
            { label: 'Роли в промтинге', path: '/module/roles', color: 'yellow' },
          ].map((item, i) => (
            <button key={i}
              data-testid={`quick-print-${i}`}
              onClick={() => printPage(item.path)}
              className={`flex items-center justify-between p-3 rounded-lg border border-${item.color}-500/20 bg-${item.color}-500/5 hover:bg-${item.color}-500/10 transition-all text-left`}>
              <span className={`text-${item.color}-400 font-semibold text-sm`}>{item.label}</span>
              <Printer size={14} className={`text-${item.color}-400`} />
            </button>
          ))}
        </div>
      </div>

      <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-2 text-sm">Инструкция по печати</h3>
        <ol className="space-y-1.5 text-sm text-zinc-400">
          <li>1. Нажмите кнопку печати на нужной странице или используйте "Быструю печать" выше</li>
          <li>2. В диалоге печати выберите: Принтер → Цветной или ч/б</li>
          <li>3. Рекомендуемый формат: A4, одностороннее</li>
          <li>4. Боковое меню и навигация скрыты при печати автоматически</li>
          <li>5. Также можно сохранить как PDF (выбрать "Сохранить как PDF" в диалоге)</li>
        </ol>
      </div>
    </div>
  );
}
