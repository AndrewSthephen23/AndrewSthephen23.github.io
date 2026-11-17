# Cómo publicar un writeup / post 📝

Publicar es crear **un archivo** en `src/content/blog/` y hacer commit. Nada más.

## 1. Crea el archivo

Crea `src/content/blog/mi-post.md` (el nombre del archivo es la URL:
`/blog/mi-post/`). Usa `.mdx` en vez de `.md` si quieres componentes interactivos
(llegan en la Fase 3).

## 2. Rellena el frontmatter

```markdown
---
title: "HTB: NombreMáquina — Write-Up"     # obligatorio
description: "Resumen de una frase para la tarjeta y el SEO."   # obligatorio
pubDate: 2026-07-07                          # obligatorio (YYYY-MM-DD)
category: writeup                            # writeup | proyecto | blog
platform: HTB                                # HTB | THM | CTF | otro  (solo writeups)
difficulty: easy                             # easy | medium | hard | insane (solo writeups)
os: linux                                    # linux | windows | otro (solo writeups)
tags: ["samba", "privesc", "linux"]          # opcional
draft: false                                 # true = no se publica en producción
---

Aquí empieza el contenido en Markdown normal...
```

### Campos

| Campo | ¿Obligatorio? | Notas |
|-------|--------------|-------|
| `title` | Sí | Titular del post. |
| `description` | Sí | Aparece en la tarjeta y (Fase 4) en las OG cards. |
| `pubDate` | Sí | Ordena los posts (más reciente primero). |
| `category` | No (default `blog`) | Define el badge y el filtro: `writeup`, `proyecto`, `blog`. |
| `platform` / `difficulty` / `os` | No | Solo para writeups. Forman la línea `HTB • EASY • LINUX`. |
| `tags` | No | Lista de etiquetas. |
| `image` | No | Portada/OG (se optimiza con `astro:assets`). |
| `draft` | No (default `false`) | `true` lo oculta en producción pero se ve en `npm run dev`. |
| `updatedDate` | No | Fecha de última edición. |

## 3. Escribe el contenido

Markdown normal. Los **bloques de código** se renderizan con marco de terminal,
resaltado de sintaxis y botón de copiar automáticamente. Indica el lenguaje:

````markdown
```bash
nmap -sC -sV 10.10.10.3
```
````

Usa `ansi` como lenguaje para pegar **salidas de terminal** con colores.

### Componentes especiales (solo en archivos `.mdx`)

Si tu archivo es `.mdx` (no `.md`), tienes tres componentes listos para usar
**sin necesidad de importarlos**:

```mdx
<Callout type="info" title="Nota">Texto destacado.</Callout>
<Callout type="warn">Advertencia.</Callout>
<Callout type="pwned">Máquina comprometida.</Callout>
<Callout type="tip">Consejo útil.</Callout>

<Terminal user="root" host="lame" path="/" cmd="id">
uid=0(root) gid=0(root)
</Terminal>

Flag de usuario: <Flag label="user.txt">HTB{ejemplo_de_flag}</Flag>
```

- **`<Callout>`** — caja de nota. `type`: `info` | `warn` | `pwned` | `tip`.
- **`<Terminal>`** — comando + salida con prompt estilizado. El contenido del
  slot es la salida; el comando va en `cmd`.
- **`<Flag>`** — oculta un valor (flag, hash) con desenfoque hasta que se hace click.

Ejemplo completo en uso: `src/content/blog/htb-lame.mdx`.

## 4. Previsualiza

```bash
npm run dev
```

Abre `http://localhost:4321/blog`. Prueba el toggle de tema: el código cambia de
claro (DEV) a oscuro (HACKER) contigo.

## 5. Publica

```bash
git add src/content/blog/mi-post.md
git commit -m "post: writeup de NombreMáquina"
git push
```

(El deploy automático llega en la Fase 6; por ahora `git push` versiona el post.)

---

**Errores comunes:** si el build falla con un error de validación, revisa el
frontmatter — un `category`/`difficulty`/`os` fuera de los valores permitidos o
una fecha mal escrita son las causas típicas. El schema vive en
`src/content.config.ts`.
