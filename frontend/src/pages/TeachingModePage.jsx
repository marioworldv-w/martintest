import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Presentation, Clock, ChevronDown, ChevronUp, Play, RotateCcw, BookOpen, MessageSquare, Dumbbell } from 'lucide-react';
import { TEACHING_TIMELINE } from '../data/courseData';

export default function TeachingModePage() {
  const navigate = useNavigate();
  const [activeBlock, setActiveBlock] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [started, setStarted] = useState(false);

  const totalMinutes = 120;
  const currentBlock = TEACHING_TIMELINE.find(b => currentTime >= b.timeStart && currentTime < b.timeEnd);

  const tabMap = {
    'explain': { label: 'Что объяснять', icon: BookOpen },
    'demo': { label: 'Демо', icon: Play },
    'question': { label: 'Вопрос', icon: MessageSquare },
    'task': { label: 'Задание', icon: Dumbbell },
  };

  const [activeTab, setActiveTab] = useState({});

  const getTab = (blockId) => activeTab[blockId] || 'explain';
  const setTab = (blockId, tab) => setActiveTab(prev => ({ ...prev, [blockId]: tab }));

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in" data-testid="teaching-mode-page">
      {/* Header */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Presentation size={20} className="text-red-400" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Режим преподавателя</span>
              <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">LIVE</span>
            </div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-white mb-2">2-часовой план урока</h1>
            <p className="text-zinc-400">Поминутный план с подсказками, демонстрациями и заданиями для студентов.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setStarted(true); setCurrentTime(0); }}
              data-testid="start-lesson-btn"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
            >
              <Play size={16} />
              Начать урок
            </button>
            <button onClick={() => { setStarted(false); setCurrentTime(0); }}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Progress */}
      {started && (
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-red-400" />
              <span className="text-white font-semibold">Минута: {currentTime}</span>
              {currentBlock && (
                <span className={`text-sm text-${currentBlock.color}-400 font-medium`}>— {currentBlock.title}</span>
              )}
            </div>
            <span className="text-zinc-500 text-sm">{currentTime}/{totalMinutes} мин</span>
          </div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / totalMinutes) * 100}%` }} />
          </div>
          <input
            type="range"
            min="0"
            max="120"
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            data-testid="time-slider"
            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-red-500"
          />
          <div className="flex justify-between text-xs text-zinc-600 mt-1">
            {[0, 15, 30, 45, 60, 75, 90, 105, 120].map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      )}

      {/* Lesson Blocks */}
      <div className="space-y-3">
        {TEACHING_TIMELINE.map((block, idx) => {
          const isActive = started && currentTime >= block.timeStart && currentTime < block.timeEnd;
          const isPast = started && currentTime >= block.timeEnd;
          const isOpen = activeBlock === idx;
          const tab = getTab(block.id);

          return (
            <div
              key={block.id}
              data-testid={`teaching-block-${idx}`}
              className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                isActive ? `border-${block.color}-500 shadow-lg shadow-${block.color}-900/20` :
                isPast ? 'border-zinc-800 opacity-60' :
                `border-${block.borderColor}/30 hover:border-${block.color}-500/40`
              }`}
            >
              {/* Block Header */}
              <button
                onClick={() => setActiveBlock(isOpen ? null : idx)}
                className={`w-full flex items-center gap-4 p-4 lg:p-5 text-left transition-colors ${isActive ? `bg-${block.color}-500/10` : 'bg-zinc-900/30 hover:bg-zinc-800/30'}`}
              >
                {/* Time Badge */}
                <div className={`shrink-0 w-20 text-center px-2 py-1.5 rounded-lg ${isActive ? `bg-${block.color}-500/20 border border-${block.color}-500/30` : 'bg-zinc-800/60 border border-zinc-700/50'}`}>
                  <div className={`text-xs font-bold ${isActive ? `text-${block.color}-400` : 'text-zinc-400'}`}>{block.timeStart}–{block.timeEnd}</div>
                  <div className="text-zinc-600 text-[10px]">мин</div>
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-base truncate ${isActive ? `text-${block.color}-400` : 'text-white'}`}>{block.title}</h3>
                    {isActive && <span className={`text-[10px] font-bold bg-${block.color}-500/20 text-${block.color}-400 px-2 py-0.5 rounded border border-${block.color}-500/30 shrink-0`}>СЕЙЧАС</span>}
                  </div>
                  <p className="text-zinc-500 text-sm mt-0.5 line-clamp-1">{block.goal}</p>
                </div>

                {/* Duration */}
                <div className="shrink-0 text-right">
                  <div className="text-zinc-600 text-xs">{block.timeEnd - block.timeStart} мин</div>
                  {isOpen ? <ChevronUp size={16} className="text-zinc-500 ml-auto mt-1" /> : <ChevronDown size={16} className="text-zinc-500 ml-auto mt-1" />}
                </div>
              </button>

              {/* Block Content */}
              {isOpen && (
                <div className="border-t border-zinc-800">
                  {/* Tabs */}
                  <div className="flex border-b border-zinc-800/60">
                    {Object.entries(tabMap).map(([key, { label, icon: Icon }]) => (
                      <button
                        key={key}
                        onClick={() => setTab(block.id, key)}
                        data-testid={`tab-${key}`}
                        className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors ${tab === key ? `text-${block.color}-400 border-b-2 border-${block.color}-500 bg-${block.color}-500/5` : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-5">
                    {tab === 'explain' && (
                      <div className="space-y-2">
                        <p className={`text-${block.color}-400 font-semibold text-sm mb-3`}>Цель: {block.goal}</p>
                        {block.explain.map((point, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className={`w-5 h-5 rounded-full bg-${block.color}-500/20 border border-${block.color}-500/30 flex items-center justify-center shrink-0 mt-0.5`}>
                              <span className={`text-${block.color}-400 text-[10px] font-bold`}>{i + 1}</span>
                            </div>
                            <p className="text-zinc-300 text-sm">{point}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {tab === 'demo' && (
                      <div className={`bg-${block.color}-500/5 border border-${block.color}-500/20 rounded-xl p-4`}>
                        <p className={`text-${block.color}-400 font-semibold text-sm mb-2`}>Демонстрация:</p>
                        <p className="text-zinc-200 font-mono text-sm leading-relaxed">{block.demo}</p>
                        <p className="text-zinc-500 text-xs mt-3">Откройте ChatGPT или Gemini и покажите этот промт вживую</p>
                      </div>
                    )}
                    {tab === 'question' && (
                      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-yellow-400 font-semibold text-sm mb-2">Вопрос студентам:</p>
                        <p className="text-zinc-200 text-base font-medium leading-relaxed">"{block.question}"</p>
                        <p className="text-zinc-500 text-xs mt-3">Подождите ответов — вовлечённость важна</p>
                      </div>
                    )}
                    {tab === 'task' && (
                      <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                        <p className="text-green-400 font-semibold text-sm mb-2">Задание студенту:</p>
                        <p className="text-zinc-200 text-sm leading-relaxed">{block.task}</p>
                        <p className="text-zinc-500 text-xs mt-3">Дайте 3-5 минут на выполнение</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips for teacher */}
      <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-5">
        <h3 className="text-red-400 font-semibold mb-3">Советы преподавателю</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Держите ChatGPT и Gemini открытыми в браузере — используйте вживую',
            'Не торопитесь — пауза после демо лучше, чем быстрый переход',
            'Задавайте вопросы аудитории каждые 10-15 минут',
            'Если студент спрашивает — используйте это как момент для демонстрации',
            'Шпаргалка есть на странице /cheatsheet — распечатайте заранее',
            'Практическое задание в конце — самый важный момент урока',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-red-400 shrink-0">•</span>
              <span className="text-zinc-300">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
