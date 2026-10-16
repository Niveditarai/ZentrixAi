import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Zap, Mic, X } from 'lucide-react';
import { playSound } from '../utils/audio';

interface FloatingAiOrbProps {
  onOpenChat: () => void;
  onOpenVoice: () => void;
  activeAgentName: string;
}

export const FloatingAiOrb: React.FC<FloatingAiOrbProps> = ({
  onOpenChat,
  onOpenVoice,
  activeAgentName,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            className="mb-3 w-64 glass-panel-purple border border-purple-400/30 rounded-2xl p-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wide">ZENTRIX ORB</span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 mt-2 mb-3">
              Direct access to <span className="text-cyan-300 font-semibold">{activeAgentName}</span>. How would you like to interact?
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  playSound('agent');
                  setExpanded(false);
                  onOpenChat();
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 transition-all group"
              >
                <MessageSquare className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform text-cyan-300" />
                <span className="text-[11px] font-semibold">AI Assistant</span>
              </button>

              <button
                onClick={() => {
                  playSound('success');
                  setExpanded(false);
                  onOpenVoice();
                }}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 transition-all group"
              >
                <Mic className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform text-purple-300" />
                <span className="text-[11px] font-semibold">Voice Mode</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Orb Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          playSound(expanded ? 'click' : 'agent');
          setExpanded(!expanded);
        }}
        className="relative group w-14 h-14 rounded-full flex items-center justify-center focus:outline-none"
        title="Open Zentrix Holographic AI"
      >
        {/* Pulsing multi-layer halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all animate-pulse-slow" />
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 opacity-40 blur-xl animate-aurora" />

        {/* Inner Glass Sphere */}
        <div className="relative w-full h-full rounded-full bg-[#070b1e]/90 border border-cyan-400/50 shadow-inner flex items-center justify-center overflow-hidden">
          {/* Animated concentric rings */}
          <div className="absolute inset-1 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-2.5 rounded-full border border-purple-400/30 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />

          <Sparkles className="w-6 h-6 text-cyan-300 group-hover:text-white transition-colors animate-orb" />

          <div className="absolute bottom-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#070b1e]" />
        </div>
      </motion.button>
    </div>
  );
};
