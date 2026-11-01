import React, { useState } from 'react';
import { Tag, Copy, Check, Download, Plus, X, AlertCircle } from 'lucide-react';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Technology & AI': [
    'artificial intelligence', 'machine learning', 'cyberpunk', 'futuristic', 'neural network',
    'quantum computing', 'data center', 'algorithm', 'hardware', 'motherboard', 'fiber optics',
    'cyber security', 'cloud computing', 'cryptocurrency', 'blockchain', 'deep learning',
    'nanotechnology', 'server room', 'supercomputer', 'automation', 'robotics', 'virtual reality',
    'augmented reality', 'digital transformation', 'microchip', 'semiconductor', 'glowing', 'neon'
  ],
  'Business & Finance': [
    'business', 'corporate', 'finance', 'investment', 'success', 'strategy', 'leadership',
    'market analysis', 'stock market', 'analytics', 'growth', 'economy', 'fintech', 'banking',
    'professional', 'teamwork', 'office', 'career', 'startup', 'management', 'global trading',
    'consulting', 'executive', 'profit', 'revenue', 'financial chart', 'enterprise'
  ],
  'Industrial & Science': [
    'laboratory', 'science', 'chemistry', 'research', 'experiment', 'industrial', 'engineering',
    'biotechnology', 'medicine', 'pharmaceutical', 'scientific', 'equipment', 'manufacturing',
    'factory', 'automation', 'precision', 'cryogenic', 'optics', 'laser', 'cleanroom'
  ],
  'Abstract & 3D': [
    'abstract', '3d render', 'geometric', 'minimalist', 'wallpaper', 'background', 'isolated',
    'copy space', 'nobody', 'cinematic lighting', 'fluid art', 'cgi', 'isometric', 'high angle',
    'depth of field', 'macro shot', 'vibrant', 'dark background', 'futuristic architecture'
  ],
  'Nature & Environment': [
    'nature', 'environment', 'ecology', 'sustainability', 'renewable energy', 'green technology',
    'landscape', 'wilderness', 'ocean', 'forest', 'atmosphere', 'climate change', 'clean energy',
    'solar power', 'wind turbine', 'conservation', 'biodiversity', 'natural resources'
  ]
};

