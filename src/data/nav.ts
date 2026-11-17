// ════════════════════════════════════════════════════════════
// ENLACES DEL NAV — compartidos por el nav de escritorio y el menú móvil.
// Los anchors usan "/#seccion" para que funcionen también desde /blog.
// ════════════════════════════════════════════════════════════

export const navLinks = [
    { href: '/#about', label: '/ABOUT' },
    { href: '/#skills', label: '/SKILLS' },
    { href: '/#experience', label: '/LOGS' },
    { href: '/#projects', label: '/WORK' },
    { href: '/blog/', label: '/BLOG', section: '/blog' },
] as const;

export const navCta = { href: '/#contact', label: 'HIRE ME' } as const;

/**
 * Valor de aria-current para un enlace: "page" si es la página actual,
 * "true" si estamos dentro de su sección (p. ej. un post bajo /blog).
 */
export function ariaCurrent(
    link: { href: string; section?: string },
    pathname: string,
): 'page' | 'true' | undefined {
    if (!('section' in link) || !link.section) return undefined;
    const path = pathname.replace(/\/+$/, '') || '/';
    if (path === link.section) return 'page';
    if (path.startsWith(`${link.section}/`)) return 'true';
    return undefined;
}
