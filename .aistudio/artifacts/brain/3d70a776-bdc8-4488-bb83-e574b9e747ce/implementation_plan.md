# Zentrix Experience Points (XP) & Global Cohort Leaderboard Engine

A comprehensive gamification and peer ranking system that awards Experience Points (XP) dynamically upon completing DSA challenges, checking off study planner sessions, and optimizing resume ATS scores, complete with a Global Cohort Leaderboard widget and celebratory level-up modal.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following design and product directions were confirmed via interactive user clarification and govern the implementation:

- **Progression Branding**: Experience Points (XP) with Tier Levels (e.g., Novice Engineer, Systems Builder, Senior Architect, Principal Contender, Fellow).
- **Leaderboard Scope**: Global Cohort Leaderboard featuring simulated active peers from top university engineering cohorts and industry bootcamps, placing the user dynamically in their percentile ranking.
- **Celebration Effects**: Interactive Level-Up modal featuring multi-stage particle confetti, audio feedback (`playSound('success')`), rank badge glow, and instant stat counters.
- **XP Reward Balance (Recommended)**:
  - **DSA Task Completion**: +100 XP per solved problem (Easy: +75 XP, Medium: +100 XP, Hard: +150 XP).
  - **Study Planner Slot**: +50 XP per completed deep-work or revision block.
  - **Resume Improvement**: +15 XP per ATS point increase upon analysis.
  - **Level Formula**: Level $N = \lfloor\sqrt{\text{Total XP} / 100}\rfloor + 1$, with an animated progress bar to the next tier.

---

### 1. Overview & Core Concept

