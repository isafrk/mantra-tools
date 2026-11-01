import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToolCard } from './components/ToolCard';
import { SearchModal } from './components/SearchModal';
import type { ToolItem, ToolCategory } from './types';
import { ArrowLeft, Zap } from 'lucide-react';

// Import all 12 Tools
import { PromptStudio } from './tools/PromptStudio';
import { MicrostockKeywords } from './tools/MicrostockKeywords';
import { SubtitleCleaner } from './tools/SubtitleCleaner';
import { SafeZoneOverlay } from './tools/SafeZoneOverlay';
import { ImageCompressor } from './tools/ImageCompressor';
import { ExifStripper } from './tools/ExifStripper';
import { SvgOptimizer } from './tools/SvgOptimizer';
import { FaviconGenerator } from './tools/FaviconGenerator';
import { OgPreviewer } from './tools/OgPreviewer';
import { SlugCaseEngine } from './tools/SlugCaseEngine';
import { TextDiff } from './tools/TextDiff';
import { CryptoJwtStudio } from './tools/CryptoJwtStudio';

const TOOLS: ToolItem[] = [
  // Category 1: AI & Creator Workflow
  {
    id: 'prompt-studio',
    title: 'AI Prompt Splitter & Formatter',
    shortTitle: 'Prompt Splitter',
    category: 'ai-creator',
    description: 'Clean, parameterize, batch-chunk, and format prompts for Midjourney, Flux, SDXL, and Nano Banana.',
    badge: 'Creator Essential',
    iconName: 'Sparkles',
    tags: ['midjourney', 'flux', 'prompt', 'batch', 'ai']
  },
  {
    id: 'microstock-keywords',
    title: 'Microstock Keyword & Metadata Studio',
    shortTitle: 'Stock Keywords',
    category: 'ai-creator',
    description: 'Build compliant 50-tag SEO clusters, auto-extract keywords, and export metadata CSV for Adobe Stock & Shutterstock.',
    badge: '50-Tag Safe',
    iconName: 'Tag',
    tags: ['microstock', 'adobestock', 'shutterstock', 'seo', 'csv']
  },
  {
    id: 'subtitle-cleaner',
    title: 'SRT & VTT Subtitle to Clean Script',
    shortTitle: 'Subtitle Cleaner',
    category: 'ai-creator',
    description: 'Strip timestamps, line indexes, sound effects, and HTML markup into clean voiceover-ready text.',
    badge: 'VO Ready',
    iconName: 'FileText',
    tags: ['srt', 'vtt', 'subtitles', 'script', 'transcription']
  },
  {
    id: 'safe-zone-overlay',
    title: 'Social Safe-Zone & Aspect Simulator',
    shortTitle: 'Safe-Zone Overlay',
    category: 'ai-creator',
    description: 'Test video framing against TikTok, Instagram Reels, and YouTube Shorts UI occlusion zones.',
    badge: '9:16 Simulator',
    iconName: 'Smartphone',
    tags: ['tiktok', 'shorts', 'reels', 'safezone', 'aspect-ratio']
  },

  // Category 2: Media & Assets Processing
  {
    id: 'image-compressor',
    title: 'Client-Side Image Compressor & Converter',
    shortTitle: 'Image Compressor',
    category: 'media-assets',
    description: '100% private in-browser compression. Convert PNG, JPEG, and WebP with zero upload latency.',
    badge: 'Zero Upload',
    iconName: 'Zap',
    tags: ['compress', 'webp', 'png', 'jpg', 'canvas']
  },
  {
    id: 'exif-stripper',
    title: 'Exif & Privacy Metadata Stripper',
    shortTitle: 'EXIF Stripper',
    category: 'media-assets',
    description: 'Permanently wipe GPS coordinates, camera serial numbers, and device fingerprints before sharing online.',
    badge: 'Privacy Hardened',
    iconName: 'ShieldCheck',
    tags: ['exif', 'privacy', 'gps', 'metadata', 'sanitize']
  },
  {
    id: 'svg-optimizer',
    title: 'SVG to Web-Ready Optimizer',
    shortTitle: 'SVG Optimizer',
    category: 'media-assets',
    description: 'Clean, minify, convert SVG into React components, CSS Data URIs, or export high-res PNG.',
    badge: 'React Ready',
    iconName: 'Code',
    tags: ['svg', 'react', 'jsx', 'css', 'minify']
  },
  {
    id: 'favicon-generator',
    title: 'Favicon & Web App Icon Pack Generator',
    shortTitle: 'Favicon Generator',
    category: 'media-assets',
    description: 'Drop 1 high-resolution logo and download a complete ZIP package with all iOS, Android, and web favicon sizes.',
    badge: 'ZIP Package',
    iconName: 'Sparkles',
    tags: ['favicon', 'ico', 'apple-touch-icon', 'pwa', 'zip']
  },

  // Category 3: Web & Developer Utilities
  {
    id: 'og-previewer',
    title: 'Social OpenGraph & Card Simulator',
    shortTitle: 'OG Card Previewer',
    category: 'developer-text',
    description: 'Preview live link sharing cards across Twitter/X, Discord, and Google SERP search results.',
    badge: 'Live Simulator',
    iconName: 'Share2',
    tags: ['opengraph', 'twitter', 'discord', 'seo', 'meta']
  },
  {
    id: 'slug-case-engine',
    title: 'Case Converter & Clean Slug Engine',
    shortTitle: 'Slug & Case Engine',
    category: 'developer-text',
    description: 'Real-time casing transformations for SEO slugs, programming variables, and database identifiers.',
    badge: 'Instant Transform',
    iconName: 'Type',
    tags: ['slug', 'kebab-case', 'camelcase', 'snake_case', 'seo']
  },
  {
    id: 'text-diff',
    title: 'Code & Text Diff Studio',
    shortTitle: 'Code & Text Diff',
    category: 'developer-text',
    description: 'Compare two versions of code, prompts, or documents side-by-side with real-time change detection.',
    badge: 'Side-by-Side',
    iconName: 'SplitSquareVertical',
    tags: ['diff', 'compare', 'code', 'git', 'text']
  },
  {
    id: 'crypto-jwt',
    title: 'Crypto, Hash & JWT Inspector',
    shortTitle: 'Crypto & JWT',
    category: 'developer-text',
    description: 'Zero-server client-side Web Crypto API hashing (SHA-256, SHA-512), Base64, and JWT token analysis.',
    badge: 'Web Crypto API',
    iconName: 'Shield',
    tags: ['jwt', 'sha256', 'hash', 'base64', 'crypto']
  },
];

