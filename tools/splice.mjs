// Remplace dans un fichier le texte situé entre deux repères (le repère de début inclus, celui de fin exclu).
// Usage : node tools/splice.mjs <fichier> <fragment> "<repère début>" "<repère fin>"
import fs from 'node:fs';
const [file, frag, start, end] = process.argv.slice(2);
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf(start); if (a < 0) throw new Error('repère de début introuvable');
const b = s.indexOf(end, a + start.length); if (b < 0) throw new Error('repère de fin introuvable');
s = s.slice(0, a) + fs.readFileSync(frag, 'utf8') + s.slice(b);
fs.writeFileSync(file, s);
console.log(`remplacé ${b - a} caractères dans ${file}`);
