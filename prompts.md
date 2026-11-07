# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

---

## Prompt 1

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Analiza únicamente el requisito "Lo que cada tarea muestra de su responsable" de openspec/specs/tasks/spec.md.

No analices otros requisitos ni la capability completa.

Extrae todos los scenarios asociados a este requisito.

Para cada scenario devuelve:
- Identificador o título (si existe)
- Resumen en una sola línea indicando qué se espera y en qué situación
- Texto original del scenario

No busques tests todavía.
No evalúes cobertura.
No generes código.

Devuelve únicamente una tabla con los scenarios encontrados.
```

**Qué salió:** Identificó los tres escenarios del requisito con su resumen y texto original.

---

## Prompt 2

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Usando únicamente los scenarios identificados para el requisito "Lo que cada tarea muestra de su responsable":

Para cada scenario:

- Busca los tests relacionados existentes.
- Muestra el nombre exacto de cada test encontrado.
- Explica brevemente qué valida realmente cada test.
- Determina si el scenario está:
  - Cubierto
  - No cubierto
  - No lo sé

Si un scenario no tiene un test identificable con nombre exacto, déjalo sin asociar.

Genera una tabla de trazabilidad con las columnas:
Scenario | Test | Estado | Evidencia

No generes código ni propongas cambios.
Solo recopila evidencia.
```

**Qué salió:** Generó una matriz de trazabilidad y concluyó que los tres escenarios no tenóan evidencia directa de cobertura.

---

## Prompt 3

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Genera solo los tests necesarios para cubrir los 3 scenarios identificados.

- Sigue el estilo de backend/tests/functional/auth.
- Reutiliza los helpers existentes.
- No modifiques código de producción.

Primero muestra:

Scenario | Nombre del test | Cobertura

Después muestra únicamente el código de los nuevos tests.
```

**Qué salió:** Generó 6 tests funcionales, cubrió 3 escenarios y detectó 2 fallos reales por exposición del email del responsable.

---

## Prompt 4

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Redacta el contenido completo para docs/verificacion/JLL.md usando la matriz de trazabilidad obtenida, los resultados de los tests y los hallazgos detectados.

No inventes información.
Genera únicamente Markdown.
```

**Qué salió:** escribió `docs/verificacion/JLL.md` con la matriz, los resultados, los hallazgos y las tres líneas; dejó como pendiente la estimación previa de la línea 1 porque no la conocía.

---

## Prompt 5

**Modelo:** Claude Opus 5.5 (`claude-opus-5-5`)
**Herramienta:** Claude Code

```
Genera prompts.md con los prompts usados
```

**Qué salió:** este archivo.
