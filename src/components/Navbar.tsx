import React from 'react';
import { Terminal, Shield, Search } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onHomeClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#08090d]/90 backdrop-blur-md border-b border-[#181b24] px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onHomeClick}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400/20 via-[#12141c] to-emerald-400/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-wider text-white font-mono">
                MANTRA<span className="text-cyan-400">TOOLS</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                v2.6 FREE
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
              <span>tools.mantralabs.web.id</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Client-Side Engine
              </span>
            </div>
          </div>
        </div>

        {/* Center / Search Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12141c] hover:bg-[#181b26] border border-[#1e2230] text-slate-400 hover:text-slate-200 text-xs font-mono transition shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search any tool...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#090a0f] border border-[#252b3d] text-[10px] text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Privacy badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>Zero Server Uploads</span>
          </div>
        </div>
      </div>
    </header>
  );
};
