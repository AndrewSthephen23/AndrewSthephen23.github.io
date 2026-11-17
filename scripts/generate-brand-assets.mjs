#!/usr/bin/env node
// ════════════════════════════════════════════════════════════
// Genera los assets de marca estáticos de public/:
//   · og-default.png        (1200×630, tarjeta Open Graph por defecto)
//   · favicon.svg           (icono vectorial de la pestaña)
//   · favicon.ico           (16/32/48 px, PNG embebidos)
//   · apple-touch-icon.png  (180×180)
//   · icon-192.png / icon-512.png + site.webmanifest
//
// Uso:  npm run brand
//
// Reproducible: los colores salen de los tokens del tema DEV
// (src/styles/themes/dev.css) y el texto se convierte a trazados con la
// JetBrains Mono self-hosted (@fontsource), así que el resultado no
// depende de las fuentes instaladas en el sistema que rasteriza.
// ════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import opentype from 'opentype.js';

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = resolve(ROOT, 'public');

// ── Datos de marca ───────────────────────────────────────────
const ALIAS = 'M3ow5N0IR';
const SUBTITLE = 'Portafolio & CTF Write-Ups';
const PROMPT = `root@${ALIAS.toLowerCase()}:~$ whoami`;
const CHIPS = [
    { text: 'PENTESTING', fill: 'secondary' },
    { text: 'CTF', fill: 'success' },
    { text: 'WEB SECURITY', fill: 'warning' },
];

// ── Tokens del tema DEV (fuente única de color) ─────────────
function readTokens(file) {
    const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const tokens = {};
    for (const [, name, value] of css.matchAll(/--t-([\w-]+)\s*:\s*([^;]+);/g)) {
        tokens[name] ??= value.trim();
    }
    return tokens;
}
const t = readTokens(resolve(ROOT, 'src/styles/themes/dev.css'));

// ── Fuentes → trazados ───────────────────────────────────────
function loadFont(weight) {
    const file = require.resolve(
        `@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff`,
    );
    const buf = readFileSync(file);
    return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}
const fonts = { 400: loadFont(400), 700: loadFont(700), 800: loadFont(800) };

/** Texto como <path>. `x`,`y` = inicio de la línea base. */
function textPath(str, { x, y, size, weight = 700, fill }) {
    const d = fonts[weight].getPath(str, x, y, size).toPathData(2);
    return `<path d="${d}" fill="${fill}"/>`;
}
const textWidth = (str, size, weight = 700) => fonts[weight].getAdvanceWidth(str, size);

/** Caja neobrutalista: sombra dura desplazada + rectángulo con borde. */
function box({ x, y, w, h, fill, stroke = t.ink, sw = 4, shadow = 8, extra = '' }) {
    const s = shadow ? `<rect x="${x + shadow}" y="${y + shadow}" width="${w}" height="${h}" fill="${t.shadow}"/>` : '';
    return `${s}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`;
}

