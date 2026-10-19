# Comparación técnica del experimento de Harness Engineering en FlowSync

Fecha de auditoría: 18 de octubre de 2026. Ticket de referencia: [FLOW-4](https://harness-lab-carlos.atlassian.net/browse/FLOW-4).

## 1. Alcance y criterio de evidencia

Se inspeccionaron las copias `C:\Users\NEUROMARKETING\flowsync-ai4devs-202610-ro` —con harness— y `C:\Users\NEUROMARKETING\flowsync-sin-harness` —sin harness— mediante lectura de archivos, estado de Git y diferencias respecto de HEAD. Ambas apuntan al commit `8e5b11802c86f154a69be5d71e56b00e13f2cb55`. Compartir HEAD no demuestra que sus estados locales iniciales fueran idénticos.

Se distinguen tres categorías: **verificado por inspección**, para propiedades observables en archivos o registros; **reportado**, para datos aportados por el responsable del experimento; y **No verificado**, para afirmaciones sin evidencia suficiente de ejecución. La presencia de una prueba no acredita que haya pasado.

El contenido de FLOW-4 no fue accesible mediante la consulta web. Sus criterios oficiales de aceptación quedan **No verificado**. No se atribuyen al ticket requisitos de persistencia, pruebas o interfaz que no pudieron consultarse.

No se lanzaron manualmente instalaciones, servidores, pruebas, lint ni build. Sin embargo, el hook existente se activó tras la primera consulta de lectura de esta auditoría y ejecutó automáticamente lint y build, ambos con salida 0. Este efecto incidental escribió resultados temporales y produjo artefactos de compilación; impide afirmar que toda la auditoría transcurrió sin escrituras automáticas. No se modificó ni desactivó el hook. La única edición deliberada es este documento.

## 2. Inventario de cambios observados

Los siguientes cambios existían antes de redactar este informe. Su atribución a las implementaciones se apoya en el contenido y el contexto proporcionado, no en un historial completo de cada sesión.

| Grupo | Con harness | Sin harness |
| --- | --- | --- |
| Frontend: archivos versionados modificados | `frontend/index.html`, `frontend/src/App.tsx`, `frontend/src/App.css`, `frontend/src/index.css` | Los cuatro anteriores, más `frontend/README.md`, `frontend/package.json`, `frontend/package-lock.json`, `frontend/vite.config.ts` |
| Frontend: archivos nuevos | `frontend/src/auth.ts` | `frontend/tests/App.test.tsx` |
| Infraestructura local nueva | `AGENTS.md`, `.codex/hooks.json`, `.codex/hooks/frontend-quality.cjs` | No se encontraron equivalentes locales en la raíz inspeccionada |
| Dependencias y configuración frontend | Sin diferencias en manifiesto, lockfile y configuración Vite respecto de HEAD | Cuatro dependencias de desarrollo añadidas, script `test`, lockfile actualizado y proxy Vite |

En ambas copias, `git status --short` también marca doce rutas de backend: `backend/package.json`, `backend/.env.example`, `backend/database/schema.ts`, los cinco archivos `.adonisjs/client/{data.d.ts,manifest.d.ts,registry/index.ts,registry/schema.d.ts,registry/tree.d.ts}` y los cuatro `.adonisjs/server/{controllers.ts,events.ts,listeners.ts,routes.d.ts}`.

AGENTS.md documenta cambios preexistentes en esos grupos. El diff de contenido de backend muestra cambios en `package.json`, cuyo contenido actual es idéntico entre ambas copias. Las otras rutas marcadas no aparecen como cambios de contenido en el resumen normal; Git emite advertencias de finales de línea. No se atribuyen estas diferencias al trabajo de autenticación ni se concluye una infracción del backend a partir del estado final. La ausencia de modificaciones históricas adicionales, incluidos archivos ignorados y SQLite, queda **No verificado**.

## 3. Diferencias de implementación y resultados

| Dimensión | Con harness | Sin harness | Interpretación y evidencia |
| --- | --- | --- | --- |
| Duración | 2 min 34 s | 7 min | Reportado; cronometraje independiente: **No verificado** |
| Login y logout | Cliente separado en `auth.ts`; sesión React en memoria | Cliente y estados concentrados en `App.tsx` | Verificado por lectura; ambas consumen las rutas existentes |
| Restauración al recargar | No implementada; el estado inicial es `null` | `sessionStorage` y consulta de `/account/profile` | Verificado en código; no se reprodujo en navegador |
| Dirección de API | `VITE_API_URL` como origen; añade `/api/v1`; predeterminado `http://localhost:3333` | `VITE_API_URL` incluye el prefijo; predeterminado `/api/v1`, con proxy Vite a 3333 | Convenciones distintas para la misma variable; no son configuraciones intercambiables |
| Validación del formulario | Email obligatorio y máximo 254; contraseña obligatoria | Igual validación declarativa | Ambas evitan imponer al login los límites de longitud del registro |
| Manejo de fallos | Estados 400/401, 422, 429, otros fallos HTTP, red y respuesta inválida; comprueba estructura de login | Estados 400/401 y 422; fallos generales, perfil caducado y reintento de perfil | Verificado por lectura; no equivale a comprobar todos los casos en ejecución |
| Comprobación automática | PostToolUse y registros de lint/build satisfactorios | No se encontró hook local equivalente | Lint y build comprueban reglas, tipos y empaquetado; no prueban autenticación |
| Escenarios simulados | Nueve escenarios reportados | Una prueba de fallo de red usa un rechazo simulado de `fetch` | Los nueve escenarios y sus resultados: **No verificado**; no se encontró una suite persistente que los documente |
| Pruebas automatizadas persistentes | Sin script `test` ni suite frontend local encontrada | Tres casos Vitest en `frontend/tests/App.test.tsx` | Existencia verificada; tres resultados satisfactorios: reportados, **No verificado** |
| Backend real | No comprobado según el reporte | Dos casos requieren servicios locales; uno simula fallo de red | El código respalda el diseño de integración; su ejecución real satisfactoria: **No verificado** |
| Inspección visual | No aportada | Login y campos obligatorios observados según el reporte | Capturas o registro de esa sesión: **No verificado** |
| Intervención humana | Sin solicitudes descritas en el resumen | Autorizaciones para instalar dependencias y limpiar caché | Reportado; cantidad, orden y motivos exactos: **No verificado** |
| Correcciones durante el trabajo | Sin secuencia histórica disponible | Sin secuencia histórica disponible | Número de reintentos, fallos previos y correcciones: **No verificado** |

Con los tiempos reportados, la diferencia es de 266 segundos —4 min 26 s— y la reducción relativa es del 63,3 % respecto de 420 segundos. La razón entre duraciones es aproximadamente 2,73. Son cálculos descriptivos de esta observación, no una estimación causal ni generalizable de productividad.

Las dos interfaces reemplazan la plantilla inicial por una pantalla de acceso en español, con etiquetas, campos de autocompletado, estados de espera y mensajes accesibles de error. La versión con harness utiliza una tarjeta violeta; la otra añade cabecera, pie y una paleta verde. No se realizó una evaluación visual comparativa durante esta auditoría.

Ambas leen el token desde `data.token`, envían Bearer al cerrar sesión y no exigen una envoltura `data` para el resultado de logout. La versión con harness valida un subconjunto del usuario público recibido y separa transporte de presentación. La otra obtiene el usuario mediante perfil y conserva el token durante la sesión de la pestaña. No se guarda la contraseña en almacenamiento persistente en el código inspeccionado.

La suite sin harness usa Vitest, jsdom y Testing Library. El primer caso crea una cuenta, comprueba error de credenciales, acceso, desmontaje y nuevo montaje, logout y revocación del token. Ese nuevo montaje aproxima una restauración de componente; no es una recarga real de navegador. El segundo caso consulta una sesión inválida y el tercero simula una desconexión. El README advierte que la cuenta creada permanece en la base local. No se ejecutó esta suite por su dependencia de servicios y sus efectos sobre datos.

## 4. Reglas y configuración del harness

### 4.1. Componentes comprobados

`AGENTS.md` aporta contexto de arquitectura, contrato de autenticación, restricciones absolutas del backend, preservación de cambios previos, convenciones TypeScript/React y obligaciones de verificación y cierre. Es una guía operativa; su existencia no demuestra que cada paso histórico se haya cumplido.

`.codex/hooks.json` registra un evento `PostToolUse` con matcher `.*`, comando Node con ruta absoluta al script y timeout de 300 segundos. El script `.codex/hooks/frontend-quality.cjs`:

- Limita la ejecución a la copia autorizada y a un directorio de trabajo contenido en ella; rechaza enlaces simbólicos en el frontend.
- Calcula una huella SHA-256 del frontend, excluyendo dependencias, salida de build y diversas cachés y temporales.
- Conserva estado por copia y sesión en `%TEMP%/flowsync-frontend-quality`, con bloqueo para evitar ejecuciones concurrentes y recuperación de bloqueos antiguos.
- Ejecuta secuencialmente `npm.cmd run lint` y `npm.cmd run build`, con 120 segundos de timeout por comando, cuando corresponde comprobar una huella nueva.
- Comunica resultados mediante contexto adicional de PostToolUse y guarda `latest-results.json`. No implementa un bloqueo explícito del trabajo ante fallos; comunica el error.

La configuración contiene una ruta absoluta y requiere adaptación para otra ubicación. La huella y el estado reducen repeticiones, pero no distinguen por sí solos una tarea de edición de una auditoría de lectura. En una sesión sin estado previo, un nombre de herramienta que coincida con `exec_command` puede provocar la comprobación aunque su comando solo lea archivos.

### 4.2. Evidencia de ejecuciones

Se encontraron tres directorios de sesión con `latest-results.json` anteriores a esta auditoría: prefijos `4457c0b2…`, `92e032f8…` y `b266293c…`. Todos registran lint y build con exit code 0. Los dos primeros comparten huella; el tercero contiene otra. Un cuarto registro, `137a127a…`, corresponde a la activación incidental observada durante esta auditoría y también registra ambos comandos con salida 0.

Esto confirma la existencia de resultados automáticos satisfactorios. No demuestra que los tres registros históricos pertenezcan a la ejecución cronometrada ni que representen todas sus activaciones: `latest-results.json` se sobrescribe y no contiene una cronología completa. Por tanto, «exactamente tres ejecuciones durante el experimento, todas satisfactorias» permanece como dato reportado; su correspondencia histórica exacta es **No verificado**. El resultado de la auditoría no debe añadirse al recuento del experimento.

### 4.3. Cumplimiento observable

La implementación con harness mantiene TypeScript, ESM, componentes funcionales, `import type`, StrictMode y el estilo predominante de dos espacios, comillas simples y ausencia de punto y coma en TypeScript. No introduce dependencias ni cambia la configuración frontend. No se identificaron supresiones ni tipos `any` explícitos en sus archivos nuevos de autenticación. La lectura del backend confirma rutas, envolturas y validación de login; el manejador de excepciones delega al framework, por lo que no se infiere una envoltura universal para errores.

La versión sin harness conserva TypeScript, ESM y StrictMode, pero concentra responsabilidades y usa puntos y coma en varias líneas compactas de TypeScript y pruebas. Añade infraestructura de pruebas y modifica el lockfile. Estas son diferencias frente a las convenciones del harness, no infracciones atribuibles a una sesión en la que no consta que esas reglas estuvieran activas. La autorización reportada para instalar tampoco puede trasladarse retrospectivamente a la otra condición.

Los requisitos de revisión inicial, cierre, ausencia de secretos y prohibición de tocar backend no pueden certificarse históricamente solo con el código final. No se observaron secretos reales en los archivos de implementación revisados; no se leyó `.env` ni se realizó un escaneo exhaustivo de todo el entorno.

## 5. Respuestas a las preguntas del ejercicio

### ¿Qué componentes construimos para el harness y cuál fue el más difícil?

Los componentes comprobados son la guía `AGENTS.md`, el registro PostToolUse en `.codex/hooks.json` y su ejecutor `frontend-quality.cjs`, junto con su mecanismo de huellas, bloqueo y registros temporales. Los escenarios simulados son una actividad de validación reportada; no se verificó un componente persistente que permita reproducirlos.

Cuál fue el componente más difícil durante su construcción: **No verificado**. No hay bitácora de esfuerzo. Por complejidad técnica observable, el ejecutor del hook es el candidato más exigente: combina selección de alcance, compatibilidad Windows, exclusión de artefactos, control de concurrencia y comunicación de resultados. Esta es una valoración técnica, no un recuerdo demostrado del proceso.

### ¿Cuál fue la primera diferencia observable entre las dos ejecuciones?

La primera diferencia cronológica: **No verificado**, por ausencia de transcripciones ordenadas de ambas sesiones. La diferencia operativa que sí puede identificarse es la disponibilidad de comprobaciones automáticas PostToolUse en la condición con harness. En el relato del experimento también aparece una necesidad de autorizaciones humanas en la condición sin harness; no se puede establecer qué evento ocurrió primero. La diferencia temporal de finalización reportada es 2 min 34 s frente a 7 min.

### ¿Qué instrucción del harness no se cumplió, si hubo alguna?

En la implementación original no se acredita una infracción concreta con la evidencia disponible. En particular, perder la sesión al recargar no contradice una regla explícita de AGENTS.md, y no es posible contrastarlo con FLOW-4. Tampoco los cambios preexistentes de backend demuestran una infracción de esa ejecución.

Sí se observó durante esta auditoría una incompatibilidad concreta entre la automatización y la instrucción: «No lo ejecutes cuando la tarea prohíba esas escrituras», referida al build en AGENTS.md. El hook ejecutó build tras una lectura a pesar de la restricción actual. Su configuración no incorpora una excepción explícita para este tipo de tarea. Este hallazgo corresponde a la auditoría y no debe atribuirse retrospectivamente al experimento original. No se corrigió porque el alcance permite crear únicamente este informe.

## 6. Limitaciones metodológicas

1. Existe una sola ejecución por condición. No hay repetición, dispersión ni control suficiente para aislar el efecto del harness de variaciones del modelo, contexto o entorno.
2. El mismo HEAD no acredita igualdad de prompts, permisos, dependencias instaladas, cambios locales o estado de servicios. Los dos `prompts.md` conservan el ejemplo de plantilla y no documentan las sesiones reales.
3. Las comprobaciones simuladas y las de integración tienen alcances diferentes. Las primeras no verifican transporte, CORS, serialización ni backend real; las segundas necesitan servicios, estado de datos y evidencia de ejecución. Ni contar nueve escenarios ni contar tres casos permite comparar cobertura directamente.
4. No existe equivalencia funcional completa: solo la condición sin harness incluye persistencia y recuperación de perfil. También asume coste de nuevas dependencias e infraestructura. La diferencia de tiempo no compara entregables idénticos.
5. Faltan mediciones independientes de tiempos, registros completos de autorizaciones, correcciones y resultados de pruebas, así como criterios accesibles de Jira. No se verificaron publicación, comportamiento productivo ni autenticación real durante esta auditoría.
6. El propio instrumento afecta la observación: el hook produjo escrituras automáticas durante una tarea de lectura. Los registros recientes deben separarse de los históricos para evitar contaminar la comparación.

## 7. Conclusiones y verificaciones de cierre

El harness aporta instrucciones explícitas, restricciones de alcance y retroalimentación automática comprobable de lint/build. La condición con harness presenta un cambio frontend más acotado y un tiempo reportado menor. La condición sin harness incorpora más funcionalidad y una suite persistente con integración prevista, a cambio de más archivos, dependencias y autorizaciones reportadas. Ninguna de estas observaciones permite declarar superioridad general ni cumplimiento completo de FLOW-4.

La evidencia favorece describir el experimento como una comparación exploratoria de dos procesos con resultados funcionales distintos. Para una evaluación causal serían necesarias ejecuciones repetidas, criterios de aceptación comunes y registros reproducibles de tiempos, permisos y validaciones. El principal defecto comprobado del harness es la falta de una exclusión efectiva para tareas que prohíben escrituras automáticas.

Se revisaron estados Git y diffs de ambas copias, archivos nuevos, configuración y código del hook, contrato backend y registros temporales. `git diff --check` no reportó errores de espacios en ninguna copia; Git sí mostró advertencias preexistentes LF/CRLF. El documento nuevo se revisó por separado porque no aparece en el diff normal hasta estar versionado. No se ejecutaron comprobaciones funcionales ni comandos manuales de lint/build por tratarse de una auditoría documental con restricción de escrituras. La activación automática y sus dos resultados satisfactorios se declaran expresamente, sin presentarlos como pruebas de autenticación. No se editaron código, backend, reglas, hooks, dependencias ni configuraciones.
