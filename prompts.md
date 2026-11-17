# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Registro de prompts de la sesión

Todas las llamadas se hicieron al mismo modelo, **Opus 5.5 (`claude-opus-5-5`)**, desde Claude Code 2.1.319 en modo `auto`. Los datos salen del transcript local de la sesión `91b87931-2f1c-4f2b-919f-89674e6d7cbd` (`~/.claude/projects/<proyecto>/<sesión>.jsonl`). Las horas están en UTC.

| #   | Hora (UTC) | Prompt                                                                           | Llamadas al LLM | Tiempo del LLM | Herramientas                  | Total del turno |
| --- | ---------- | -------------------------------------------------------------------------------- | --------------- | -------------- | ----------------------------- | --------------- |
| 1   | 01:14:22   | `! make setup` (falló por `better-sqlite3`, compilado para otra versión de Node) | 4               | 15,5 s         | 5,4 s (`npm rebuild` ≈ 4,2 s) | 27,3 s\*        |
| 2   | 01:15:12   | `! make start` (interrumpido por el usuario)                                     | 0               | —              | —                             | —               |
| 3   | 01:16:09   | `! (cd backend && npm test)`                                                     | 2               | 4,4 s          | 0,6 s                         | 7,8 s\*         |
| 4   | 01:16:39   | `! code .`                                                                       | 1               | 1,7 s          | —                             | 5,7 s\*         |
| 5   | 01:17:14   | `! git checkout -b auditoria-daca`                                               | 1               | 2,8 s          | —                             | 2,9 s           |
| 6   | 01:32:56   | Auditoría de las reglas de proceso → `docs/auditoria/daca.md`                    | 6               | 93,3 s         | 5,4 s (≈ 3,5 s de `gh api`)   | 99,0 s          |
| 7   | 01:52:24   | Listado de prompts, modelo y tiempos                                             | 4               | 41,1 s         | 1,9 s                         | 43,3 s          |

\* El total incluye lo que tardó en ejecutarse el propio comando `!` del usuario antes de la respuesta: unos 6 s `make setup`, 2,7 s `npm test` y 3,9 s `code .`.

### Prompt completo de la auditoría
Eres un auditor profesional en el uso de la IA. Basado en el documento @CLAUDE.md busca el apartado de Reglas de proceso y para cada uno de los items vas a auditar el cumplimiento de estas basado en los ultimos 15 commits de este repositorio. Asegurate de construir una tabla y deja el resultado en @docs/auditoria/daca.md, si el archivo no existe crealo siguiendo la ruta descrita. Esto es una auditoria no un arreglo, por favor no hagas modificaciones algunas en el proyecto. Formato de la tabla a continuacion.
El formato lo fija esta lección, y no es negociable: una fila por regla, con estas cinco casillas.

Qué pide la regla. Una frase, con tus palabras. Si necesitas tres, es que ahí hay dos reglas metidas en una.
Qué se miró para comprobarlo. El comando concreto, o el archivo. Sin esta casilla la fila no se escribe: es lo único que separa una auditoría de una opinión.
Veredicto, y solo hay tres: se cumple, no se cumple, o no se puede comprobar con lo que hay. Este tercero no es rendirse, es un dato: significa que esa regla no deja rastro en ninguna parte. Un se cumple sin evidencia detrás es en realidad este, mal etiquetado.
La evidencia, en una línea. Si el veredicto es no se cumple, el sitio donde se rompió. Si es no se puede comprobar, qué falta para poder comprobarla.
Qué harías con ella. Una palabra: dejarla, borrarla o bajarla a algo que se ejecute solo.

- **Totales (turnos 1–7):** 18 llamadas al LLM y unos 159 s de tiempo de modelo.
- **Peso de la auditoría:** el prompt de la auditoría (#6) se lleva el 59 % de ese tiempo. Una sola de sus llamadas, la que razonó y escribió la tabla, tardó 56 s.
- **Tiempo del LLM:** desde cada `api-request` hasta el último mensaje del asistente en esa llamada.
- **Herramientas:** el hueco entre una llamada a herramienta y su resultado.
- **Total del turno:** el `turn_duration` que registra Claude Code.
- **Fuera de la tabla:** los dos resúmenes automáticos (`away_summary`) del transcript, porque no tienen `api-request` asociado.