export const App: React.FC = () => {
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<ToolCategory>('all');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const activeTool = TOOLS.find(t => t.id === selectedToolId);

  const filteredTools = currentCategory === 'all'
    ? TOOLS
    : TOOLS.filter(t => t.category === currentCategory);

  // Sync URL hash with active tool
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && TOOLS.some(t => t.id === hash)) {
        setSelectedToolId(hash);
      } else if (!hash) {
        setSelectedToolId(null);
      }
    };

    // On initial mount
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update document title and URL hash on selection
  React.useEffect(() => {
    if (activeTool) {
      document.title = `${activeTool.title} | Mantra Tools`;
      if (window.location.hash !== `#${activeTool.id}`) {
        window.history.pushState(null, '', `#${activeTool.id}`);
      }
    } else {
      document.title = 'Mantra Tools | Free Client-Side Micro SaaS Suite (tools.mantralabs.web.id)';
      if (window.location.hash) {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  }, [selectedToolId, activeTool]);

  const renderActiveToolComponent = () => {
    switch (selectedToolId) {
      case 'prompt-studio': return <PromptStudio />;
      case 'microstock-keywords': return <MicrostockKeywords />;
      case 'subtitle-cleaner': return <SubtitleCleaner />;
      case 'safe-zone-overlay': return <SafeZoneOverlay />;
      case 'image-compressor': return <ImageCompressor />;
      case 'exif-stripper': return <ExifStripper />;
      case 'svg-optimizer': return <SvgOptimizer />;
      case 'favicon-generator': return <FaviconGenerator />;
      case 'og-previewer': return <OgPreviewer />;
      case 'slug-case-engine': return <SlugCaseEngine />;
      case 'text-diff': return <TextDiff />;
      case 'crypto-jwt': return <CryptoJwtStudio />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onHomeClick={() => setSelectedToolId(null)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <Sidebar
          currentCategory={currentCategory}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            setSelectedToolId(null);
          }}
          selectedToolId={selectedToolId}
          onSelectTool={(id) => setSelectedToolId(id)}
          tools={TOOLS}
        />

        {/* Right Content Area */}
        <section className="flex-1 min-w-0">
          {activeTool ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Breadcrumb Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#181b24]">
                <button
                  onClick={() => setSelectedToolId(null)}
                  className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                  <span>Back to All Micro-Tools</span>
                </button>
                <div className="text-xs font-mono text-slate-500">
                  Category: <span className="text-slate-300 uppercase">{activeTool.category}</span>
                </div>
              </div>

              {/* Render Active Tool */}
              {renderActiveToolComponent()}
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Hero Banner */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#12141e] via-[#0d0f17] to-[#12141c] border border-[#1e2230] p-6 lg:p-8 overflow-hidden shadow-2xl">
                {/* Tech background grid / glows */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Sovereign Client-Side Micro SaaS Suite</span>
                  </div>
                  <h1 className="text-2xl lg:text-4xl font-extrabold text-white tracking-tight font-mono">
                    High-Octane Web Utilities For <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Creators & Engineers</span>
                  </h1>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    12 high-performance micro-tools running directly in your browser. Zero backend telemetry, zero data storage, 100% private and forever free.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
                    <div className="px-3 py-1.5 rounded-lg bg-[#08090d] border border-[#1e2230] text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      12 Micro-Tools
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#08090d] border border-[#1e2230] text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      100% Local Execution
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#08090d] border border-[#1e2230] text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      Zero Cloud Footprint
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Filter Bar */}
              <div className="flex items-center justify-between pb-2">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Tools' },
                    { id: 'ai-creator', label: 'AI & Creator' },
                    { id: 'media-assets', label: 'Media & Assets' },
                    { id: 'developer-text', label: 'Web & Dev' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentCategory(tab.id as ToolCategory)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition ${
                        currentCategory === tab.id
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-bold'
                          : 'bg-[#10121a] border-[#1c202d] text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  Showing {filteredTools.length} utilities
                </span>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onSelect={(id) => setSelectedToolId(id)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#181b24] bg-[#07080b] py-8 px-4 lg:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-300">MANTRA LABS</span>
            <span>•</span>
            <span>tools.mantralabs.web.id</span>
            <span>•</span>
            <span className="text-emerald-400">100% Client-Side Engine</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <a href="https://mantralabs.web.id" target="_blank" rel="noopener" className="hover:text-cyan-400 transition">Studio</a>
            <span>•</span>
            <a href="https://downtik.web.id" target="_blank" rel="noopener" className="hover:text-lime-400 transition">DownTik</a>
            <span>•</span>
            <a href="https://gameonradar.online" target="_blank" rel="noopener" className="hover:text-sky-400 transition">GameOnRadar</a>
            <span>•</span>
            <span>Zero Tracking</span>
            <span>•</span>
            <span>Free Forever</span>
          </div>
        </div>
      </footer>

      {/* Command Palette Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tools={TOOLS}
        onSelectTool={(id) => setSelectedToolId(id)}
      />
    </div>
  );
};

export default App;
