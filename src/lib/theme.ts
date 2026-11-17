// ════════════════════════════════════════════════════════════
// Lectura de tokens de las piezas de tema EN BUILD.
// ────────────────────────────────────────────────────────────
// Para lo que no puede leer CSS en el navegador (p. ej. <meta
// name="theme-color">, que necesita un color literal) se extrae el
// valor del token directamente de src/styles/themes/<tema>.css:
// el color sigue viviendo en un único sitio.
// ════════════════════════════════════════════════════════════

const sources = import.meta.glob<string>('../styles/themes/*.css', {
    query: '?raw',
    import: 'default',
    eager: true,
});

/** Valor de `--t-<token>` en la pieza `theme` (p. ej. "dev", "surface"). */
export function themeToken(theme: string, token: string): string | undefined {
    const css = sources[`../styles/themes/${theme}.css`];
    if (!css) return undefined;
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const match = clean.match(new RegExp(`--t-${token}\\s*:\\s*([^;]+);`));
    return match?.[1].trim();
}
