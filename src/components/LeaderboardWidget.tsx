import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Flame,
  Search,
  ChevronRight,
  TrendingUp,
  Cpu,
  User,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  Target
} from 'lucide-react';
import { PeerCandidate } from '../types';
import { useGamification } from '../context/GamificationContext';
import { playSound } from '../utils/audio';

export const LeaderboardWidget: React.FC = () => {
  const {
    leaderboard,
    userRank,
    totalPeers,
    percentile,
    totalXP,
    awardXP,
    level,
    tier,
  } = useGamification();

  const [activeFilter, setActiveFilter] = useState<'all' | 'top5' | 'division'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<PeerCandidate | null>(null);
  const [hasClaimedStreakBonus, setHasClaimedStreakBonus] = useState(false);

  // Find user's candidate object and peer directly ahead
  const currentUserIndex = leaderboard.findIndex((c) => c.isCurrentUser);
  const peerAhead = currentUserIndex > 0 ? leaderboard[currentUserIndex - 1] : null;
  const xpToNextRank = peerAhead ? Math.max(0, peerAhead.xp - totalXP) : 0;

  // Filter candidates
  const filteredCandidates = leaderboard.filter((candidate) => {
    // Search query matching
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.cohort.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'top5') {
      const idx = leaderboard.findIndex((c) => c.id === candidate.id);
      return idx < 5 || candidate.isCurrentUser;
    }

    if (activeFilter === 'division') {
      const currentUserDivision = leaderboard[currentUserIndex]?.division || 'Diamond';
      return candidate.division === currentUserDivision;
    }

    return true;
  });

  const top3 = leaderboard.slice(0, 3);

  const handleClaimDailyBonus = () => {
    if (hasClaimedStreakBonus) return;
    playSound('success');
    awardXP(50, 'streak', 'Claimed Daily 24-day Streak Momentum Bonus');
    setHasClaimedStreakBonus(true);
  };

  const getPodiumBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-amber-300 border-amber-400/40 bg-amber-400/10';
      case 2:
        return 'text-slate-200 border-slate-300/40 bg-slate-300/10';
      case 3:
        return 'text-amber-600 border-amber-600/40 bg-amber-600/10';
      default:
        return 'text-slate-400 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 flex items-center justify-center text-slate-950 font-bold">
              <Trophy className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                Global Cohort Leaderboard
                <span className="text-xs font-mono font-normal text-cyan-300">
                  · Season 2026.1
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Live rankings across top university engineering candidates & unicorn applicants
              </p>
            </div>
          </div>
        </div>

        {/* User live standing snippet & Streak Bonus */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Your Rank
              </span>
              <span className="font-mono font-extrabold text-sm text-cyan-300 tabular-nums">
                #{userRank} <span className="text-xs font-normal text-slate-400">/ {totalPeers}</span>
              </span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Percentile
              </span>
              <span className="font-mono font-extrabold text-sm text-emerald-400 tabular-nums">
                Top {100 - percentile + 5}%
              </span>
            </div>
          </div>

          <button
            onClick={handleClaimDailyBonus}
            disabled={hasClaimedStreakBonus}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              hasClaimedStreakBonus
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer'
            }`}
          >
            {hasClaimedStreakBonus ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Streak Bonus Claimed (+50 XP)</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Claim Streak Bonus (+50 XP)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Podium Spotlight: Top 3 Candidates */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 my-4">
        {top3.map((peer, idx) => {
          const rank = idx + 1;
          const isGold = rank === 1;
          const isSilver = rank === 2;
          const isBronze = rank === 3;

          return (
            <div
              key={peer.id}
              onClick={() => setSelectedCandidate(peer)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                peer.isCurrentUser
                  ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,245,255,0.15)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {/* Podium medal watermark */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-lg font-mono font-extrabold text-xs flex items-center justify-center border ${getPodiumBadgeColor(
                      rank
                    )}`}
                  >
                    #{rank}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {isGold ? '🏆 Grandmaster' : isSilver ? '🥈 Master' : '🥉 Specialist'}
                  </span>
                </div>
                <span className="font-mono font-bold text-xs text-amber-300 tabular-nums">
                  {peer.xp.toLocaleString()} XP
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="relative">
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                  {peer.isCurrentUser && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#050816]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                    {peer.name}
                    {peer.isCurrentUser && (
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">(You)</span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{peer.cohort}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>{peer.solvedDSA} solved</span>
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3 h-3" />
                  <span>{peer.streakDays}d streak</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Progress Callout */}
      {peerAhead && (
        <div className="relative z-10 mb-4 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400 shrink-0" />
            <p className="text-xs text-slate-200">
              <span className="font-bold text-white">Next Target:</span> You are only{' '}
              <span className="font-mono font-bold text-cyan-300 tabular-nums">
                {xpToNextRank} XP
              </span>{' '}
              behind <span className="font-bold text-white">{peerAhead.name}</span> for Rank #{currentUserIndex}.
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-300/80 shrink-0">
            ~{Math.ceil(xpToNextRank / 100)} DSA Challenge{Math.ceil(xpToNextRank / 100) > 1 ? 's' : ''} to overtake
          </span>
        </div>
      )}

      {/* Controls: Search and Segmented Filter Tabs */}
      <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Cohort ({leaderboard.length})
          </button>
          <button
            onClick={() => setActiveFilter('top5')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'top5'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Top 5 Contenders
          </button>
          <button
            onClick={() => setActiveFilter('division')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeFilter === 'division'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Division ({leaderboard[currentUserIndex]?.division || 'Diamond'})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cohort candidates..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Main Roster Table */}
      <div className="relative z-10 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Rank</th>
              <th className="py-2.5 px-3">Candidate</th>
              <th className="py-2.5 px-3 hidden sm:table-cell">Target Role</th>
              <th className="py-2.5 px-3 hidden md:table-cell text-center">DSA Solved</th>
              <th className="py-2.5 px-3 hidden lg:table-cell text-center">Streak</th>
              <th className="py-2.5 px-3 text-right">Experience</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {filteredCandidates.map((candidate) => {
              const actualRank = leaderboard.findIndex((c) => c.id === candidate.id) + 1;
              const isUser = candidate.isCurrentUser;

              return (
                <tr
                  key={candidate.id}
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`transition-colors cursor-pointer group ${
                    isUser
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Rank Column */}
                  <td className="py-2.5 px-3 font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs tabular-nums ${
                        actualRank === 1
                          ? 'text-amber-300 font-extrabold bg-amber-400/15'
                          : actualRank === 2
                          ? 'text-slate-200 font-bold bg-slate-200/15'
                          : actualRank === 3
                          ? 'text-amber-500 font-bold bg-amber-500/15'
                          : isUser
                          ? 'text-cyan-300 font-extrabold bg-cyan-400/20'
                          : 'text-slate-400'
                      }`}
                    >
                      {actualRank}
                    </span>
                  </td>

                  {/* Candidate Identity */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate flex items-center gap-1.5 group-hover:text-cyan-300 transition-colors">
                          <span>{candidate.name}</span>
                          {isUser && (
                            <span className="text-[9px] font-mono font-bold text-cyan-300 px-1 rounded bg-cyan-400/20">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {candidate.cohort}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Target Role */}
                  <td className="py-2.5 px-3 hidden sm:table-cell text-slate-300 truncate max-w-[200px]">
                    {candidate.role}
                  </td>

                  {/* Solved DSA */}
                  <td className="py-2.5 px-3 hidden md:table-cell text-center font-mono text-slate-200 tabular-nums">
                    {candidate.solvedDSA}
                  </td>

                  {/* Streak */}
                  <td className="py-2.5 px-3 hidden lg:table-cell text-center font-mono text-amber-400 tabular-nums">
                    <span className="inline-flex items-center gap-0.5">
                      <Flame className="w-3 h-3" />
                      {candidate.streakDays}d
                    </span>
                  </td>

                  {/* XP & Level */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="font-mono font-bold text-white tabular-nums group-hover:text-cyan-300 transition-colors">
                      {candidate.xp.toLocaleString()} XP
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Level {candidate.level}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Peer Profile Inspector Modal */}
      {selectedCandidate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-md rounded-2xl glass-panel p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Candidate Profile Inspection
              </span>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3.5">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="w-14 h-14 rounded-xl object-cover border border-cyan-500/40"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  {selectedCandidate.name}
                  {selectedCandidate.isCurrentUser && (
                    <span className="text-[10px] font-mono font-bold text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-500/20">
                      You
                    </span>
                  )}
                </h4>
                <p className="text-xs text-cyan-300 font-mono">{selectedCandidate.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedCandidate.cohort}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-4">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Total XP</span>
                <span className="font-mono font-bold text-sm text-cyan-300 tabular-nums">
                  {selectedCandidate.xp.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">DSA Solved</span>
                <span className="font-mono font-bold text-sm text-purple-300 tabular-nums">
                  {selectedCandidate.solvedDSA}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Streak</span>
                <span className="font-mono font-bold text-sm text-amber-400 tabular-nums flex items-center justify-center gap-0.5">
                  <Flame className="w-3.5 h-3.5" />
                  {selectedCandidate.streakDays}d
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Competitive Tier:</span>
                <span className="font-mono font-semibold text-white">
                  Level {selectedCandidate.level} · {selectedCandidate.division}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Interview Pipeline Status:</span>
                <span className="text-emerald-400 font-semibold">Active Tier-1 Pipeline</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
