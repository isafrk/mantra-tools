import React, { useState } from 'react';
import { Type, Copy, Check } from 'lucide-react';

export const SlugCaseEngine: React.FC = () => {
  const [input, setInput] = useState<string>('Mantra Labs: Building Autonomous AI Workflows 2026!');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Conversions
  const toWords = (str: string): string[] => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);
  };

  const words = toWords(input);

  const kebabSlug = words.map(w => w.toLowerCase()).join('-');
  const camelCase = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  const pascalCase = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  const snakeCase = words.map(w => w.toLowerCase()).join('_');
  const screamingSnake = words.map(w => w.toUpperCase()).join('_');
  const titleCase = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  const sentenceCase = words.length > 0 ? (words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1).toLowerCase()) : '';
  const dotCase = words.map(w => w.toLowerCase()).join('.');
  const pathCase = words.map(w => w.toLowerCase()).join('/');

  const formats = [
    { key: 'slug', label: 'URL Kebab Slug', value: kebabSlug, desc: 'Clean SEO friendly URL' },
    { key: 'camel', label: 'camelCase', value: camelCase, desc: 'JavaScript variables & keys' },
    { key: 'pascal', label: 'PascalCase', value: pascalCase, desc: 'React Components & Classes' },
    { key: 'snake', label: 'snake_case', value: snakeCase, desc: 'Python & Database columns' },
    { key: 'screaming', label: 'SCREAMING_SNAKE', value: screamingSnake, desc: 'Environment variables & Constants' },
    { key: 'title', label: 'Title Case', value: titleCase, desc: 'Article headlines & Display titles' },
    { key: 'sentence', label: 'Sentence case', value: sentenceCase, desc: 'Standard readable UI sentences' },
    { key: 'dot', label: 'dot.case', value: dotCase, desc: 'Package namespaces & metric tags' },
    { key: 'path', label: 'path/case', value: pathCase, desc: 'Folder routing & directory pathing' },
  ];

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Type className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Case Converter & Clean Slug Engine</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time casing transformations for SEO slugs, programming variables, and database identifiers.
          </p>
        </div>
      </div>

      {/* Input Field */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4">
        <label className="text-xs font-mono uppercase text-slate-400 block mb-2">Input String</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste any text string here..."
          className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-4 py-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-emerald-500/50"
        />
        <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-500">
          <span>Words: {words.length}</span>
          <span>Chars: {input.length}</span>
          <span>Bytes: {new Blob([input]).size} B</span>
        </div>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {formats.map((fmt) => (
          <div key={fmt.key} className="bg-[#12141c] border border-[#1e2230] rounded-xl p-3.5 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-bold">{fmt.label}</span>
                <button
                  onClick={() => handleCopy(fmt.key, fmt.value)}
                  className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded bg-[#1a1e2b] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-[#262c3e] transition"
                >
                  {copiedKey === fmt.key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === fmt.key ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</p>
            </div>
            <div className="bg-[#090a0f] border border-[#1e2230] rounded-lg p-2 font-mono text-xs text-slate-200 truncate select-all">
              {fmt.value || <span className="text-slate-600">—</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
