#!/usr/bin/env bash
# UserPromptSubmit hook: auto-registra cada prompt en prompts.md tal cual llega.
# Solo observa — nunca bloquea el turno (siempre exit 0), nunca modifica el prompt.
set -euo pipefail

PROMPTS_FILE="${CLAUDE_PROJECT_DIR}/prompts.md"
MODEL_FALLBACK="_(completar)_"
TOOL_DEFAULT="Claude Code (copia CON harness)"

input="$(cat)"

# Modelo: el de la última respuesta del asistente en el transcript de la sesión
# (el hook no recibe el modelo directamente). Es el del turno anterior: en el
# primer prompt de una sesión, o justo después de un /model, puede no cuadrar.
model="$(node -e '
  const fs = require("fs");
  let data = "";
  process.stdin.on("data", c => data += c);
  process.stdin.on("end", () => {
    try {
      const { transcript_path } = JSON.parse(data);
      const lines = fs.readFileSync(transcript_path, "utf8").trim().split("\n");
      for (let i = lines.length - 1; i >= 0; i--) {
        let e;
        try { e = JSON.parse(lines[i]); } catch { continue; }
        const id = e.type === "assistant" && !e.isSidechain && e.message && e.message.model;
        if (!id || id.startsWith("<")) continue;
        // claude-opus-5-5 -> Opus 5.5
        const m = id.match(/^claude-([a-z]+)-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?$/);
        let name = m ? m[1][0].toUpperCase() + m[1].slice(1) + " " + m[2] + (m[3] ? "." + m[3] : "") : id;
        if (e.effort) name += " (effort " + e.effort + ")";
        process.stdout.write(name);
        return;
      }
    } catch (err) {}
  });
' <<< "$input")"
model="${model:-$MODEL_FALLBACK}"

prompt_text="$(node -e '
  let data = "";
  process.stdin.on("data", c => data += c);
  process.stdin.on("end", () => {
    try {
      const j = JSON.parse(data);
      let p = j.prompt || "";
      // Quita bloques de contexto que Claude Code inyecta solo (no lo tecleó
      // el usuario): ide_opened_file, ide_selection, system-reminder, etc.
      // "tal cual lo lanzaste" es tal cual TU lo escribiste, no lo que el
      // cliente añade por su cuenta.
      p = p.replace(/<(ide_opened_file|ide_selection|ide_diagnostics|system-reminder)>[\s\S]*?<\/\1>\n?/g, "");
      process.stdout.write(p.trim());
    } catch (e) {
      process.exit(0);
    }
  });
' <<< "$input")"

# Sin prompt (input inesperado) o sin prompts.md en este proyecto: no hacer nada.
if [ -z "$prompt_text" ] || [ ! -f "$PROMPTS_FILE" ]; then
  exit 0
fi

count=$(grep -c '^## Prompt ' "$PROMPTS_FILE" 2>/dev/null) || count=0
next_n=$((count + 1))

{
  echo ""
  echo "## Prompt ${next_n}"
  echo ""
  echo "**Modelo:** ${model}"
  echo "**Herramienta:** ${TOOL_DEFAULT}"
  echo ""
  echo '```'
  printf '%s\n' "$prompt_text"
  echo '```'
  echo ""
  echo "**Qué salió:** _(completar)_"
} >> "$PROMPTS_FILE"

exit 0
