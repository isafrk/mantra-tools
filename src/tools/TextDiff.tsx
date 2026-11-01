import React, { useState } from 'react';
import { SplitSquareVertical, ArrowLeftRight, Trash2 } from 'lucide-react';

export const TextDiff: React.FC = () => {
  const [original, setOriginal] = useState<string>(
`function calculateScore(user) {
  let score = 0;
  if (user.isVerified) {
    score += 10;
  }
  return score;
}`
  );

  const [modified, setModified] = useState<string>(
`function calculateScore(user) {
  let score = 0;
  if (user.isVerified && user.hasActiveSubscription) {
    score += 25;
  }
  return score * 1.5;
}`
  );

  // diff state

  // Line-by-line simple diff
  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const maxLines = Math.max(origLines.length, modLines.length);

  const swap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <SplitSquareVertical className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Code & Text Diff Studio</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Compare two versions of code, prompts, or documents side-by-side with real-time change detection.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={swap}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-300 border border-[#262c3e] transition"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
            Swap Sides
          </button>
          <button
            onClick={() => {
              setOriginal('');
              setModified('');
            }}
            className="p-1.5 rounded-lg bg-[#1a1e2b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#262c3e] transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
          <label className="text-xs font-mono uppercase text-slate-400 block">Original Text (Before)</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={10}
            className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-y"
          />
        </div>

        <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
          <label className="text-xs font-mono uppercase text-slate-400 block">Modified Text (After)</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            rows={10}
            className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-y"
          />
        </div>
      </div>

      {/* Side-by-side Visual Diff */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1e2230]">
          <span className="text-xs font-mono uppercase text-slate-400">Side-by-Side Comparison</span>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400"></span> Removed
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Added
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 font-mono text-xs overflow-x-auto">
          {/* Left: Original Diff */}
          <div className="space-y-1 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230]">
            {Array.from({ length: maxLines }).map((_, i) => {
              const origLine = origLines[i] ?? '';
              const modLine = modLines[i] ?? '';
              const isDifferent = origLine !== modLine;

              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-2 py-0.5 rounded ${
                    isDifferent && origLine
                      ? 'bg-red-500/15 text-red-300'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 w-6 select-none">{i + 1}</span>
                  <span className="whitespace-pre-wrap">{origLine || ' '}</span>
                </div>
              );
            })}
          </div>

          {/* Right: Modified Diff */}
          <div className="space-y-1 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230]">
            {Array.from({ length: maxLines }).map((_, i) => {
              const origLine = origLines[i] ?? '';
              const modLine = modLines[i] ?? '';
              const isDifferent = origLine !== modLine;

              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-2 py-0.5 rounded ${
                    isDifferent && modLine
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 w-6 select-none">{i + 1}</span>
                  <span className="whitespace-pre-wrap">{modLine || ' '}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
