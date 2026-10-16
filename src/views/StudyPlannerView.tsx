import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Volume2,
  Sparkles,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudySlot } from '../types';
import { playSound } from '../utils/audio';
import { useGamification } from '../context/GamificationContext';

interface StudyPlannerViewProps {
  studySlots: StudySlot[];
  onToggleSlot: (id: string) => void;
  onAddSlot: (slot: StudySlot) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  studySlots,
  onToggleSlot,
  onAddSlot,
}) => {
  const { awardXP } = useGamification();

  // Pomodoro Timer State (default: 25 mins = 1500 sec)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [focusMode, setFocusMode] = useState<'work' | 'break'>('work');


  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound('timer');
      confetti({ particleCount: 50, spread: 60 });
      setIsRunning(false);
      if (focusMode === 'work') {
        awardXP(75, 'study', 'Completed 25m High-Intensity Focus Sprint');
        setFocusMode('break');
        setTimeLeft(5 * 60);
      } else {
        setFocusMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, focusMode]);

  const toggleTimer = () => {
    playSound('click');
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playSound('click');
    setIsRunning(false);
    setTimeLeft(focusMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-400" />
              SMART STUDY PLANNER
            </span>
            <span className="text-xs font-mono text-slate-400">Spaced Repetition Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            AI Timetable & Deep Work Sprint Lab
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Adaptive study timetables optimized for cognitive retention, spaced repetition, and high-intensity coding intervals.
          </p>
        </div>

        {/* Quick Streak KPI */}
        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-3">
          <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Productivity Score</span>
            <span className="text-lg font-mono font-bold text-white">4.8 hrs / day</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Pomodoro Timer Card + Timetable Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Futuristic Pomodoro HUD */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(0,245,255,0.1)] flex flex-col items-center justify-between text-center relative overflow-hidden">
          {/* Subtle Glow behind timer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-white/10">
            <span>POMODORO SPRINT</span>
            <span className={`font-bold ${focusMode === 'work' ? 'text-cyan-400' : 'text-emerald-400'}`}>
              {focusMode === 'work' ? 'DEEP WORK CYCLE' : 'REST & RECHARGE'}
            </span>
          </div>

          {/* Huge Futuristic Clock */}
          <div className="my-8 relative">
            <div className="w-48 h-48 rounded-full border-2 border-cyan-500/20 flex flex-col items-center justify-center relative">
              <span className="text-5xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 tracking-wider">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                {isRunning ? 'Synthesizer Active' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="w-full flex items-center justify-center gap-3">
            <button
              onClick={toggleTimer}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isRunning ? 'Pause Sprint' : 'Start Focus Session'}</span>
            </button>

            <button
              onClick={resetTimer}
              className="p-3 rounded-xl glass-panel hover:border-white/30 text-slate-300 hover:text-white transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Adaptive Timetable Slots */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Weekly Spaced Repetition Schedule
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {studySlots.filter((s) => s.completed).length} of {studySlots.length} Sessions Done
            </span>
          </div>

          <div className="space-y-2.5">
            {studySlots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => {
                  onToggleSlot(slot.id);
                  if (!slot.completed) {
                    awardXP(50, 'study', `Completed ${slot.type}: ${slot.subject}`);
                    playSound('success');
                    confetti({ particleCount: 40, spread: 60 });
                  } else {
                    playSound('click');
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  slot.completed
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-slate-300'
                    : 'bg-slate-900/80 border-white/5 hover:border-white/20 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {slot.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{slot.subject}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                        {slot.day} • {slot.time}
                      </span>
                    </div>
                    <p className={`text-xs text-slate-400 mt-0.5 ${slot.completed ? 'line-through' : ''}`}>
                      {slot.focusArea}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                    slot.type === 'deep-work'
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                      : slot.type === 'dsa-sprint'
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {slot.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
