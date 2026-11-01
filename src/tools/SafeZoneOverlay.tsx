import React, { useState, useRef } from 'react';
import { Smartphone, Eye, Upload, ShieldAlert, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';
type OverlayPlatform = 'tiktok' | 'shorts' | 'reels' | 'grid' | 'none';

export const SafeZoneOverlay: React.FC = () => {
  const [aspect, setAspect] = useState<AspectRatio>('9:16');
  const [platform, setPlatform] = useState<OverlayPlatform>('tiktok');
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video/');
      setIsVideo(isVid);
      const url = URL.createObjectURL(file);
      setMediaSrc(url);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const getContainerStyles = (): string => {
    switch (aspect) {
      case '9:16': return 'w-[320px] h-[568px]';
      case '16:9': return 'w-[568px] h-[320px]';
      case '1:1': return 'w-[400px] h-[400px]';
      case '4:5': return 'w-[360px] h-[450px]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Smartphone className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Social Safe-Zone & Aspect Simulator</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Test video and image framing against TikTok, Instagram Reels, and YouTube Shorts UI occlusion zones. Supports live video playback.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Video / Image
          </button>
          {mediaSrc && (
            <button
              onClick={() => {
                setMediaSrc(null);
                setIsVideo(false);
              }}
              className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#262c3e] transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Aspect Ratio Selector */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 block">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '9:16', label: '9:16 Vertical (Shorts/Reels)' },
                { id: '16:9', label: '16:9 Standard Landscape' },
                { id: '1:1', label: '1:1 Square Feed' },
                { id: '4:5', label: '4:5 Portrait Feed' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAspect(item.id as AspectRatio)}
                  className={`p-2.5 rounded-lg border text-xs font-mono text-left transition ${
                    aspect === item.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                      : 'bg-[#090a0f] border-[#1e2230] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-bold block text-slate-200">{item.id}</span>
                  <span className="text-[10px] text-slate-500">{item.label.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform UI Overlay Preset */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 block">Platform UI Mask</label>
            <div className="space-y-2">
              {[
                { id: 'tiktok', name: 'TikTok (Buttons right, captions bottom)' },
                { id: 'shorts', name: 'YouTube Shorts (Title & Action row)' },
                { id: 'reels', name: 'Instagram Reels (Audio tag & Profile)' },
                { id: 'grid', name: 'Rule of Thirds Grid only' },
                { id: 'none', name: 'Clean / No Mask' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPlatform(item.id as OverlayPlatform)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-mono transition ${
                    platform === item.id
                      ? 'bg-pink-500/10 border-pink-500/40 text-pink-400'
                      : 'bg-[#090a0f] border-[#1e2230] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{item.name}</span>
                  {platform === item.id && <Eye className="w-3.5 h-3.5 text-pink-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Video Player Controls (If Video) */}
          {isVideo && (
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
              <label className="text-xs font-mono uppercase text-slate-400 block">Video Controls</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-200 text-xs font-mono border border-[#262c3e]"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                      videoRef.current.play();
                      setIsPlaying(true);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-[#1a1e2b] text-slate-300 border border-[#262c3e]"
                  title="Rewind"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-[#1a1e2b] text-slate-300 border border-[#262c3e]"
                  title="Toggle Mute"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            </div>
          )}

          {/* Info note */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-medium">
              <ShieldAlert className="w-4 h-4" />
              Occlusion Hazard Guide
            </div>
            <p className="leading-relaxed">
              Keep critical subtitles, face focus points, and product graphics inside the unshaded middle viewport.
              The red tinted zones represent user interface overlays that permanently hide pixels on mobile apps.
            </p>
          </div>
        </div>

        {/* Right Canvas Preview */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#090a0f] border border-[#1e2230] rounded-xl p-6 min-h-[620px] overflow-hidden">
          <div className={`relative ${getContainerStyles()} border-2 border-dashed border-[#2b3245] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center bg-[#0d0f17]`}>
            {/* Background Media */}
            {mediaSrc ? (
              isVideo ? (
                <video
                  ref={videoRef}
                  src={mediaSrc}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={mediaSrc} alt="Preview Target" className="w-full h-full object-cover" />
              )
            ) : (
              <div className="text-center p-6 space-y-2 select-none">
                <Smartphone className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs font-mono text-slate-500">Drop MP4 video or JPG/PNG image</p>
                <p className="text-[10px] font-mono text-slate-600">Simulating {aspect} canvas</p>
              </div>
            )}

            {/* Rule of Thirds Grid */}
            {(platform === 'grid' || platform !== 'none') && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
                <div className="border-r border-b border-cyan-400"></div>
                <div className="border-r border-b border-cyan-400"></div>
                <div className="border-b border-cyan-400"></div>
                <div className="border-r border-b border-cyan-400"></div>
                <div className="border-r border-b border-cyan-400"></div>
                <div className="border-b border-cyan-400"></div>
                <div className="border-r border-cyan-400"></div>
                <div className="border-r border-cyan-400"></div>
                <div></div>
              </div>
            )}

            {/* TikTok Overlay Mask */}
            {platform === 'tiktok' && aspect === '9:16' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="w-full h-12 bg-red-500/20 border-b border-red-500/40 rounded flex items-center justify-between px-3 text-[10px] font-mono text-red-300">
                  <span>LIVE / Following / For You</span>
                  <span>Search</span>
                </div>

                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Avatar</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Like</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Comms</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Save</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Share</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[8px] text-red-200">Audio</div>
                </div>

                <div className="w-[75%] bg-red-500/20 border border-red-500/40 rounded p-2 text-[10px] font-mono text-red-300 space-y-1">
                  <div className="font-bold">@creator_handle</div>
                  <div className="truncate">Caption description and trending hashtags...</div>
                  <div className="text-[9px] text-red-400">♫ Original Sound - Mantra Audio</div>
                </div>
              </div>
            )}

            {/* YouTube Shorts Overlay Mask */}
            {platform === 'shorts' && aspect === '9:16' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="w-full h-10 bg-red-500/20 border-b border-red-500/40 rounded flex items-center justify-end px-3 text-[10px] font-mono text-red-300">
                  <span>Search / Menu</span>
                </div>

                <div className="absolute right-3 bottom-20 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Like</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Dislike</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Comms</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Share</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Remix</div>
                </div>

                <div className="w-[78%] bg-red-500/20 border border-red-500/40 rounded p-2 text-[10px] font-mono text-red-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-400 inline-block"></span>
                    Channel Name [Subscribe]
                  </div>
                  <div>Shorts title headline here...</div>
                </div>
              </div>
            )}

            {/* Instagram Reels Overlay Mask */}
            {platform === 'reels' && aspect === '9:16' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="w-full h-10 bg-red-500/20 border-b border-red-500/40 rounded flex items-center justify-between px-3 text-[10px] font-mono text-red-300">
                  <span>Reels</span>
                  <span>Camera</span>
                </div>

                <div className="absolute right-3 bottom-16 flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Heart</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Reply</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">Send</div>
                  <div className="w-8 h-8 rounded-full bg-red-500/30 border border-red-400 flex items-center justify-center text-[9px] text-red-200">...</div>
                </div>

                <div className="w-[76%] bg-red-500/20 border border-red-500/40 rounded p-2 text-[10px] font-mono text-red-300 space-y-1">
                  <div className="font-bold">instagram_user • Follow</div>
                  <div>Reels audio clip track title...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
