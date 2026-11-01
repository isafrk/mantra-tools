import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles, Tag, FileText, Smartphone, Zap, ShieldCheck, Code, Share2, Type, SplitSquareVertical, Shield } from 'lucide-react';
import type { ToolItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onSelectTool: (id: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Tag,
  FileText,
  Smartphone,
  Zap,
  ShieldCheck,
  Code,
  Share2,
  Type,
  SplitSquareVertical,
  Shield,
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, tools, onSelectTool }) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = tools.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl bg-[#10121a] border border-[#1e2230] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[#1e2230]">
          <Search className="w-5 h-5 text-cyan-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type tool name, format, or keyword (e.g. srt, exif, prompt, favicon)..."
            className="w-full bg-transparent text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              No micro-tools found matching "{query}"
            </div>
          ) : (
            filtered.map((tool) => {
              const IconComp = ICON_MAP[tool.iconName] || Sparkles;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#181b26] transition text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#141722] border border-[#1e2230] text-cyan-400 group-hover:border-cyan-500/40 transition">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono text-slate-200 group-hover:text-cyan-400 transition">
                        {tool.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{tool.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#0a0b10] border-t border-[#1e2230] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>{filtered.length} micro-tools indexed</span>
          <div className="flex gap-2">
            <span>[Esc] Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
