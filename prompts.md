# Registro de instrucciones y prompts — FlowSync

Segundo entregable de Harness Engineering de AI4Devs. Elaborado el 18 de octubre de 2026.

## Alcance y clasificación de la evidencia

Este documento sustituye la plantilla existente. Los datos «Opus 1M xHigh» y «Claude Code» de aquella plantilla eran un ejemplo, no evidencia del experimento.

- **Texto verificado:** mensaje disponible en esta conversación o instrucción presente en un archivo. La configuración actual no acredita el prompt que la generó.
- **Reconstrucción:** descripción retrospectiva deducida de artefactos; no es una transcripción ni se afirma que se enviara al agente.
- **Reportado:** información aportada por el participante sin comprobación histórica independiente.
- **No recuperado / No verificado:** falta el texto o la evidencia necesaria; no se completa con contenido plausible.

La numeración organiza este registro; no demuestra el número ni el orden de todos los mensajes originales.

## Secuencia temporal

1. Se preparó el harness en la copia original, según el relato del participante. Los artefactos actuales son inspeccionables; sus mensajes de creación no se recuperaron.
2. Se ejecutaron las condiciones con harness y sin harness. Se reportaron duraciones de 2 min 34 s y 7 min. Su orden relativo no está documentado.
3. **FLOW-4 se creó después de ambas ejecuciones**, según la aclaración expresa del participante en la solicitud actual. Fecha de creación en Jira: **No verificado**. No se presenta el ticket como una fuente consultada antes de implementar.
4. Después del experimento se solicitó la auditoría y se creó `docs/harness/comparacion.md`.
5. Después de esa auditoría se solicitó este registro.
6. Posteriormente, el participante recuperó del ticket oficial los seis criterios de aceptación y los proporcionó en esta conversación para incorporarlos literalmente al registro.

El informe comparativo se conserva sin cambios como documento de la auditoría anterior. Su descripción de ambos `prompts.md` como plantillas corresponde al momento anterior a esta actualización.

## FLOW-4 y sus seis criterios de aceptación

