import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Cpu, MessageSquare, Sparkles, ArrowLeftRight, Terminal, Wrench,
  Library, UserCog, Globe, Layers, Presentation, Dumbbell,
  FileText, Printer, ChevronDown, ChevronRight, X, LayoutDashboard,
  BookOpen, CheckCircle2, Circle
} from 'lucide-react';
import { MODULES, TOOLS_SECTION } from '../../data/courseData';
import { useProgress } from '../../hooks/useProgress';

const ICON_MAP = {
  Cpu, MessageSquare, Sparkles, ArrowLeftRight, Terminal, Wrench,
  Library, UserCog, Globe, Layers, Presentation, Dumbbell,
  FileText, Printer, BookOpen
};

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isComplete } = useProgress();
  const [courseOpen, setCourseOpen] = useState(true);

  const go = (path) => {
    navigate(path);
    onClose?.();
  };

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, title, color, completed, badge }) => {
    const active = isActive(path);
    return (
      <button
        data-testid={`nav-${path.replace(/\//g, '-')}`}
        onClick={() => go(path)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group text-left ${
          active
            ? `bg-${color}-500/15 text-${color}-400 border-l-2 border-${color}-500`
            : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
        }`}
      >
        {completed ? (
          <CheckCircle2 size={14} className="text-green-500 shrink-0" />
        ) : (
          <Icon size={14} className={`shrink-0 ${active ? `text-${color}-400` : 'text-zinc-500 group-hover:text-zinc-300'}`} />
        )}
        <span className="truncate font-body">{title}</span>
        {badge && (
          <span className="ml-auto text-[10px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      data-testid="sidebar"
      className="w-64 h-screen bg-[#0D0D0D] border-r border-zinc-800/60 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800/60">
        <button onClick={() => go('/')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <BookOpen size={16} className="text-blue-400" />
          </div>
          <div>
            <div className="text-white font-heading text-xs font-bold leading-none">AI Academy</div>
            <div className="text-zinc-500 text-[10px] leading-none mt-0.5">Курс для начинающих</div>
          </div>
        </button>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {/* Dashboard */}
        <NavItem path="/" icon={LayoutDashboard} title="Главная" color="blue" />

        <div className="pt-2">
          {/* Course Section */}
          <button
            onClick={() => setCourseOpen(!courseOpen)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-400 transition-colors"
          >
            {courseOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            КУРС
          </button>

          {courseOpen && (
            <div className="space-y-0.5 mt-1">
              {MODULES.map((mod) => {
                const Icon = ICON_MAP[mod.icon] || BookOpen;
                return (
                  <NavItem
                    key={mod.id}
                    path={mod.path}
                    icon={Icon}
                    title={`${mod.number}. ${mod.shortTitle}`}
                    color={mod.color}
                    completed={isComplete(mod.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-2">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            ИНСТРУМЕНТЫ
          </div>
          <div className="space-y-0.5 mt-1">
            {TOOLS_SECTION.map((tool) => {
              const Icon = ICON_MAP[tool.icon] || BookOpen;
              return (
                <NavItem
                  key={tool.path}
                  path={tool.path}
                  icon={Icon}
                  title={tool.title}
                  color={tool.color}
                  badge={tool.path === '/teaching-mode' ? 'LIVE' : undefined}
                />
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-4 py-3 border-t border-zinc-800/60">
        <div className="text-[10px] text-zinc-600 text-center">
          AI Academy · 2025
        </div>
      </div>
    </aside>
  );
}
