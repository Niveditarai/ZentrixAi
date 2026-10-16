import React, { useState } from 'react';
import {
  Milestone,
  CheckCircle2,
  Circle,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Download,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RoadmapData } from '../types';
import { playSound } from '../utils/audio';

interface RoadmapGeneratorViewProps {
  roadmap: RoadmapData;
  onUpdateRoadmap: (data: RoadmapData) => void;
}

export const RoadmapGeneratorView: React.FC<RoadmapGeneratorViewProps> = ({
  roadmap,
  onUpdateRoadmap,
}) => {
  const [targetRole, setTargetRole] = useState(roadmap.role);
  const [level, setLevel] = useState('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRoadmap = async (roleOverride?: string) => {
    playSound('agent');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/roadmap-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: roleOverride || targetRole,
          currentLevel: level,
          timeCommitmentHours: 15,
        }),
      });

      const data = await res.json();
      const updated: RoadmapData = {
        id: `rd-${Date.now()}`,
        role: data.role || targetRole,
        level: data.level || level,
        estimatedWeeks: data.estimatedWeeks || 10,
        progressPercent: 25,
        phases: data.phases || roadmap.phases,
      };

      onUpdateRoadmap(updated);
      playSound('success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00f5ff', '#8b5cf6'],
      });
    } catch (e) {
      console.error('Error generating roadmap:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePhase = (phaseNumber: number) => {
    playSound('click');
    const updatedPhases = roadmap.phases.map((p) => {
      if (p.phaseNumber === phaseNumber) {
        return { ...p, completed: !p.completed };
      }
      return p;
    });

    const completedCount = updatedPhases.filter((p) => p.completed).length;
    const progressPercent = Math.round((completedCount / updatedPhases.length) * 100);

    onUpdateRoadmap({
      ...roadmap,
      phases: updatedPhases,
      progressPercent,
    });

    if (progressPercent === 100) {
      playSound('success');
      confetti({ particleCount: 100, spread: 90 });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Milestone className="w-3 h-3 text-amber-400" />
              DYNAMIC CURRICULUM ARCHITECT
            </span>
            <span className="text-xs font-mono text-slate-400">Week-by-Week Action Plan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            AI Engineering Career Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Custom curriculum generated with topological prerequisite graphs, real-world portfolio artifacts, and weekly milestones.
          </p>
        </div>

        {/* Generator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target Career Track..."
            className="text-xs bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-52 sm:w-64"
          />

          <button
            onClick={() => handleGenerateRoadmap()}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Synthesizing...' : 'Regenerate Path'}</span>
          </button>
        </div>
      </div>

      {/* Preset Fast Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-mono text-[11px] shrink-0">Preset Tracks:</span>
        {[
          'Staff AI Systems Engineer',
          'Distributed Systems Architect',
          'Quant Core Developer',
          'Autonomous Agent Platform Lead',
        ].map((track, idx) => (
          <button
            key={idx}
            onClick={() => {
              setTargetRole(track);
              handleGenerateRoadmap(track);
            }}
            className="px-3 py-1.5 rounded-lg glass-panel hover:border-cyan-400/40 text-slate-300 hover:text-white shrink-0 text-xs font-medium transition-all"
          >
            {track}
          </button>
        ))}
      </div>

      {/* Roadmap Progress Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-400">ACTIVE TRACK</span>
          <h3 className="text-base font-heading font-bold text-white mt-0.5">{roadmap.role}</h3>
          <span className="text-[11px] font-mono text-cyan-400">
            {roadmap.estimatedWeeks} Weeks Projected • {roadmap.level}
          </span>
        </div>

        <div className="w-full sm:w-72 space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-slate-300">Curriculum Progress</span>
            <span className="text-cyan-300">{roadmap.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_10px_#00f5ff]"
              style={{ width: `${roadmap.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Phases */}
      <div className="space-y-4">
        {roadmap.phases.map((phase, pIdx) => {
          const isDone = phase.completed;

          return (
            <div
              key={pIdx}
              className={`glass-panel p-6 rounded-2xl border transition-all duration-300 ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-white/10 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTogglePhase(phase.phaseNumber)}
                    className="shrink-0 transition-transform active:scale-95"
                    title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 hover:text-cyan-400" />
                    )}
                  </button>
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-purple-300 uppercase">
                      PHASE {phase.phaseNumber} • {phase.duration}
                    </span>
                    <h4 className={`text-base font-heading font-bold mt-1 ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {phase.title}
                    </h4>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded-full font-bold uppercase self-start sm:self-auto ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  }`}
                >
                  {isDone ? 'Completed' : 'Sprint Target'}
                </span>
              </div>

              {/* Topics & Project Artifacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Topics */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                    Key Topics & Conceptual Deep-Dives
                  </span>
                  <div className="space-y-1.5">
                    {phase.topics.map((top, tIdx) => (
                      <div key={tIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">•</span>
                        <span>{top}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestone Artifact */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    ★ Verifiable Showcase Artifact
                  </span>
                  {phase.projects.map((proj, prIdx) => (
                    <p key={prIdx} className="text-xs font-medium text-white leading-relaxed">
                      {proj}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
