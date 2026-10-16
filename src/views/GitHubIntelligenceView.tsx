import React, { useState } from 'react';
import {
  GitBranch,
  Star,
  GitFork,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
  Flame,
  Search,
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import { GitHubStats } from '../types';
import { playSound } from '../utils/audio';

interface GitHubIntelligenceViewProps {
  githubStats: GitHubStats;
  onUpdateStats: (stats: GitHubStats) => void;
}

export const GitHubIntelligenceView: React.FC<GitHubIntelligenceViewProps> = ({
  githubStats,
  onUpdateStats,
}) => {
  const [usernameInput, setUsernameInput] = useState(githubStats.username);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    playSound('agent');
    setIsAuditing(true);

    setTimeout(() => {
      const updated: GitHubStats = {
        ...githubStats,
        username: usernameInput,
        contributionsLastYear: Math.floor(Math.random() * 800) + 1100,
        readinessScore: Math.floor(Math.random() * 8) + 88,
        totalStars: Math.floor(Math.random() * 200) + 350,
      };
      onUpdateStats(updated);
      setIsAuditing(false);
      playSound('success');
    }, 800);
  };

  // Generate 52 weeks of contribution heatmap data
  const heatmapWeeks = Array.from({ length: 40 }, (_, wIdx) => {
    return Array.from({ length: 7 }, (_, dIdx) => {
      // higher intensity on weekdays
      const isWeekend = dIdx === 0 || dIdx === 6;
      const val = isWeekend ? Math.random() * 3 : Math.random() * 12;
      return Math.floor(val);
    });
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Search Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Code2 className="w-3 h-3 text-cyan-400" />
              GITHUB INTELLIGENCE ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">Open-Source Code Hygiene</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Repository Analysis & Engineering Readiness
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Audit commit hygiene, semantic release logs, automated testing coverage, and architectural quality across candidate repositories.
          </p>
        </div>

        {/* Username Lookup Bar */}
        <form onSubmit={handleAudit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <GitBranch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter GitHub username..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/15 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,255,0.25)] transition-all shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isAuditing ? 'Auditing...' : 'Analyze'}</span>
          </button>
        </form>
      </div>

      {/* GitHub Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">TOTAL COMMITS</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            {githubStats.contributionsLastYear}
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Past 12 Months Active</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">STARNED REPOSITORIES</span>
          <div className="text-2xl font-mono font-bold text-cyan-300 mt-1 flex items-center gap-1.5">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            {githubStats.totalStars}
          </div>
          <span className="text-[10px] font-mono text-slate-400">Verified Peer Recognition</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">PUBLIC REPOSITORIES</span>
          <div className="text-2xl font-mono font-bold text-purple-300 mt-1">
            {githubStats.totalRepos}
          </div>
          <span className="text-[10px] font-mono text-purple-300">{githubStats.totalForks} Forks Across Repos</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">CODE READINESS SCORE</span>
          <div className="text-2xl font-mono font-bold text-emerald-300 mt-1">
            {githubStats.readinessScore}%
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Grade: Tier-1 FAANG</span>
        </div>
      </div>

      {/* Contribution Heatmap Simulator */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Contribution Velocity & Streak Calendar
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Current Active Streak: <strong className="text-amber-400 font-bold">{githubStats.streakDays} Days</strong>
          </span>
        </div>

        {/* Grid of contribution boxes */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[700px]">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((val, dIdx) => {
                  let bgClass = 'bg-slate-800/60';
                  if (val > 8) bgClass = 'bg-cyan-400 shadow-[0_0_5px_#00f5ff]';
                  else if (val > 4) bgClass = 'bg-cyan-600';
                  else if (val > 1) bgClass = 'bg-cyan-900/80';

                  return (
                    <div
                      key={dIdx}
                      className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 ${bgClass}`}
                      title={`Activity: ${val} contributions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Less active</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-900/80" />
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-600" />
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
          </div>
          <span>High velocity</span>
        </div>
      </div>

      {/* Language Breakdown & Project Evaluations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Languages */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <h3 className="font-heading font-bold text-sm text-white mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Language Distribution
          </h3>

          <div className="space-y-3">
            {githubStats.topLanguages.map((lang, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                    {lang.name}
                  </span>
                  <span className="font-mono text-slate-400 font-bold">{lang.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluated Projects */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-white">
              Evaluated Showcase Repositories
            </h3>
            <span className="text-xs font-mono text-cyan-400">3 Top Ranked</span>
          </div>

          <div className="space-y-3">
            {githubStats.evaluatedProjects.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-500/30 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer flex items-center gap-1.5">
                      {proj.name}
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Grade: {proj.grade}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-1.5">
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400">
                    ★ {proj.stars} Stars
                  </span>
                </div>

                <div className="text-[11px] font-mono text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                  <strong className="text-purple-200">Zentrix Audit:</strong> {proj.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
