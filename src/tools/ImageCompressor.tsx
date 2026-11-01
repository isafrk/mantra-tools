import React, { useState } from 'react';
import { Upload, Download, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface ProcessedFile {
  id: string;
  name: string;
  origSize: number;
  newSize: number;
  origWidth: number;
  origHeight: number;
  newWidth: number;
  newHeight: number;
  dataUrl: string;
}

export const ImageCompressor: React.FC = () => {
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [maxDimension, setMaxDimension] = useState<number>(0); // 0 = original
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<ProcessedFile[]>([]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processImageFile = (file: File): Promise<ProcessedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let targetW = img.width;
          let targetH = img.height;

          if (maxDimension > 0) {
            if (img.width > img.height && img.width > maxDimension) {
              targetW = maxDimension;
              targetH = Math.round((img.height * maxDimension) / img.width);
            } else if (img.height > maxDimension) {
              targetH = maxDimension;
              targetW = Math.round((img.width * maxDimension) / img.height);
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject('No canvas context');
            return;
          }

          ctx.drawImage(img, 0, 0, targetW, targetH);
          const dataUrl = canvas.toDataURL(format, quality / 100);

          // Approximate size from base64 length
          const head = dataUrl.indexOf(',') + 1;
          const newSize = Math.round((dataUrl.length - head) * 0.75);

          const ext = format === 'image/webp' ? '.webp' : format === 'image/jpeg' ? '.jpg' : '.png';
          const newName = file.name.substring(0, file.name.lastIndexOf('.')) + '_compressed' + ext;

          resolve({
            id: Math.random().toString(36).substring(7),
            name: newName,
            origSize: file.size,
            newSize,
            origWidth: img.width,
            origHeight: img.height,
            newWidth: targetW,
            newHeight: targetH,
            dataUrl
          });
        };
        img.onerror = () => reject('Failed to load image');
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const newItems: ProcessedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        try {
          const res = await processImageFile(file);
          newItems.push(res);
        } catch (err) {
          console.error(err);
        }
      }
    }

    setResults(prev => [...newItems, ...prev]);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Client-Side Image Compressor & Converter</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            100% private in-browser compression. Files never touch any remote server. Zero upload latency.
          </p>
        </div>
        {results.length > 0 && (
          <button
            onClick={() => setResults([])}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#262c3e] transition"
          >
            Clear All Results
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">Compression Settings</h3>

            {/* Quality Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-400">Target Quality</span>
                <span className="text-emerald-400 font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>

            {/* Target Format */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">Output Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'image/webp', label: 'WebP (Best)' },
                  { id: 'image/jpeg', label: 'JPEG' },
                  { id: 'image/png', label: 'PNG' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id as any)}
                    className={`py-1.5 px-2 text-xs font-mono rounded-lg border transition ${
                      format === f.id
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                        : 'bg-[#090a0f] border-[#1e2230] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Dimensions */}
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">Max Resolution Limit</label>
              <select
                value={maxDimension}
                onChange={(e) => setMaxDimension(Number(e.target.value))}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value={0}>Original Resolution (No Resize)</option>
                <option value={3840}>4K Ultra HD (Max 3840px)</option>
                <option value={1920}>Full HD (Max 1920px)</option>
                <option value={1280}>HD Ready (Max 1280px)</option>
                <option value={800}>Web Thumbnail (Max 800px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload & Results Column */}
        <div className="lg:col-span-8 space-y-4">
          {/* Dropzone */}
          <label className="block border-2 border-dashed border-[#1e2230] hover:border-emerald-500/50 rounded-xl p-8 text-center cursor-pointer bg-[#090a0f] transition group">
            <Upload className="w-10 h-10 text-slate-600 group-hover:text-emerald-400 mx-auto mb-2 transition" />
            <p className="text-sm font-medium text-slate-300">Click to select or drag and drop images</p>
            <p className="text-xs font-mono text-slate-500 mt-1">PNG, JPG, WebP supported • Multi-file batch ready</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </label>

          {/* Results List */}
          <div className="space-y-3">
            {isProcessing && (
              <div className="flex items-center justify-center gap-2 p-4 bg-[#12141c] rounded-xl border border-[#1e2230] text-emerald-400 text-xs font-mono">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compressing in browser canvas worker...</span>
              </div>
            )}

            {results.map((item) => {
              const diff = item.origSize - item.newSize;
              const percent = Math.round((diff / item.origSize) * 100);
              const isSmaller = diff > 0;

              return (
                <div key={item.id} className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img src={item.dataUrl} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-[#1e2230] bg-[#090a0f]" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{item.name}</h4>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">
                        {item.origWidth}x{item.origHeight} → {item.newWidth}x{item.newHeight}
                      </p>
                    </div>
                  </div>

                  {/* Size comparison */}
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-400 line-through">{formatBytes(item.origSize)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-white font-bold">{formatBytes(item.newSize)}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isSmaller ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {isSmaller ? `-${percent}%` : '+0%'}
                    </span>
                  </div>

                  {/* Download button */}
                  <a
                    href={item.dataUrl}
                    download={item.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