Referencia: [FLOW-4](https://harness-lab-carlos.atlassian.net/browse/FLOW-4).

**Información oficial recuperada posteriormente al experimento:** el participante proporcionó los siguientes seis criterios, recuperados de FLOW-4, con el enlace de Jira como fuente. Se transcriben literalmente de su mensaje; no son una reconstrucción a partir del código. La consulta directa del ticket por el agente no pudo realizarse con las herramientas disponibles.

1. Debe existir una pantalla de inicio de sesión.
2. El usuario debe poder introducir su correo electrónico y contraseña.
3. Al enviar el formulario, el sistema debe validar las credenciales utilizando el backend existente.
4. Si las credenciales son incorrectas, debe mostrarse un mensaje de error.
5. Si el inicio de sesión es correcto, el usuario debe acceder a una pantalla de bienvenida.
6. Debe existir una opción para cerrar sesión.

El ticket se creó después de las ejecuciones originales. La recuperación posterior de estos criterios no demuestra que se utilizaran durante ellas ni permite recuperar el prompt original de implementación.

El README contiene un ticket de ejemplo con **cinco criterios**, sobre registro, login, perfil protegido, errores y navegación entre registro y login. La descripción menciona shadcn/ui. Ese material es verificable, pero no acredita el contenido de FLOW-4 ni el encargo realmente enviado. No se añade un sexto criterio para equipararlos.

## Prompt 1 — Configuración del harness

**Etapa:** preparación de la condición con harness.

**Herramienta:** Codex, según el relato; interfaz y versión históricas no verificadas.

**Modelo:** No verificado.

**Prompt original exacto:** No recuperado.

### Instrucciones textuales verificadas en AGENTS.md

Extractos literales del archivo actual. No son el prompt que lo creó ni acreditan que toda su versión actual estuviera presente antes del experimento:

```text
- No crees, edites, elimines, formatees ni regeneres ningún archivo dentro de `backend/`, incluidos configuración, dependencias, lockfile, archivos ignorados y artefactos generados.
- Consulta el backend únicamente para leer el contrato existente. Adapta el frontend a ese contrato.
- Mantén TypeScript y ESM; usa `import type` cuando corresponda.
- Sigue el estilo existente: dos espacios, comillas simples y ausencia de punto y coma. Conserva UTF-8 y finales LF.
- Respeta las reglas de hooks y la configuración existente de Oxlint. Conserva StrictMode.
- No instales dependencias ni cambies lockfiles salvo autorización expresa para una tarea futura, limitada al frontend. La autorización no permite modificar el backend.
```

También constan estas instrucciones textuales sobre autenticación:

```text
- En login, el password se valida como cadena; no traslades automáticamente las restricciones de registro al login.
- Tanto signup como login devuelven un token. Léelo de `data.token`, no de la raíz de la respuesta.
- Logout elimina el token actual y devuelve un mensaje sin envoltura `data`. No asumas que todas las respuestas usan la misma estructura.
- No inventes el formato de los errores ni asumas que tienen la envoltura de las respuestas exitosas. Revisa la implementación disponible y maneja explícitamente los errores de validación y autenticación.
```

### Configuración textual verificada del hook

Transcripción de `.codex/hooks.json`:

```json
{
  "description": "FlowSync: lint y build automáticos al cambiar el frontend.",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"C:/Users/NEUROMARKETING/flowsync-ai4devs-202610-ro/.codex/hooks/frontend-quality.cjs\"",
            "timeout": 300,
            "statusMessage": "Comprobando frontend FlowSync"
          }
        ]
      }
    ]
  }
}
```

### Reconstrucción a partir del ejecutor; no es un prompt histórico

El script `.codex/hooks/frontend-quality.cjs` restringe la comprobación a la copia autorizada, calcula huellas del frontend, excluye dependencias y artefactos, rechaza enlaces simbólicos y guarda estado por sesión en temporales. Emplea un bloqueo de concurrencia y ejecuta lint y build al verificar una huella nueva. Comunica resultados mediante PostToolUse y escribe `latest-results.json`.

Estas decisiones son observables en código. No se sabe cuáles pidió el participante y cuáles decidió el agente. El README propone otros componentes del ejercicio, pero su presencia en el enunciado no acredita su configuración en esta copia.

## Prompt 2 — Implementación del inicio de sesión en ambas condiciones

**Etapa:** experimento, anterior a FLOW-4.

**Condiciones:** con harness y sin harness.

**Herramienta:** Codex, según el participante.

**Modelo y razonamiento de las sesiones originales:** No verificado.

**Prompt exacto:** No recuperado en ninguna de las dos condiciones.

No es posible transcribir el prompt común ni verificar que su redacción fuera idéntica. Los dos `prompts.md` inspeccionados antes de esta edición contenían solo la plantilla. No se sustituye el mensaje perdido por el ticket posterior, el ejemplo del README o una nueva instrucción.

**Reconstrucción del objetivo, no del mensaje enviado:** desarrollar una interfaz frontend de inicio de sesión para FlowSync que utilice el backend de autenticación existente. Ambas implementaciones contienen formulario de email y contraseña, login y cierre de sesión. Esta coincidencia caracteriza el objetivo implementado, sin demostrar todos los requisitos originales.

La versión con harness separa el cliente en `auth.ts` y mantiene la sesión en memoria. La otra incorpora `sessionStorage`, consulta de perfil, proxy Vite y pruebas. No hay evidencia suficiente para determinar si esas diferencias fueron solicitadas, negociadas o decisiones autónomas. No se atribuyen prompts de persistencia, instalación o limpieza sin sus textos originales.

## Prompt 3 — Verificación del harness y las implementaciones

**Etapa:** verificaciones asociadas al experimento; mensajes originales no recuperados.

**Herramienta:** Codex, según relato; npm y el hook, según artefactos.

**Modelo:** No verificado.

**Prompt exacto de verificación:** No recuperado.

### Instrucciones textuales verificadas

AGENTS.md prescribe ejecutar desde `frontend/`, con las dependencias existentes:

```powershell
npm.cmd run lint
npm.cmd run build
```

Extractos literales adicionales:

```text
- No presentes lint o build como pruebas funcionales ni como cobertura de autenticación. No existe un comando de pruebas frontend configurado.
- Para cambios exclusivamente documentales, revisa el contenido y el diff. No es necesario ejecutar lint y build; indica que no se ejecutaron y por qué.
- Antes de finalizar, revisa `git diff --check`, el diff de tu trabajo y `git status --short`. Inspecciona también los archivos nuevos, que no aparecen en el diff normal mientras no estén versionados.
```

### Registros y límites

Se leyeron `latest-results.json` en `%TEMP%/flowsync-frontend-quality/`. Los directorios con prefijos `4457c0b2…`, `92e032f8…` y `b266293c…` registran lint y build con exit 0 y son anteriores a la auditoría. El registro `137a127a…` corresponde a la activación incidental durante aquella auditoría. Son resultados de herramientas, no prompts; no acreditan un historial completo ni que los tres primeros pertenezcan a una sola ejecución cronometrada.

El participante reportó tres activaciones satisfactorias y nueve escenarios simulados con harness. No se recuperaron los mensajes de esos escenarios ni una suite persistente que permita enumerarlos fielmente.

En la copia sin harness, `frontend/tests/App.test.tsx` contiene tres casos: flujo de login/restauración/logout con servicios locales, sesión inválida y fallo de conexión simulado. Su existencia no acredita su ejecución satisfactoria ni revela el prompt que los solicitó. Las autorizaciones para instalar dependencias y limpiar caché son reportadas; sus textos no se recuperaron.

## Prompt 4 — Auditoría comparativa, posterior al experimento

**Fuente:** mensaje del participante en esta conversación.

**Estado:** texto verificado; transcripción íntegra.

**Herramienta receptora:** Codex.

**Modelo:** agente identificado como basado en GPT-6; variante y configuración exactas no verificadas. Este dato no se extrapola al experimento.

**Resultado:** creación de `docs/harness/comparacion.md`; el efecto incidental del hook se declaró en ese informe.

```text
Actúa como auditor técnico del ejercicio de Harness Engineering de AI4Devs.

Estamos trabajando en FlowSync. El ticket oficial de Jira es FLOW-4: https://harness-lab-carlos.atlassian.net/browse/FLOW-4

Ya realizamos el experimento con dos copias del mismo proyecto:

**CON HARNESS**
- Carpeta: C:\Users\NEUROMARKETING\flowsync-ai4devs-202610-ro
- Codex completó el trabajo en 2 minutos y 34 segundos.
- Se configuraron AGENTS.md y un hook PostToolUse.
- El hook se ejecutó automáticamente tres veces.
- Las tres ejecuciones devolvieron lint exit=0 y build exit=0.
- Se comprobaron nueve escenarios de autenticación con respuestas simuladas.
- No se verificó la autenticación contra el backend real.
- La sesión permanece únicamente en memoria y se pierde al recargar.

**SIN HARNESS**
- Carpeta: C:\Users\NEUROMARKETING\flowsync-sin-harness
- Codex completó el trabajo en 7 minutos.
- Reportó tres pruebas automatizadas satisfactorias.
- Reportó pruebas contra un backend local.
- Se comprobó visualmente la pantalla de inicio de sesión en el navegador.
- Se observó validación de campos obligatorios.
- Implementó restauración de sesión al recargar.
- Hubo solicitudes de autorización humana durante la instalación de dependencias y limpieza de caché.

**TU TAREA**

1. Inspecciona ambas carpetas en modo lectura.
2. Comprueba qué archivos cambiaron en cada implementación y cuáles son sus diferencias.
3. Verifica las reglas de AGENTS.md y la configuración del hook.
4. Distingue las afirmaciones documentadas de aquellas que no puedas verificar.
5. Compara tiempos, resultados, cumplimiento de convenciones, intervención humana y correcciones.
6. Incluye las limitaciones metodológicas: una ejecución por condición, diferencias entre pruebas simuladas y reales, y ausencia de equivalencia funcional completa.
7. Responde estas tres preguntas:
   - ¿Qué componentes construimos para el harness y cuál fue el más difícil?
   - ¿Cuál fue la primera diferencia observable entre las dos ejecuciones?
   - ¿Qué instrucción del harness no se cumplió, si hubo alguna?

**ENTREGABLE**

Crea únicamente el archivo:

docs/harness/comparacion.md

Redáctalo en español, con estilo técnico, claro y académico. Incluye una tabla comparativa y conclusiones fundamentadas.

No modifiques archivos de código, AGENTS.md, hooks, dependencias ni configuraciones.

No ejecutes instalaciones, servidores ni comandos que alteren los proyectos.

No inventes resultados. Si no hay evidencia suficiente, escribe «No verificado».

Al terminar, informa qué archivo creaste y resume sus conclusiones.
```

## Prompt 5 — Documentación, posterior al experimento y a la auditoría

**Fuente:** solicitud actual del participante.

**Estado:** texto verificado; transcripción íntegra.

**Herramienta receptora:** Codex.

**Modelo:** agente identificado como basado en GPT-6; variante y configuración exactas no verificadas.

**Resultado:** sustitución de la plantilla raíz por este registro, con sus vacíos históricos señalados.

```text
Prepara el segundo entregable del ejercicio de Harness Engineering de AI4Devs.

Crea un archivo llamado `prompts.md` en la raíz del proyecto FlowSync.

El documento debe registrar las instrucciones utilizadas en el experimento con harness y sin harness.

Incluye:

1. El ticket de Jira FLOW-4 y sus seis criterios de aceptación.
2. El prompt de implementación del inicio de sesión utilizado en ambas condiciones.
3. Las instrucciones de configuración y verificación del harness que puedan recuperarse de los archivos y registros disponibles.
4. Los prompts de auditoría y documentación, identificándolos como posteriores al experimento.
5. Una distinción clara entre instrucciones textuales verificadas e instrucciones reconstruidas a partir de evidencias.

IMPORTANTE:
- No inventes prompts ni afirmes que un texto reconstruido fue utilizado literalmente.
- Si no puedes recuperar el prompt original exacto, indícalo expresamente.
- El ticket FLOW-4 se creó después de las ejecuciones; documenta esa secuencia.
- No modifiques código, dependencias, AGENTS.md, hooks ni el informe comparacion.md.
- No ejecutes instalaciones ni servidores.

Al finalizar, informa qué archivo creaste y qué evidencias utilizaste.
```

## Fuentes y pendientes

| Fuente | Aportación | Límite |
| --- | --- | --- |
| Mensajes del participante | Prompts posteriores textuales; resultados reportados; secuencia de FLOW-4; seis criterios oficiales recuperados posteriormente del ticket y transcritos literalmente | No contienen el encargo original; la consulta directa de Jira por el agente no se verificó |
| `AGENTS.md` | Reglas actuales y comandos | No acredita su prompt de creación ni versión histórica completa |
| Archivos del hook | Configuración y comportamiento | No son una transcripción del encargo |
| Registros temporales | Resultados de lint/build | Sin prompts ni historial exhaustivo |
| `docs/harness/comparacion.md` | Hallazgos anteriores | Fuente secundaria, no evidencia independiente adicional |
| Ambos `prompts.md` previos | Plantilla sin registro real | No permiten recuperar las sesiones originales |
| README | Enunciado y ticket de ejemplo de cinco criterios | No sustituye FLOW-4 |
| Artefactos y pruebas inspeccionados en la auditoría | Comportamiento implementado | No demuestran qué se pidió literalmente |

Los seis criterios oficiales de FLOW-4 ya fueron recuperados por el participante e incorporados literalmente. Pendientes de recuperación: prompts exactos de implementación en ambas condiciones; mensajes de configuración, pruebas, autorizaciones y correcciones. Este documento no constituye un registro completo mientras falten esas fuentes. Los criterios recuperados posteriormente no sustituyen esos mensajes históricos.

La edición se limita a `prompts.md`. No se ejecutaron instalaciones, servidores ni pruebas. Por tratarse de documentación, no se lanzaron lint ni build; se revisaron contenido, diff y estado Git. El informe comparativo se conserva sin cambios.

### Resultado de la revisión final

- `git diff --check`: sin errores de espacios; permanecen advertencias de conversión LF/CRLF de Git.
- Documento guardado en UTF-8 con finales LF.
- Bloque JSON del hook: sintaxis comprobada y comando contrastado con `.codex/hooks.json`.
- `comparacion.md`: SHA-256 idéntico antes y después de esta edición (`49e5bfa062870334d50bdb35568c8acab1b0e0e1480259578086c6646bf5d9e2`).
- Único archivo editado en esta tarea: `prompts.md`; se preservaron los cambios locales anteriores.

El cierre documental incorpora los seis criterios oficiales recuperados posteriormente al experimento. Los prompts originales siguen pendientes de recuperación, sin contenido inventado ni atribución retrospectiva de los criterios a las ejecuciones.
