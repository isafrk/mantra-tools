import React, { useState } from 'react';
import { ShieldCheck, Upload, Download, Check, AlertTriangle, Trash2, Archive } from 'lucide-react';
import JSZip from 'jszip';

interface CleanedImage {
  id: string;
  name: string;
  originalSize: number;
  cleanSize: number;
  origWidth: number;
  origHeight: number;
  dataUrl: string;
  blob: Blob;
}

export const ExifStripper: React.FC = () => {
  const [cleanedImages, setCleanedImages] = useState<CleanedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const cleanFile = (file: File): Promise<CleanedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Re-draw onto a clean 2D canvas strictly strips all EXIF, GPS, camera serials, and metadata blobs
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
          const mime = isPng ? 'image/png' : 'image/jpeg';
          
          canvas.toBlob((blob) => {
            if (!blob) {
              reject('Canvas blob failed');
              return;
            }
            const cleanDataUrl = canvas.toDataURL(mime, 0.95);
            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const ext = isPng ? '.png' : '.jpg';

            resolve({
              id: Math.random().toString(36).substring(7),
              name: `${baseName}_sanitized${ext}`,
              originalSize: file.size,
              cleanSize: blob.size,
              origWidth: img.width,
              origHeight: img.height,
              dataUrl: cleanDataUrl,
              blob
            });
          }, mime, 0.95);
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

  const downloadAllZip = async () => {
    if (cleanedImages.length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();

    for (const item of cleanedImages) {
      zip.file(item.name, item.blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mantra_sanitized_${cleanedImages.length}_images.zip`;
    a.click();
    URL.revokeObjectURL(url);
    setIsZipping(false);
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
        {cleanedImages.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={downloadAllZip}
              disabled={isZipping}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition disabled:opacity-50"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Archiving...' : `Download All Sanitized (${cleanedImages.length})`}</span>
            </button>
            <button
              onClick={() => setCleanedImages([])}
              className="p-1.5 rounded-lg bg-[#1a1e2b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#262c3e] transition"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
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
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
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
            <p className="text-xs font-mono text-slate-500 mt-1">Instant processing • Multi-image batch ready</p>
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
            {isProcessing && (
              <div className="p-3 bg-[#12141c] border border-[#1e2230] rounded-xl text-xs font-mono text-emerald-400 text-center animate-pulse">
                Sanitizing byte stream and re-rasterizing canvas...
              </div>
            )}

            {cleanedImages.map((img) => (
              <div key={img.id} className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img src={img.dataUrl} alt={img.name} className="w-12 h-12 object-cover rounded-lg border border-[#1e2230] bg-[#090a0f]" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{img.name}</h4>
                    <p className="text-xs font-mono text-emerald-400">
                      EXIF Cleared • {img.origWidth}x{img.origHeight}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-slate-500 line-through">{formatBytes(img.originalSize)}</span>
                  <span className="text-slate-200 font-bold">{formatBytes(img.cleanSize)}</span>
                </div>

                <a
                  href={img.dataUrl}
                  download={img.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Image
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
