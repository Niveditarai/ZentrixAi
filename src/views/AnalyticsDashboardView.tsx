import React from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Award,
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { playSound } from '../utils/audio';

export const AnalyticsDashboardView: React.FC = () => {
  const handleExportReport = () => {
    playSound('click');
    const reportData = `ZENTRIX AI - EXECUTIVE CANDIDATE READINESS REPORT
Generated: ${new Date().toLocaleDateString()}
Candidate: Alex Vance (Senior AI Systems Engineer)
Placement Readiness Score: 88%
Contest Rating: 1985 (Knight Tier)
Resume ATS Score: 89/100
Time Spent This Month: 112.5 Hours
Core Competencies:
- DSA: 92% (Mastery)
- Distributed Systems: 86% (Strong)
- System Design: 90% (Proficient)
- Technical Communication: 84% (High)`;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zentrix-analytics-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <BarChart3 className="w-3 h-3 text-cyan-400" />
              COMPREHENSIVE TELEMETRY
            </span>
            <span className="text-xs font-mono text-slate-400">Longitudinal Growth Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Performance Analytics & Skill Growth
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Multi-dimensional tracking across coding velocity, algorithmic accuracy, interview simulation rubrics, and time allocation.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2.5 rounded-xl glass-panel hover:border-cyan-400 text-white font-bold text-xs flex items-center gap-2 border border-white/15 transition-all shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Executive Dossier</span>
        </button>
      </div>

      {/* Top Velocity Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">READINESS TRAJECTORY</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-mono font-bold text-white">88%</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +14% this month
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Projected 95% threshold reached in 12 days.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">SOLVE VELOCITY</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-mono font-bold text-cyan-300">18.4m</span>
            <span className="text-xs text-emerald-400 font-mono">avg per Medium</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Speed improved by 32% compared to baseline.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">TOTAL SPRINT HOURS</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-mono font-bold text-purple-300">112.5 hrs</span>
            <span className="text-xs text-purple-400 font-mono">30 days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Top 5% consistency across candidate cohort.
          </p>
        </div>
      </div>

      {/* Visual Charts: Time Allocation & Mock Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Allocation Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Focus Time Allocation
            </h3>
            <span className="text-xs font-mono text-slate-400">112.5 Hours Total</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Data Structures & Algorithms', percent: 38, hours: '42.8 hrs', color: 'from-cyan-500 to-blue-500' },
              { label: 'Distributed Systems & Architecture', percent: 28, hours: '31.5 hrs', color: 'from-purple-500 to-indigo-500' },
              { label: 'Mock Technical Interviews & Speech', percent: 20, hours: '22.5 hrs', color: 'from-pink-500 to-rose-500' },
              { label: 'Open-Source Projects & Git Hygiene', percent: 14, hours: '15.7 hrs', color: 'from-emerald-500 to-teal-500' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{cat.label}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{cat.percent}%</strong> ({cat.hours})
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-700`}
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Interview Historical Trend */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Mock Interview Score Progression
            </h3>
            <span className="text-xs font-mono text-emerald-400">Latest: 92/100</span>
          </div>

          {/* Simulated Historical Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { date: 'Session 1', score: 62 },
              { date: 'Session 2', score: 71 },
              { date: 'Session 3', score: 78 },
              { date: 'Session 4', score: 84 },
              { date: 'Session 5', score: 89 },
              { date: 'Session 6', score: 92 },
            ].map((bar, bIdx) => (
              <div key={bIdx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono font-bold text-cyan-300 group-hover:scale-110 transition-transform">
                  {bar.score}%
                </span>
                <div className="w-full bg-slate-800/80 rounded-t-lg h-32 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg transition-all duration-700 group-hover:brightness-125"
                    style={{ height: `${bar.score}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400 truncate max-w-full">
                  {bar.date}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5 text-center">
            Steady upward trajectory in technical trade-off evaluation & system capacity sizing.
          </p>
        </div>
      </div>
    </div>
  );
};