// ── Imagen OG 1200×630 ───────────────────────────────────────
function ogSvg() {
    const W = 1200;
    const H = 630;
    const card = { x: 70, y: 66, w: 1040, h: 470 };
    const header = 62;
    const padX = card.x + 48;

    // Alias + cursor "_" en rojo
    const aliasSize = 150;
    const aliasY = card.y + header + 190;
    const aliasW = textWidth(ALIAS, aliasSize, 800);

    // Subtítulo en caja amarilla
    const subSize = 38;
    const subPad = 26;
    const subW = textWidth(SUBTITLE, subSize, 700) + subPad * 2;
    const subY = aliasY + 46;
    const subH = 76;

    // Chips
    const chipSize = 22;
    const chipH = 44;
    const chipY = subY + subH + 34;
    let chipX = padX;
    const chips = CHIPS.map(({ text, fill }) => {
        const w = textWidth(text, chipSize, 700) + 32;
        const out =
            box({ x: chipX, y: chipY, w, h: chipH, fill: t[fill], sw: 3, shadow: 4 }) +
            textPath(text, { x: chipX + 16, y: chipY + 30, size: chipSize, fill: t['on-accent'] });
        chipX += w + 18;
        return out;
    }).join('');

    // Pegatina "PWNED" girada en la esquina inferior derecha
    const stW = 200;
    const stH = 72;
    const stX = card.x + card.w - stW - 40;
    const stY = card.y + card.h - stH - 36;
    const sticker = `<g transform="rotate(-8 ${stX + stW / 2} ${stY + stH / 2})">
        ${box({ x: stX, y: stY, w: stW, h: stH, fill: t.danger, sw: 4, shadow: 6 })}
        ${textPath('PWNED', { x: stX + (stW - textWidth('PWNED', 42, 800)) / 2, y: stY + 51, size: 42, weight: 800, fill: t['box-ink'] })}
    </g>`;

    // Círculo decorativo (acento secundario) mordiendo la esquina superior derecha
    const circle = `<circle cx="${card.x + card.w + 8}" cy="${card.y + 6}" r="48" fill="${t.info}" stroke="${t.ink}" stroke-width="5"/>`;

    const dots = ['danger', 'warning', 'success']
        .map((c, i) => `<rect x="${card.x + 24 + i * 30}" y="${card.y + 22}" width="18" height="18" fill="${t[c]}" stroke="${t['box-line']}" stroke-width="1"/>`)
        .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M100 0H0V100" fill="none" stroke="${t.grid}" stroke-width="2"/>
        </pattern>
        <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1.2" fill="${t['grid-dot']}" opacity="0.5"/>
        </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="${t.surface}"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <rect width="${W}" height="${H}" fill="url(#dots)"/>
    <rect x="6" y="6" width="${W - 12}" height="${H - 12}" fill="none" stroke="${t.ink}" stroke-width="12"/>

    ${box({ x: card.x, y: card.y, w: card.w, h: card.h, fill: t.panel, sw: 6, shadow: 16 })}
    <rect x="${card.x}" y="${card.y}" width="${card.w}" height="${header}" fill="${t.box}" stroke="${t.ink}" stroke-width="6"/>
    ${dots}
    ${textPath(PROMPT, { x: card.x + 130, y: card.y + 41, size: 24, weight: 400, fill: t['box-ink'] })}

    ${textPath(ALIAS, { x: padX, y: aliasY, size: aliasSize, weight: 800, fill: t.ink })}
    ${textPath('_', { x: padX + aliasW + 6, y: aliasY, size: aliasSize, weight: 800, fill: t.danger })}

    ${box({ x: padX, y: subY, w: subW, h: subH, fill: t.primary, sw: 4, shadow: 8 })}
    ${textPath(SUBTITLE, { x: padX + subPad, y: subY + 51, size: subSize, weight: 700, fill: t['on-accent'] })}

    ${chips}
    ${sticker}
    ${circle}
</svg>`;
}

// ── Favicon ──────────────────────────────────────────────────
// Cuadrado amarillo con borde y sombra dura de tinta + "M" en negro:
// el amarillo destaca sobre pestañas oscuras y el negro sobre claras.
function markSvg({ size = 32, background } = {}) {
    // Geometría en una rejilla de 32 con coordenadas pares, para que a
    // 16 px cada borde caiga en un píxel entero (nítido, sin medios tonos):
    // cuadro 0..26 con borde de 2 y sombra dura desplazada 6 (6..32).
    const font = fonts[800];
    const glyphSize = 22;
    const bb = font.getPath('M', 0, 0, glyphSize).getBoundingBox();
    const center = 13;
    const gx = center - (bb.x1 + bb.x2) / 2;
    const gy = center - (bb.y1 + bb.y2) / 2;
    const glyph = font.getPath('M', gx, gy, glyphSize).toPathData(2);

    const mark = `<rect x="6" y="6" width="26" height="26" fill="${t.shadow}"/>
    <rect x="1" y="1" width="24" height="24" fill="${t.primary}" stroke="${t.ink}" stroke-width="2"/>
    <path d="${glyph}" fill="${t.ink}"/>`;
    if (!background) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    ${mark}
</svg>`;
    }
    // Iconos de app (fondo opaco): la marca ocupa ~62% del lienzo, centrada.
    const scale = 0.62;
    const offset = (32 - 32 * scale) / 2;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="${background}"/>
    <g transform="translate(${offset} ${offset}) scale(${scale})">${mark}</g>
</svg>`;
}

const png = (svg, size) =>
    sharp(Buffer.from(svg)).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** ICO con PNG embebidos (soportado por todos los navegadores actuales). */
function buildIco(images) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reservado
    header.writeUInt16LE(1, 2); // tipo: icono
    header.writeUInt16LE(images.length, 4);
    const entries = [];
    let offset = 6 + 16 * images.length;
    for (const { size, data } of images) {
        const e = Buffer.alloc(16);
        e.writeUInt8(size >= 256 ? 0 : size, 0);
        e.writeUInt8(size >= 256 ? 0 : size, 1);
        e.writeUInt8(0, 2); // paleta
        e.writeUInt8(0, 3); // reservado
        e.writeUInt16LE(1, 4); // planos
        e.writeUInt16LE(32, 6); // bpp
        e.writeUInt32LE(data.length, 8);
        e.writeUInt32LE(offset, 12);
        offset += data.length;
        entries.push(e);
    }
    return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

// ── Escritura ────────────────────────────────────────────────
async function main() {
    const out = (name, data) => {
        writeFileSync(resolve(PUBLIC, name), data);
        console.log(`  public/${name}`);
    };
    console.log('Generando assets de marca:');

    out('og-default.png', await sharp(Buffer.from(ogSvg())).png({ compressionLevel: 9 }).toBuffer());

    const favicon = markSvg();
    out('favicon.svg', favicon + '\n');

    const icoSizes = [16, 32, 48];
    const icoImages = await Promise.all(
        icoSizes.map(async (size) => ({ size, data: await png(markSvg({ size }), size) })),
    );
    out('favicon.ico', buildIco(icoImages));

    out('apple-touch-icon.png', await png(markSvg({ size: 180, background: t.surface }), 180));
    out('icon-192.png', await png(markSvg({ size: 192, background: t.surface }), 192));
    out('icon-512.png', await png(markSvg({ size: 512, background: t.surface }), 512));

    const manifest = {
        name: `${ALIAS} — ${SUBTITLE}`,
        short_name: ALIAS,
        icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        start_url: '/',
        display: 'standalone',
        theme_color: t.surface,
        background_color: t.surface,
    };
    out('site.webmanifest', JSON.stringify(manifest, null, 2) + '\n');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
