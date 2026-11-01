import React, { useState } from 'react';
import { Share2, Globe, Copy, Check, MessageSquare } from 'lucide-react';

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 23.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const OgPreviewer: React.FC = () => {
  const [title, setTitle] = useState<string>('Mantra Labs | Autonomous High-Tech Systems');
  const [description, setDescription] = useState<string>('Engineering high-throughput automated workflows, algorithmic pipelines, and sovereign digital infrastructures.');
  const [url, setUrl] = useState<string>('https://mantralabs.web.id');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [activeTab, setActiveTab] = useState<'twitter' | 'discord' | 'google'>('twitter');
  const [copiedMeta, setCopiedMeta] = useState<boolean>(false);

  const metaTagsCode = 
`<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Share2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Social OpenGraph & Card Simulator</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Preview live link sharing cards across Twitter/X, Discord, and Google SERP search results.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Page Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Meta Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-y"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Destination URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">OG Image URL (1200x630)</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Copy Meta Tags */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">Head Meta Tags</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(metaTagsCode);
                  setCopiedMeta(true);
                  setTimeout(() => setCopiedMeta(false), 2000);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              >
                {copiedMeta ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Tags
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-400 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
              {metaTagsCode}
            </pre>
          </div>
        </div>

        {/* Right: Social Platform Previews */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex gap-2">
            {[
              { id: 'twitter', label: 'Twitter / X Card', icon: TwitterIcon },
              { id: 'discord', label: 'Discord Embed', icon: MessageSquare },
              { id: 'google', label: 'Google Search SERP', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono border transition ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold'
                      : 'bg-[#12141c] border-[#1e2230] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Twitter Card Preview */}
          {activeTab === 'twitter' && (
            <div className="bg-[#000000] border border-[#2f3336] rounded-2xl p-4 max-w-lg mx-auto shadow-2xl">
              <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">
                <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                <div>
                  <span className="font-bold text-white">Mantra Labs</span>
                  <span className="text-slate-500 ml-1">@mantralabs</span>
                </div>
              </div>
              <div className="rounded-2xl border border-[#2f3336] overflow-hidden bg-[#16181c]">
                <img src={imageUrl} alt="OG Card" className="w-full h-56 object-cover" />
                <div className="p-3">
                  <span className="text-[11px] text-slate-400 uppercase font-mono">{new URL(url).hostname}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5 truncate">{title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Discord Embed Preview */}
          {activeTab === 'discord' && (
            <div className="bg-[#313338] rounded-xl p-4 max-w-lg mx-auto shadow-2xl text-slate-200">
              <div className="border-l-4 border-[#5865f2] bg-[#2b2d31] rounded-r-lg p-3 space-y-2">
                <span className="text-xs font-semibold text-[#00a8fc] hover:underline cursor-pointer">{title}</span>
                <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
                <img src={imageUrl} alt="OG Embed" className="w-full h-52 object-cover rounded-lg" />
              </div>
            </div>
          )}

          {/* Google Search Preview */}
          {activeTab === 'google' && (
            <div className="bg-[#202124] rounded-xl p-5 max-w-lg mx-auto shadow-2xl space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">🌐</span>
                <span className="text-slate-300">{url}</span>
              </div>
              <h4 className="text-lg text-[#8ab4f8] hover:underline cursor-pointer font-medium">{title}</h4>
              <p className="text-xs text-[#bdc1c6] leading-relaxed">{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
