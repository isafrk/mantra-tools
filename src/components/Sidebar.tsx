import React from 'react';
import { LayoutGrid, Sparkles, Image, Terminal, ChevronRight } from 'lucide-react';
import type { ToolCategory, ToolItem } from '../types';

interface SidebarProps {
  currentCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  selectedToolId: string | null;
  onSelectTool: (id: string | null) => void;
  tools: ToolItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onSelectCategory,
  selectedToolId,
  onSelectTool,
  tools
}) => {
  const categories = [
    { id: 'all', label: 'All Tools Hub', icon: LayoutGrid, count: tools.length },
    { id: 'ai-creator', label: 'AI & Creator', icon: Sparkles, count: tools.filter(t => t.category === 'ai-creator').length },
    { id: 'media-assets', label: 'Media & Assets', icon: Image, count: tools.filter(t => t.category === 'media-assets').length },
    { id: 'developer-text', label: 'Web & Dev Ops', icon: Terminal, count: tools.filter(t => t.category === 'developer-text').length },
  ];

  return (
    <aside className={`w-full lg:w-64 shrink-0 space-y-5 ${selectedToolId ? 'hidden lg:block' : 'block'}`}>
      {/* Category Navigation */}
      <div className="bg-[#0f1118] border border-[#1b1f2b] rounded-2xl p-3 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1.5 block">
          Tool Categories
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = currentCategory === cat.id && !selectedToolId;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id as ToolCategory);
                  onSelectTool(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-bold shadow-[0_0_12px_rgba(0,240,255,0.08)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151822]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#181c28] text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Launch List */}
      <div className="bg-[#0f1118] border border-[#1b1f2b] rounded-2xl p-3 space-y-1 hidden sm:block">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 py-1.5 block">
          Quick Launch Bench
        </span>
        <div className="space-y-0.5 max-h-[380px] overflow-y-auto pr-1">
          {tools.map((t) => {
            const isSelected = selectedToolId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-left transition ${
                  isSelected
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#151822]'
                }`}
              >
                <span className="truncate">{t.shortTitle}</span>
                {isSelected && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sovereign Client Guarantee */}
      <div className="bg-[#0b0c12] border border-[#171a24] rounded-2xl p-4 text-[11px] font-mono text-slate-500 space-y-2">
        <div className="text-slate-300 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Sovereign Browser Runtime
        </div>
        <p className="leading-relaxed">
          Zero data transmitted to backend servers. Canvas rendering, regex tokenization, and Web Crypto execute 100% inside your browser sandbox.
        </p>
      </div>
    </aside>
  );
};
