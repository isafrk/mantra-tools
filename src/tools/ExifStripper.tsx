import React, { useState } from 'react';
import { ShieldCheck, Upload, Download, Check, FileCheck, AlertTriangle } from 'lucide-react';

interface CleanedImage {
  name: string;
  originalSize: number;
  cleanSize: number;
  dataUrl: string;
}

export const ExifStripper: React.FC = () => {
  const [cleanedImages, setCleanedImages] = useState<CleanedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const cleanFile = (file: File): Promise<CleanedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Re-draw onto a clean canvas strips all EXIF, GPS, camera serials, and metadata blobs completely!
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject('Canvas not supported');
            return;
          }
          ctx.drawImage(img, 0, 0);

          const isPng = file.type === 'image/png';
          const format = isPng ? 'image/png' : 'image/jpeg';
          const cleanDataUrl = canvas.toDataURL(format, 0.95);

          const head = cleanDataUrl.indexOf(',') + 1;
          const cleanSize = Math.round((cleanDataUrl.length - head) * 0.75);

          const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const ext = isPng ? '.png' : '.jpg';

          resolve({
            name: `${baseName}_sanitized${ext}`,
            originalSize: file.size,
            cleanSize,
            dataUrl: cleanDataUrl
          });
        };
        img.onerror = () => reject('Failed to load image raster');
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    const newItems: CleanedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const cleaned = await cleanFile(files[i]);
        newItems.push(cleaned);
      } catch (err) {
        console.error(err);
      }
    }

    setCleanedImages(prev => [...newItems, ...prev]);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Exif & Privacy Metadata Stripper</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Permanently wipe GPS coordinates, camera serial numbers, date taken, and device fingerprints before sharing online.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-4">
          {/* Security Checklist */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Destroyed Metadata Vectors
            </h3>
            <ul className="text-xs font-mono text-slate-400 space-y-2">
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                GPS Latitude & Longitude (Home/Location privacy)
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Camera Make, Model & Lens Hardware Serials
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Original Date, Time, and Timezone timestamps
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Software tags (Photoshop/Lightroom author history)
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Embedded thumbnail previews & ICC color profiles
              </li>
            </ul>

            <div className="pt-2 border-t border-[#1e2230]">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                Zero Cloud Leak
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Stripping happens through pure client-side HTML5 2D canvas pixel re-rasterization. The byte header is rebuilt from scratch.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {/* Drop Area */}
          <label className="block border-2 border-dashed border-[#1e2230] hover:border-emerald-500/50 rounded-xl p-8 text-center cursor-pointer bg-[#090a0f] transition group">
            <Upload className="w-10 h-10 text-slate-600 group-hover:text-emerald-400 mx-auto mb-2 transition" />
            <p className="text-sm font-medium text-slate-300">Drop photos to sanitize metadata</p>
            <p className="text-xs font-mono text-slate-500 mt-1">Instant processing • No server upload</p>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </label>

          {/* Cleaned Results */}
          <div className="space-y-3">
            {isProcessing && <div className='text-xs font-mono text-emerald-400 p-2'>Sanitizing EXIF data...</div>}\n            {cleanedImages.map((img, idx) => (
              <div key={idx} className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{img.name}</h4>
                    <p className="text-xs font-mono text-emerald-400">Metadata Sanitized • EXIF Cleared</p>
                  </div>
                </div>

                <a
                  href={img.dataUrl}
                  download={img.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Clean Image
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
