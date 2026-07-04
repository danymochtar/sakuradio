/**
 * Rasterize public/icon.svg into the PNG sizes a PWA needs.
 * Run: node scripts/generate-icons.mjs
 * (Regenerate whenever public/icon.svg changes.)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public', 'icon.svg');
const out = (name) => join(root, 'public', name);

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon.png', size: 48 },
];

for (const { name, size } of targets) {
  await sharp(src, { density: 384 }).resize(size, size).png().toFile(out(name));
  console.log(`✓ ${name} (${size}px)`);
}
