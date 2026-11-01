import React, { useState, useRef } from 'react';
import { Share2, Globe, Copy, Check, MessageSquare, Upload } from 'lucide-react';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63-1.63z"/>
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 23.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const OgPreviewer: React.FC = () => {
  const [title, setTitle] = useState<string>('Mantra Labs | Sovereign High-Tech Systems');
  const [description, setDescription] = useState<string>('Engineering high-throughput automated workflows, algorithmic pipelines, and sovereign digital infrastructures.');
  const [url, setUrl] = useState<string>('https://mantralabs.web.id');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [activeTab, setActiveTab] = useState<'twitter' | 'discord' | 'google' | 'linkedin'>('twitter');
  const [copiedMeta, setCopiedMeta] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCleanDomain = (fullUrl: string) => {
    try {
      return new URL(fullUrl).hostname;
    } catch {
      return 'mantralabs.web.id';
    }
  };

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
            Preview live link sharing cards across Twitter/X, Discord, LinkedIn, and Google SERP search results.
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
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Target URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-slate-400">OG Image</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> Upload Local Image
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or upload local image"
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
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'twitter', label: 'Twitter / X', icon: TwitterIcon },
              { id: 'discord', label: 'Discord', icon: MessageSquare },
              { id: 'google', label: 'Google SERP', icon: Globe },
              { id: 'linkedin', label: 'LinkedIn', icon: LinkedinIcon },
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
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">M</div>
                <div>
                  <span className="font-bold text-white">Mantra Labs</span>
                  <span className="text-slate-500 ml-1">@mantralabs</span>
                </div>
              </div>
              <div className="rounded-2xl border border-[#2f3336] overflow-hidden bg-[#16181c]">
                <img src={imageUrl} alt="OG Card" className="w-full h-56 object-cover bg-[#090a0f]" />
                <div className="p-3">
                  <span className="text-[11px] text-slate-400 uppercase font-mono">{getCleanDomain(url)}</span>
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
                <img src={imageUrl} alt="OG Embed" className="w-full h-52 object-cover rounded-lg bg-[#1e1f22]" />
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

          {/* LinkedIn Preview */}
          {activeTab === 'linkedin' && (
            <div className="bg-[#1b1f23] border border-[#2d3238] rounded-xl overflow-hidden max-w-lg mx-auto shadow-2xl">
              <img src={imageUrl} alt="LinkedIn Preview" className="w-full h-52 object-cover bg-[#090a0f]" />
              <div className="p-3 bg-[#1d2226]">
                <h4 className="text-sm font-bold text-white truncate">{title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{getCleanDomain(url)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
