import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobApplication } from '../types';
import { INITIAL_APPLICATIONS } from '../data/mockData';
import { playSound } from '../utils/audio';

export const PlacementDashboardView: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const updateStatus = (id: string, newStatus: JobApplication['status']) => {
    playSound('click');
    const updated = applications.map((app) => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    });
    setApplications(updated);

    if (newStatus === 'Offer') {
      playSound('success');
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#00f5ff', '#8b5cf6', '#10b981'],
      });
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    const currentStatus = app.status || app.stage || '';
    return currentStatus.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-cyan-400" />
              TIER-1 PLACEMENT ACCELERATOR
            </span>
            <span className="text-xs font-mono text-slate-400">FAANG & Decacorn Pipelines</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Placement Pipeline & Opportunity Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Live telemetry on active hiring loops, algorithmic match coefficients, compensation benchmarks, and referral channels.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Stages ({applications.length})</option>
            <option value="Applied">Applied</option>
            <option value="OA">OA Round</option>
            <option value="Technical Round">Technical Round</option>
            <option value="Final Loop">Final Loop</option>
            <option value="Offer">Offer Extended</option>
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">ACTIVE PIPELINES</span>
          <div className="text-2xl font-mono font-bold text-white mt-1">
            {applications.length} Companies
          </div>
          <span className="text-[10px] font-mono text-cyan-400">100% Tier-1 AI & FinTech</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">AVERAGE MATCH SCORE</span>
          <div className="text-2xl font-mono font-bold text-emerald-300 mt-1">
            93.5%
          </div>
          <span className="text-[10px] font-mono text-emerald-400">High Recruiter Callback</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">COMPENSATION CEILING</span>
          <div className="text-2xl font-mono font-bold text-purple-300 mt-1">
            $360,000
          </div>
          <span className="text-[10px] font-mono text-slate-400">Base + Equity + Bonus</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs font-mono text-slate-400">INTERNAL REFERRALS</span>
          <div className="text-2xl font-mono font-bold text-amber-300 mt-1">
            4 Verified
          </div>
          <span className="text-[10px] font-mono text-amber-400">Staff Engineers Connected</span>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center font-bold text-white font-heading text-sm shadow-md">
                  {app.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {app.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium text-slate-300">{app.company}</span>
                    <span className="text-[10px] text-slate-500">• {app.location}</span>
                  </div>
                </div>
              </div>

              {/* Match Score Badge */}
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {app.matchScore}% Match
              </span>
            </div>

            {/* Compensation & Referral Info */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                <span>{app.salaryRange}</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-300 font-mono">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>Referral: {app.referralContact}</span>
              </div>
            </div>

            {/* Stage Selector Dropdown */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Current Status:</span>
              <select
                value={app.status}
                onChange={(e) => updateStatus(app.id, e.target.value as any)}
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                  app.status === 'Offer'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : app.status === 'Final Loop'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : app.status === 'Technical Round'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-800 text-slate-300 border-white/10'
                }`}
              >
                <option value="Applied">Applied</option>
                <option value="OA">OA Screen</option>
                <option value="Technical Round">Technical Round</option>
                <option value="Final Loop">Final Loop</option>
                <option value="Offer">🎉 Offer Extended</option>
                <option value="Rejected">Closed</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