export const MicrostockKeywords: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Technology & AI');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [copiedTags, setCopiedTags] = useState<boolean>(false);
  

  const addTag = (newTag: string) => {
    const cleaned = newTag.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '');
    if (cleaned && !tags.includes(cleaned) && tags.length < 50) {
      setTags(prev => [...prev, cleaned]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInput) {
        addTag(tagInput);
        setTagInput('');
      }
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const extractFromText = () => {
    const combined = `${title} ${description}`.toLowerCase();
    const words = combined
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
    
    // Stop words
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'were', 'which',
      'about', 'into', 'over', 'after', 'will', 'there', 'their', 'what', 'when', 'make'
    ]);
    const meaningful = words.filter(w => !stopWords.has(w));
    
    // Add words
    const unique = Array.from(new Set(meaningful));
    const merged = Array.from(new Set([...tags, ...unique])).slice(0, 50);
    setTags(merged);
  };

  const addCategoryPreset = () => {
    const preset = CATEGORY_KEYWORDS[category] || [];
    const merged = Array.from(new Set([...tags, ...preset])).slice(0, 50);
    setTags(merged);
  };

  const copyTagsString = () => {
    navigator.clipboard.writeText(tags.join(', '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const exportCSV = () => {
    const headers = ['Filename', 'Title', 'Description', 'Keywords', 'Category'];
    const row = [
      `asset_${Date.now()}`,
      `"${title.replace(/"/g, '""')}"`,
      `"${description.replace(/"/g, '""')}"`,
      `"${tags.join(', ')}"`,
      `"${category}"`
    ];
    const csvContent = headers.join(',') + '\n' + row.join(',');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `microstock_metadata_${tags.length}_tags.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Tag className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Microstock Keyword & Metadata Studio</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Build strict 50-tag SEO clusters, auto-extract keywords, and export metadata CSV for Adobe Stock, Shutterstock, and Freepik.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTitle('Futuristic Quantum Computer Core Glowing In Dark Laboratory');
              setDescription('Cinematic 4K render of advanced quantum supercomputer with illuminated cryogenic processors, holographic waveguides and fiber optic wiring in a research data center.');
              setTags([
                'quantum computer', 'supercomputer', 'server room', 'data center', 'technology',
                'artificial intelligence', 'cyberpunk', 'futuristic', 'laboratory', 'cryogenic',
                'glowing', 'fiber optics', 'hardware', 'cyber security', 'cloud computing',
                'research', 'nanotechnology', 'motherboard', '4k resolution', 'nobody',
                'copy space', 'isolated background', 'cinematic lighting', 'high angle shot'
              ]);
            }}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-300 border border-[#262c3e] transition"
          >
            Load Sample
          </button>
          <button
            onClick={() => {
              setTitle('');
              setDescription('');
              setTags([]);
            }}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#262c3e] transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Metadata */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-slate-400">Asset Title</label>
                <span className="text-[11px] font-mono text-slate-500">{title.length} chars (Target 40-70)</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Autonomous AI Drone Swarm Scanning City..."
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-slate-400">Description / Caption</label>
                <span className="text-[11px] font-mono text-slate-500">{description.length} chars</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full contextual description detailing subject, angle, lighting, and concept..."
                rows={4}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Stock Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
                >
                  {Object.keys(CATEGORY_KEYWORDS).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 self-end">
                <button
                  onClick={extractFromText}
                  disabled={!title && !description}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition disabled:opacity-40"
                >
                  Auto-Extract
                </button>
                <button
                  onClick={addCategoryPreset}
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-cyan-400 border border-[#262c3e] transition"
                >
                  + Add Category Pack
                </button>
              </div>
            </div>
          </div>

          {/* Quick Suggestions from Category */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4">
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center justify-between">
              <span>{category} High-Traffic Tags</span>
              <span className="text-[10px] text-slate-500">Click to add</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {(CATEGORY_KEYWORDS[category] || []).map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => addTag(s)}
                  disabled={tags.includes(s) || tags.length >= 50}
                  className="text-xs font-mono px-2 py-1 rounded bg-[#090a0f] hover:bg-[#1a1e2b] text-slate-300 border border-[#1e2230] hover:border-emerald-500/40 transition disabled:opacity-40"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tags Cluster & Export */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-400">Keyword Cluster</span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                  tags.length > 50
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : tags.length >= 30
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {tags.length} / 50 Tags
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyTagsString}
                  disabled={tags.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition disabled:opacity-40"
                >
                  {copiedTags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Comma Tags
                </button>
                <button
                  onClick={exportCSV}
                  disabled={tags.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-200 border border-[#262c3e] transition disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {/* Input tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type tag and press Enter or comma..."
                className="flex-1 bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                onClick={() => {
                  if (tagInput) {
                    addTag(tagInput);
                    setTagInput('');
                  }
                }}
                className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-emerald-400 border border-[#262c3e]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Tags Box */}
            <div className="min-h-[220px] max-h-[340px] overflow-y-auto bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 flex flex-wrap gap-1.5 content-start">
              {tags.length === 0 ? (
                <div className="w-full text-center text-slate-600 text-xs py-12">
                  No tags added yet. Type tags above, click Auto-Extract, or select from category pack.
                </div>
              ) : (
                tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161a24] text-slate-200 text-xs border border-[#252b3a] hover:border-emerald-500/40 transition group"
                  >
                    <span className="text-[10px] text-slate-500 font-mono">{idx + 1}</span>
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(idx)}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {tags.length > 50 && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>You exceeded the 50 keyword threshold! Adobe Stock will reject files with more than 50 tags.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
