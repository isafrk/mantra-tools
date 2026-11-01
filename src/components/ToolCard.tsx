import React from 'react';
import { ArrowRight, Sparkles, Tag, FileText, Smartphone, Zap, ShieldCheck, Code, Share2, Type, SplitSquareVertical, Shield } from 'lucide-react';
import type { ToolItem } from '../types';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (id: string) => void;
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

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const IconComp = ICON_MAP[tool.iconName] || Sparkles;

  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="bg-[#10121a] hover:bg-[#151824] border border-[#1c202d] hover:border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-cyan-500/5 relative overflow-hidden"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2.5 rounded-xl bg-[#161925] border border-[#222738] text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/50 transition">
            <IconComp className="w-5 h-5" />
          </div>
          {tool.badge && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {tool.badge}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 font-mono tracking-wide transition">
            {tool.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#181c26] flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-[10px] font-mono text-slate-500 bg-[#0a0b10] px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-slate-400 group-hover:text-cyan-400 transition">
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
        </div>
      </div>
    </div>
  );
};
