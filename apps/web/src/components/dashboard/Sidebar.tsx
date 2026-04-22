'use client';

import { useState } from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  alertCount?: number;
  messageCount?: number;
  patientCount?: number;
}

const NAV_ITEMS = [
  { id: 'patients', icon: '👥', label: 'My Patients' },
  { id: 'messages', icon: '💬', label: 'Messages' },
  { id: 'legal', icon: '⚖️', label: 'Legal' },
  { id: 'cybersecurity', icon: '🛡️', label: 'Cyber Security' },
  { id: 'help', icon: '❓', label: 'Help' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ activeSection, onSectionChange, alertCount = 3, messageCount = 2, patientCount = 4 }: SidebarProps) {
  const getBadge = (id: string) => {
    if (id === 'patients') return patientCount > 0 ? patientCount.toString() : undefined;
    if (id === 'messages') return messageCount > 0 ? messageCount.toString() : undefined;
    return undefined;
  };

  return (
    <aside className="w-[260px] min-w-[260px] bg-[#0a0f1e] text-[#8b95a8] flex flex-col border-r border-white/[0.06] select-none">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white text-base font-bold">S</span>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-white tracking-tight">StrokeSync</h1>
            <p className="text-[10px] text-[#505c70] font-medium tracking-wide uppercase">Neurologist Console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const badge = getBadge(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                isActive
                  ? 'bg-blue-500/[0.12] text-blue-400 font-semibold shadow-sm shadow-blue-500/5'
                  : 'hover:bg-white/[0.04] text-[#6b7790] hover:text-[#a0abb8]'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {badge && (
                <span className={`min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-white/[0.06] text-[#5a6578]'
                }`}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Alerts separator */}
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-semibold text-[#3a4358] uppercase tracking-wider">Notifications</p>
        </div>
        <button
          onClick={() => onSectionChange('alerts')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
            activeSection === 'alerts'
              ? 'bg-red-500/[0.12] text-red-400 font-semibold'
              : 'hover:bg-white/[0.04] text-[#6b7790] hover:text-[#a0abb8]'
          }`}
        >
          <span className="text-base w-5 text-center">🔔</span>
          <span className="flex-1 text-left">Alerts</span>
          {alertCount > 0 && (
            <span className="min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 animate-pulse">
              {alertCount}
            </span>
          )}
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/20 border border-blue-400/20 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-400">MC</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">Dr. Michael Chen</p>
            <p className="text-[11px] text-[#505c70]">Vascular Neurology</p>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/40" />
        </div>
      </div>
    </aside>
  );
}
