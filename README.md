# MANTRA TOOLS (`tools.mantralabs.web.id`)

> **Sovereign, High-Performance Client-Side Micro SaaS Suite**  
> Built for creators, AI prompt engineers, microstock contributors, and web developers.  
> **100% Client-Side execution** • **Zero server cost** • **Zero cloud telemetry**.

---

## ⚡ Core Philosophy & Architecture

Most developer utilities and creator tools force users to upload their private assets, images, prompts, and tokens to third-party servers. 

**Mantra Tools** executes 100% inside the user's browser using:
- **HTML5 Canvas 2D API** for lossless/lossy WebP/JPEG/PNG re-rasterization and EXIF sanitization.
- **Web Crypto API (`window.crypto.subtle`)** for hardware-accelerated SHA-256 and SHA-512 hashing.
- **JSZip Engine** for instant multi-asset PWA and Favicon package compression without server rounds.
- **Client-Side Regex & Token Parsing** for subtitle cleaning, batch prompt chunking, and case conversions.

---

## 🛠️ The 12 Micro-Tools Suite

### 1. AI & Creator Workflow
1. **AI Prompt Splitter & Formatter (`PromptStudio`)**  
   - Batch prompt cleaner for Midjourney, Flux, SDXL, and Nano Banana.
   - Strips numbering, injects `--ar`, `--v 6.1`, `--s`, `--no` parameters, deduplicates, and splits into custom batch sizes (10, 25, 50, 100).
2. **Microstock Keyword & Metadata Studio (`MicrostockKeywords`)**  
   - Strict 50-tag SEO optimizer for Adobe Stock, Shutterstock, and Freepik.
   - Auto-extracts tags from titles/descriptions, validates tag counts, and exports CSV.
3. **SRT & VTT Subtitle to Clean Script (`SubtitleCleaner`)**  
   - Strips timestamps, cue numbers, HTML formatting tags, and sound effects.
   - Formats text into natural paragraphs with word count and estimated voiceover reading time.
4. **Social Safe-Zone & Aspect Simulator (`SafeZoneOverlay`)**  
   - 9:16 vertical video & thumbnail framing tester.
   - Interactive UI occlusion overlays for TikTok, YouTube Shorts, and Instagram Reels.

### 2. Media & Asset Processing
5. **Client-Side Image Compressor & Converter (`ImageCompressor`)**  
   - Instant in-browser canvas compression with live quality slider, resolution resize, and WebP/JPG/PNG conversion.
   - Real-time before/after size savings calculator.
6. **Exif & Privacy Metadata Stripper (`ExifStripper`)**  
   - Wipes GPS coordinates, camera hardware serials, and device fingerprints via clean pixel re-rasterization.
7. **SVG to Web-Ready Optimizer (`SvgOptimizer`)**  
   - Strips comments and bloat, minifies SVG, generates clean React (JSX/TSX) components, CSS Data URIs, and exports 1x/2x/4x high-res PNGs.
8. **Favicon & Web App Icon Pack Generator (`FaviconGenerator`)**  
   - Converts 1 source logo into a complete package: `favicon.ico`, `favicon-16x16`, `favicon-32x32`, `apple-touch-icon`, `chrome-192`, `chrome-512`, `site.webmanifest`, and HTML tags.
   - One-click ZIP download.

### 3. Web & Developer Utilities
9. **Social OpenGraph & Card Simulator (`OgPreviewer`)**  
   - Live visual card simulators for Twitter/X, Discord embeds, and Google Search SERP snippets.
   - Generates copy-paste HTML `<meta>` tags.
10. **Case Converter & Clean Slug Engine (`SlugCaseEngine`)**  
    - Real-time conversion to URL slug (kebab-case), camelCase, PascalCase, snake_case, CONSTANT_CASE, Title Case, dot.case, and path/case.
11. **Code & Text Diff Studio (`TextDiff`)**  
    - Side-by-side visual diff comparison with line additions and deletions highlighted.
12. **Crypto, Hash & JWT Inspector (`CryptoJwtStudio`)**  
    - Hardware-accelerated client-side SHA-256 and SHA-512 hashing via Web Crypto API.
    - Base64 encoding/decoding and JWT header/payload inspector with expiration check.

---

## 🚀 Deployment to `tools.mantralabs.web.id`

### Deploy with Cloudflare Pages (Recommended - 100% Free Forever):
1. Push this repository to GitHub (`mantralabs/tools` or your account).
2. Go to **Cloudflare Dashboard > Workers & Pages > Create application > Pages**.
3. Connect your GitHub repository.
4. Set Build Settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Once deployed, click **Custom Domains**, add `tools.mantralabs.web.id`.
6. Cloudflare will automatically configure the CNAME and issue a free SSL certificate.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production bundle
npm run build
```
