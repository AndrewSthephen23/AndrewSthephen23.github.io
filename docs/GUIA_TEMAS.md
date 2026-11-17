# Guía del Sistema de Temas tipo LEGO 🧱

> Cómo funcionan los temas intercambiables del sitio, cómo crear uno nuevo
> y **cómo especificar el diseño UX/UI** cuando quieras cambiar de estilo.

---

## 1. El concepto

El sitio nunca habla de colores concretos. Los componentes hablan en **roles**
(`bg-panel`, `text-ink`, `border-ink`, `bg-primary`, `shadow-hard`...) y cada
**tema** es un archivo CSS independiente que decide qué color real tiene cada rol.

```
┌────────────────────────────┐
│  COMPONENTES (.astro)      │  ← usan roles: bg-panel, text-ink, shadow-hard
│  "quiero un panel con      │     NUNCA colores directos (#fff, border-black)
│   tinta y sombra dura"     │
└─────────────┬──────────────┘
              │
┌─────────────▼──────────────┐
│  PUENTE (global.css)       │  ← @theme inline: convierte cada token --t-*
│  rol → token del contrato  │     en utilidad Tailwind. NO SE TOCA.
└─────────────┬──────────────┘
              │
┌─────────────▼──────────────┐
│  PIEZAS LEGO (themes/*.css)│  ← cada tema define TODOS los tokens --t-*
│  dev.css  hacker.css  ...  │     y opcionalmente "overrides de sabor"
└────────────────────────────┘
```

**Slots:** el sitio tiene 2 slots — `light` y `dark` — y el botón del nav alterna
entre ellos. Qué pieza ocupa cada slot se decide en **un solo lugar**:
`THEME_SLOTS` en [Layout.astro](../src/layouts/Layout.astro).

```js
const THEME_SLOTS = { light: "dev", dark: "hacker" };
```

Cambiar de estilo = crear otra pieza y cambiar un nombre aquí. Nada más.

---

## 2. Anatomía de los archivos

| Archivo | Rol | ¿Se toca al crear un tema? |
|---------|-----|---------------------------|
| `src/styles/themes/dev.css` | Pieza "DEV" (slot light actual) | No |
| `src/styles/themes/hacker.css` | Pieza "HACKER" (slot dark actual) | No |
| `src/styles/themes/_plantilla.css` | Plantilla para copiar | Se copia |
| `src/styles/global.css` | Puente tokens→Tailwind + imports de temas | Solo añadir 1 `@import` |
| `src/layouts/Layout.astro` | `THEME_SLOTS` + etiquetas del botón toggle | Solo el slot y la etiqueta |

---

## 3. El contrato de tokens (obligatorio)

Todo tema DEBE definir estos 22 tokens. Si falta uno, esa parte de la UI heredará
el valor del tema por defecto y se verá rota.

### Estructura
| Token | Rol en la UI | Utilidades que genera |
|-------|-------------|----------------------|
| `--t-surface` | Fondo de página | `bg-surface`, `text-surface` |
| `--t-panel` | Tarjetas, nav, formularios | `bg-panel` |
| `--t-soft` | Rellenos neutros suaves (fondo de forms, placeholders de foto) | `bg-soft` |
| `--t-ink` | Texto y **bordes** principales (el "negro" del neobrutalismo) | `text-ink`, `border-ink`, `bg-ink` |
| `--t-muted` | Texto secundario / descripciones | `text-muted`, `border-muted` |
| `--t-on-accent` | Texto encima de rellenos de acento (garantiza contraste) | `text-on-accent` |

### Bloques oscuros (cajas "terminal", footer, sección skills)
| Token | Rol en la UI |
|-------|-------------|
| `--t-box` | Fondo de bloques destacados oscuros |
| `--t-box-ink` | Texto principal sobre box |
| `--t-box-muted` | Texto secundario sobre box |
| `--t-box-line` | Bordes y divisores sobre box (lleva alpha, ej. `rgb(255 255 255 / 0.15)`) |

