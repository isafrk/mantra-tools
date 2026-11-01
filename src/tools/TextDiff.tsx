import React, { useState } from 'react';
import { SplitSquareVertical, ArrowLeftRight, Trash2 } from 'lucide-react';

interface DiffLine {
  type: 'same' | 'added' | 'removed' | 'empty';
  leftLine?: number;
  rightLine?: number;
  leftText?: string;
  rightText?: string;
}

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

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute Longest Common Subsequence (LCS) for accurate diff alignment
  const computeLcsDiff = (origStr: string, modStr: string): DiffLine[] => {
    const origLines = origStr.split('\n');
    const modLines = modStr.split('\n');

    const m = origLines.length;
    const n = modLines.length;

    // LCS Table
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (origLines[i] === modLines[j]) {
          dp[i + 1][j + 1] = dp[i][j] + 1;
        } else {
          dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    // Backtrack to build aligned diff
    let i = m;
    let j = n;
    const rawDiff: { type: 'same' | 'added' | 'removed'; origIdx?: number; modIdx?: number; text: string }[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
        rawDiff.unshift({ type: 'same', origIdx: i, modIdx: j, text: origLines[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        rawDiff.unshift({ type: 'added', modIdx: j, text: modLines[j - 1] });
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        rawDiff.unshift({ type: 'removed', origIdx: i, text: origLines[i - 1] });
        i--;
      }
    }

    // Transform raw diff into aligned side-by-side rows
    const rows: DiffLine[] = [];
    let p = 0;
    while (p < rawDiff.length) {
      const item = rawDiff[p];
      if (item.type === 'same') {
        rows.push({
          type: 'same',
          leftLine: item.origIdx,
          rightLine: item.modIdx,
          leftText: item.text,
          rightText: item.text
        });
        p++;
      } else if (item.type === 'removed') {
        // Check if next is added to pair them on the same visual line
        if (p + 1 < rawDiff.length && rawDiff[p + 1].type === 'added') {
          rows.push({
            type: 'removed',
            leftLine: item.origIdx,
            rightLine: rawDiff[p + 1].modIdx,
            leftText: item.text,
            rightText: rawDiff[p + 1].text
          });
          p += 2;
        } else {
          rows.push({
            type: 'removed',
            leftLine: item.origIdx,
            leftText: item.text,
            rightText: ''
          });
          p++;
        }
      } else if (item.type === 'added') {
        rows.push({
          type: 'added',
          rightLine: item.modIdx,
          leftText: '',
          rightText: item.text
        });
        p++;
      }
    }

    return rows;
  };

  const diffRows = computeLcsDiff(original, modified);

  const additions = diffRows.filter(r => r.type === 'added' || (r.type === 'removed' && r.rightText)).length;
  const deletions = diffRows.filter(r => r.type === 'removed').length;

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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
            Real Longest Common Subsequence (LCS) side-by-side visual diff. Detects additions, modifications, and line shifts.
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
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-400">Original Text (Before)</label>
            <button
              onClick={() => handleCopy('orig', original)}
              className="text-[11px] font-mono text-slate-500 hover:text-cyan-400 transition"
            >
              {copiedKey === 'orig' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            rows={8}
            placeholder="Paste original code or text..."
            className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-y"
          />
        </div>

        <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-400">Modified Text (After)</label>
            <button
              onClick={() => handleCopy('mod', modified)}
              className="text-[11px] font-mono text-slate-500 hover:text-cyan-400 transition"
            >
              {copiedKey === 'mod' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            rows={8}
            placeholder="Paste revised code or text..."
            className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-y"
          />
        </div>
      </div>

      {/* Side-by-side Aligned Visual Diff */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1e2230] flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-slate-300 font-bold">Aligned Visual Diff</span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                +{additions} lines
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                -{deletions} lines
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {diffRows.length} total aligned rows
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 font-mono text-xs overflow-x-auto max-h-[500px] overflow-y-auto">
          {/* Left Aligned Column */}
          <div className="space-y-0.5 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230]">
            <div className="text-[10px] text-slate-500 uppercase pb-1 mb-1 border-b border-[#181c26]">Original Document</div>
            {diffRows.map((row, i) => {
              const isRemoved = row.type === 'removed';
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-2 py-0.5 rounded min-h-[20px] ${
                    isRemoved
                      ? 'bg-red-500/15 text-red-300 border-l-2 border-red-500'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 w-6 select-none shrink-0 text-right">
                    {row.leftLine ?? ''}
                  </span>
                  <span className="whitespace-pre-wrap break-all">{row.leftText || (row.type === 'added' ? ' ' : '')}</span>
                </div>
              );
            })}
          </div>

          {/* Right Aligned Column */}
          <div className="space-y-0.5 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230]">
            <div className="text-[10px] text-slate-500 uppercase pb-1 mb-1 border-b border-[#181c26]">Modified Document</div>
            {diffRows.map((row, i) => {
              const isAdded = row.type === 'added' || (row.type === 'removed' && row.rightText);
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-2 py-0.5 rounded min-h-[20px] ${
                    isAdded
                      ? 'bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-500'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="text-[10px] text-slate-600 w-6 select-none shrink-0 text-right">
                    {row.rightLine ?? ''}
                  </span>
                  <span className="whitespace-pre-wrap break-all">{row.rightText || (row.type === 'removed' ? ' ' : '')}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
