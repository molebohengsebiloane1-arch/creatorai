import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Helper to create a valid uncompressed/deflated PNG
function createPNG(width, height, isMaskable = false) {
  // A simple PNG writer in pure Node.js
  const bytesPerPixel = 4; // RGBA
  const rowSize = width * bytesPerPixel + 1; // 1 filter byte per row
  const rawData = Buffer.alloc(rowSize * height);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = isMaskable ? width * 0.46 : width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient from top-left (#1e1b4b deep indigo) to bottom-right (#7c3aed violet)
      const gradRatio = (x + y) / (width + height);
      let r = Math.round(15 + gradRatio * 110);
      let g = Math.round(18 + gradRatio * 40);
      let b = Math.round(35 + gradRatio * 200);
      let a = 255;

      if (!isMaskable) {
        // Rounded rectangle mask for standard icon
        const cornerRadius = width * 0.22;
        const inCornerX = Math.abs(dx) > (width / 2 - cornerRadius);
        const inCornerY = Math.abs(dy) > (height / 2 - cornerRadius);
        if (inCornerX && inCornerY) {
          const cornerDist = Math.sqrt(
            Math.pow(Math.abs(dx) - (width / 2 - cornerRadius), 2) +
            Math.pow(Math.abs(dy) - (height / 2 - cornerRadius), 2)
          );
          if (cornerDist > cornerRadius) {
            a = 0;
          }
        }
      }

      // Draw emblem in center: Sparkle / Star polygon + Stylized 'C'
      // Outer sparkle distance
      const angle = Math.atan2(dy, dx);
      // 4-pointed star modulation
      const starR = (width * 0.28) * (0.6 + 0.4 * Math.pow(Math.cos(angle * 2), 2));
      const inSparkle = dist < starR;

      if (a > 0 && inSparkle) {
        // Vibrant neon purple/cyan inner glow
        r = Math.min(255, 168 + Math.round(dist * 0.5));
        g = Math.min(255, 85 + Math.round((1 - dist / starR) * 160));
        b = 255;
      }

      // Inner center glowing core
      if (a > 0 && dist < width * 0.1) {
        r = 255;
        g = 255;
        b = 255;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Deflate IDAT data
  const compressedData = zlib.deflateSync(rawData);

  // Build PNG chunks
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type), data]);
    const crc = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 implementation
function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c >>> 0;
  }

  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate standard PNG icons
console.log('Generating pwa-192x192.png...');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));

console.log('Generating pwa-512x512.png...');
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));

console.log('Generating pwa-maskable-512x512.png...');
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));

console.log('Generating apple-touch-icon.png (180x180)...');
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));

// 2. Generate SVG icons
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#4C1D95"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C084FC"/>
      <stop offset="50%" stop-color="#A855F7"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="140" fill="none" stroke="url(#sparkleGrad)" stroke-width="24" stroke-dasharray="600 200" opacity="0.4"/>
  <!-- Glowing central sparkle -->
  <path d="M 256 90 Q 256 256 422 256 Q 256 256 256 422 Q 256 256 90 256 Q 256 256 256 90 Z" fill="url(#sparkleGrad)" filter="url(#glow)"/>
  <circle cx="256" cy="256" r="28" fill="#FFFFFF"/>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');

// 3. Android Digital Asset Links template
const wellKnownDir = path.join(publicDir, '.well-known');
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

const assetLinks = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.creatorai.app",
      sha256_cert_fingerprints: [
        "00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF"
      ]
    }
  }
];

fs.writeFileSync(
  path.join(wellKnownDir, 'assetlinks.json'),
  JSON.stringify(assetLinks, null, 2),
  'utf8'
);

console.log('All PWA assets generated successfully in /public!');
