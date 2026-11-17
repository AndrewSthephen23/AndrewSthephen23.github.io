#!/usr/bin/env bash
# Busca placeholders y dependencias de CDN que no deben llegar a producción.
#
# Uso local:   bash .github/scripts/check-placeholders.sh [directorio]   (por defecto: src)
# Sale con 1 si encuentra alguno, 0 si está limpio.
# En GitHub Actions emite además una anotación ::error por coincidencia.
set -uo pipefail

DIR="${1:-src}"

PATTERNS=(
  'tu-usuario'            # enlaces de GitHub/socials de la plantilla
  'href="#"'              # enlaces vacíos
  'images.unsplash.com'   # imágenes de stock en lugar de propias
  'fonts.googleapis.com'  # fuentes por CDN (deben ir self-hosted)
  'cdn.jsdelivr.net'      # iconos/librerías por CDN
)

found=0
for pattern in "${PATTERNS[@]}"; do
  # -F: literal; -r: recursivo; -n: número de línea; -I: ignora binarios
  matches="$(grep -rnIF -- "$pattern" "$DIR" || true)"
  [ -z "$matches" ] && continue
  while IFS= read -r line; do
    found=$((found + 1))
    file="${line%%:*}"
    rest="${line#*:}"
    lineno="${rest%%:*}"
    if [ "${GITHUB_ACTIONS:-}" = "true" ]; then
      echo "::error file=${file},line=${lineno},title=Placeholder::Patrón '${pattern}' encontrado"
    else
      echo "${file}:${lineno}: '${pattern}'"
    fi
  done <<< "$matches"
done

if [ "$found" -gt 0 ]; then
  echo "Encontrados ${found} placeholder(s) en ${DIR}/."
  exit 1
fi
echo "Sin placeholders en ${DIR}/."
