import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Download,
  Trash2,
  Volume2,
  Copy,
  Check,
  Zap,
  CornerDownLeft,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { AgentInfo, ChatMessage } from '../types';
import { playSound, speakText, stopSpeaking } from '../utils/audio';

interface CareerAssistantViewProps {
  activeAgent: AgentInfo;
  agents: AgentInfo[];
  onSelectAgent: (agent: AgentInfo) => void;
}

export const CareerAssistantView: React.FC<CareerAssistantViewProps> = ({
  activeAgent,
  agents,
  onSelectAgent,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      role: 'assistant',
      content: `### ⚡ Zentrix Neural Core Activated\n\nI am the **${activeAgent.name}** (${activeAgent.role}). My inference parameters are primed for Tier-1 technology career acceleration.\n\nHow can I advance your career strategy today? You can inquire about:\n- **Salary negotiations** and equity packages for L5/L6 senior roles\n- **Engineering interview strategies** for high-growth AI unicorn startups\n- **Targeted architectural portfolio reviews** to pass engineering director screens`,
      agentId: activeAgent.id,
      timestamp: 'Just now',
      model: 'gemini-3.8-flash',
      suggestedPrompts: [
        'How do I negotiate a $250k+ base salary at Tier-1 AI labs?',
        'What are the top 3 architectural weaknesses that fail FAANG L6 screens?',
        'Break down the optimal 30-day preparation sprint for Anthropic / OpenAI.',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    playSound('click');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          agent: activeAgent.id,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      playSound('agent');

      const content = data.text || (data.details ? `> ⚠️ **Service Notice**: *${data.error || 'Rate Limit Reached'}*\n\n${data.details}\n\n*Please try again in a few moments.*` : '### 💡 Response Received\n\nInference complete. Continue with your career preparation query.');

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content,
        agentId: activeAgent.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || 'zentrix-autonomous-engine',
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        role: 'assistant',
        content: `### ⚡ Autonomous Neural Routing Engaged\n\nAPI rate limit reached or network reconnecting. Zentrix local autonomous engine is available to answer your technical, DSA, resume, and career questions.`,
        agentId: activeAgent.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'zentrix-autonomous-core',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    playSound('click');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    stopSpeaking();
    setSpeakingId(id);
    // Strip markdown formatting for cleaner speech synthesis
    const cleanText = text.replace(/[#*`_\[\]]/g, '');
    speakText(cleanText, () => setSpeakingId(null));
  };

  const handleExportChat = () => {
    playSound('click');
    const content = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()} (${m.agentId || 'User'}):\n${m.content}\n\n`)
      .join('---\n\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zentrix-${activeAgent.id}-chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearChat = () => {
    playSound('click');
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in">
      {/* Top Chat Bar */}
      <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeAgent.avatarColor} p-[1px] shadow-lg flex items-center justify-center`}>
            <div className="w-full h-full bg-[#070b1e] rounded-[11px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-sm text-white">{activeAgent.name}</h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {activeAgent.model}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono truncate max-w-sm sm:max-w-md">
              {activeAgent.role} • Conversation Memory Active
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Agent Switcher Dropdown in View */}
          <select
            value={activeAgent.id}
            onChange={(e) => {
              const selected = agents.find((a) => a.id === e.target.value);
              if (selected) {
                playSound('agent');
                onSelectAgent(selected);
              }
            }}
            className="text-xs bg-slate-900 border border-white/15 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                Switch: {ag.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportChat}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-cyan-500/30 transition-all"
            title="Export Markdown Log"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                  isUser
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950'
                    : `bg-gradient-to-tr ${activeAgent.avatarColor} text-white`
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`group relative rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-slate-100 rounded-tr-sm'
                    : 'glass-panel border border-white/10 text-slate-200 rounded-tl-sm shadow-xl'
                }`}
              >
                {/* Markdown text representation */}
                <div className="space-y-2 whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                {/* Suggested Prompts Pill Container if present */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                    <p className="text-[10px] font-mono text-cyan-300 uppercase tracking-wider font-bold">
                      Recommended Strategic Prompts:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {msg.suggestedPrompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-left text-xs p-2 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-slate-300 hover:text-cyan-200 transition-all flex items-center justify-between group/prompt"
                        >
                          <span>{prompt}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/prompt:text-cyan-400 group-hover/prompt:translate-x-1 transition-all shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bubble Footer & Actions */}
                <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>{msg.timestamp}</span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className={`p-1 rounded hover:bg-white/10 ${
                          speakingId === msg.id ? 'text-cyan-400 animate-pulse' : 'text-slate-400'
                        }`}
                        title="Play Speech Audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyText(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-200"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-lg">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeAgent.avatarColor} text-white flex items-center justify-center shrink-0`}>
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-panel p-3.5 rounded-2xl rounded-tl-sm border border-white/10 flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-300">Neural inference running</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${activeAgent.name} anything about engineering growth, system design, or placement...`}
              disabled={isTyping}
              className="w-full pl-4 pr-10 py-3 bg-slate-900/90 border border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 hidden sm:block">
              Return ↵
            </div>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,245,255,0.25)] transition-all shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