- **What It Does**: Transforms candidate interview preparation into an engaging, quantified RPG-style progression loop. Every concrete milestone achieved in the app—marking a DSA challenge done, ticking off a study block, or improving resume keyword resonance—automatically awards XP, updates user rank, shifts the cohort leaderboard standing, and triggers celebratory visual feedback.
- **Target Audience / Persona**: Aspiring and practicing software engineers preparing for competitive FAANG, Tier-1 tech, and AI startup placement rounds who thrive on momentum, quantified progress, and peer benchmarks.
- **Key Value**: Replaces anxiety and isolation in interview prep with visible dopamine-reinforcing feedback loops, clear milestone clarity, and realistic cohort positioning.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Dashboard Leaderboard & XP Overview*: User opens the Dashboard (Overview) to see their current Level, Total XP, progress bar to next level, and the Global Cohort Leaderboard widget showing their active position among peers (e.g., Rank #4 in the San Francisco / FAANG 2026 Cohort).
  2. *Earning XP via DSA Problem Solving*: When the user toggles a daily DSA target in either the Overview or the dedicated DSA Dashboard, an animated XP floating badge appears (`+100 XP`), sound plays, and the leaderboard counter increments smoothly with tabular numeral transitions.
  3. *Earning XP via Study Planner*: Checking off a scheduled deep-work slot or mock interview in the Study Planner grants `+50 XP` with instant toast notification.
  4. *Earning XP via Resume Upload/Improvement*: Uploading or re-analyzing a resume that yields a higher ATS score awards `+15 XP` per delta point.
  5. *Level-Up Celebration Event*: Crossing an XP threshold triggers a high-impact Level-Up modal with particle fireworks, tier rank upgrade card, celebratory audio, and a "Continue Dominating" action button.
  6. *Leaderboard Interaction*: Filter cohort by "Global Top 10", "Friends & Cohort", or "My Division", with expandable peer profile cards displaying top tech stacks and solved problem stats.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Dark slate futuristic SaaS console (`#050816`) with cyan (`#00f5ff`) and purple (`#a855f7`) cybernetic accents, hairline frosted glass borders, and subtle gradient backdrops.
  - *Color Palette & Tokens*:
    - 60% Dominant Neutral: `#050816` & `#0b0f24` (dark space canvas).
    - 30% Structural Surfaces: `rgba(255, 255, 255, 0.03)` with `border-white/10` and `backdrop-blur-xl`.
    - 10% High-Intent Accents: Neon Cyan (`#00f5ff`), Emerald (`#10b981`), Amber Gold (`#f59e0b`), Violet (`#8b5cf6`).
  - *Typography & Hierarchy*:
    - Display / Section Headings: `Plus Jakarta Sans` or modern sans in Bold/Extrabold (`text-xl` to `text-2xl`).
    - Tabular Data & Metrics: Strictly monospace `tabular-nums` (`JetBrains Mono` / `font-mono`) for XP numbers, rank badges, and percentage stats.
    - Subtext & Labels: Crisp unboxed typography with bullet (`·`) separators in accordance with Zero-Pill discipline.
  - *Component Styling & Layout*:
    - Leaderboard Widget positioned cleanly on the Dashboard grid (either alongside or under the daily targets, preserving 1440px desktop balance).
    - Top 3 Podium Cards (Gold #1, Silver #2, Bronze #3) followed by high-density tabular rows with the current user pinned or highlighted in neon cyan.
    - Zero pill capsules on static ranks: clean numerical rank badges with subtle colored borders for podium places.

- **Interactive Feedback & Motion**:
  - XP counter animation utilizing spring-physics or smooth counting transitions (`framer-motion` / CSS counter).
  - Floating `+XP` pill toast that fades out and slides up on completion.
  - Canvas confetti burst (`canvas-confetti`) calibrated to 80 particles in cyber-cyan, violet, and gold.
  - Audio chime using existing Web Audio API sound generator in `src/utils/audio.ts`.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Centralized Gamification Store / Context vs Prop Drilling**
  - *Chosen Approach*: Create a persistent `GamificationContext` or unified state hook (`useGamification`) that connects XP state with local storage persistence and event triggers across all views.
  - *Why*: Allows any view (DSA view, Study Planner view, Resume view, Overview) to dispatch `awardXP(amount, reason, metadata)` without complex multi-level callback chains in `App.tsx`.
  - *Alternatives Considered*: Pure `App.tsx` prop-passing was viable but creates brittle coupling across 6+ views.

- **Decision 2: Realistic Simulated Cohort with Deterministic Relative Placement**
  - *Chosen Approach*: A rich cohort roster of 12 realistic peer profiles with active university/company affiliations, XP velocity, and dynamic rank shifting based on the user's live score.
  - *Why*: Provides genuine social proof, competitive tension, and immediate responsiveness without needing backend multi-tenant databases.
  - *Alternatives Considered*: Static leaderboard would feel dead; purely random scores break immersion.

- **Decision 3: Non-Intrusive Level-Up Modal**
  - *Chosen Approach*: Trigger modal with backdrop blur when XP crosses the tier boundary, but allow instant `Escape` key or click-anywhere dismissal so it never blocks an active coding/study session.
  - *Why*: Celebrates major milestones without breaking user focus.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

#### System Architecture & Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          User Actions & Views                          │
│                                                                        │
│   ┌───────────────┐      ┌────────────────┐      ┌─────────────────┐   │
│   │  DSA Targets  │      │  Study Planner │      │ Resume Analysis │   │
│   │ (Toggle Task) │      │ (Complete Slot)│      │  (ATS Delta)    │   │
│   └───────┬───────┘      └────────┬───────┘      └────────┬────────┘   │
└───────────┼───────────────────────┼───────────────────────┼────────────┘
            │                       │                       │
            ▼                       ▼                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Gamification Event Bus & State Store                   │
│                                                                        │
│   - Total XP & Level Calculation (Level 1 to 20+)                      │
│   - Tier Badges: Novice -> Specialist -> Architect -> Fellow           │
│   - Activity XP History Feed & Daily Streak Sync                       │
│   - Persistent in LocalStorage (key: 'zentrix_gamification_v1')        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
┌───────────────────────────────────────┐   ┌────────────────────────────┐
│      Dashboard Leaderboard Widget     │   │   Celebration Triggers     │
│                                       │   │                            │
│  - Cohort Ranking & Percentile        │   │  - Floating "+XP" Toast    │
│  - Top 3 Podium + User Current Row    │   │  - Canvas Confetti Cannon  │
│  - Division Filter & Profile Modals   │   │  - Audio Chime Synthesis   │
│  - Tabular Numeral Ranks              │   │  - Level-Up Modal Dialogue │
└───────────────────────────────────────┘   └────────────────────────────┘
```

#### Data Model & Entities

```typescript
export interface XPTransaction {
  id: string;
  source: 'dsa' | 'study' | 'resume' | 'interview' | 'streak';
  amount: number;
  description: string;
  timestamp: string;
}

export type TierRank = 'Novice Engineer' | 'Algorithmic Specialist' | 'Systems Architect' | 'Principal Contender' | 'Zentrix Fellow';

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
}
```

#### Component & Interactive State Mapping
- `src/context/GamificationContext.tsx`: Manages XP balance, tier calculations, milestone thresholds, and local storage synchronization.
- `src/components/LeaderboardWidget.tsx`: Clean, high-density cohort leaderboard card for the Overview dashboard with filter tabs (All, Top 10, Nearby Ranks) and user highlight row.
- `src/components/LevelUpModal.tsx`: Celebratory modal that mounts with animation when `pendingLevelUp` is non-null.
- `src/components/XPFloatingNotice.tsx`: Ephemeral floating XP indicator that appears near triggered actions.
- `src/views/OverviewView.tsx`: Integrated Leaderboard Widget alongside vital statistics and daily targets.
- `src/views/DsaDashboardView.tsx`, `src/views/StudyPlannerView.tsx`, `src/views/ResumeIntelligenceView.tsx`: Bound with XP dispatchers upon completions.

---
