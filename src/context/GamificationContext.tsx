import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { PeerCandidate, TierRank, XPTransaction } from '../types';
import { playSound } from '../utils/audio';

const STORAGE_KEY = 'zentrix_gamification_v2';

// Level thresholds progression
const LEVEL_THRESHOLDS = [
  0,     // Level 1: 0 - 299
  300,   // Level 2: 300 - 699
  700,   // Level 3: 700 - 1199
  1200,  // Level 4: 1200 - 1899
  1900,  // Level 5: 1900 - 2799
  2800,  // Level 6: 2800 - 3899
  3900,  // Level 7: 3900 - 5199
  5200,  // Level 8: 5200 - 6699
  6700,  // Level 9: 6700 - 8399
  8400,  // Level 10: 8400 - 10299
  10300, // Level 11: 10300+
];

export function getTierForLevel(lvl: number): TierRank {
  if (lvl <= 2) return 'Novice Engineer';
  if (lvl <= 4) return 'Algorithmic Specialist';
  if (lvl <= 6) return 'Systems Architect';
  if (lvl <= 8) return 'Principal Contender';
  return 'Zentrix Fellow';
}

export function calculateLevelFromXP(xp: number): {
  level: number;
  tier: TierRank;
  currentLevelFloor: number;
  nextLevelCeiling: number;
  progressPercent: number;
} {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentLevelFloor = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelCeiling = LEVEL_THRESHOLDS[level] || currentLevelFloor + 1500;
  const range = nextLevelCeiling - currentLevelFloor;
  const earnedInLevel = Math.max(0, xp - currentLevelFloor);
  const progressPercent = Math.min(100, Math.round((earnedInLevel / range) * 100));

  return {
    level,
    tier: getTierForLevel(level),
    currentLevelFloor,
    nextLevelCeiling,
    progressPercent,
  };
}

export const INITIAL_PEERS: Omit<PeerCandidate, 'isCurrentUser'>[] = [
  {
    id: 'peer-1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    role: 'Distributed Systems & Kernel Eng',
    cohort: 'Stanford AI Lab / FAANG Prep',
    xp: 4350,
    level: 7,
    streakDays: 38,
    solvedDSA: 420,
    division: 'Challenger',
  },
  {
    id: 'peer-2',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    role: 'Full-Stack AI & LLM Systems',
    cohort: 'UC Berkeley EECS / Unicorn Batch',
    xp: 3820,
    level: 6,
    streakDays: 29,
    solvedDSA: 345,
    division: 'Challenger',
  },
  {
    id: 'peer-3',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    role: 'ML Infrastructure & Optimization',
    cohort: 'IIT Bombay / Anthropic Fellow',
    xp: 3380,
    level: 6,
    streakDays: 31,
    solvedDSA: 312,
    division: 'Diamond',
  },
  {
    id: 'peer-4',
    name: 'Kaito Tanaka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    role: 'Backend High-Throughput & Rust',
    cohort: 'University of Waterloo / Stripe Track',
    xp: 2920,
    level: 6,
    streakDays: 22,
    solvedDSA: 265,
    division: 'Diamond',
  },
  {
    id: 'peer-5',
    name: 'Sarah Lindqvist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'Cloud Native & Kubernetes Systems',
    cohort: 'KTH Royal Inst / Databricks Track',
    xp: 2680,
    level: 5,
    streakDays: 19,
    solvedDSA: 240,
    division: 'Diamond',
  },
  {
    id: 'peer-6',
    name: 'Devon Bradley',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    role: 'Full-Stack TypeScript & Next.js',
    cohort: 'CMU Software Research Group',
    xp: 2450,
    level: 5,
    streakDays: 17,
    solvedDSA: 215,
    division: 'Platinum',
  },
  {
    id: 'peer-7',
    name: 'Amara Okafor',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
    role: 'Search, Embeddings & RAG Architect',
    cohort: 'MIT Media Lab / OpenAI Scholar',
    xp: 2280,
    level: 5,
    streakDays: 15,
    solvedDSA: 198,
    division: 'Platinum',
  },
  {
    id: 'peer-8',
    name: 'Lucas Silva',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    role: 'Frontend Performance & Graphics',
    cohort: 'Georgia Tech / Scale AI Track',
    xp: 1940,
    level: 5,
    streakDays: 14,
    solvedDSA: 175,
    division: 'Platinum',
  },
  {
    id: 'peer-9',
    name: 'Zoe Nakamura',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    role: 'Algorithmic Trading & Low Latency',
    cohort: 'Oxford CompSci / Jane Street Track',
    xp: 1650,
    level: 4,
    streakDays: 12,
    solvedDSA: 150,
    division: 'Gold',
  },
  {
    id: 'peer-10',
    name: 'Mateo Morales',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    role: 'Database Engines & Distributed Storage',
    cohort: 'UT Austin Turing Scholars',
    xp: 1420,
    level: 4,
    streakDays: 10,
    solvedDSA: 132,
    division: 'Gold',
  },
];

