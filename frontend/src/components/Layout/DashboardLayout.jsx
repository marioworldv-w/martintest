import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isPrintPage = location.pathname === '/print-center';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex" data-testid="dashboard-layout">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block no-print">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden no-print"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 lg:hidden no-print transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-[#0F0F0F] sticky top-0 z-30 no-print">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            data-testid="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>
          <span className="font-heading text-sm font-semibold text-white">AI Academy</span>
        </div>

        {/* Page Content */}
        <main className={`flex-1 ${isPrintPage ? '' : 'p-4 lg:p-6'}`} data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
