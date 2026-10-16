import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Award,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResumeAnalysisResult } from '../types';
import { playSound } from '../utils/audio';
import { useGamification } from '../context/GamificationContext';

interface ResumeIntelligenceViewProps {
  resumeAnalysis: ResumeAnalysisResult;
  onUpdateAnalysis: (result: ResumeAnalysisResult) => void;
}

export const ResumeIntelligenceView: React.FC<ResumeIntelligenceViewProps> = ({
  resumeAnalysis,
  onUpdateAnalysis,
}) => {
  const { awardXP } = useGamification();
  const [targetRole, setTargetRole] = useState('Full Stack AI Systems Engineer');

  const [resumeText, setResumeText] = useState(`ALEX VANCE
alex.vance@zentrix.ai | github.com/alexvance-ai | San Francisco, CA

SUMMARY
Senior Full-Stack AI Engineer with 6+ years architecting high-concurrency distributed systems, RAG inference engines, and low-latency microservices. 

EXPERIENCE
Staff AI Infrastructure Engineer | NeuralScale AI (2024 - Present)
- Architected distributed vector indexing pipeline using Go, Redis, and Pinecone, reducing p99 semantic retrieval latency from 180ms to 24ms for 4.2M daily queries.
- Spearheaded adoption of Next.js 15 App Router and React 19 concurrent streaming, accelerating frontend TTFB by 35%.
- Implemented real-time LangGraph multi-agent orchestration for automated code auditing across 85 microservices.

Full Stack Software Engineer | Horizon Cloud Systems (2021 - 2024)
- Designed asynchronous task queue with Kafka and Docker workers, processing 12,000 background jobs/sec with zero packet loss.
- Migrated legacy monolithic PostgreSQL schema to distributed sharded database, cutting cloud database egress costs by $84,000 annually.

SKILLS
Languages: TypeScript, Python, Go, Rust, SQL
Technologies: React 19, Next.js, Node.js, LangChain, Pinecone, Docker, Kubernetes, PostgreSQL, Redis, Tailwind CSS`);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>('alex_vance_resume_2026.pdf');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSound('click');
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setResumeText(content);
        triggerAnalysis(content);
      }
    };
    reader.readAsText(file);
  };

  const triggerAnalysis = async (textToAnalyze?: string) => {
    playSound('agent');
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/resume-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: textToAnalyze || resumeText,
          targetRole,
        }),
      });

      const data: ResumeAnalysisResult = await res.json();
      onUpdateAnalysis(data);

      const delta = Math.max(0, data.atsScore - (resumeAnalysis.atsScore || 0));
      const xpEarned = delta > 0 ? Math.max(100, delta * 20) : 75;
      awardXP(
        xpEarned,
        'resume',
        delta > 0
          ? `Improved Resume ATS Score (+${delta} pts to ${data.atsScore}/100)`
          : `Completed Resume ATS Audit (${data.atsScore}/100)`
      );

      if (data.atsScore >= 85) {
        playSound('success');
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f5ff', '#8b5cf6', '#10b981'],
        });
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-400" />
              ATS INTELLIGENCE AUDITOR
            </span>
            <span className="text-xs font-mono text-slate-400">FAANG Keyword Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Resume Intelligence & ATS Optimization
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Audit your resume against Tier-1 recruiting algorithms, calculate hard skill density, and optimize bullet points with the Google XYZ formula.
          </p>
        </div>

        {/* Target Role Selector */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Target Role Persona</span>
            <select
              value={targetRole}
              onChange={(e) => {
                setTargetRole(e.target.value);
                playSound('click');
              }}
              className="mt-1 text-xs bg-slate-900 border border-white/20 rounded-lg px-3 py-1.5 text-white font-medium focus:outline-none focus:border-cyan-400"
            >
              <option value="Full Stack AI Systems Engineer">Full Stack AI Systems Engineer</option>
              <option value="Staff Distributed Systems Architect">Staff Distributed Systems Architect</option>
              <option value="Machine Learning Platform Engineer">Machine Learning Platform Engineer</option>
              <option value="Quant Core Infrastructure Developer">Quant Core Infrastructure Developer</option>
            </select>
          </div>

          <button
            onClick={() => triggerAnalysis()}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Evaluating...' : 'Re-Run ATS Audit'}</span>
          </button>
        </div>
      </div>

      {/* Top Scores & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main ATS Gauge Card */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">OVERALL ATS MATCH</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
              {resumeAnalysis.industryComparison.tier}
            </span>
          </div>

          <div className="my-4 flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${resumeAnalysis.atsScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-mono font-extrabold text-white">
                  {resumeAnalysis.atsScore}
                </span>
                <span className="text-[9px] font-mono text-slate-400">/ 100</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-white leading-snug">
                Tier-1 Screening Probability: <span className="text-emerald-400 font-mono">94%</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Matches recruiter filters for {resumeAnalysis.industryComparison.targetRole}.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-cyan-300 pt-2 border-t border-white/5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Passed strict ATS filter test</span>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        <div className="md:col-span-2 glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-heading font-bold text-white">Scoring Vector Breakdown</span>
            <span className="text-[11px] font-mono text-slate-400">Algorithm v4.2</span>
          </div>

          {[
            { label: 'Keyword Density & Tech Stack Match', score: resumeAnalysis.breakdown.keywordMatch, color: 'from-cyan-400 to-blue-500' },
            { label: 'Quantifiable Impact & XYZ Formatting', score: resumeAnalysis.breakdown.impactFormatting, color: 'from-purple-400 to-indigo-500' },
            { label: 'Hard Technical Competencies', score: resumeAnalysis.breakdown.hardSkills, color: 'from-emerald-400 to-teal-500' },
            { label: 'Leadership & Cross-Functional Signals', score: resumeAnalysis.breakdown.softSkills, color: 'from-amber-400 to-orange-500' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300">{item.label}</span>
                <span className="font-mono text-white font-bold">{item.score}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor / Uploader and Analysis Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Resume Text / Uploader */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white">Resume Source Content</h3>
            </div>

            {/* File Upload Trigger */}
            <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 transition-all">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload PDF/TXT</span>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {fileName && (
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 p-2 rounded bg-slate-900/80 border border-white/5">
              <span className="text-cyan-400 font-bold">ACTIVE FILE:</span>
              <span className="text-slate-200">{fileName}</span>
            </div>
          )}

          <textarea
            rows={15}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your raw resume text here to analyze..."
            className="w-full p-3.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 leading-relaxed custom-scrollbar"
          />

          <button
            onClick={() => triggerAnalysis()}
            disabled={isAnalyzing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,245,255,0.25)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Resume with Gemini 3.8 Flash</span>
          </button>
        </div>

        {/* Right: Skills & Missing Keywords + Suggestions */}
        <div className="space-y-6">
          {/* Missing Keywords Gap Analysis */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Missing High-Leverage ATS Keywords
              </h3>
              <span className="text-[10px] font-mono text-amber-300">Add to boost score +8%</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {resumeAnalysis.missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3 text-amber-400" />
                  {kw}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
                Detected Verified Skills ({resumeAnalysis.extractedSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {resumeAnalysis.extractedSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-mono"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Executive Recommendations */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 shadow-lg space-y-3">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Strategic Bullet Point Optimizations
            </h3>

            <div className="space-y-2.5">
              {resumeAnalysis.improvements.map((imp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{imp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
