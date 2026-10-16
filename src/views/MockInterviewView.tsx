import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ShieldCheck,
  Send,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InterviewQuestion, InterviewEvaluation } from '../types';
import { INITIAL_INTERVIEW_QUESTIONS } from '../data/mockData';
import { playSound, speakText, stopSpeaking, createSpeechRecognizer } from '../utils/audio';

export const MockInterviewView: React.FC = () => {
  const [questions] = useState<InterviewQuestion[]>(INITIAL_INTERVIEW_QUESTIONS);
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion>(questions[0]);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleStartQuestion = (q: InterviewQuestion) => {
    playSound('agent');
    setActiveQuestion(q);
    setCandidateAnswer('');
    setEvaluation(null);
    setTimerSeconds(0);
    setTimerActive(true);
    // Speak out question
    speakText(q.question);
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      playSound('click');
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      playSound('click');
      setIsRecording(true);
      const recognizer = createSpeechRecognizer(
        (transcript) => {
          setCandidateAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        () => setIsRecording(false),
        (err) => {
          console.warn('Speech recognition warning:', err);
          setIsRecording(false);
        }
      );

      if (recognizer) {
        try {
          recognizer.start();
          recognizerRef.current = recognizer;
        } catch (e) {
          console.warn('Recognition start error:', e);
        }
      } else {
        // Fallback simulation text if microphone permission or API is blocked in iframe
        setCandidateAnswer(
          'To design an in-memory LRU cache with O(1) complexity, I use a combination of a Hash Map and a Doubly Linked List. The Hash Map stores keys mapping to list node pointers for instant lookup, while the Doubly Linked List maintains access recency. On each get, the accessed node is moved to the head. On put exceeding capacity, the tail node is evicted. For concurrency across threads, I use a ReadWrite mutex or striped segmented locking to avoid bottlenecks.'
        );
        setIsRecording(false);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!candidateAnswer.trim() || isEvaluating) return;
    playSound('agent');
    setIsEvaluating(true);
    setTimerActive(false);

    try {
      const res = await fetch('/api/mock-interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          answer: candidateAnswer,
          category: activeQuestion.category,
          role: activeQuestion.role,
        }),
      });

      const data: InterviewEvaluation = await res.json();
      setEvaluation(data);

      if (data.score >= 80) {
        playSound('success');
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f5ff', '#8b5cf6', '#10b981'],
        });
      }
    } catch (e) {
      console.error('Error evaluating interview:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 flex items-center gap-1">
              <Mic className="w-3 h-3 text-pink-400" />
              VOICE & TECHNICAL MOCK LAB
            </span>
            <span className="text-xs font-mono text-slate-400">FAANG Principal Interviewer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Simulated Technical & Behavioral Interviews
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time answer transcription, rubric scoring across clarity, technical accuracy, and depth, powered by Gemini 3.8 Flash.
          </p>
        </div>

        {/* Live Timer Pill */}
        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-2 font-mono">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400">Response Time:</span>
          <span className="text-sm font-bold text-white">{formatTimer(timerSeconds)}</span>
        </div>
      </div>

      {/* Question Selector Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => handleStartQuestion(q)}
            className={`p-3 rounded-xl border text-left shrink-0 w-72 transition-all ${
              activeQuestion.id === q.id
                ? 'bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_15px_rgba(0,245,255,0.15)]'
                : 'glass-panel border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-purple-300">
                {q.category}
              </span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded uppercase ${
                  q.difficulty === 'Easy'
                    ? 'text-emerald-300 bg-emerald-500/10'
                    : q.difficulty === 'Medium'
                    ? 'text-amber-300 bg-amber-500/10'
                    : 'text-rose-300 bg-rose-500/10'
                }`}
              >
                {q.difficulty}
              </span>
            </div>
            <p className="text-xs font-semibold text-white line-clamp-2">{q.question}</p>
          </button>
        ))}
      </div>

      {/* Active Question & Answer Recording HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Question & Input */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono text-cyan-300 font-bold">
              ROUND: {activeQuestion.role}
            </span>
            <button
              onClick={() => speakText(activeQuestion.question)}
              className="p-1 rounded text-slate-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] font-mono"
            >
              <Volume2 className="w-3.5 h-3.5" /> Speak Question
            </button>
          </div>

          <h3 className="text-sm sm:text-base font-heading font-bold text-white leading-relaxed">
            {activeQuestion.question}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            Focus: {activeQuestion.context}
          </p>

          {/* Answer Area */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-slate-300">
                Candidate Response (Voice or Text)
              </label>

              {/* Mic toggle */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_15px_#f43f5e]'
                    : 'bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Listening...' : 'Voice Record'}</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              placeholder="Speak via microphone or type your technical explanation here..."
              className="w-full p-3.5 bg-slate-900/80 border border-white/15 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none custom-scrollbar leading-relaxed"
            />
          </div>

          <button
            onClick={handleEvaluate}
            disabled={!candidateAnswer.trim() || isEvaluating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.25)] transition-all disabled:opacity-40"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEvaluating ? 'Interviewer Analyzing Answer...' : 'Submit to Interview Panel'}</span>
          </button>
        </div>

        {/* Right: Evaluation Report */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Interviewer Scorecard & Rubric
              </h4>
              {evaluation && (
                <span className="text-xl font-mono font-extrabold text-cyan-300">
                  {evaluation.score}/100
                </span>
              )}
            </div>

            {evaluation ? (
              <div className="mt-4 space-y-4">
                {/* Scoring Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block">Technical Accuracy</span>
                    <span className="text-base font-mono font-bold text-white">
                      {evaluation.breakdown.technicalAccuracy}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block">Communication Clarity</span>
                    <span className="text-base font-mono font-bold text-white">
                      {evaluation.breakdown.clarity}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block">Structural Flow</span>
                    <span className="text-base font-mono font-bold text-white">
                      {evaluation.breakdown.structure}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block">Depth & Trade-offs</span>
                    <span className="text-base font-mono font-bold text-white">
                      {evaluation.breakdown.depth}%
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-200">
                  <strong className="text-purple-300 font-mono">Lead Evaluator Verdict:</strong> {evaluation.feedback}
                </div>

                {/* Key Strengths */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    Observed Strengths
                  </span>
                  {evaluation.strengths.map((str, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>

                {/* Key Improvements */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                    Growth Opportunities
                  </span>
                  {evaluation.improvements.map((imp, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">
                  Select a question, speak or type your answer, and receive an instant Silicon Valley evaluation breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
