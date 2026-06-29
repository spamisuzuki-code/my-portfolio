const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outDir = __dirname;
const labPhoto = "C:/Users/aimei/Downloads/AdobeStock_140486214.jpeg";
const writerPhoto = "C:/Users/aimei/Downloads/AdobeStock_135344620.jpeg";
const outPath = path.join(outDir, "speechwriter-origin-note-thumbnail-photo-left-microscope.png");

const width = 1280;
const height = 670;

function svgBuffer(svg) {
  return Buffer.from(svg);
}

async function pulledBackImage(file, options = {}) {
  const {
    flip = false,
    position = "center",
    saturation = 0.9,
    brightness = 0.95,
    scale = 0.88,
    blur = 0,
  } = options;

  let base = sharp(file);
  let subject = sharp(file);

  if (flip) {
    base = base.flop();
    subject = subject.flop();
  }

  const background = await base
    .resize({ width, height, fit: "cover", position })
    .modulate({ saturation, brightness })
    .blur(16)
    .png()
    .toBuffer();

  const foregroundPipeline = subject
    .resize({
      width: Math.round(width * scale),
      height: Math.round(height * scale),
      fit: "cover",
      position,
    })
    .modulate({ saturation, brightness });

  if (blur >= 0.3) {
    foregroundPipeline.blur(blur);
  }

  const foreground = await foregroundPipeline
    .png()
    .toBuffer();

  const left = Math.round((width - Math.round(width * scale)) / 2);
  const top = Math.round((height - Math.round(height * scale)) / 2);

  return sharp(background)
    .composite([{ input: foreground, left, top }])
    .png()
    .toBuffer();
}

async function main() {
  const lab = await pulledBackImage(labPhoto, {
    flip: true,
    position: "west",
    saturation: 0.88,
    brightness: 0.96,
    scale: 0.88,
    blur: 0.3,
  });

  const writer = await pulledBackImage(writerPhoto, {
    position: "east",
    saturation: 0.92,
    brightness: 0.94,
    scale: 0.84,
  });

  const writerMask = svgBuffer(String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="white" stop-opacity="0"/>
        <stop offset="0.28" stop-color="white" stop-opacity="0"/>
        <stop offset="0.5" stop-color="white" stop-opacity="0.3"/>
        <stop offset="0.72" stop-color="white" stop-opacity="0.84"/>
        <stop offset="1" stop-color="white" stop-opacity="1"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#fade)"/>
  </svg>`);

  const maskedWriter = await sharp(writer)
    .ensureAlpha()
    .composite([{ input: writerMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const shade = svgBuffer(String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="vignette" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#061b27" stop-opacity="0.34"/>
        <stop offset="0.48" stop-color="#0b2227" stop-opacity="0.18"/>
        <stop offset="1" stop-color="#07191e" stop-opacity="0.34"/>
      </linearGradient>
      <linearGradient id="blendWash" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#e8f0ed" stop-opacity="0"/>
        <stop offset="0.35" stop-color="#e8f0ed" stop-opacity="0.16"/>
        <stop offset="0.5" stop-color="#e8f0ed" stop-opacity="0.36"/>
        <stop offset="0.65" stop-color="#e8f0ed" stop-opacity="0.16"/>
        <stop offset="1" stop-color="#e8f0ed" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="light" cx="45%" cy="43%" r="48%">
        <stop offset="0" stop-color="#fff8ed" stop-opacity="0.88"/>
        <stop offset="0.48" stop-color="#fff8ed" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#fff8ed" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="1" stop-color="#f8fbff" stop-opacity="0.78"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-40%" width="140%" height="180%">
        <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#001018" flood-opacity="0.25"/>
      </filter>
      <style>
        .serif { font-family: "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", serif; }
        .sans { font-family: "Yu Gothic", "YuGothic", "Hiragino Sans", "Noto Sans CJK JP", sans-serif; }
      </style>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#vignette)"/>
    <rect width="${width}" height="${height}" fill="url(#blendWash)"/>
    <rect width="${width}" height="${height}" fill="url(#light)" opacity="0.75"/>
    <rect x="288" y="126" width="704" height="410" rx="10" fill="url(#paper)" filter="url(#shadow)"/>
    <rect x="314" y="150" width="652" height="362" rx="4" fill="#ffffff" opacity="0.22"/>
    <path d="M334 430 C456 368 574 372 690 430 S852 492 946 430" fill="none" stroke="#b76e36" stroke-width="4" stroke-linecap="round" opacity="0.54"/>
    <text x="640" y="210" class="sans" font-size="24" fill="#42636e" text-anchor="middle" letter-spacing="3">スピーチライターを目指した経緯</text>
    <text x="640" y="292" class="serif" font-size="55" fill="#173947" text-anchor="middle" font-weight="700">理屈で検査技師に。</text>
    <text x="640" y="367" class="serif" font-size="61" fill="#173947" text-anchor="middle" font-weight="700">感動で、</text>
    <text x="640" y="443" class="serif" font-size="61" fill="#a85f2d" text-anchor="middle" font-weight="700">スピーチライターに。</text>
    <rect x="510" y="474" width="260" height="2" fill="#a85f2d" opacity="0.64"/>
    <text x="640" y="513" class="sans" font-size="22" fill="#4d636b" text-anchor="middle" letter-spacing="3">鈴木愛美</text>
  </svg>`);

  await sharp(lab)
    .composite([
      { input: maskedWriter, left: 0, top: 0 },
      { input: shade, left: 0, top: 0 },
    ])
    .png()
    .toFile(outPath);

  console.log(outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
