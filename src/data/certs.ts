// ════════════════════════════════════════════════════════════
// CERTS & BADGES — certificaciones, badges y rankings reales.
// ────────────────────────────────────────────────────────────
// La sección de la home solo se renderiza si este array tiene entradas.
// Añade solo lo que puedas demostrar (idealmente con `url` de verificación).
//
// Ejemplo de entrada:
//   {
//       name: "Certified Penetration Testing Specialist",
//       issuer: "Hack The Box",
//       date: "2026-03",            // AAAA-MM o AAAA-MM-DD
//       type: "cert",
//       url: "https://…/verify/…",  // opcional
//   },
// ════════════════════════════════════════════════════════════

export type CertType = "cert" | "badge" | "ranking" | "course";

export interface Cert {
    name: string;
    issuer: string;
    /** Fecha de obtención: "AAAA-MM" o "AAAA-MM-DD". */
    date: string;
    type: CertType;
    /** Enlace de verificación o perfil público (opcional). */
    url?: string;
}

export const certs: Cert[] = [];
