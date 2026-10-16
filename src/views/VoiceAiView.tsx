import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Radio,
  RefreshCw,
  Bot,
  User,
  Zap,
  Activity
} from 'lucide-react';
import { playSound, speakText, stopSpeaking, createSpeechRecognizer } from '../utils/audio';

export const VoiceAiView: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Elena (Principal Recruiter)');
  const [conversation, setConversation] = useState<Array<{ role: 'ai' | 'user'; text: string; time: string }>>([
    {
      role: 'ai',
      text: "Hello! I am Zentrix Voice Core. I'm calibrated to conduct real-time conversational technical screens. Tell me about the most challenging distributed systems bottleneck you have solved.",
      time: 'Just now',
    },
  ]);

  const recognizerRef = useRef<any>(null);

  const voicePersonas = [
    { name: 'Elena (Principal Recruiter)', role: 'Executive Behavioral & Leadership', pitch: 1.05 },
    { name: 'Marcus (Staff Systems Architect)', role: 'Distributed Systems & Concurrency', pitch: 0.95 },
    { name: 'Dr. Chloe (Quant Research Lead)', role: 'Low-Latency C++ & Algorithms', pitch: 1.1 },
  ];

  const handleToggleVoice = () => {
    if (isListening) {
      // Stop listening
      playSound('click');
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListening(false);
    } else {
      // Start listening
      playSound('click');
      setIsListening(true);

      const recognizer = createSpeechRecognizer(
        (transcript) => {
          handleUserSpeech(transcript);
        },
        () => setIsListening(false),
        (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        }
      );

      if (recognizer) {
        try {
          recognizer.start();
          recognizerRef.current = recognizer;
        } catch (e) {
          console.warn('Failed to start recognizer:', e);
        }
      } else {
        // Fallback simulation in iframe if mic is restricted
        setTimeout(() => {
          handleUserSpeech('In my last project, I redesigned our vector search pipeline to use Go and Redis with async batching, reducing p99 latency by 85%.');
        }, 1200);
      }
    }
  };

  const handleUserSpeech = async (speechText: string) => {
    setIsListening(false);
    playSound('agent');

    const newConv = [
      ...conversation,
      {
        role: 'user' as const,
        text: speechText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setConversation(newConv);

    // Call server AI for voice response
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Respond in 2-3 spoken conversational sentences as a senior technical interviewer to this candidate: "${speechText}"`,
          agent: 'agent-interview',
        }),
      });

      const data = await res.json();
      const aiReply = data.text || 'That is an exceptional architectural trade-off. How did you maintain consistency across replicas during network partitions?';

      setConversation((prev) => [
        ...prev,
        {
          role: 'ai' as const,
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      setIsSpeaking(true);
      speakText(aiReply, () => setIsSpeaking(false));
    } catch (err) {
      const fallbackReply = 'Excellent design choice. Could you elaborate on how you validated thread safety under concurrent writes?';
      setConversation((prev) => [
        ...prev,
        {
          role: 'ai' as const,
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsSpeaking(true);
      speakText(fallbackReply, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 flex items-center gap-1">
              <Radio className="w-3 h-3 text-pink-400" />
              NEURAL VOICE CONVERSATION LAB
            </span>
            <span className="text-xs font-mono text-slate-400">Low-Latency WebAudio Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Real-Time Conversational AI Voice Mode
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Simulate realistic interview dialogs with responsive voice turn-taking, synthesized speech audio, and real-time transcription.
          </p>
        </div>

        {/* Persona Switcher */}
        <select
          value={selectedVoice}
          onChange={(e) => {
            setSelectedVoice(e.target.value);
            playSound('click');
          }}
          className="text-xs bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-400"
        >
          {voicePersonas.map((p, idx) => (
            <option key={idx} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Holographic Audio Orb & Visualizer */}
      <div className="glass-panel p-8 rounded-3xl border border-pink-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.1)]">
        {/* Dynamic Background Aura */}
        <div className={`absolute w-72 h-72 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
          isSpeaking
            ? 'bg-pink-500/25 scale-125'
            : isListening
            ? 'bg-cyan-500/25 scale-110'
            : 'bg-purple-500/15 scale-90'
        }`} />

        {/* Animated Radial Waves Container */}
        <div className="relative my-8">
          {/* Concentric pulsing rings when active */}
          {(isSpeaking || isListening) && (
            <>
              <div className="absolute -inset-6 rounded-full border border-pink-400/30 animate-ping" />
              <div className="absolute -inset-12 rounded-full border border-cyan-400/20 animate-pulse" />
            </>
          )}

          {/* Core Interactive Voice Orb Button */}
          <button
            onClick={handleToggleVoice}
            className={`w-36 h-36 rounded-full relative z-10 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 ring-4 ring-cyan-400 shadow-[0_0_35px_#00f5ff]'
                : isSpeaking
                ? 'bg-gradient-to-tr from-pink-500 to-purple-600 ring-4 ring-pink-400 shadow-[0_0_35px_#f43f5e]'
                : 'bg-gradient-to-tr from-slate-900 to-purple-950 border border-white/20 hover:border-pink-400/50'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="w-10 h-10 text-white animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 text-slate-200 hover:text-white" />
            )}

            <span className="text-[10px] font-mono font-bold text-white mt-1 uppercase tracking-wider">
              {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Tap to Talk'}
            </span>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <Activity className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>
            {isListening
              ? 'Transcribing candidate speech...'
              : isSpeaking
              ? `${selectedVoice} is speaking...`
              : 'Microphone Standby • Click orb to begin conversation'}
          </span>
        </div>

        {/* Animated Sound Wave Bars */}
        <div className="flex items-center gap-1.5 mt-6 h-8">
          {Array.from({ length: 16 }).map((_, idx) => {
            const barHeight = isSpeaking || isListening
              ? `${Math.max(20, Math.sin(idx + Date.now()) * 100)}%`
              : '20%';

            return (
              <div
                key={idx}
                className="w-1 bg-gradient-to-t from-pink-500 to-cyan-400 rounded-full transition-all duration-150"
                style={{ height: barHeight }}
              />
            );
          })}
        </div>
      </div>

      {/* Real-time Conversation Log Feed */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            Live Voice Dialog Transcript
          </h3>
          <button
            onClick={() => {
              stopSpeaking();
              setConversation([]);
            }}
            className="text-xs font-mono text-slate-400 hover:text-white"
          >
            Clear Transcript
          </button>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
          {conversation.map((c, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border flex items-start gap-3 ${
                c.role === 'ai'
                  ? 'glass-panel border-pink-500/20 text-slate-200'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-100 ml-6'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                  c.role === 'ai' ? 'bg-pink-500/30 text-pink-300' : 'bg-cyan-500/30 text-cyan-300'
                }`}
              >
                {c.role === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>{c.role === 'ai' ? selectedVoice : 'Candidate (You)'}</span>
                  <span>{c.time}</span>
                </div>
                <p className="leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
