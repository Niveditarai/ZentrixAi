import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { playSound } from '../utils/audio';

export const LevelUpModal: React.FC = () => {
  const { pendingLevelUp, dismissLevelUp } = useGamification();

  useEffect(() => {
    if (pendingLevelUp) {
      playSound('success');
      // Multi-burst celebratory confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.6 },
        colors: ['#00f5ff', '#a855f7', '#fbbf24', '#10b981'],
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [pendingLevelUp]);

  if (!pendingLevelUp) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,245,255,0.25)] overflow-hidden"
      >
        {/* Glow ambient background circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center">
          {/* Trophy Badge */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-[0_0_30px_rgba(0,245,255,0.4)] flex items-center justify-center mb-5">
            <div className="w-full h-full bg-[#070b1e] rounded-[14px] flex items-center justify-center">
              <Award className="w-10 h-10 text-cyan-300 animate-bounce" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tier Elevation Achieved</span>
          </div>

          <h2 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Level {pendingLevelUp.newLevel} Unlocked!
          </h2>

          <p className="text-sm text-cyan-200/90 font-mono mt-1">
            Status: <span className="font-bold text-white">{pendingLevelUp.newTier}</span>
          </p>

          <p className="text-xs text-slate-300 mt-3 max-w-sm mx-auto leading-relaxed">
            Your algorithmic velocity and preparation consistency elevated your rank in the Silicon Valley global cohort.
          </p>

          {/* Unlocked Perks List */}
          <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-left space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Unlocked Milestone Privileges
            </span>
            {pendingLevelUp.unlockedPerks.map((perk, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                playSound('click');
                dismissLevelUp();
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,245,255,0.4)] transition-all cursor-pointer"
            >
              <span>Continue Dominating</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
