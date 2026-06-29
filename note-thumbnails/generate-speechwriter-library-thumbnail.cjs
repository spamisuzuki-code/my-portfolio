const path = require("path");
const sharp = require("sharp");

const src = "C:/Users/aimei/Downloads/AdobeStock_107325313.jpeg";
const outDir = __dirname;
const outPath = path.join(outDir, "speechwriter-origin-note-thumbnail-library.png");

const width = 1280;
const height = 670;

const overlay = Buffer.from(String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#061016" stop-opacity="0.78"/>
      <stop offset="0.44" stop-color="#061016" stop-opacity="0.58"/>
      <stop offset="0.68" stop-color="#061016" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#061016" stop-opacity="0.08"/>
    </linearGradient>
    <radialGradient id="warm" cx="39%" cy="47%" r="45%">
      <stop offset="0" stop-color="#f5d2a3" stop-opacity="0.2"/>
      <stop offset="0.5" stop-color="#f5d2a3" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#f5d2a3" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-40%" width="140%" height="180%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.32"/>
    </filter>
    <style>
      .serif { font-family: "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", serif; }
      .sans { font-family: "Yu Gothic", "YuGothic", "Hiragino Sans", "Noto Sans CJK JP", sans-serif; }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#shade)"/>
  <rect width="${width}" height="${height}" fill="url(#warm)"/>
  <g filter="url(#softShadow)">
    <text x="116" y="160" class="sans" font-size="30" fill="#f0d4b3" letter-spacing="2.4">スピーチライターを目指した経緯</text>
    <text x="114" y="255" class="serif" font-size="58" fill="#fff7ec" font-weight="700">理屈で</text>
    <text x="114" y="328" class="serif" font-size="52" fill="#fff7ec" font-weight="700">臨床検査技師に。</text>
    <text x="114" y="415" class="serif" font-size="64" fill="#fff7ec" font-weight="700">感動で、</text>
    <text x="114" y="502" class="serif" font-size="64" fill="#d69b63" font-weight="700">スピーチライターに。</text>
    <rect x="116" y="538" width="278" height="2" fill="#d69b63" opacity="0.82"/>
    <text x="116" y="584" class="sans" font-size="23" fill="#dac8b8" letter-spacing="3">鈴木愛美</text>
  </g>
</svg>`);

async function main() {
  await sharp(src)
    .resize({
      width,
      height,
      fit: "cover",
      position: "east",
    })
    .modulate({ saturation: 0.94, brightness: 0.86 })
    .composite([{ input: overlay, left: 0, top: 0 }])
    .png()
    .toFile(outPath);

  console.log(outPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
