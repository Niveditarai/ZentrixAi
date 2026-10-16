import React, { useState } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { BackgroundEffects } from './components/BackgroundEffects';
import { FloatingAiOrb } from './components/FloatingAiOrb';
import { AuthModal } from './views/AuthModal';
import { OverviewView } from './views/OverviewView';
import { CareerAssistantView } from './views/CareerAssistantView';
import { ResumeIntelligenceView } from './views/ResumeIntelligenceView';
import { GitHubIntelligenceView } from './views/GitHubIntelligenceView';
import { DsaDashboardView } from './views/DsaDashboardView';
import { RoadmapGeneratorView } from './views/RoadmapGeneratorView';
import { StudyPlannerView } from './views/StudyPlannerView';
import { MockInterviewView } from './views/MockInterviewView';
import { MultiAgentView } from './views/MultiAgentView';
import { RagSystemView } from './views/RagSystemView';
import { VoiceAiView } from './views/VoiceAiView';
import { PlacementDashboardView } from './views/PlacementDashboardView';
import { AnalyticsDashboardView } from './views/AnalyticsDashboardView';
import { AdminPanelView } from './views/AdminPanelView';
import { GamificationProvider } from './context/GamificationContext';
import { LevelUpModal } from './components/LevelUpModal';
import { XPToastContainer } from './components/XPToast';

import {
  INITIAL_USER,
  INITIAL_AGENTS,
  INITIAL_DSA_STATS,
  INITIAL_RESUME_ANALYSIS,
  INITIAL_GITHUB_STATS,
  INITIAL_ROADMAP,
  INITIAL_STUDY_SLOTS,
} from './data/mockData';
import {
  UserProfile,
  AgentInfo,
  DSAStats,
  ResumeAnalysisResult,
  GitHubStats,
  RoadmapData,
  StudySlot,
} from './types';
import { playSound } from './utils/audio';

export default function App() {
  // Navigation & Shell state
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Application Data States
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [agents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [activeAgent, setActiveAgent] = useState<AgentInfo>(INITIAL_AGENTS[0]);
  const [dsaStats, setDsaStats] = useState<DSAStats>(INITIAL_DSA_STATS);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult>(INITIAL_RESUME_ANALYSIS);
  const [githubStats, setGithubStats] = useState<GitHubStats>(INITIAL_GITHUB_STATS);
  const [roadmap, setRoadmap] = useState<RoadmapData>(INITIAL_ROADMAP);
  const [studySlots, setStudySlots] = useState<StudySlot[]>(INITIAL_STUDY_SLOTS);

  // Daily target toggle handler
  const handleToggleDailyTarget = (id: string) => {
    setDsaStats((prev) => ({
      ...prev,
      dailyTargets: prev.dailyTargets.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  // Study slot toggle handler
  const handleToggleStudySlot = (id: string) => {
    setStudySlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <GamificationProvider
      userName={user.name}
      userAvatar={user.avatarUrl}
      userTargetRole={user.targetRole}
      userSolvedDSA={dsaStats.solvedTotal}
      userStreak={user.streakDays}
    >
      <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
        {/* Dynamic Aurora & Mouse-Follow Background FX */}
        <BackgroundEffects />

        {/* Celebratory Level-Up Modal */}
        <LevelUpModal />

        {/* Floating XP Toasts */}
        <XPToastContainer />

        {/* Main Structural Layout */}
        <div className="flex flex-1 min-h-screen relative z-10">
        {/* Futuristic Glassmorphic Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <Header
            activeAgent={activeAgent}
            agents={agents}
            onSelectAgent={setActiveAgent}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenMobileMenu={() => setIsMobileOpen(true)}
            user={user}
          />

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24">
            {activeTab === 'overview' && (
              <OverviewView
                user={user}
                dsaStats={dsaStats}
                resumeAnalysis={resumeAnalysis}
                githubStats={githubStats}
                agents={agents}
                onNavigate={handleSelectTab}
                onToggleDailyTarget={handleToggleDailyTarget}
              />
            )}

            {activeTab === 'assistant' && (
              <CareerAssistantView
                activeAgent={activeAgent}
                agents={agents}
                onSelectAgent={setActiveAgent}
              />
            )}

            {activeTab === 'resume' && (
              <ResumeIntelligenceView
                resumeAnalysis={resumeAnalysis}
                onUpdateAnalysis={setResumeAnalysis}
              />
            )}

            {activeTab === 'github' && (
              <GitHubIntelligenceView
                githubStats={githubStats}
                onUpdateStats={setGithubStats}
              />
            )}

            {activeTab === 'dsa' && (
              <DsaDashboardView
                dsaStats={dsaStats}
                onToggleDailyTarget={handleToggleDailyTarget}
              />
            )}

            {activeTab === 'roadmap' && (
              <RoadmapGeneratorView
                roadmap={roadmap}
                onUpdateRoadmap={setRoadmap}
              />
            )}

            {activeTab === 'study' && (
              <StudyPlannerView
                studySlots={studySlots}
                onToggleSlot={handleToggleStudySlot}
                onAddSlot={(newSlot) => setStudySlots((prev) => [newSlot, ...prev])}
              />
            )}

            {activeTab === 'interview' && <MockInterviewView />}

            {activeTab === 'multi-agent' && (
              <MultiAgentView
                agents={agents}
                onSelectAgent={(ag) => {
                  setActiveAgent(ag);
                  setActiveTab('assistant');
                }}
              />
            )}

            {activeTab === 'rag' && <RagSystemView />}

            {activeTab === 'voice' && <VoiceAiView />}

            {activeTab === 'placement' && <PlacementDashboardView />}

            {activeTab === 'analytics' && <AnalyticsDashboardView />}

            {activeTab === 'admin' && <AdminPanelView />}
          </main>
        </div>
      </div>

      {/* Floating AI Orb */}
      <FloatingAiOrb
        activeAgentName={activeAgent.name}
        onOpenChat={() => {
          playSound('agent');
          handleSelectTab('assistant');
        }}
        onOpenVoice={() => {
          playSound('agent');
          handleSelectTab('voice');
        }}
      />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          currentUser={user}
          onLoginSuccess={(updatedUser) => {
            setUser(updatedUser);
          }}
        />
      </div>
    </GamificationProvider>
  );
}

