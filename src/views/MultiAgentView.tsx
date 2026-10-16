import React, { useState } from 'react';
import {
  Network,
  Share2,
  Cpu,
  Bot,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  Radio,
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';
import { AgentInfo } from '../types';
import { playSound } from '../utils/audio';

interface MultiAgentViewProps {
  agents: AgentInfo[];
  onSelectAgent: (agent: AgentInfo) => void;
}

export const MultiAgentView: React.FC<MultiAgentViewProps> = ({
  agents,
  onSelectAgent,
}) => {
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [logs, setLogs] = useState<Array<{ time: string; source: string; text: string; color: string }>>([
    { time: '10:04:12', source: 'Orchestrator', text: 'LangGraph state graph initialized with 7 worker pods.', color: 'text-cyan-400' },
    { time: '10:04:15', source: 'StateRouter', text: 'Telemetry channels streaming to client UI.', color: 'text-purple-400' },
  ]);

  const pipelineSteps = [
    { step: 0, agentId: 'agent-career', label: 'Candidate Profiling & Goal Alignment' },
    { step: 1, agentId: 'agent-resume', label: 'ATS Parsing & Metric Density Audit' },
    { step: 2, agentId: 'agent-github', label: 'Git Architecture & Codebase Hygiene' },
    { step: 3, agentId: 'agent-dsa', label: 'Algorithmic Pattern & Blindspot Triage' },
    { step: 4, agentId: 'agent-interview', label: 'System Design Mock Evaluation' },
    { step: 5, agentId: 'agent-jobs', label: 'FAANG Placement Match & Outreach Strategy' },
  ];

  const handleRunFullOrchestration = () => {
    if (isRunningPipeline) return;
    playSound('agent');
    setIsRunningPipeline(true);
    setActiveStep(0);

    const logMessages = [
      { agent: 'Career Agent', text: 'Ingested candidate target: Staff AI Systems Architect @ Tier-1 Labs.' },
      { agent: 'Resume Agent', text: 'Scanned 842 words. ATS score indexed at 89/100. XYZ quantification verified.' },
      { agent: 'GitHub Agent', text: 'Audited 3 repos. High-concurrency Go vector pipeline scored Grade A+.' },
      { agent: 'DSA Agent', text: 'Blindspot identified: Monotonic Stack. Recommending NeetCode #84.' },
      { agent: 'Interview Agent', text: 'Simulated Distributed Cache screen. Candidate clarity rubric at 91%.' },
      { agent: 'Job Agent', text: 'Dispatched placement profile to OpenAI, Anthropic, and Stripe recruiter pipelines.' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < pipelineSteps.length) {
        setActiveStep(current);
        const log = logMessages[current];
        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            source: log.agent,
            text: log.text,
            color: current % 2 === 0 ? 'text-cyan-300' : 'text-purple-300',
          },
        ]);
        playSound('click');
        current++;
      } else {
        clearInterval(interval);
        setIsRunningPipeline(false);
        setActiveStep(pipelineSteps.length);
        playSound('success');
        setLogs((prev) => [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            source: 'LangGraph Consensus',
            text: 'Pipeline execution finished successfully. Candidate readiness verified for FAANG screen.',
            color: 'text-emerald-400',
          },
        ]);
      }
    }, 900);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Network className="w-3 h-3 text-cyan-400" />
              LANGGRAPH NEURAL ARCHITECTURE
            </span>
            <span className="text-xs font-mono text-slate-400">Autonomous Multi-Agent Consensus</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Distributed Specialist Agent Graph
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Visualize autonomous agents exchanging state, routing candidate artifacts, and converging on optimal career positioning.
          </p>
        </div>

        <button
          onClick={handleRunFullOrchestration}
          disabled={isRunningPipeline}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all shrink-0 disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>{isRunningPipeline ? 'Executing Consensus Graph...' : 'Run Autonomous Multi-Agent Audit'}</span>
        </button>
      </div>

      {/* Graph Node Mesh Visualizer */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-purple-400" />
            Active Agent Topology & Routing Mesh
          </h3>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Mesh Status: Zero Latency
          </span>
        </div>

        {/* Dynamic Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((ag, idx) => {
            const isCurrentActive = activeStep === idx;
            const hasCompleted = activeStep > idx;

            return (
              <div
                key={ag.id}
                onClick={() => {
                  playSound('agent');
                  onSelectAgent(ag);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isCurrentActive
                    ? 'border-cyan-400 bg-cyan-500/15 shadow-[0_0_25px_rgba(0,245,255,0.3)] scale-[1.02]'
                    : hasCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'glass-panel border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${ag.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-cyan-300 font-bold">
                    {ag.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {ag.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{ag.role}</p>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">{ag.model}</span>
                  {isCurrentActive ? (
                    <span className="text-cyan-400 font-bold animate-pulse">PROCESSING</span>
                  ) : hasCompleted ? (
                    <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
                  ) : (
                    <span className="text-slate-400">STANDBY</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Agent Telemetry & Log Stream Terminal */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white">
              Real-time LangGraph State Logs & Consensus Stream
            </h3>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-[11px] font-mono text-slate-400 hover:text-white"
          >
            Clear Stream
          </button>
        </div>

        <div className="h-44 overflow-y-auto font-mono text-xs space-y-1.5 p-3 rounded-xl bg-black/70 border border-white/5 custom-scrollbar">
          {logs.map((lg, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-slate-500 shrink-0">[{lg.time}]</span>
              <span className={`font-bold shrink-0 ${lg.color}`}>[{lg.source}]</span>
              <span className="text-slate-300">{lg.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
