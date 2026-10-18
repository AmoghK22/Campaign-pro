/**
 * Generates the bundled campaign artwork used by the demo.
 *
 * Run: node scripts/generate-campaign-assets.cjs
 *
 * Emits deterministic abstract PNGs into apps/mobile/assets/campaigns/ so the
 * app never depends on external image URLs at runtime. The art is deliberately
 * abstract (gradients + shapes) rather than photographic, because these are
 * illustrative demo visuals, not real photographs of real people or places.
 */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const OUT_DIR = path.join(__dirname, '..', 'apps', 'mobile', 'assets', 'campaigns');

const CRC_TABLE = (() => {
  const table = new Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function encodePng(width, height, pixels) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;

function mix(base, tint, amount) {
  return [
    lerp(base[0], tint[0], amount),
    lerp(base[1], tint[1], amount),
    lerp(base[2], tint[2], amount),
  ];
}

function render(width, height, palette, seed) {
  const rand = mulberry32(seed);
  const circles = [];
  for (let i = 0; i < 3; i += 1) {
    circles.push({
      cx: rand(),
      cy: 0.15 + rand() * 0.7,
      r: 0.18 + rand() * 0.22,
      strength: 0.05 + rand() * 0.06,
    });
  }

  const pixels = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const ty = y / (height - 1);
    for (let x = 0; x < width; x += 1) {
      const tx = x / (width - 1);
      const baseT = clamp(ty * 0.86 + tx * 0.14);
      let color = [
        lerp(palette.top[0], palette.bottom[0], baseT),
        lerp(palette.top[1], palette.bottom[1], baseT),
        lerp(palette.top[2], palette.bottom[2], baseT),
      ];

      const glowX = (tx - 0.72) / 0.55;
      const glowY = (ty - 0.24) / 0.5;
      const glow = Math.exp(-(glowX * glowX + glowY * glowY)) * 0.2;
      color = mix(color, palette.accent, glow);

      const bandDist = ty - tx * 0.55 - 0.16;
      const band = Math.exp(-(bandDist * bandDist) / 0.0045) * 0.1;
      color = mix(color, palette.accent, band);

      for (const circle of circles) {
        const dx = tx - circle.cx;
        const dy = ty - circle.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < circle.r) {
          const falloff = (1 - dist / circle.r) ** 2;
          color = mix(color, palette.accent, circle.strength * falloff);
        }
      }

      const vignetteX = (tx - 0.5) * 2;
      const vignetteY = (ty - 0.5) * 2;
      const vignette = 1 - 0.22 * clamp(vignetteX * vignetteX + vignetteY * vignetteY);
      color = [color[0] * vignette, color[1] * vignette, color[2] * vignette];

      const offset = (y * width + x) * 4;
      pixels[offset] = Math.round(clamp(color[0] / 255) * 255);
      pixels[offset + 1] = Math.round(clamp(color[1] / 255) * 255);
      pixels[offset + 2] = Math.round(clamp(color[2] / 255) * 255);
      pixels[offset + 3] = 255;
    }
  }
  return pixels;
}

const CAMPAIGNS = [
  {
    slug: 'river-wardens',
    top: [14, 77, 69],
    bottom: [46, 139, 111],
    accent: [159, 227, 193],
  },
  {
    slug: 'stem-lab',
    top: [43, 46, 107],
    bottom: [108, 99, 199],
    accent: [201, 198, 255],
  },
  {
    slug: 'air-monitors',
    top: [18, 58, 90],
    bottom: [62, 143, 191],
    accent: [169, 219, 245],
  },
  {
    slug: 'mangrove-guards',
    top: [27, 77, 46],
    bottom: [111, 168, 66],
    accent: [223, 240, 168],
  },
  {
    slug: 'hearing-screening',
    top: [122, 46, 74],
    bottom: [208, 106, 136],
    accent: [255, 211, 222],
  },
  {
    slug: 'open-textbook',
    top: [122, 74, 18],
    bottom: [215, 154, 58],
    accent: [255, 226, 174],
  },
  {
    slug: 'night-bus-safety',
    top: [42, 33, 64],
    bottom: [110, 90, 168],
    accent: [203, 189, 245],
  },
  {
    slug: 'women-in-trades',
    top: [20, 72, 74],
    bottom: [192, 138, 46],
    accent: [247, 214, 150],
  },
  {
    slug: 'oral-history',
    top: [74, 36, 56],
    bottom: [181, 96, 63],
    accent: [245, 196, 166],
  },
];

const VARIANTS = [
  { prefix: 'cover', width: 900, height: 560 },
  { prefix: 'ad', width: 1280, height: 720 },
  { prefix: 'story', width: 900, height: 560 },
];

const GENERATED = [];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const campaign of CAMPAIGNS) {
  for (const variant of VARIANTS) {
    const suffix = variant.prefix === 'story' ? '1' : '';
    const name = suffix
      ? `${variant.prefix}-${campaign.slug}-${suffix}.png`
      : `${variant.prefix}-${campaign.slug}.png`;
    const seed = hashString(`${campaign.slug}:${variant.prefix}:${variant.width}`);
    const pixels = render(variant.width, variant.height, campaign, seed);
    const png = encodePng(variant.width, variant.height, pixels);
    fs.writeFileSync(path.join(OUT_DIR, name), png);
    GENERATED.push({ name, bytes: png.length });
  }
}

const totalBytes = GENERATED.reduce((sum, entry) => sum + entry.bytes, 0);
for (const entry of GENERATED) {
  console.log(`  ${entry.name.padEnd(34)} ${(entry.bytes / 1024).toFixed(1)} KB`);
}
console.log(
  `Generated ${GENERATED.length} images (${(totalBytes / 1024).toFixed(0)} KB) into ${path.relative(
    process.cwd(),
    OUT_DIR,
  )}`,
);
