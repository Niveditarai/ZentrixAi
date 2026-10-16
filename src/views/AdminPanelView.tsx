import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Activity,
  Cpu,
  Users,
  Key,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database,
  CheckCircle2,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { playSound } from '../utils/audio';

export const AdminPanelView: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxTokensLimit, setMaxTokensLimit] = useState(4096);
  const [temperature, setTemperature] = useState(0.7);

  const usersList = [
    { id: 'usr-1', name: 'Alex Vance', role: 'Staff Candidate', tier: 'Pro Plan', tokensUsed: '142,800', status: 'Active' },
    { id: 'usr-2', name: 'Devon Thorne', role: 'Super Admin', tier: 'Enterprise', tokensUsed: '890,210', status: 'Active' },
    { id: 'usr-3', name: 'Jordan Lee', role: 'Student Intern', tier: 'Free Tier', tokensUsed: '34,120', status: 'Active' },
    { id: 'usr-4', name: 'Elena Rostova', role: 'Recruiter Partner', tier: 'Talent Suite', tokensUsed: '512,000', status: 'Active' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              ROOT SUPERADMINISTRATION
            </span>
            <span className="text-xs font-mono text-slate-400">Node Cluster & Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            System Administration & Model Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Monitor API token throughput, vector database health, active candidate accounts, and LangGraph agent execution parameters.
          </p>
        </div>

        {/* Global Maintenance Toggle */}
        <button
          onClick={() => {
            playSound('click');
            setMaintenanceMode(!maintenanceMode);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            maintenanceMode
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'glass-panel border-white/10 text-slate-300 hover:text-white'
          }`}
        >
          {maintenanceMode ? <ToggleRight className="w-5 h-5 text-rose-400" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
          <span>Maintenance Mode: {maintenanceMode ? 'ACTIVE' : 'OFF'}</span>
        </button>
      </div>

      {/* Cluster Vital Signs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">GEMINI API HEALTH</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mt-1">210 ms</div>
          <span className="text-[10px] font-mono text-emerald-400">p95 Inference Latency</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">PINECONE VECTOR DB</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">2.4M Vectors</div>
          <span className="text-[10px] font-mono text-cyan-400">Cosine Cosine Index Active</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">TOKEN CONSUMPTION</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-purple-300 mt-1">1.57M</div>
          <span className="text-[10px] font-mono text-slate-400">Past 24 Hours</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">CONTAINER MEMORY</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-300 mt-1">248 MB</div>
          <span className="text-[10px] font-mono text-slate-400">Of 1024 MB Allocated</span>
        </div>
      </div>

      {/* Model Governance Controls & Agent Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Hyperparameters */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Runtime Inference Tuning
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-mono">
                <span className="text-slate-300">Max Generation Tokens</span>
                <span className="text-cyan-300 font-bold">{maxTokensLimit}</span>
              </div>
              <input
                type="range"
                min={1024}
                max={8192}
                step={512}
                value={maxTokensLimit}
                onChange={(e) => setMaxTokensLimit(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 font-mono">
                <span className="text-slate-300">Agent Temperature</span>
                <span className="text-purple-300 font-bold">{temperature}</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
            <span className="text-[11px] font-mono uppercase text-slate-400 block font-bold">
              Default Inference Target
            </span>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-white/10 text-slate-200 font-mono text-[11px] flex items-center justify-between">
              <span>gemini-3.8-flash</span>
              <span className="text-emerald-400 font-bold">PRIMARY</span>
            </div>
          </div>
        </div>

        {/* User Account Registry Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Candidate & Recruiter User Registry
            </h3>
            <span className="text-xs font-mono text-slate-400">4 Active Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Subscription</th>
                  <th className="pb-2">Tokens</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map((u) => (
                  <tr key={u.id} className="text-slate-200">
                    <td className="py-2.5 font-semibold text-white">{u.name}</td>
                    <td className="py-2.5 text-slate-400">{u.role}</td>
                    <td className="py-2.5 text-purple-300 font-mono">{u.tier}</td>
                    <td className="py-2.5 font-mono text-cyan-300">{u.tokensUsed}</td>
                    <td className="py-2.5 text-right font-mono text-emerald-400">
                      ● {u.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
