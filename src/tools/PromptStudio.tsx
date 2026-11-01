import React, { useState } from 'react';
import { Copy, Check, Sparkles, Trash2, Download, Layers, Wand2 } from 'lucide-react';

const STYLE_PRESETS = [
  { name: 'Cinematic 8K', prefix: 'Cinematic wide angle still,', suffix: 'shot on 35mm lens, volumetric lighting, photorealistic, 8k resolution' },
  { name: 'Dark Cyberpunk', prefix: 'Cyberpunk dystopian scene,', suffix: 'neon reflections in wet pavement, volumetric fog, octane render, unreal engine 5' },
  { name: 'Analog Film', prefix: 'Vintage 1970s film photograph,', suffix: 'Kodak Portra 400 grain, warm cinematic color grading, raw candid' },
  { name: 'Isometric 3D', prefix: 'Low-poly isometric 3D diorama of', suffix: 'clean pastel lighting, soft shadows, blender render, trending on artstation' },
  { name: 'Macro Biological', prefix: 'Hyper-detailed macro closeup shot of', suffix: 'focus stacking, delicate organic textures, soft rim lighting, national geographic' },
];

export const PromptStudio: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [ar, setAr] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const [stylize, setStylize] = useState<string>('');
  const [noElements, setNoElements] = useState<string>('');
  const [chunkSize, setChunkSize] = useState<number>(50);
  const [copiedBatch, setCopiedBatch] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Process lines
  const rawLines = input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // Strip numbering (1., 1), etc)
  const cleanPrompts = rawLines.map(line => {
    let cleaned = line.replace(/^(\d+[\.\-\)]\s*)+/, '').trim();
    if (prefix.trim()) cleaned = `${prefix.trim()} ${cleaned}`;
    if (suffix.trim()) cleaned = `${cleaned}, ${suffix.trim()}`;
    if (noElements.trim()) cleaned = `${cleaned} --no ${noElements.trim()}`;
    if (ar.trim()) cleaned = `${cleaned} --ar ${ar.trim()}`;
    if (version.trim()) cleaned = `${cleaned} --v ${version.trim()}`;
    if (stylize.trim()) cleaned = `${cleaned} --s ${stylize.trim()}`;
    return cleaned;
  });

  // Unique prompts
  const uniquePrompts = Array.from(new Set(cleanPrompts));

  // Chunks
  const batches: string[][] = [];
  for (let i = 0; i < uniquePrompts.length; i += chunkSize) {
    batches.push(uniquePrompts.slice(i, i + chunkSize));
  }

  const applyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    setPrefix(preset.prefix);
    setSuffix(preset.suffix);
  };

  const handleCopyBatch = (batchIdx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBatch(batchIdx);
    setTimeout(() => setCopiedBatch(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uniquePrompts.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([uniquePrompts.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mantra_prompts_${uniquePrompts.length}_items.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">AI Prompt Splitter & Formatter</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Clean, parameterize, batch-split, and export prompts for Midjourney, Flux, SDXL, and Nano Banana.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInput(
                "1. cybernetic shaman meditating inside bioluminescent rain forest, floating neon glyphs\n" +
                "2. retro-futuristic arcade in Tokyo year 2088, volumetric fog, Kodak Portra\n" +
                "3. hyper-detailed macro shot of biomechanical dragonfly wing, gold leaf inlays\n" +
                "4. brutalist concrete monolith rising out of misty black ocean, moody overcast"
              );
            }}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-300 border border-[#262c3e] transition"
          >
            Load Sample
          </button>
          <button
            onClick={() => {
              setInput('');
              setPrefix('');
              setSuffix('');
            }}
            className="p-1.5 rounded-lg bg-[#1a1e2b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#262c3e] transition"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and Parameters */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Raw Input Prompts (One per line)
              </label>
              <span className="text-xs font-mono text-cyan-400">
                {rawLines.length} lines detected
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your raw prompts here...\n1. Cyberpunk street market\n2. Moody atmospheric interior\n3. Vintage astronaut portrait"
              rows={10}
              className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-y"
            />
          </div>

          {/* Quick Style Presets */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-mono uppercase text-slate-400">
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              Quick Style Preset Injectors
            </div>
            <div className="flex flex-wrap gap-2">
              {STYLE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-[#090a0f] hover:bg-[#1a1e2b] text-slate-300 border border-[#1e2230] hover:border-cyan-500/40 transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parameter Injectors */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Bulk Parameter Injection
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Prefix (e.g. "cinematic still,")</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="Masterpiece, 8k..."
                  className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Suffix (e.g. "photorealistic, 35mm")</label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="unreal engine 5, octane render..."
                  className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Aspect Ratio</label>
                <select
                  value={ar}
                  onChange={(e) => setAr(e.target.value)}
                  className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="">None</option>
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Shorts/Reels)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Portrait)</option>
                  <option value="21:9">21:9 (Ultrawide)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Engine / Version</label>
                <select
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="">None</option>
                  <option value="6.1">v 6.1 (Midjourney)</option>
                  <option value="6.0">v 6.0</option>
                  <option value="5.2">v 5.2</option>
                  <option value="raw">Style Raw</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Stylize (--s)</label>
                <input
                  type="text"
                  value={stylize}
                  onChange={(e) => setStylize(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Chunk Size</label>
                <select
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                  className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                >
                  <option value={10}>10 per batch</option>
                  <option value={25}>25 per batch</option>
                  <option value={50}>50 per batch</option>
                  <option value={100}>100 per batch</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Negative filter (--no)</label>
              <input
                type="text"
                value={noElements}
                onChange={(e) => setNoElements(e.target.value)}
                placeholder="text, watermark, blurry, deformed fingers"
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output & Batch Manager */}
        <div className="lg:col-span-5 space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Total Prompts</span>
              <p className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{uniquePrompts.length}</p>
            </div>
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Batches</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{batches.length}</p>
            </div>
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Duplicates Cut</span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                {rawLines.length - uniquePrompts.length}
              </p>
            </div>
          </div>

          {/* Action Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Processed Batches ({batches.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                disabled={uniquePrompts.length === 0}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition disabled:opacity-50"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy All
              </button>
              <button
                onClick={handleDownloadTxt}
                disabled={uniquePrompts.length === 0}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-200 border border-[#262c3e] transition disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                .TXT
              </button>
            </div>
          </div>

          {/* Batches List */}
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {batches.length === 0 ? (
              <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-8 text-center text-slate-500 text-sm">
                No prompts to display. Paste raw lines on the left or click Load Sample.
              </div>
            ) : (
              batches.map((batch, idx) => {
                const batchText = batch.join('\n');
                return (
                  <div key={idx} className="bg-[#12141c] border border-[#1e2230] rounded-xl p-3.5">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1e2230]">
                      <span className="text-xs font-mono font-medium text-slate-300">
                        Batch #{idx + 1} ({batch.length} items)
                      </span>
                      <button
                        onClick={() => handleCopyBatch(idx, batchText)}
                        className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded bg-[#1a1e2b] hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-[#262c3e] transition"
                      >
                        {copiedBatch === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Batch</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-slate-400 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                      {batchText}
                    </pre>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
