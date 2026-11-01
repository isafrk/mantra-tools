import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Trash2, Clock, Upload } from 'lucide-react';

export const SubtitleCleaner: React.FC = () => {
  const [rawText, setRawText] = useState<string>('');
  const [cleanParagraphs, setCleanParagraphs] = useState<boolean>(true);
  const [removeSoundFx, setRemoveSoundFx] = useState<boolean>(true);
  const [removeSpeakers, setRemoveSpeakers] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const cleanSubtitles = (input: string): string => {
    if (!input.trim()) return '';

    let text = input;

    // Remove WebVTT headers
    text = text.replace(/^WEBVTT[^\n]*\n+/i, '');
    text = text.replace(/NOTE\s+[^\n]*\n+/gi, '');

    // Remove timestamps
    text = text.replace(/\d{1,2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,\.]\d{3}[^\n]*/g, '');
    text = text.replace(/\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{2}:\d{2}[,\.]\d{3}[^\n]*/g, '');

    // Remove line numbers (digits on their own line)
    text = text.replace(/^\s*\d+\s*$/gm, '');

    // Remove HTML markup
    text = text.replace(/<[^>]+>/g, '');

    // Remove Sound FX tags like [Music], (Applause), [Laughter]
    if (removeSoundFx) {
      text = text.replace(/\[[^\]]*\]/g, '');
      text = text.replace(/\([^\)]*\)/g, '');
    }

    // Remove speaker names like "SPEAKER 1:", "John:", ">>"
    if (removeSpeakers) {
      text = text.replace(/^[A-Z0-9_\s]{2,15}:\s*/gm, '');
      text = text.replace(/^>>\s*/gm, '');
    }

    // Split lines, trim and deduplicate blank lines
    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (cleanParagraphs) {
      const paragraphs: string[] = [];
      let currentPara: string[] = [];

      for (const line of lines) {
        currentPara.push(line);
        if (/[.?!]$/.test(line) && currentPara.join(' ').split(' ').length > 35) {
          paragraphs.push(currentPara.join(' '));
          currentPara = [];
        }
      }
      if (currentPara.length > 0) {
        paragraphs.push(currentPara.join(' '));
      }
      return paragraphs.join('\n\n');
    }

    return lines.join('\n');
  };

  const processed = cleanSubtitles(rawText);

  // Stats
  const wordCount = processed.trim() ? processed.trim().split(/\s+/).length : 0;
  const charCount = processed.length;
  const readingTimeMin = Math.ceil(wordCount / 140); // Standard VO pacing ~140 wpm

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRawText(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(processed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([processed], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_script_${wordCount}_words.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">SRT & VTT Subtitle to Clean Script</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Instantly strip timestamps, line indexes, sound effects, speaker cues, and HTML markup into clean voiceover-ready text.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            Upload .SRT / .VTT
            <input type="file" accept=".srt,.vtt,.txt,.sbv" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            onClick={() => {
              setRawText(
                "WEBVTT\n\n" +
                "1\n00:00:01.000 --> 00:00:04.200\n[Dramatic Synth Music]\nSPEAKER 1: In 1974, deep beneath the Pacific Ocean,\n\n" +
                "2\n00:00:04.500 --> 00:00:08.100\nthe United States CIA launched the most ambitious\n\n" +
                "3\n00:00:08.300 --> 00:00:11.800\nclandestine salvage operation in naval history.\n\n" +
                "4\n00:00:12.100 --> 00:00:16.000\nIt was codenamed <i>Project Azorian</i>.\n"
              );
            }}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-300 border border-[#262c3e] transition"
          >
            Load Sample
          </button>
          <button
            onClick={() => setRawText('')}
            className="p-1.5 rounded-lg bg-[#1a1e2b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#262c3e] transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raw input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Raw Subtitle Text (Paste or Drop)
              </label>
              <span className="text-xs font-mono text-slate-500">
                {rawText.length} characters
              </span>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste SRT or VTT content here..."
              rows={16}
              className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 resize-y"
            />
          </div>

          {/* Clean Options */}
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
              <input
                type="checkbox"
                checked={cleanParagraphs}
                onChange={(e) => setCleanParagraphs(e.target.checked)}
                className="rounded bg-[#090a0f] border-[#1e2230] text-cyan-500 focus:ring-0"
              />
              Merge into narrative paragraphs
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
              <input
                type="checkbox"
                checked={removeSoundFx}
                onChange={(e) => setRemoveSoundFx(e.target.checked)}
                className="rounded bg-[#090a0f] border-[#1e2230] text-cyan-500 focus:ring-0"
              />
              Strip sound tags ([Music], (Applause))
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
              <input
                type="checkbox"
                checked={removeSpeakers}
                onChange={(e) => setRemoveSpeakers(e.target.checked)}
                className="rounded bg-[#090a0f] border-[#1e2230] text-cyan-500 focus:ring-0"
              />
              Strip speaker tags (SPEAKER 1:, &gt;&gt;)
            </label>
          </div>
        </div>

        {/* Right: Clean Script Output */}
        <div className="lg:col-span-6 space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Words</span>
              <p className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{wordCount}</p>
            </div>
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Characters</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{charCount}</p>
            </div>
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-3 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Est. VO Time</span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" />
                ~{readingTimeMin} min
              </p>
            </div>
          </div>

          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2230]">
              <span className="text-xs font-mono uppercase text-slate-400">Clean Script Document</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!processed}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition disabled:opacity-40"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Text
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!processed}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-[#1a1e2b] hover:bg-[#252b3d] text-slate-200 border border-[#262c3e] transition disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  .TXT
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={processed}
              placeholder="Clean script will automatically render here..."
              rows={14}
              className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-sm text-slate-200 leading-relaxed focus:outline-none resize-y font-sans select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