export interface LevelUpEvent {
  previousLevel: number;
  newLevel: number;
  newTier: TierRank;
  unlockedPerks: string[];
}

export interface XPNotice {
  id: string;
  amount: number;
  source: 'dsa' | 'study' | 'resume' | 'interview' | 'streak';
  description: string;
}

interface GamificationContextType {
  totalXP: number;
  level: number;
  tier: TierRank;
  currentLevelFloor: number;
  nextLevelCeiling: number;
  progressPercent: number;
  recentTransactions: XPTransaction[];
  leaderboard: PeerCandidate[];
  userRank: number;
  totalPeers: number;
  percentile: number;
  awardXP: (
    amount: number,
    source: 'dsa' | 'study' | 'resume' | 'interview' | 'streak',
    description: string
  ) => void;
  pendingLevelUp: LevelUpEvent | null;
  dismissLevelUp: () => void;
  activeNotices: XPNotice[];
  removeNotice: (id: string) => void;
  resetGamification: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const TIER_PERKS: Record<number, string[]> = {
  2: ['Unlocks Advanced Graph DSA Patterns', 'Tier 2 Peer Leaderboard Access'],
  3: ['Algorithmic Specialist Rank Badge', 'Automated ATS Keyword Injection Assistant'],
  4: ['Access to Unicorn Senior Screening Questions', 'Concurrency Drill Simulator'],
  5: ['Systems Architect Tier Achieved', 'Custom Distributed Systems Whiteboard'],
  6: ['Priority Autonomous Agent Routing', 'FAANG High-Bar Benchmark Simulation'],
  7: ['Principal Contender Golden Wordmark', 'VIP Recruiter Talent Spotlight'],
  8: ['Zentrix Fellow Grandmaster Honor', 'Unrestricted High-Throughput Model Access'],
};

export const GamificationProvider: React.FC<{
  children: ReactNode;
  userName: string;
  userAvatar: string;
  userTargetRole: string;
  userSolvedDSA: number;
  userStreak: number;
}> = ({ children, userName, userAvatar, userTargetRole, userSolvedDSA, userStreak }) => {
  // Load initial state from local storage or defaults
  const [totalXP, setTotalXP] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed.totalXP === 'number') return parsed.totalXP;
        } catch (e) {
          // ignore parsing error
        }
      }
    }
    // Baseline starting XP for Alex Vance
    return 3240;
  });

  const [recentTransactions, setRecentTransactions] = useState<XPTransaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.recentTransactions)) return parsed.recentTransactions;
        } catch (e) {
          // ignore
        }
      }
    }
    return [
      {
        id: 'tx-init-1',
        source: 'dsa',
        amount: 100,
        description: 'Solved: LRU Cache Implementation',
        timestamp: 'Today, 2:15 PM',
      },
      {
        id: 'tx-init-2',
        source: 'study',
        amount: 50,
        description: 'Completed: Morning Deep Work Block',
        timestamp: 'Today, 10:30 AM',
      },
      {
        id: 'tx-init-3',
        source: 'resume',
        amount: 150,
        description: 'ATS Score optimization (+10 points)',
        timestamp: 'Yesterday',
      },
    ];
  });

  const [pendingLevelUp, setPendingLevelUp] = useState<LevelUpEvent | null>(null);
  const [activeNotices, setActiveNotices] = useState<XPNotice[]>([]);

  // Calculate current level metrics
  const { level, tier, currentLevelFloor, nextLevelCeiling, progressPercent } =
    calculateLevelFromXP(totalXP);

  // Sync to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          totalXP,
          recentTransactions: recentTransactions.slice(0, 20),
        })
      );
    }
  }, [totalXP, recentTransactions]);

  // Award XP with level-up trigger and floating notice
  const awardXP = useCallback(
    (
      amount: number,
      source: 'dsa' | 'study' | 'resume' | 'interview' | 'streak',
      description: string
    ) => {
      setTotalXP((prevXP) => {
        const newXP = prevXP + amount;
        const oldMetrics = calculateLevelFromXP(prevXP);
        const newMetrics = calculateLevelFromXP(newXP);

        // Check for level up
        if (newMetrics.level > oldMetrics.level) {
          playSound('success');
          setPendingLevelUp({
            previousLevel: oldMetrics.level,
            newLevel: newMetrics.level,
            newTier: newMetrics.tier,
            unlockedPerks: TIER_PERKS[newMetrics.level] || [
              `Level ${newMetrics.level} Achieved`,
              'Global Cohort Standing Boost',
            ],
          });
        } else {
          playSound('click');
        }

        // Add notice
        const noticeId = `xp-notice-${Date.now()}-${Math.random()}`;
        setActiveNotices((prev) => [
          ...prev.slice(-3),
          { id: noticeId, amount, source, description },
        ]);

        return newXP;
      });

      // Record transaction
      const newTx: XPTransaction = {
        id: `tx-${Date.now()}`,
        source,
        amount,
        description,
        timestamp: 'Just now',
      };
      setRecentTransactions((prev) => [newTx, ...prev.slice(0, 19)]);
    },
    []
  );

  const removeNotice = useCallback((id: string) => {
    setActiveNotices((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissLevelUp = useCallback(() => {
    setPendingLevelUp(null);
  }, []);

  const resetGamification = useCallback(() => {
    setTotalXP(3240);
    setRecentTransactions([]);
    setPendingLevelUp(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Assemble dynamic leaderboard with current user
  const currentUserEntry: PeerCandidate = {
    id: 'user-current',
    name: userName || 'Alex Vance',
    avatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: userTargetRole || 'Full-Stack AI Systems Engineer',
    cohort: 'FAANG Candidate Pool (You)',
    xp: totalXP,
    level,
    streakDays: userStreak || 24,
    solvedDSA: userSolvedDSA || 284,
    isCurrentUser: true,
    division: totalXP >= 3800 ? 'Challenger' : totalXP >= 2600 ? 'Diamond' : 'Platinum',
  };

  // Sort peers with user included by XP descending
  const allCandidates: PeerCandidate[] = [...INITIAL_PEERS, currentUserEntry].sort(
    (a, b) => b.xp - a.xp
  );

  const userRank = allCandidates.findIndex((c) => c.isCurrentUser) + 1;
  const totalPeers = allCandidates.length;
  const percentile = Math.max(
    1,
    Math.round(((totalPeers - userRank + 1) / totalPeers) * 100)
  );

  return (
    <GamificationContext.Provider
      value={{
        totalXP,
        level,
        tier,
        currentLevelFloor,
        nextLevelCeiling,
        progressPercent,
        recentTransactions,
        leaderboard: allCandidates,
        userRank,
        totalPeers,
        percentile,
        awardXP,
        pendingLevelUp,
        dismissLevelUp,
        activeNotices,
        removeNotice,
        resetGamification,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export function useGamification(): GamificationContextType {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
