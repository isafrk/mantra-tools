import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check, AlertCircle, Key, RefreshCw } from 'lucide-react';

export const CryptoJwtStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jwt' | 'hash' | 'base64' | 'timestamp'>('jwt');

  // JWT state
  const [jwtInput, setJwtInput] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hbnRyYSBPcGVyYXRvciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDgwMDAwMDAwfQ.' +
    'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );
  const [jwtSecret, setJwtSecret] = useState<string>('your-256-bit-secret');
  const [sigStatus, setSigStatus] = useState<'valid' | 'invalid' | 'checking' | null>(null);

  // Hash state
  const [hashInput, setHashInput] = useState<string>('Mantra Labs Sovereign Intelligence');
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [sha512Hash, setSha512Hash] = useState<string>('');

  // Base64 state
  const [base64Input, setBase64Input] = useState<string>('Hello from Mantra Labs!');
  const [base64Output, setBase64Output] = useState<string>('');
  const [isB64Encode, setIsB64Encode] = useState<boolean>(true);

  // Timestamp state
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [epochResult, setEpochResult] = useState<string>('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Parse JWT
  const parseJwt = () => {
    try {
      const parts = jwtInput.trim().split('.');
      if (parts.length !== 3) return { error: 'Invalid JWT structure (must have 3 parts separated by dots).' };

      const decodePart = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return JSON.parse(decodeURIComponent(escape(window.atob(base64))));
      };

      const header = decodePart(parts[0]);
      const payload = decodePart(parts[1]);

      let isExpired = false;
      let expDate = null;
      if (payload.exp) {
        expDate = new Date(payload.exp * 1000);
        isExpired = expDate < new Date();
      }

      return { header, payload, isExpired, expDate, signature: parts[2] };
    } catch (err: any) {
      return { error: 'Failed to decode JWT: ' + err.message };
    }
  };

  const jwtParsed = parseJwt();

  // Verify HMAC-SHA256 signature via Web Crypto API
  const verifySignature = async () => {
    try {
      const parts = jwtInput.trim().split('.');
      if (parts.length !== 3 || !jwtSecret) {
        setSigStatus(null);
        return;
      }
      setSigStatus('checking');

      const encoder = new TextEncoder();
      const keyData = encoder.encode(jwtSecret);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const message = `${parts[0]}.${parts[1]}`;
      const signatureBytes = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
      
      // Convert to base64url
      const b64 = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      setSigStatus(b64 === parts[2] ? 'valid' : 'invalid');
    } catch (e) {
      setSigStatus('invalid');
    }
  };

  useEffect(() => {
    verifySignature();
  }, [jwtInput, jwtSecret]);

  // Calculate Hashes using native Web Crypto API
  const calculateHashes = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);

    const hash256Buffer = await crypto.subtle.digest('SHA-256', data);
    const hash256Array = Array.from(new Uint8Array(hash256Buffer));
    setSha256Hash(hash256Array.map(b => b.toString(16).padStart(2, '0')).join(''));

    const hash512Buffer = await crypto.subtle.digest('SHA-512', data);
    const hash512Array = Array.from(new Uint8Array(hash512Buffer));
    setSha512Hash(hash512Array.map(b => b.toString(16).padStart(2, '0')).join(''));
  };

  useEffect(() => {
    calculateHashes();
  }, [hashInput]);

  // Base64 safe UTF-8 converter
  useEffect(() => {
    try {
      if (isB64Encode) {
        setBase64Output(btoa(unescape(encodeURIComponent(base64Input))));
      } else {
        setBase64Output(decodeURIComponent(escape(atob(base64Input))));
      }
    } catch {
      setBase64Output('Invalid format for conversion');
    }
  }, [base64Input, isB64Encode]);

  // Epoch converter
  useEffect(() => {
    try {
      const num = Number(epochInput.trim());
      if (isNaN(num)) {
        setEpochResult('Invalid Unix number');
        return;
      }
      // Check if seconds or milliseconds
      const d = num > 1e11 ? new Date(num) : new Date(num * 1000);
      setEpochResult(`${d.toUTCString()} (Local: ${d.toLocaleString()})`);
    } catch {
      setEpochResult('Error parsing timestamp');
    }
  }, [epochInput]);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Crypto, Hash & JWT Inspector</h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Zero-server client-side Web Crypto API hashing (SHA-256, SHA-512), Base64, and HMAC JWT token verification.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'jwt', label: 'JWT Token Inspector & HMAC' },
          { id: 'hash', label: 'SHA-256 / SHA-512 Hasher' },
          { id: 'base64', label: 'Base64 Safe Studio' },
          { id: 'timestamp', label: 'Unix Epoch Converter' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono border transition ${
              activeTab === tab.id
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold'
                : 'bg-[#12141c] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: JWT */}
      {activeTab === 'jwt' && (
        <div className="space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-3">
            <label className="text-xs font-mono uppercase text-slate-400 block">JWT Encoded String</label>
            <textarea
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
              rows={3}
              placeholder="Paste encoded JWT (header.payload.signature)..."
              className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500/50 resize-y"
            />

            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={jwtSecret}
                  onChange={(e) => setJwtSecret(e.target.value)}
                  placeholder="Enter secret to verify HS256 signature..."
                  className="flex-1 bg-[#090a0f] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>

              {sigStatus === 'valid' && (
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                  ✓ Valid Signature
                </span>
              )}
              {sigStatus === 'invalid' && (
                <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold">
                  ✗ Signature Mismatch
                </span>
              )}
            </div>
          </div>

          {jwtParsed.error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-2 text-red-400 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{jwtParsed.error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Header */}
              <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
                <span className="text-xs font-mono text-red-400 font-bold block">HEADER (Algorithm & Type)</span>
                <pre className="text-xs font-mono text-slate-300 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(jwtParsed.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 font-bold">PAYLOAD (Claims)</span>
                  {jwtParsed.expDate && (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                      jwtParsed.isExpired
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {jwtParsed.isExpired ? 'Expired' : 'Active Token'}
                    </span>
                  )}
                </div>
                <pre className="text-xs font-mono text-slate-300 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(jwtParsed.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Hash */}
      {activeTab === 'hash' && (
        <div className="space-y-4">
          <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4">
            <label className="text-xs font-mono uppercase text-slate-400 block mb-2">Input String to Hash</label>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-4 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="space-y-3">
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 font-bold">SHA-256 (32 bytes / 256 bits)</span>
                <button
                  onClick={() => handleCopy('sha256', sha256Hash)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                >
                  {copiedKey === 'sha256' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="text-xs font-mono text-emerald-400 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] break-all select-all">
                {sha256Hash}
              </pre>
            </div>

            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 font-bold">SHA-512 (64 bytes / 512 bits)</span>
                <button
                  onClick={() => handleCopy('sha512', sha512Hash)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                >
                  {copiedKey === 'sha512' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
              </div>
              <pre className="text-xs font-mono text-cyan-400 bg-[#090a0f] p-3 rounded-lg border border-[#1e2230] break-all select-all">
                {sha512Hash}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Base64 */}
      {activeTab === 'base64' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsB64Encode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
                isB64Encode ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-bold' : 'bg-[#12141c] border-[#1e2230] text-slate-400'
              }`}
            >
              Encode (Text → Base64)
            </button>
            <button
              onClick={() => setIsB64Encode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
                !isB64Encode ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400 font-bold' : 'bg-[#12141c] border-[#1e2230] text-slate-400'
              }`}
            >
              Decode (Base64 → Text)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
              <label className="text-xs font-mono uppercase text-slate-400 block">
                {isB64Encode ? 'Plaintext (UTF-8)' : 'Base64 String'}
              </label>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                rows={6}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-y"
              />
            </div>

            <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-slate-400">
                  {isB64Encode ? 'Base64 Result' : 'Decoded Plaintext'}
                </label>
                <button
                  onClick={() => handleCopy('b64', base64Output)}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                >
                  {copiedKey === 'b64' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  Copy
                </button>
              </div>
              <textarea
                readOnly
                value={base64Output}
                rows={6}
                className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-none select-all resize-y"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Timestamp */}
      {activeTab === 'timestamp' && (
        <div className="bg-[#12141c] border border-[#1e2230] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-slate-400">Unix Timestamp (Seconds or Milliseconds)</label>
            <button
              onClick={() => setEpochInput(Math.floor(Date.now() / 1000).toString())}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline"
            >
              <RefreshCw className="w-3 h-3" /> Set Current Time
            </button>
          </div>
          <input
            type="text"
            value={epochInput}
            onChange={(e) => setEpochInput(e.target.value)}
            className="w-full bg-[#090a0f] border border-[#1e2230] rounded-lg px-4 py-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500/50"
          />

          <div className="p-4 rounded-lg bg-[#090a0f] border border-[#1e2230] space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase block">Formatted UTC & Local Output</span>
            <p className="text-sm font-mono text-emerald-400 font-bold">{epochResult}</p>
          </div>
        </div>
      )}
    </div>
  );
};
