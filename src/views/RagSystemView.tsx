import React, { useState } from 'react';
import {
  Database,
  Search,
  FileText,
  Sparkles,
  Plus,
  Upload,
  ArrowRight,
  Layers,
  Zap,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { RagDocument } from '../types';
import { INITIAL_RAG_DOCS } from '../data/mockData';
import { playSound } from '../utils/audio';

export const RagSystemView: React.FC = () => {
  const [docs, setDocs] = useState<RagDocument[]>(INITIAL_RAG_DOCS);
  const [query, setQuery] = useState('How to handle cache stampede in distributed systems?');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  // New Document modal/state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('System Design');
  const [showAddDoc, setShowAddDoc] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    playSound('agent');
    setIsSearching(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setSearchResults(data.results || []);
      setAiAnswer(data.answer || 'Semantic retrieval converged.');
      playSound('success');
    } catch (err) {
      console.error('RAG search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    playSound('success');
    const newDoc: RagDocument = {
      id: `rag-doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      content: newContent,
      similarityScore: 0.95,
      tokens: Math.floor(newContent.split(' ').length * 1.3),
      updatedAt: 'Just now',
    };

    setDocs((prev) => [newDoc, ...prev]);
    setNewTitle('');
    setNewContent('');
    setShowAddDoc(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" />
              PINECONE & HYBRID VECTOR RAG
            </span>
            <span className="text-xs font-mono text-slate-400">Embedding Model: text-embedding-004</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Knowledge Base Semantic Vector Retrieval
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Index interview notes, system design blueprints, and behavioral stories into high-dimensional vector embeddings for low-latency contextual synthesis.
          </p>
        </div>

        <button
          onClick={() => {
            playSound('click');
            setShowAddDoc(!showAddDoc);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddDoc ? 'Close Ingestion Form' : 'Ingest Document / Note'}</span>
        </button>
      </div>

      {/* Ingest Document Modal / Panel */}
      {showAddDoc && (
        <form onSubmit={handleAddDocument} className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-400" />
            Embed New Candidate Knowledge Chunk
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-1">Document Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus: Raft vs Paxos"
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-1">Domain Taxonomy</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="System Design">System Design</option>
                <option value="DSA Patterns">DSA Patterns</option>
                <option value="Behavioral Leadership">Behavioral Leadership</option>
                <option value="Database Engineering">Database Engineering</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-300 block mb-1">Source Text Content</label>
            <textarea
              rows={4}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Paste notes, cheat sheets, or architecture diagrams..."
              className="w-full p-3 bg-slate-900 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddDoc(false)}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono"
            >
              Generate Embedding Vector & Save
            </button>
          </div>
        </form>
      )}

      {/* Semantic Vector Search Input */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query vector database across all your notes and cheat sheets..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl text-xs sm:text-sm text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.25)] transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSearching ? 'Vector Querying...' : 'Semantic Search'}</span>
          </button>
        </form>

        {/* Suggested Quick Vector Queries */}
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 overflow-x-auto pb-1">
          <span className="text-[10px] font-mono shrink-0">Try Query:</span>
          {[
            'Explain cache stampede prevention',
            'When to choose LSM Trees over B-Trees',
            'STAR format conflict resolution story',
          ].map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white shrink-0 text-xs transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* AI Synthesis Answer from Retrieved Chunks */}
      {aiAnswer && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/10 shadow-xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white">
                RAG Synthesized Answer (Gemini 3.8 Flash + Retrieved Embeddings)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-300">Confidence: 98.4%</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pt-2 whitespace-pre-wrap">
            {aiAnswer}
          </p>
        </div>
      )}

      {/* Indexed Document Chunks Grid */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Indexed Document Knowledge Store ({docs.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">Pinecone Serverless Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-white/5 hover:border-cyan-500/30 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-cyan-300 uppercase">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  Cosine: {(doc.similarityScore * 100).toFixed(0)}%
                </span>
              </div>

              <h4 className="text-xs font-bold text-white leading-snug">{doc.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed font-mono">
                {doc.content}
              </p>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{doc.tokens} Tokens</span>
                <span>{doc.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
