import React, { useState, useRef } from 'react';
import { Sparkles, Upload, Download, RefreshCw, Check } from 'lucide-react';
import JSZip from 'jszip';

interface IconSpec {
  name: string;
  size: number;
}

const ICON_SPECS: IconSpec[] = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

export const FaviconGenerator: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setDownloadReady(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateZip = async () => {
    if (!imageSrc) return;
    setIsGenerating(true);

    const zip = new JSZip();
    const img = new Image();
    img.src = imageSrc;

    await new Promise((res) => {
      img.onload = () => res(null);
    });

    // Render each icon to canvas and add to zip
    for (const spec of ICON_SPECS) {
      const canvas = document.createElement('canvas');
      canvas.width = spec.size;
      canvas.height = spec.size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, spec.size, spec.size);
        const dataUrl = canvas.toDataURL('image/png');
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        zip.file(spec.name, base64Data, { base64: true });
        
        // Also make favicon.ico from the 32x32 canvas
        if (spec.size === 32) {
          zip.file('favicon.ico', base64Data, { base64: true });
        }
      }
    }

    // Add site.webmanifest
    const webmanifest = {
      name: "Mantra Web App",
      short_name: "MantraApp",
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
      ],
      theme_color: "#090a0f",
      background_color: "#090a0f",
      display: "standalone"
    };
    zip.file('site.webmanifest', JSON.stringify(webmanifest, null, 2));

    // Generate zip blob
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mantra_favicon_pack.zip';
    link.click();
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  const htmlSnippet = 
`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Favicon & Web App Icon Pack Generator</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Drop 1 high-resolution logo and download a complete ZIP package with all iOS, Android, and browser favicon sizes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upload and preview */}
        <div className="lg:col-span-5 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#1e2230] hover:border-pink-500/50 rounded-xl p-8 text-center cursor-pointer bg-[#090a0f] transition group"
          >
            {imageSrc ? (
              <div className="space-y-3">
                <img src={imageSrc} alt="Favicon Source" className="w-24 h-24 object-contain mx-auto rounded-xl border border-[#1e2230] bg-[#12141c]" />
                <p className="text-xs font-mono text-pink-400">Click to replace source logo</p>
              </div>
            ) : (
              <div>
                <Upload className="w-10 h-10 text-slate-600 group-hover:text-pink-400 mx-auto mb-2 transition" />
                <p className="text-sm font-medium text-slate-300">Drop your master logo (512x512+ recommended)</p>
                <p className="text-xs font-mono text-slate-500 mt-1">PNG, JPG, SVG, WebP</p>
              </div>
            )}
          </div>

          {downloadReady && (
            <button
              onClick={generateZip}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 font-mono text-sm transition"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Building Favicon ZIP...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Full Favicon Pack (.ZIP)
                </>
              )}
            </button>
          )}
        </div>

        {/* Right: Included Assets & HTML Code */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">Package Contents Generated</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#090a0f] border border-[#1e2230]">
                <span className="text-pink-400 font-bold block">favicon.ico</span>
                <span className="text-[10px] text-slate-500">Classic 32x32 ICO</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090a0f] border border-[#1e2230]">
                <span className="text-pink-400 font-bold block">favicon-16x16.png</span>
                <span className="text-[10px] text-slate-500">Browser tab standard</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090a0f] border border-[#1e2230]">
                <span className="text-pink-400 font-bold block">favicon-32x32.png</span>
                <span className="text-[10px] text-slate-500">Retina tab icon</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090a0f] border border-[#1e2230]">
                <span className="text-pink-400 font-bold block">apple-touch-icon</span>
                <span className="text-[10px] text-slate-500">180x180 iOS Home</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090a0f] border border-[#1e2230]">
                <span className="text-pink-400 font-bold block">chrome-192x192</span>
                <span className="text-[10px] text-slate-500">Android PWA</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#090a0f] border border-[#1e2230]">
                <span className="text-pink-400 font-bold block">site.webmanifest</span>
                <span className="text-[10px] text-slate-500">PWA Manifest JSON</span>
              </div>
            </div>
          </div>

          {/* HTML Meta snippet */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400">HTML &lt;head&gt; Snippet</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(htmlSnippet);
                  setCopiedHtml(true);
                  setTimeout(() => setCopiedHtml(false), 2000);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-300 border border-[#262c3e]"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                {copiedHtml ? 'Copied' : 'Copy HTML'}
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] overflow-x-auto whitespace-pre-wrap select-all">
              {htmlSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
