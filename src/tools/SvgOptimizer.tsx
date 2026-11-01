import React, { useState, useRef } from 'react';
import { Code, Copy, Check, Upload, Download } from 'lucide-react';

export const SvgOptimizer: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(
    `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">\n` +
    `  <!-- Mantra Labs Tech Emblem -->\n` +
    `  <circle cx="50" cy="50" r="45" stroke="#00f0ff" stroke-width="3" fill="#090a0f" />\n` +
    `  <polygon points="50,20 80,75 20,75" stroke="#10b981" stroke-width="3" fill="none" />\n` +
    `  <circle cx="50" cy="56" r="8" fill="#00f0ff" />\n` +
    `</svg>`
  );

  const [copiedMode, setCopiedMode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSvgInput(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  // Minify SVG
  const optimizeSvg = (raw: string): string => {
    return raw
      .replace(/<!--[\s\S]*?-->/g, '') // remove comments
      .replace(/<\?xml[\s\S]*?\?>/g, '') // remove xml doctype
      .replace(/<!DOCTYPE[\s\S]*?>/g, '')
      .replace(/\s{2,}/g, ' ') // collapse multi-spaces
      .replace(/>\s+</g, '><')
      .trim();
  };

  const minified = optimizeSvg(svgInput);

  // Format to React JSX
  const toReactComponent = (svgStr: string): string => {
    let jsx = svgStr
      .replace(/stroke-width/g, 'strokeWidth')
      .replace(/stroke-linecap/g, 'strokeLinecap')
      .replace(/stroke-linejoin/g, 'strokeLinejoin')
      .replace(/stroke-miterlimit/g, 'strokeMiterlimit')
      .replace(/fill-rule/g, 'fillRule')
      .replace(/clip-rule/g, 'clipRule')
      .replace(/stop-color/g, 'stopColor')
      .replace(/stop-opacity/g, 'stopOpacity')
      .replace(/class=/g, 'className=');

    return `import React from 'react';\n\nexport const Icon = (props: React.SVGProps<SVGSVGElement>) => (\n  ${jsx}\n);\n\nexport default Icon;`;
  };

  // CSS Data URI
  const toDataUri = (svgStr: string): string => {
    const encoded = encodeURIComponent(svgStr)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");
    return `background-image: url('data:image/svg+xml,${encoded}');`;
  };

  const handleCopy = (mode: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMode(mode);
    setTimeout(() => setCopiedMode(null), 2000);
  };

  const downloadSvgFile = () => {
    const blob = new Blob([minified], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized_mantra_vector.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = (scale: number) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    const svgBlob = new Blob([svgInput], { type: 'image/svg+xml;charset=utf-8' });
    const URLObj = window.URL || window.webkitURL || window;
    const blobURL = URLObj.createObjectURL(svgBlob);

    img.onload = () => {
      const w = img.width || 300;
      const h = img.height || 300;
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `mantra_vector_${canvas.width}x${canvas.height}.png`;
        a.click();
      }
      URLObj.revokeObjectURL(blobURL);
    };
    img.src = blobURL;
  };

  const origBytes = new Blob([svgInput]).size;
  const optBytes = new Blob([minified]).size;
  const savedPercent = Math.max(0, Math.round(((origBytes - optBytes) / origBytes) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">SVG to Web-Ready Optimizer</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Clean, minify, convert SVG into React components, CSS Data URIs, or export high-res PNG.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".svg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload .SVG File
          </button>
          <button
            onClick={downloadSvgFile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-200 border border-[#262c3e] transition"
          >
            <Download className="w-3.5 h-3.5" />
            Save .SVG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor & Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                SVG Raw Source Code
              </label>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500">{origBytes} B → {optBytes} B</span>
                {savedPercent > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    -{savedPercent}%
                  </span>
                )}
              </div>
            </div>
            <textarea
              value={svgInput}
              onChange={(e) => setSvgInput(e.target.value)}
              rows={10}
              className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-y"
            />
          </div>

          {/* Live Preview Canvas */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 block">Render Canvas</span>
            <div className="h-44 rounded-lg bg-[#090a0f] border border-[#1e2230] flex items-center justify-center p-4 overflow-hidden relative"
                 dangerouslySetInnerHTML={{ __html: svgInput }}
            />
            
            {/* PNG Export Options */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-400">Export High-Res Raster:</span>
              <div className="flex gap-2">
                {[1, 2, 4].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => exportPng(scale)}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-[#1a1e2b] hover:bg-[#252b3d] text-cyan-400 border border-[#262c3e] transition"
                  >
                    PNG {scale}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Optimized Formats */}
        <div className="lg:col-span-6 space-y-4">
          {/* Format 1: Minified SVG */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold">Minified SVG String</span>
              <button
                onClick={() => handleCopy('minified', minified)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              >
                {copiedMode === 'minified' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Minified
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-400 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] overflow-x-auto whitespace-pre-wrap max-h-24 select-all">
              {minified}
            </pre>
          </div>

          {/* Format 2: React JSX Component */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold">React (JSX / TSX) Component</span>
              <button
                onClick={() => handleCopy('react', toReactComponent(minified))}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              >
                {copiedMode === 'react' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Component
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-400 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] overflow-x-auto whitespace-pre-wrap max-h-32 select-all">
              {toReactComponent(minified)}
            </pre>
          </div>

          {/* Format 3: CSS Data URI */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold">CSS Background Data URI</span>
              <button
                onClick={() => handleCopy('css', toDataUri(minified))}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-300 border border-[#262c3e]"
              >
                {copiedMode === 'css' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy CSS
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-400 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] overflow-x-auto whitespace-pre-wrap max-h-24 select-all">
              {toDataUri(minified)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