### Efectos
| Token | Rol en la UI |
|-------|-------------|
| `--t-shadow` | Color de las sombras duras (`shadow-hard`, `-sm`, `-lg`, `-xl`) — **la firma visual del tema** |
| `--t-grid` | Líneas de la rejilla del fondo |
| `--t-grid-dot` | Puntos de la rejilla del fondo |

### Acentos (7 roles)
| Token | Rol semántico | Uso típico |
|-------|--------------|-----------|
| `--t-primary` | Highlight protagonista | Caja del hero, HIRE ME, focus de inputs, cursor hover |
| `--t-secondary` | Acento secundario | Hovers alternativos, decoración |
| `--t-info` | Informativo | Marquee, botón TRANSMIT, links técnicos |
| `--t-success` | Estado OK / terminal | Status ONLINE, barra de progreso, borde del footer |
| `--t-special` | Decorativo | Cita del about, tarjetas |
| `--t-warning` | Aviso | Tags, tarjetas |
| `--t-danger` | Error / glitch | ROOT.JPG, `_Log`, efecto glitch |

### Tipografía
| Token | Rol |
|-------|-----|
| `--t-font-display` | Titulares (`font-display`) |
| `--t-font-mono` | Texto técnico (`font-mono`) |

Además: `color-scheme: light | dark` (controles nativos y scrollbars).

---

## 4. Cómo crear e instalar una pieza nueva (paso a paso)

1. **Copia** `src/styles/themes/_plantilla.css` → `src/styles/themes/mi-tema.css`.
2. **Renombra** el selector a `[data-theme="mi-tema"]` (mismo nombre que el archivo).
3. **Rellena los 22 tokens** siguiendo tu spec de diseño (ver sección 6).
4. *(Opcional)* Añade **overrides de sabor** al final del archivo, siempre con el
   prefijo `[data-theme="mi-tema"]` — texturas, scanlines, forma del cursor,
   el marquee (`.marquee-bar`), el blend del hero (`.blend-darken`). Mira
   [hacker.css](../src/styles/themes/hacker.css) como ejemplo real.
5. **Importa** en `global.css`: `@import "./themes/mi-tema.css";`
6. **Encaja la pieza** en su slot en `Layout.astro`:
   ```js
   const THEME_SLOTS = { light: "dev", dark: "mi-tema" };  // reemplaza hacker
   ```
7. Actualiza la **etiqueta del botón** toggle en el nav (los `<span data-mode-label>`).
8. `npm run dev` y pasa el **checklist de QA** (sección 7).

> Los temas que no están en un slot no ocupan lugar en la mente del usuario:
> puedes acumular piezas (`cyberpunk.css`, `paper.css`, `dracula.css`) y rotar
> cuando quieras. Solo pagan unos bytes de CSS.

### Reglas para no romper el sistema 🚫

- **Nunca** escribas colores directos en componentes (`bg-white`, `border-black`,
  `text-[#33FF57]`). Si un componente lo necesita, es señal de que falta un rol.
- **Nunca** edites el bloque `@theme inline` de `global.css` para un tema.
- Si añades un **token nuevo** al contrato: agrégalo al puente en `global.css`,
  a `_plantilla.css` y a **TODOS** los temas existentes.
- Los overrides de sabor van **en el archivo del tema**, jamás en `global.css`
  ni en los componentes.

---

## 5. Piezas actuales

| Pieza | Slot | Identidad |
|-------|------|-----------|
| `dev` | light | Neobrutalismo clásico: crema + bordes negros + sombras negras + acentos saturados |
| `hacker` | dark | Terminal phosphor: negro + verde fósforo + **sombras verdes** + scanlines + cursor de bloque |

---

## 6. 📋 Cómo especificar el diseño UX/UI de un tema nuevo

Cuando quieras un estilo nuevo, redacta una **spec** con esta plantilla y
entrégamela (o úsala tú mismo para rellenar los tokens). Con esto alcanza
para construir la pieza completa sin ambigüedad:

