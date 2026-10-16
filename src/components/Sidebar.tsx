import React from 'react';
import {
  LayoutDashboard,
  Bot,
  FileText,
  GitBranch,
  Cpu,
  Milestone,
  Calendar,
  Mic,
  Network,
  Database,
  Radio,
  Briefcase,
  BarChart3,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { playSound } from '../utils/audio';

export type NavTab = 
  | 'overview'
  | 'assistant'
  | 'resume'
  | 'github'
  | 'dsa'
  | 'roadmap'
  | 'study'
  | 'interview'
  | 'multi-agent'
  | 'rag'
  | 'voice'
  | 'placement'
  | 'analytics'
  | 'admin';

interface SidebarProps {
  currentTab?: NavTab;
  activeTab?: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole?: string;
  readinessScore?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  userRole = 'engineer',
  readinessScore = 88,
  isMobileOpen = false,
  onCloseMobile = () => {},
}) => {
  const selectedTab = activeTab || currentTab || 'overview';
  const navItems = [
    { id: 'overview' as NavTab, label: 'Mission Cockpit', icon: LayoutDashboard, badge: 'CORE' },
    { id: 'assistant' as NavTab, label: 'AI Career Assistant', icon: Bot, badge: 'GEMINI' },
    { id: 'resume' as NavTab, label: 'Resume Intelligence', icon: FileText, badge: 'ATS 89' },
    { id: 'github' as NavTab, label: 'GitHub Intelligence', icon: GitBranch, badge: '91%' },
    { id: 'dsa' as NavTab, label: 'DSA Analytics', icon: Cpu, badge: '462' },
    { id: 'roadmap' as NavTab, label: 'Roadmap Generator', icon: Milestone, badge: '10 WKS' },
    { id: 'study' as NavTab, label: 'Study & Pomodoro', icon: Calendar, badge: 'FOCUS' },
    { id: 'interview' as NavTab, label: 'Mock Interview Lab', icon: Mic, badge: 'VOICE' },
    { id: 'multi-agent' as NavTab, label: 'LangGraph Multi-Agent', icon: Network, badge: '7 NODES' },
    { id: 'rag' as NavTab, label: 'RAG Knowledge Core', icon: Database, badge: 'VECTORS' },
    { id: 'voice' as NavTab, label: 'Live Voice AI', icon: Radio, badge: 'LIVE' },
    { id: 'placement' as NavTab, label: 'Placement Pipeline', icon: Briefcase, badge: '4 ACTIVE' },
    { id: 'analytics' as NavTab, label: 'Intelligence Telemetry', icon: BarChart3, badge: 'ANALYTICS' },
    { id: 'admin' as NavTab, label: 'System Admin Panel', icon: ShieldAlert, badge: 'SUPER' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`glass-panel border-r border-white/10 flex flex-col justify-between transition-all duration-300 z-50 shrink-0 select-none ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-64 shadow-2xl block'
            : 'hidden lg:flex'
        } ${collapsed && !isMobileOpen ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Top Nav List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1.5 custom-scrollbar">
          {/* Toggle Collapse Bar */}
          <div className="flex items-center justify-between px-2 py-1 mb-2">
            {(!collapsed || isMobileOpen) && (
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">
                PLATFORM MODULES
              </span>
            )}
            <button
              onClick={() => {
                playSound('click');
                if (isMobileOpen) onCloseMobile();
                else onToggleCollapse();
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-colors ml-auto"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed && !isMobileOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation buttons */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                playSound('click');
                onSelectTab(item.id);
              }}
              className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/15 to-transparent text-cyan-200 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,245,255,0.15)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {/* Left active glowing indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r-full shadow-[0_0_8px_#00f5ff]" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                          : 'bg-white/5 text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Readiness Summary Card */}
      {!collapsed ? (
        <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-[#0c122e] to-[#140f32] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              Readiness Score
            </span>
            <span className="font-mono font-bold text-cyan-300">{readinessScore}%</span>
          </div>

          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
            <div
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,245,255,0.5)]"
              style={{ width: `${readinessScore}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              FAANG Ready
            </span>
            <span className="text-purple-300 flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-400" /> 24d
            </span>
          </div>
        </div>
      ) : (
        <div className="p-2 text-center text-[10px] font-mono text-cyan-400 font-bold border-t border-white/10">
          {readinessScore}%
        </div>
      )}
    </aside>
    </>
  );
};
