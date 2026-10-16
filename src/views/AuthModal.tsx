import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, KeyRound, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { playSound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  currentUser: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack AI Systems Engineer');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('success');

    const updatedUser: UserProfile = {
      ...currentUser,
      name: name || (mode === 'login' ? (email.split('@')[0] || 'Alex Vance') : 'Engineer Candidate'),
      email: email || 'candidate@zentrix.ai',
      targetRole: targetRole || currentUser.targetRole,
    };

    setFeedback('Authentication validated. Encrypted session token issued.');
    setTimeout(() => {
      onLoginSuccess(updatedUser);
      onClose();
      setFeedback(null);
    }, 600);
  };

  const handleQuickDemo = (role: 'engineer' | 'student' | 'admin') => {
    playSound('agent');
    const demoProfiles: Record<string, UserProfile> = {
      engineer: {
        id: 'usr_eng_101',
        name: 'Alex Vance',
        email: 'alex.vance@zentrix.ai',
        role: 'engineer',
        targetRole: 'Staff AI Systems Architect',
        targetCompanyTier: 'Tier-1 & Decacorn AI Labs',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'August 2026',
        readinessScore: 92,
        streakDays: 28,
      },
      student: {
        id: 'usr_stu_202',
        name: 'Jordan Lee',
        email: 'jordan.lee@stanford.edu',
        role: 'student',
        targetRole: 'Junior Full Stack Developer',
        targetCompanyTier: 'FAANG New Grad 2027',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'September 2026',
        readinessScore: 74,
        streakDays: 12,
      },
      admin: {
        id: 'usr_adm_999',
        name: 'Devon Thorne',
        email: 'admin@zentrix.ai',
        role: 'admin',
        targetRole: 'Platform Super Administrator',
        targetCompanyTier: 'Zentrix Core Team',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'January 2026',
        readinessScore: 99,
        streakDays: 140,
      },
    };

    onLoginSuccess(demoProfiles[role]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md glass-panel border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,245,255,0.15)] relative overflow-hidden"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />

        {/* Close Button */}
        <button
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-white">
              {mode === 'login' && 'Sign in to Zentrix AI'}
              {mode === 'register' && 'Create Candidate Account'}
              {mode === 'forgot' && 'Account Recovery'}
            </h3>
            <p className="text-xs text-slate-400">
              {mode === 'login' && 'Access your AI career models and placement pipeline'}
              {mode === 'register' && 'Deploy personalized career agents for your profile'}
              {mode === 'forgot' && 'Reset secure JWT key credentials'}
            </p>
          </div>
        </div>

        {/* 1-Click Fast Demo Login Pill Selection */}
        <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
              ⚡ 1-Click Instant Demo Credentials
            </span>
            <span className="text-[9px] text-slate-400">No password needed</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('engineer')}
              className="px-2 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold text-center transition-all"
            >
              Engineer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-2 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold text-center transition-all"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center transition-all"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Feedback message if any */}
        {feedback && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center gap-2 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-300 mb-1">Work or Personal Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.vance@zentrix.ai"
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Forgot key?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">Target Engineering Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack AI Engineer"
                className="w-full px-3 py-2 bg-slate-900/80 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.3)] transition-all"
          >
            <span>
              {mode === 'login' && 'Authorize Session'}
              {mode === 'register' && 'Initialize Profile'}
              {mode === 'forgot' && 'Send Key Reset Link'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-slate-400">
          {mode === 'login' && (
            <p>
              New candidate?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-cyan-300 font-semibold hover:underline"
              >
                Register account
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-cyan-300 font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              Remember your credentials?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-cyan-300 font-semibold hover:underline"
              >
                Back to Sign in
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
