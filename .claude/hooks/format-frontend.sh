#!/usr/bin/env bash
# PostToolUse hook (Edit|Write|MultiEdit): formatea con Prettier el archivo que
# el agente acaba de tocar si está bajo frontend/src/. Nunca bloquea el turno.
set -uo pipefail

# Rutas reales: el proyecto se abre a veces a través de un enlace simbólico
FRONTEND_DIR="$(realpath "${CLAUDE_PROJECT_DIR}/frontend")"
PRETTIER="${FRONTEND_DIR}/node_modules/.bin/prettier"

file="$(jq -r '.tool_input.file_path // empty')"
[ -n "$file" ] && [ -f "$file" ] || exit 0
file="$(realpath "$file")"

case "$file" in
  "${FRONTEND_DIR}/src/"*) ;;
  *) exit 0 ;;
esac

if [ ! -x "$PRETTIER" ]; then
  echo "format-frontend: Prettier no está instalado (cd frontend && npm install)" >&2
  exit 0
fi

# --ignore-unknown: no falla con archivos que Prettier no sabe formatear (imágenes, etc.)
cd "$FRONTEND_DIR" && "$PRETTIER" --write --ignore-unknown --log-level warn "$file" >&2 || true
exit 0
