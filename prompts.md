**Modelo:** Opus 5.5
**Herramienta:** Claude code # Prompts

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

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code


```
Crea una skill de proyecto llamada /priority-ticket en
.claude/skills/priority-ticket/SKILL.md.

Debe ejecutarse solo cuando yo la invoque y hacer lo siguiente:

1. Usar la conexión MCP de Atlassian para identificar mi usuario.
2. Buscar en mi proyecto de Jira del curso el ticket de mayor
   prioridad asignado a mí que esté en “Por hacer”.
   Si no puede identificar el proyecto o el estado equivalente,
   preguntarme antes de elegir. No buscar en proyectos ajenos
   al ejercicio.
3. Leer el ticket completo y resumir su clave, título,
   descripción y criterios de aceptación.
4. Entrar en plan mode, explorar el código necesario y proponer
   cómo implementarlo, indicando los archivos que propone tocar
   y cómo verificaría los criterios de aceptación.
5. Esperar mi aprobación explícita del plan. Antes de ella,
   no modificar código ni cambiar el estado del ticket.
6. Solo si apruebo el plan, mover ese ticket a “En curso”
   usando las transiciones disponibles en Jira.

Si no encuentra tickets, debe informarlo sin inventar ninguno.

Ahora crea únicamente la skill. No la ejecutes, no modifiques
CLAUDE.md, no cambies el backend ni el frontend y no crees
ni actualices tickets.

```


---

## Promt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Crea una skill de proyecto llamada /commit en
.claude/skills/commit/SKILL.md.

Debe ejecutarse solo cuando yo la invoque y crear un commit
convencional a partir de los cambios que ya estén preparados
en staging.

Su comportamiento debe ser:

1. Revisar git status y git diff --cached para identificar
   exactamente qué cambios están preparados.
2. Si no hay cambios preparados, informarlo y detenerse.
   No ejecutar git add automáticamente.
3. Redactar un mensaje con el formato:
   tipo(scope): descripción
   El tipo y el scope deben corresponder a los cambios reales.
4. Crear el commit únicamente con lo que ya esté en staging,
   sin incluir cambios que no estén preparados.
5. No usar --amend, no omitir hooks y no hacer push.
6. Al finalizar, mostrar el hash y el mensaje del commit,
   o informar el error si no pudo crearlo.

Ahora crea únicamente el archivo de la skill.
No ejecutes /commit, no prepares archivos, no crees commits
y no modifiques CLAUDE.md ni el código de la aplicación.
```

---
## Promt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code


```
Crea un subagente de proyecto llamado adversarial-reviewer
en .claude/agents/adversarial-reviewer.md.

Su función es revisar un pull request intentando encontrar
cómo puede fallar, no buscando aprobarlo.

Debe recibir la URL o el número del pull request y:

1. Leer la descripción, el diff y los archivos necesarios
   para entender los cambios. Puede usar gh pr view,
   gh pr diff y otras consultas de solo lectura.
2. Contrastar la propuesta con los criterios de aceptación,
   las instrucciones del proyecto y los contratos reales
   del backend.
3. Buscar errores funcionales, casos límite, problemas de
   autenticación, validación y manejo de errores, regresiones
   e incumplimientos de las convenciones del proyecto.
4. Reportar hallazgos concretos, ordenados por gravedad.
   Cada hallazgo debe incluir archivo y línea cuando sea
   posible, escenario que lo provoca, impacto y una sugerencia.
5. Distinguir problemas comprobables de dudas que requieren
   validación. No inventar fallos para completar una lista.
6. Si no encuentra problemas, indicarlo y explicar los límites
   de la revisión. No considerar eso una aprobación automática.

Configúralo con herramientas de lectura y sin herramientas
de edición. Si necesita Bash para consultar Git o GitHub,
limita su uso a consultas de solo lectura.

No debe modificar archivos, cambiar ramas, instalar paquetes,
crear commits, publicar comentarios o reviews en GitHub,
aprobar ni fusionar el pull request.

Ahora crea únicamente la definición del subagente.
No lo ejecutes, no crees un pull request y no modifiques
CLAUDE.md ni las otras piezas del harness.
```

---
## Promt 4 

**Modelo:** Opus 5.5
**Herramienta:** Claude Code


```
Configura la pieza 6 del harness descrita en README.md:
un hook que formatee el frontend después de que el agente
edite un archivo.

Haz lo siguiente únicamente en este proyecto:

1. Instala Prettier como dependencia de desarrollo dentro
   de frontend/, usando npm y conservando las dependencias
   y scripts existentes.

2. Configura un hook PostToolUse para las herramientas
   Edit y Write en .claude/settings.json.
   Si existe configuración, consérvala e integra el hook.

3. El hook debe leer la ruta del archivo editado y actuar
   únicamente si pertenece a frontend/src/.
   Cuando corresponda, debe ejecutar el Prettier instalado
   localmente sobre frontend/src/**, con el patrón entre
   comillas y omitiendo formatos no compatibles.

4. Resuelve las rutas desde la raíz del proyecto, aunque
   Claude haya cambiado su directorio de trabajo.
   No descargues paquetes con npx durante cada ejecución.

5. Si necesitas un script auxiliar, créalo dentro de
   .claude/hooks/. Haz que los errores de formato se
   comuniquen a Claude sin ocultarlos.

6. Comprueba que el script acepta el evento, que actúa
   para una edición en frontend/src/ y que omite archivos
   fuera de esa carpeta. Usa una prueba temporal y elimina
   únicamente los archivos temporales que tú hayas creado.

No modifiques el backend, CLAUDE.md, las skills ni el subagente.
No restaures el anterior hook Stop de comprobaciones.
No crees commits ni implementes el ticket de login.

Al terminar, indica qué archivos cambiaste, qué pruebas
hiciste y si formateaste archivos existentes del frontend.
```


## Promt 5


**Modelo:** Opus 5.5
**Herramienta:** Claude Code


```
Agrega al final de CLAUDE.md una sección titulada
“Reglas de proceso”, como pide la pieza 7 del README.

Conserva intacto todo el contenido anterior generado por /init.

La nueva sección debe indicar:

1. Antes de modificar código para un encargo, crear una rama
   nueva con un nombre relacionado con el ticket, conservando
   los cambios previos del usuario.

2. Al terminar una implementación aprobada, revisar el diff
   y preparar en staging únicamente los archivos del encargo.
   Usar /commit para crear el commit convencional.
   Si no puedes invocar esa skill, indicarlo y solicitar
   que el usuario la ejecute; no sustituirla silenciosamente.

3. Publicar la rama en el fork y crear el pull request
   mediante gh pr create, verificando el repositorio y
   la rama de destino.

4. Después de crear el pull request, delegar su revisión
   al subagente adversarial-reviewer. No fusionarlo.

5. Al cerrar ese flujo, responder en el chat únicamente
   con la URL real del pull request. Si hay un bloqueo,
   informar el problema sin inventar una URL ni afirmar
   que se completó.

Aclara que estas reglas de cierre corresponden a una
implementación aprobada. En la comparación de este ejercicio
se presentan los planes y se espera aprobación:
no se implementa, no se cambia el estado del ticket y no se
crea un pull request de implementación sin esa aprobación.

Ahora modifica únicamente CLAUDE.md.
No ejecutes el flujo, no crees ramas, commits o pull requests
y no modifiques Jira ni las demás piezas del harness.
```



**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.