```markdown
## SPEC DE TEMA: <nombre-kebab-case>

### 1. Identidad
- **Slot destino:** light | dark
- **Concepto en una frase:** (ej. "revista de skate de los 2000 fotocopiada")
- **3 adjetivos:** (ej. crudo, ácido, impreso)
- **Referencias visuales:** links, screenshots o "como X app/juego/película"

### 2. Color (mapea a los tokens)
- **Fondo de página (surface):** #......
- **Paneles/tarjetas (panel):** #......
- **Tinta: texto y bordes (ink):** #......
- **Sombra dura (shadow):** #......  ← la personalidad del tema vive aquí
- **Acento protagonista (primary):** #......
- **Resto de acentos (secondary/info/success/special/warning/danger):**
  #... #... #... (si das menos de 7, yo derivo el resto en armonía)
- **¿Los bloques "terminal" (box) siguen oscuros o cambian?**

### 3. Tipografía
- **Titulares (display):** mantener Space Grotesk | otra: ______
- **Mono:** mantener JetBrains Mono | otra: ______

### 4. Textura y efectos (overrides de sabor)
- **Fondo:** rejilla actual | puntos | ruido | scanlines | liso | otro
- **Cursor custom:** círculo | bloque terminal | cruz | flecha nativa | otro
- **Marquee:** color/estilo deseado
- **Extras:** (ej. grano de papel, glow neón, esquinas rotas, stickers)

### 5. Sensación de movimiento
- **Intensidad:** igual que ahora | más sobrio | más caótico
- **Detalles:** (ej. "sin bounce", "glitch más agresivo", "todo más lento")

### 6. No negociables
- Qué NO debe pasar (ej. "nada de degradados", "el verde jamás sobre blanco")
```

### Ejemplo rellenado (spec lista para construir)

```markdown
## SPEC DE TEMA: cyberpunk

### 1. Identidad
- Slot destino: dark
- Concepto: "Night City: neón sobre asfalto mojado"
- 3 adjetivos: neón, denso, eléctrico
- Referencias: UI de Cyberpunk 2077, portadas synthwave

### 2. Color
- surface: #0D0221 (púrpura casi negro)
- panel: #150633
- ink: #F3EFFF
- shadow: #FF2BD6 (magenta neón — sombras duras rosas)
- primary: #FCEE0A (amarillo CP2077)
- secondary #FF2BD6 / info #00F0FF / success #39FF14 /
  special #B36BFF / warning #FF9F1C / danger #FF003C
- Los box siguen negros (#05010D) con líneas cian

### 3. Tipografía
- display: mantener / mono: mantener

### 4. Textura y efectos
- Fondo: rejilla en perspectiva sutil color #1E0B45
- Cursor: cruz cian
- Marquee: negro con texto cian y glow suave
- Extras: glow exterior tenue en shadow-hard-lg

### 5. Movimiento
- Igual que ahora, glitch un 20% más agresivo

### 6. No negociables
- El amarillo primary nunca como fondo de secciones grandes
```

---

## 7. Checklist de QA al instalar una pieza

- [ ] Hero: titular legible, caja de subtítulo con contraste, ambos botones CTA.
- [ ] Marquee: texto legible sobre su fondo.
- [ ] About: cita, chips de estado, highlight `estética cruda`.
- [ ] Skills: hover de TODAS las tiles legible (texto sobre cada acento).
- [ ] Experience: los 4 `textColor` de empresas legibles sobre panel.
- [ ] Selected Works: título hueco (stroke) visible sobre el fondo `primary`.
- [ ] User Reports: tarjetas y estrellas visibles sobre box.
- [ ] Contact: inputs en foco (fondo primary + texto on-accent), botón submit.
- [ ] Footer: links, hovers y divisores.
- [ ] Toggle: alternar 5 veces seguidas — sin flash al recargar (anti-FOUC).
- [ ] Selección de texto (`Ctrl+A`) legible.
- [ ] Contraste AA en texto normal (usa el inspector o https://webaim.org/resources/contrastchecker/).
