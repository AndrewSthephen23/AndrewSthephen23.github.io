#!/usr/bin/env node
// ════════════════════════════════════════════════════════════
// AUDITORÍA DE CONTRASTE (WCAG 2.x) DE LOS TEMAS
// ────────────────────────────────────────────────────────────
// Lee los tokens --t-* de cada pieza de src/styles/themes/ y calcula el
// ratio de contraste de los pares texto/fondo que el sitio usa de verdad.
//
//   node scripts/check-contrast.mjs            → tabla por tema
//   node scripts/check-contrast.mjs --md       → tabla Markdown (para PRs)
//   node scripts/check-contrast.mjs mi-tema    → solo esa pieza
//
// Sale con 1 si algún par no llega a su mínimo. Úsalo al crear un tema
// nuevo (checklist de docs/GUIA_TEMAS.md §7).
// ════════════════════════════════════════════════════════════
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const THEMES_DIR = join(dirname(fileURLToPath(import.meta.url)), "../src/styles/themes");

// AA: 4.5 texto normal · 3 texto grande (≥24px, o ≥18.66px en negrita) y
// componentes de UI / bordes que transmiten información.
const TEXT = 4.5;
const LARGE = 3;

/**
 * Pares reales: [fg, bg, mínimo, dónde se usa].
 * fg/bg son nombres de token sin el prefijo --t-. Un fg puede llevar
 * opacidad con "token@0.7" (se compone sobre el fondo).
 */
const PAIRS = [
    // ── Estructura ──
    ["ink", "surface", TEXT, "texto base sobre la página"],
    ["ink", "panel", TEXT, "texto en tarjetas, nav, formularios"],
    ["ink", "soft", TEXT, "labels del formulario, código inline"],
    ["muted", "surface", TEXT, "texto secundario sobre la página (blog)"],
    ["muted", "panel", TEXT, "descripciones en tarjetas"],
    ["muted", "soft", TEXT, "placeholders sobre fondos suaves"],
    ["surface", "ink", TEXT, "nav activo / filtros (bg-ink text-surface)"],
    // ── Texto sobre rellenos de acento ──
    ["on-accent", "primary", TEXT, "hero, HIRE ME, inputs en foco, <strong>"],
    ["on-accent", "secondary", TEXT, "hovers, badge INSANE"],
    ["on-accent", "info", TEXT, "marquee, TRANSMIT, badge PROYECTO"],
    ["on-accent", "success", TEXT, "STATUS, flecha de proyecto, badge EASY"],
    ["on-accent", "special", TEXT, "badge BLOG, tile de skills"],
    ["on-accent", "warning", TEXT, "badge MEDIUM / DRAFT"],
    ["on-accent", "danger", TEXT, "badge WRITEUP / HARD, ROOT.JPG"],
    ["on-accent@0.75", "primary", TEXT, "placeholder de input en foco"],
    // ── Bloques oscuros (box) ──
    ["box-ink", "box", TEXT, "texto en terminal, footer, skills"],
    ["box-muted", "box", TEXT, "texto secundario en box"],
    ["success", "box", TEXT, "prompt de terminal, cabeceras del footer"],
    ["info", "box", TEXT, "ruta del prompt de terminal"],
    ["danger", "box", TEXT, "error de la 404"],
    ["primary", "box", TEXT, "hover de redes en el footer"],
    // ── Acentos como texto grande sobre la página (titulares) ──
    ["danger", "surface", LARGE, "_Log, _&_Logs, h3 de posts, glitch"],
    ["danger", "panel", LARGE, "títulos de proyecto/tarjeta en hover"],
    // ── Bordes y UI (3:1) ──
    ["ink", "surface", LARGE, "bordes neobrutalistas / anillo de foco"],
    ["box-ink", "box", LARGE, "anillo de foco dentro de box"],
    ["shadow", "surface", LARGE, "sombra dura (firma del tema)"],
];

// ── Color ──────────────────────────────────────────────────
function parseColor(value) {
    const v = value.trim();
    let m = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
        let h = m[1];
        if (h.length === 3) h = [...h].map((c) => c + c).join("");
        return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
    }
    m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/i);
    if (m) {
        let a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
        return { r: +m[1], g: +m[2], b: +m[3], a };
    }
    return null;
}

const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
});

function luminance({ r, g, b }) {
    const lin = (c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(fg, bg) {
    const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
    return (a + 0.05) / (b + 0.05);
}

// ── Tokens ─────────────────────────────────────────────────
function readTheme(file) {
    const css = readFileSync(join(THEMES_DIR, file), "utf8");
    // Solo el primer bloque (el contrato); los overrides de sabor no cuentan.
    const block = css.slice(css.indexOf("{"), css.indexOf("}"));
    const tokens = {};
    for (const [, name, value] of block.matchAll(/--t-([\w-]+)\s*:\s*([^;]+);/g)) {
        tokens[name] = value.replace(/\/\*.*?\*\//g, "").trim();
    }
    return tokens;
}

// ── Main ───────────────────────────────────────────────────
const args = process.argv.slice(2);
const md = args.includes("--md");
const only = args.find((a) => !a.startsWith("--"));
const files = readdirSync(THEMES_DIR)
    .filter((f) => f.endsWith(".css") && !f.startsWith("_"))
    .filter((f) => !only || f === `${only}.css`);

let failures = 0;
for (const file of files) {
    const name = file.replace(/\.css$/, "");
    const t = readTheme(file);
    const rows = [];
    for (const [fgSpec, bgName, min, where] of PAIRS) {
        const [fgName, alpha] = fgSpec.split("@");
        const bgRaw = parseColor(t[bgName] ?? "");
        const fgRaw = parseColor(t[fgName] ?? "");
        if (!bgRaw || !fgRaw) {
            rows.push({ pair: `${fgSpec} / ${bgName}`, value: "—", min, ok: false, where: "token ausente o no parseable" });
            failures++;
            continue;
        }
        // Un fondo con alpha (p. ej. box-line) se compone sobre su base.
        const base = parseColor(bgName.startsWith("box") ? t.box : t.surface);
        const bg = bgRaw.a < 1 ? over(bgRaw, base) : bgRaw;
        const fg = over({ ...fgRaw, a: fgRaw.a * (alpha ? parseFloat(alpha) : 1) }, bg);
        const r = ratio(fg, bg);
        const ok = r >= min;
        if (!ok) failures++;
        rows.push({ pair: `${fgSpec} / ${bgName}`, value: r.toFixed(2), min, ok, where });
    }

    if (md) {
        console.log(`\n#### ${name}\n`);
        console.log("| Par (texto / fondo) | Ratio | Mínimo | Estado | Uso |");
        console.log("|---|---:|---:|:---:|---|");
        for (const r of rows) {
            console.log(`| \`${r.pair}\` | ${r.value} | ${r.min} | ${r.ok ? "OK" : "**FALLA**"} | ${r.where} |`);
        }
    } else {
        console.log(`\n== ${name} ==`);
        for (const r of rows) {
            console.log(`${r.ok ? "  ok " : "FALLA"}  ${r.pair.padEnd(26)} ${String(r.value).padStart(6)}  (min ${r.min})  ${r.where}`);
        }
    }
}

console.log(failures ? `\n${failures} par(es) por debajo de AA.` : "\nTodos los pares cumplen AA.");
process.exit(failures ? 1 : 0);
