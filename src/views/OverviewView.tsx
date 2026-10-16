import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Cpu,
  FileText,
  GitBranch,
  Target,
  Award,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Radio,
  Flame,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, DSAStats, ResumeAnalysisResult, GitHubStats, AgentInfo } from '../types';
import { NavTab } from '../components/Sidebar';
import { playSound } from '../utils/audio';
import { useGamification } from '../context/GamificationContext';
import { LeaderboardWidget } from '../components/LeaderboardWidget';

interface OverviewViewProps {
  user: UserProfile;
  dsaStats: DSAStats;
  resumeAnalysis: ResumeAnalysisResult;
  githubStats: GitHubStats;
  agents: AgentInfo[];
  onNavigate: (tab: NavTab) => void;
  onToggleDailyTarget: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  dsaStats,
  resumeAnalysis,
  githubStats,
  agents,
  onNavigate,
  onToggleDailyTarget,
}) => {
  const { totalXP, level, tier, progressPercent, awardXP } = useGamification();

  const triggerConfetti = () => {
    playSound('success');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f5ff', '#8b5cf6', '#10b981'],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Hero Welcome Banner with Aurora Glass Card */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
        {/* Neon decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/20 via-purple-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                SYSTEM ONLINE • GEMINI 3.8 FLASH CLUSTER
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30">
                FAANG CANDIDATE POOL
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-purple-300">{user.name}</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Your autonomous career intelligence engine is tracking <span className="text-white font-semibold">4 Tier-1 pipelines</span>. Placement readiness is currently indexed at <span className="text-cyan-300 font-mono font-bold">{user.readinessScore}%</span>.
            </p>
          </div>

          {/* Quick Launch Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                playSound('agent');
                onNavigate('assistant');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consult Career Agent</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                onNavigate('interview');
              }}
              className="px-4 py-2 rounded-xl glass-panel hover:border-purple-500/50 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition-all"
            >
              <Radio className="w-4 h-4 text-purple-400" />
              <span>Mock Interview</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Vital Statistics Cards including XP & Tier Progression */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Experience Points (XP) & Tier Level */}
        <motion.div
          whileHover={{ y: -3 }}
          className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-transparent transition-all relative overflow-hidden group shadow-[0_4px_20px_rgba(0,245,255,0.08)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">TOTAL EXPERIENCE</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white group-hover:text-cyan-300 transition-colors tabular-nums">
              {totalXP.toLocaleString()}
            </span>
            <span className="text-xs text-cyan-300 font-mono font-bold">
              LVL {level}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="text-white font-semibold truncate">{tier}</span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
        </motion.div>

        {/* Placement Readiness Score */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('placement')}
          className="glass-panel p-4 rounded-xl border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">PLACEMENT READINESS</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              {user.readinessScore}%
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: `${user.readinessScore}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Tier: FAANG Caliber</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.div>

        {/* DSA Solved */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('dsa')}
          className="glass-panel p-4 rounded-xl border border-white/10 hover:border-purple-500/40 cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">DSA PROBLEMS</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white group-hover:text-purple-300 transition-colors">
              {dsaStats.solvedTotal}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              / 600 target
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full" style={{ width: `${(dsaStats.solvedTotal / 600) * 100}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Rating: {dsaStats.contestRating}</span>
            <span className="text-amber-300 flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-amber-400" /> {dsaStats.streak}d
            </span>
          </div>
        </motion.div>

        {/* Resume ATS Score */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('resume')}
          className="glass-panel p-4 rounded-xl border border-white/10 hover:border-emerald-500/40 cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">RESUME ATS SCORE</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white group-hover:text-emerald-300 transition-colors">
              {resumeAnalysis.atsScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style={{ width: `${resumeAnalysis.atsScore}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Top 6% Candidate</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.div>

        {/* GitHub Intelligence */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigate('github')}
          className="glass-panel p-4 rounded-xl border border-white/10 hover:border-cyan-500/40 cursor-pointer transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">GITHUB ACTIVITY</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <GitBranch className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              {githubStats.contributionsLastYear}
            </span>
            <span className="text-xs text-slate-400 font-mono">commits / yr</span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full" style={{ width: '88%' }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>{githubStats.totalStars} Stars Earned</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Left Side (Daily Goals & Readiness Breakdown) + Right Side (Multi-Agent Status & Fast Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Daily Target Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Goals Panel */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="font-heading font-bold text-sm text-white">Daily Algorithmic & Prep Targets</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {dsaStats.dailyTargets.filter((t) => t.completed).length} of {dsaStats.dailyTargets.length} Completed
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {dsaStats.dailyTargets.map((target) => (
                <div
                  key={target.id}
                  onClick={() => {
                    onToggleDailyTarget(target.id);
                    if (!target.completed) {
                      awardXP(target.points || 100, 'dsa', `Completed: ${target.title}`);
                      triggerConfetti();
                    } else {
                      playSound('click');
                    }
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    target.completed
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-slate-200'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {target.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs font-semibold ${target.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {target.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-400">{target.category}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            target.difficulty === 'Easy'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : target.difficulty === 'Medium'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {target.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-cyan-400 shrink-0">
                    +{target.points} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Competency Matrix */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Engineering Competency Breakdown
              </h3>
              <span className="text-xs text-slate-400 font-mono">Weighted Algorithm</span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: 'Data Structures & Algorithms', score: 92, status: 'Mastery' },
                { label: 'Distributed Systems & Architecture', score: 86, status: 'Strong' },
                { label: 'Resume Impact & Quantifiable Metrics', score: 89, status: 'Optimized' },
                { label: 'Live Technical Communication', score: 84, status: 'Proficient' },
                { label: 'Open-Source Production Hygiene', score: 91, status: 'Top Tier' },
              ].map((comp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{comp.label}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400 text-[11px]">{comp.status}</span>
                      <span className="text-cyan-300 font-bold">{comp.score}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Agent Cluster & Live Actions */}
        <div className="space-y-6">
          {/* Active LangGraph Agents Card */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-heading font-bold text-sm text-white">LangGraph Agent Fleet</h3>
                <p className="text-[11px] text-slate-400 font-mono">Autonomous Specialist Pods</p>
              </div>
              <button
                onClick={() => onNavigate('multi-agent')}
                className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center"
              >
                Graph <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {agents.slice(0, 5).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => {
                    playSound('agent');
                    onNavigate('assistant');
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${ag.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                      {ag.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white leading-tight">{ag.name}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{ag.role}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {ag.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launchpad to Top Tools */}
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
            <h3 className="font-heading font-bold text-sm text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Direct Tool Launchpad
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  onNavigate('study');
                }}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-cyan-400/40 text-left transition-all group"
              >
                <div className="text-cyan-400 text-xs font-bold mb-0.5 group-hover:translate-x-0.5 transition-transform flex items-center justify-between">
                  <span>Pomodoro Sprint</span>
                  <Play className="w-3 h-3 fill-cyan-400" />
                </div>
                <p className="text-[10px] text-slate-400">25m focus + audio waves</p>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  onNavigate('roadmap');
                }}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-purple-400/40 text-left transition-all group"
              >
                <div className="text-purple-400 text-xs font-bold mb-0.5 group-hover:translate-x-0.5 transition-transform flex items-center justify-between">
                  <span>AI Roadmap</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
                <p className="text-[10px] text-slate-400">Week 6 of 10 in progress</p>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  onNavigate('rag');
                }}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-emerald-400/40 text-left transition-all group"
              >
                <div className="text-emerald-400 text-xs font-bold mb-0.5 group-hover:translate-x-0.5 transition-transform flex items-center justify-between">
                  <span>Vector Search</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
                <p className="text-[10px] text-slate-400">FAANG cheat sheets & notes</p>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  onNavigate('voice');
                }}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-pink-400/40 text-left transition-all group"
              >
                <div className="text-pink-400 text-xs font-bold mb-0.5 group-hover:translate-x-0.5 transition-transform flex items-center justify-between">
                  <span>Voice AI Lab</span>
                  <Radio className="w-3 h-3" />
                </div>
                <p className="text-[10px] text-slate-400">Live speech synthesis</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Cohort Leaderboard Widget */}
      <LeaderboardWidget />
    </div>
  );
};

