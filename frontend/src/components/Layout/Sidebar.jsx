import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Cpu, MessageSquare, Sparkles, ArrowLeftRight, Terminal, Wrench,
  Library, UserCog, Globe, Layers, Presentation, Dumbbell,
  FileText, Printer, X, LayoutDashboard, BookOpen, CheckCircle2,
  ChevronDown, ChevronRight, Zap
} from 'lucide-react';
import { MODULES, TOOLS_SECTION } from '../../data/courseData';
import { useProgress } from '../../hooks/useProgress';

const ICON_MAP = {
  Cpu, MessageSquare, Sparkles, ArrowLeftRight, Terminal, Wrench,
  Library, UserCog, Globe, Layers, Presentation, Dumbbell,
  FileText, Printer, BookOpen, Zap
};

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isComplete } = useProgress();
  const [courseOpen, setCourseOpen] = useState(true);

  const go = (path) => { navigate(path); onClose?.(); };
  const isActive = (path) => location.pathname === path;

  const NavItem = ({ path, icon: Icon, title, color, completed, badge }) => {
    const active = isActive(path);
    return (
      <button
        data-testid={`nav-${path.replace(/\//g, '-')}`}
        onClick={() => go(path)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 group text-left relative overflow-hidden ${
          active
            ? 'text-white'
            : 'text-zinc-500 hover:text-zinc-200'
        }`}
        style={active ? {
          background: `rgba(var(--color-${color}-rgb, 59,130,246), 0.12)`,
          borderLeft: `2px solid rgba(59,130,246,0.7)`,
        } : {}}
      >
        {active && <div className="absolute inset-0 rounded-lg" style={{ background: 'rgba(59,130,246,0.06)' }} />}
        <span className="relative z-10 flex items-center gap-2.5 w-full">
          {completed ? (
            <CheckCircle2 size={13} className="text-green-400 shrink-0" />
          ) : (
            <Icon size={13} className={`shrink-0 ${active ? 'text-blue-400' : 'text-zinc-600 group-hover:text-zinc-400'} transition-colors`} />
          )}
          <span className="truncate font-body">{title}</span>
          {badge && (
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#FC8181', border: '1px solid rgba(239,68,68,0.25)' }}>
              {badge}
            </span>
          )}
        </span>
      </button>
    );
  };

  return (
    <aside
      data-testid="sidebar"
      className="glass-sidebar w-64 h-screen flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid rgba(59,130,246,0.08)' }}>
        <button onClick={() => go('/')} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center relative"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.25))', border: '1px solid rgba(59,130,246,0.30)' }}>
            <BookOpen size={16} className="text-blue-300" />
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: '0 0 20px -4px rgba(59,130,246,0.5)' }} />
          </div>
          <div>
            <div className="text-white font-heading text-xs font-bold leading-none tracking-wider">AI ACADEMY</div>
            <div className="text-[10px] leading-none mt-0.5" style={{ color: 'rgba(147,197,253,0.5)' }}>Курс для начинающих</div>
          </div>
        </button>
        {onClose && (
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 p-1 transition-colors">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        <NavItem path="/" icon={LayoutDashboard} title="Главная" color="blue" />

        <div className="pt-2 pb-1">
          <button
            onClick={() => setCourseOpen(!courseOpen)}
            className="w-full flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
            style={{ color: 'rgba(59,130,246,0.45)' }}
          >
            {courseOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            КУРС
          </button>

          {courseOpen && (
            <div className="space-y-0.5 mt-0.5">
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

        <div className="pt-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'rgba(59,130,246,0.45)' }}>
            ИНСТРУМЕНТЫ
          </div>
          <div className="space-y-0.5 mt-0.5">
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

      {/* Footer */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(59,130,246,0.08)' }}>
        <div className="text-[10px] text-center" style={{ color: 'rgba(59,130,246,0.25)' }}>
          AI Academy · 2025
        </div>
      </div>
    </aside>
  );
}
