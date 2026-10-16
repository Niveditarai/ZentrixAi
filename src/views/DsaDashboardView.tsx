import React from 'react';
import {
  Cpu,
  Flame,
  Award,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Zap,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DSAStats } from '../types';
import { playSound } from '../utils/audio';
import { useGamification } from '../context/GamificationContext';

interface DsaDashboardViewProps {
  dsaStats: DSAStats;
  onToggleDailyTarget: (id: string) => void;
}

export const DsaDashboardView: React.FC<DsaDashboardViewProps> = ({
  dsaStats,
  onToggleDailyTarget,
}) => {
  const { awardXP } = useGamification();

  const triggerConfetti = () => {
    playSound('success');

    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#00f5ff', '#8b5cf6', '#10b981'],
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-400" />
              ALGORITHMIC ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">FAANG LeetCode Master</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            DSA Analytics & Competitive Programming
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Track pattern recognition, solve velocity, weak topic identification, and daily contest performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Contest Rating</span>
            <span className="text-xl font-mono font-bold text-amber-300 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" />
              {dsaStats.contestRating}
            </span>
            <span className="text-[9px] font-mono text-emerald-400">Knight Tier • Top 4%</span>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">TOTAL SOLVED</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
            {dsaStats.solvedTotal}
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Target: 600 questions</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
          <span className="text-xs font-mono text-emerald-300">EASY PROBLEMS</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-1">
            {dsaStats.easyCount}
          </div>
          <span className="text-[11px] font-mono text-slate-400">100% Core Patterns</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-amber-500/20 bg-amber-950/10">
          <span className="text-xs font-mono text-amber-300">MEDIUM PROBLEMS</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 mt-1">
            {dsaStats.mediumCount}
          </div>
          <span className="text-[11px] font-mono text-slate-400">FAANG Screen Core</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <span className="text-xs font-mono text-rose-300">HARD PROBLEMS</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-rose-400 mt-1">
            {dsaStats.hardCount}
          </div>
          <span className="text-[11px] font-mono text-slate-400">L5/L6 Differentiators</span>
        </div>
      </div>

      {/* Topic-Wise Progress & Weak Topic Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Mastery List */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-white">
              Data Structure & Pattern Mastery
            </h3>
            <span className="text-xs font-mono text-slate-400">NeetCode 150 + Blind 75</span>
          </div>

          <div className="space-y-3.5">
            {dsaStats.topics.map((topic, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{topic.name}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        topic.status === 'Mastered'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : topic.status === 'In Progress'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-rose-500/10 text-rose-300'
                      }`}
                    >
                      {topic.status}
                    </span>
                    <span className="text-slate-400">
                      {topic.solved} / {topic.total}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(topic.solved / topic.total) * 100}%`,
                      backgroundColor: topic.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Weak Topic Detector & Algorithmic Coach Advice */}
        <div className="space-y-6">
          {/* Weak Topic Alert */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-950/10 shadow-lg">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase font-mono mb-2">
              <AlertCircle className="w-4 h-4" />
              Detected Algorithmic Blindspot
            </div>
            <h4 className="text-sm font-bold text-white">Monotonic Stack & Queue (68% Mastery)</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Frequently tested in Tier-1 screens for finding the Next Greater Element, Stock Span, and Histogram Area in O(N).
            </p>
            <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-cyan-300 font-mono">
              💡 Recommended Next: <em>Largest Rectangle in Histogram</em> & <em>Daily Temperatures</em>
            </div>
          </div>

          {/* Daily Problem Sprint Check-off */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                Active Streak: {dsaStats.streak} Days
              </h3>
            </div>

            <div className="space-y-2">
              {dsaStats.dailyTargets.map((target) => (
                <div
                  key={target.id}
                  onClick={() => {
                    onToggleDailyTarget(target.id);
                    if (!target.completed) {
                      awardXP(target.points || 100, 'dsa', `Solved: ${target.title}`);
                      triggerConfetti();
                    } else {
                      playSound('click');
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    target.completed
                      ? 'bg-cyan-500/10 border-cyan-500/30 text-slate-300'
                      : 'bg-slate-900/80 border-white/5 hover:border-white/20 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {target.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className={`text-xs ${target.completed ? 'line-through text-slate-400' : 'font-medium'}`}>
                      {target.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0 ml-2">
                    +{target.points} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
