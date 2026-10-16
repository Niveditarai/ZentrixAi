import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bell, 
  ShieldCheck, 
  Cpu, 
  User, 
  ChevronDown, 
  LogOut, 
  Check, 
  Zap,
  Bot,
  Menu
} from 'lucide-react';
import { AgentInfo, UserProfile } from '../types';
import { playSound, toggleSound } from '../utils/audio';
import { useGamification } from '../context/GamificationContext';

interface HeaderProps {
  user: UserProfile;
  activeAgent: AgentInfo;
  agents: AgentInfo[];
  soundActive?: boolean;
  onSoundToggle?: () => void;
  onSelectAgent: (agent: AgentInfo) => void;
  onOpenAuth: () => void;
  onOpenMobileMenu?: () => void;
  onUserRoleChange?: (role: 'engineer' | 'student' | 'admin') => void;
  onNavigateToVoice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeAgent,
  agents,
  soundActive = true,
  onSoundToggle = () => toggleSound(),
  onSelectAgent,
  onOpenAuth,
  onOpenMobileMenu,
  onUserRoleChange = () => {},
  onNavigateToVoice = () => {},
}) => {
  const { totalXP, level } = useGamification();
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);


  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl glass-panel border border-white/10 text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="relative group flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(0,245,255,0.35)]">
            <div className="w-full h-full bg-[#070b1e] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300 pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-400">
                ZENTRIX
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md">
                AI 3.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Silicon Valley Career Engine • Server-Side Gemini
            </p>
          </div>
        </div>

        {/* Center: Active Agent Switcher Pill */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              playSound('click');
              setShowAgentMenu(!showAgentMenu);
            }}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 hover:border-cyan-500/40 transition-all text-xs text-slate-200"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-mono text-[11px]">ACTIVE AGENT:</span>
            <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              {activeAgent.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showAgentMenu && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 glass-panel border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                LangGraph Multi-Agent Cluster
              </div>
              <div className="space-y-1 mt-1">
                {agents.map((ag) => (
                  <button
                    key={ag.id}
                    onClick={() => {
                      playSound('agent');
                      onSelectAgent(ag);
                      setShowAgentMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      activeAgent.id === ag.id
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        {ag.name}
                        {activeAgent.id === ag.id && (
                          <Check className="w-3 h-3 text-cyan-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{ag.role}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-purple-300">
                      {ag.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live XP & Tier Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-xs">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
            <span className="font-mono font-bold text-white tabular-nums">
              {totalXP.toLocaleString()} <span className="text-cyan-300">XP</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
              LVL {level}
            </span>
          </div>

          {/* Quick Voice Room Launch */}
          <button
            onClick={() => {
              playSound('click');
              onNavigateToVoice();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/30 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
            title="Launch Voice AI Career Session"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Voice AI</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const newState = toggleSound();
              onSoundToggle();
              playSound(newState ? 'success' : 'click');
            }}
            className={`p-2 rounded-lg border transition-all ${
              soundActive
                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                : 'border-white/10 bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
            title={soundActive ? 'Audio FX Enabled' : 'Audio FX Muted'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                playSound('click');
                setShowNotifs(!showNotifs);
              }}
              className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#050816]" />
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 glass-panel border border-white/15 rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-heading font-semibold text-xs text-white">System Feed</span>
                  <span className="text-[10px] font-mono text-cyan-400">3 Unread</span>
                </div>
                <div className="space-y-2 mt-2">
                  <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-xs">
                    <p className="font-semibold text-cyan-200">ATS Score Recalculated: 89/100</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Your updated resume added 3 high-impact FAANG keywords.</p>
                  </div>
                  <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20 text-xs">
                    <p className="font-semibold text-purple-200">New Technical Round at Anthropic</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Scheduled for next week. Zentrix prepared a customized prep docket.</p>
                  </div>
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <p className="font-semibold text-emerald-200">Daily DSA Goal: 2 of 4 Solved</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Solve 'Trapping Rain Water' to maintain your 24-day streak.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                playSound('click');
                setShowUserMenu(!showUserMenu);
              }}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/5 transition-all text-left"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-400/50"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                  {user.name}
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-[10px] font-mono text-purple-300 uppercase">{user.role}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 glass-panel border border-white/15 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] font-mono text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold uppercase">
                      Score: {user.readinessScore}%
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                      🔥 {user.streakDays}d Streak
                    </span>
                  </div>
                </div>

                {/* Role Switcher for testing all modules & views */}
                <div className="p-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Demo Role Persona
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['engineer', 'student', 'admin'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          playSound('click');
                          onUserRoleChange(r);
                          setShowUserMenu(false);
                        }}
                        className={`py-1 text-[11px] font-medium rounded capitalize transition-all ${
                          user.role === r
                            ? 'bg-cyan-500 text-[#050816] font-bold'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      playSound('click');
                      onOpenAuth();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch Account / Sign In</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
