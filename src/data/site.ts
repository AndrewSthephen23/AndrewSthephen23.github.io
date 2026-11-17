// ════════════════════════════════════════════════════════════
// DATOS DEL PERFIL — único lugar donde se editan alias, contacto y redes.
// ────────────────────────────────────────────────────────────
// Los campos opcionales vacíos ("") no se renderizan: no hay enlaces
// rotos ni "#". Rellena solo lo que quieras publicar en la web.
// ════════════════════════════════════════════════════════════

export const site = {
    /** Alias público: nav, footer y títulos de página. */
    alias: "M3ow5N0IR",

    /** Perfil de GitHub (URL completa). */
    github: "https://github.com/AndrewSthephen23",

    // TODO: rellenar con el correo público; vacío oculta el email y el formulario de contacto.
    email: "",

    /** Opcionales: URLs completas de perfil. */
    linkedin: "",
    hackthebox: "",
    tryhackme: "",

    /** Opcional: ubicación a mostrar (ej. "Lima, PE / Remoto"). */
    location: "",
};

/** Redes con valor, en el orden en que se muestran. */
export const socials = [
    { label: "GitHub", href: site.github, icon: "ri:github-fill" },
    { label: "LinkedIn", href: site.linkedin, icon: "ri:linkedin-box-fill" },
    { label: "Hack The Box", href: site.hackthebox, icon: "ri:terminal-box-fill" },
    { label: "TryHackMe", href: site.tryhackme, icon: "ri:flag-2-fill" },
].filter((s) => s.href !== "");
