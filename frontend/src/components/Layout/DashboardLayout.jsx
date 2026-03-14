import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import MatrixCanvas from '../MatrixCanvas';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen relative" style={{ background: '#050512' }} data-testid="dashboard-layout">

      {/* Matrix canvas background */}
      <MatrixCanvas />

      {/* Subtle grid overlay */}
      <div className="matrix-grid fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Ambient light orbs */}
      <div className="ambient-orb ambient-blue-1" style={{ zIndex: 1 }} />
      <div className="ambient-orb ambient-blue-2" style={{ zIndex: 1 }} />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full no-print" style={{ zIndex: 20 }}>
        <Sidebar />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden no-print"
          onClick={() => setSidebarOpen(false)} />
      )}
      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full z-40 lg:hidden no-print transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="lg:ml-64 min-h-screen flex flex-col relative" style={{ zIndex: 5 }}>
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 no-print sticky top-0 z-10"
          style={{ background: 'rgba(5,5,18,0.95)', borderBottom: '1px solid rgba(59,130,246,0.08)', backdropFilter: 'blur(20px)' }}>
          <button onClick={() => setSidebarOpen(true)} data-testid="mobile-menu-btn"
            className="p-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
            style={{ background: 'rgba(59,130,246,0.1)' }}>
            <Menu size={18} />
          </button>
          <span className="font-heading text-sm font-bold text-white">AI Academy</span>
        </div>

        <main className="flex-1 p-4 lg:p-6" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
