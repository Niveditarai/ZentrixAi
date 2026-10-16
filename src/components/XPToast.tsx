import React, { useEffect } from 'react';
import { Zap, X, Trophy, BookOpen, FileCheck, Mic } from 'lucide-react';
import { useGamification, XPNotice } from '../context/GamificationContext';

const ToastItem: React.FC<{ notice: XPNotice; onDismiss: (id: string) => void }> = ({
  notice,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notice.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notice.id, onDismiss]);

  const getIcon = () => {
    switch (notice.source) {
      case 'dsa':
        return <Trophy className="w-4 h-4 text-cyan-300" />;
      case 'study':
        return <BookOpen className="w-4 h-4 text-purple-300" />;
      case 'resume':
        return <FileCheck className="w-4 h-4 text-emerald-300" />;
      case 'interview':
        return <Mic className="w-4 h-4 text-pink-300" />;
      default:
        return <Zap className="w-4 h-4 text-amber-300" />;
    }
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl glass-panel border border-cyan-500/30 bg-[#070c1e]/95 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 max-w-sm pointer-events-auto"
    >
      <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-extrabold text-sm text-cyan-300 tabular-nums">
            +{notice.amount} XP
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            · {notice.source.toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-slate-200 truncate mt-0.5">{notice.description}</p>
      </div>
      <button
        onClick={() => onDismiss(notice.id)}
        className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const XPToastContainer: React.FC = () => {
  const { activeNotices, removeNotice } = useGamification();

  if (activeNotices.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 pointer-events-none">
      {activeNotices.map((notice) => (
        <ToastItem key={notice.id} notice={notice} onDismiss={removeNotice} />
      ))}
    </div>
  );
};
