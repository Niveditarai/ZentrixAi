export type AgentId = 
  | 'career'
  | 'resume'
  | 'dsa'
  | 'roadmap'
  | 'interview'
  | 'github'
  | 'job';

export interface AgentInfo {
  id: AgentId;
  name: string;
  role: string;
  avatarColor: string;
  badge: string;
  iconName: string;
  description: string;
  status: 'active' | 'standby' | 'processing';
  model: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentId?: AgentId;
  timestamp: string;
  model?: string;
  sources?: string[];
  suggestedPrompts?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'engineer' | 'student' | 'admin';
  targetRole: string;
  targetCompanyTier: string;
  avatarUrl: string;
  joinedDate: string;
  readinessScore: number;
  streakDays: number;
}

export interface ATSBreakdown {
  keywordMatch: number;
  impactFormatting: number;
  hardSkills: number;
  softSkills: number;
  experienceDepth: number;
}

export interface ResumeAnalysisResult {
  atsScore: number;
  breakdown: ATSBreakdown;
  extractedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  industryComparison: {
    percentile: number;
    tier: string;
    targetRole: string;
  };
}

export interface GitHubStats {
  username: string;
  avatar: string;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  contributionsLastYear: number;
  streakDays: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  readinessScore: number;
  evaluatedProjects: {
    name: string;
    description: string;
    stars: number;
    techStack: string[];
    grade: 'A+' | 'A' | 'B+' | 'B';
    feedback: string;
  }[];
}

export interface DSAStats {
  solvedTotal: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  acceptanceRate: number;
  globalRank: number;
  contestRating: number;
  streak: number;
  topics: {
    name: string;
    solved: number;
    total: number;
    status: 'Mastered' | 'In Progress' | 'Needs Practice';
    color: string;
  }[];
  dailyTargets: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    completed: boolean;
    points: number;
  }[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  completed?: boolean;
  topics: string[];
  projects: string[];
}

export interface RoadmapData {
  id: string;
  role: string;
  level: string;
  estimatedWeeks: number;
  progressPercent: number;
  phases: RoadmapPhase[];
}

export interface StudySlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  focusArea: string;
  type: 'deep-work' | 'dsa-sprint' | 'mock-interview' | 'revision';
  completed: boolean;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR & Behavioral' | 'System Design';
  role: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  context: string;
  expectedKeypoints: string[];
}

export interface InterviewEvaluation {
  score: number;
  breakdown: {
    technicalAccuracy: number;
    clarity: number;
    structure: number;
    depth: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  idealAnswerSample: string;
}

export interface KnowledgeDocument {
  id: string;
  source: string;
  type: 'guide' | 'resume' | 'dsa' | 'github' | 'interview';
  similarity: number;
  snippet: string;
  dateAdded: string;
}

export interface RagDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  similarityScore: number;
  tokens: number;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  title?: string;
  location: string;
  salaryRange: string;
  stage?: 'Saved' | 'Applied' | 'Screening' | 'Technical Round' | 'Final Round' | 'Offer';
  status?: 'Applied' | 'OA' | 'Technical Round' | 'Final Loop' | 'Offer' | 'Rejected' | string;
  appliedDate?: string;
  matchScore: number;
  referralContact?: string;
  notes?: string;
}

export type TierRank =
  | 'Novice Engineer'
  | 'Algorithmic Specialist'
  | 'Systems Architect'
  | 'Principal Contender'
  | 'Zentrix Fellow';

export interface XPTransaction {
  id: string;
  source: 'dsa' | 'study' | 'resume' | 'interview' | 'streak';
  amount: number;
  description: string;
  timestamp: string;
}

export interface PeerCandidate {
  id: string;
  name: string;
  avatar: string;
  role: string;
  cohort: string;
  xp: number;
  level: number;
  streakDays: number;
  solvedDSA: number;
  isCurrentUser?: boolean;
  division?: 'Challenger' | 'Diamond' | 'Platinum' | 'Gold';
}

export interface GamificationState {
  totalXP: number;
  level: number;
  tier: TierRank;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
  recentTransactions: XPTransaction[];
  leaderboard: PeerCandidate[];
  pendingLevelUp?: {
    previousLevel: number;
    newLevel: number;
    newTier: TierRank;
    unlockedPerks?: string[];
  } | null;
}

