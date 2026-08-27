# FlowSync

Proyecto de práctica del curso: gestión de tareas en equipo. API en **AdonisJS 7 + SQLite** (`backend/`) y frontend en **React 19 + Vite** (`frontend/`).

Este es el sistema sobre el que trabajas en el Módulo 5. Léelo entero antes de empezar: además de cómo levantarlo, aquí está **el ejercicio y cómo se entrega**.

## Arrancarlo

No hay `package.json` en la raíz. Los comandos de `npm` se ejecutan dentro de `backend/` y de `frontend/`, y el `Makefile` de la raíz ya lo hace por ti.

```bash
make setup   # solo la primera vez: instala deps, crea los .env, genera APP_KEY y migra
make start   # levanta backend (:3333) y frontend (:5173) a la vez; Ctrl-C para los dos
make help    # lista todos los targets
```

- Backend en `http://localhost:3333`.
- Frontend en `http://localhost:5173`. Apunta al backend por defecto; para cambiarlo, ajusta `VITE_API_URL` en `frontend/.env`.

La suite de tests vive en el backend y no tiene atajo en el `Makefile`:

```bash
(cd backend && npm test)
```

Ejecútala una vez antes de empezar. Es la mejor comprobación de que el entorno está bien montado.

> `make` no viene de serie en Windows sin WSL, y estas recetas usan sintaxis POSIX. Desde WSL, clona dentro del sistema de ficheros de Linux (`~/…`) y no en `/mnt/c`, o `npm install` irá muy lento.

## La capa de agente

Vive en la raíz y es **el material del ejercicio**, no un accesorio:

- [`CLAUDE.md`](CLAUDE.md), con la arquitectura del proyecto y, al final, la sección **Reglas de proceso**: lo que hay que hacer antes de tocar código, cuándo se commitea y qué va al cerrar el trabajo.
- [`AGENTS.md`](AGENTS.md), el mismo contenido para agentes que leen ese archivo.
- `.claude/`, con los subagentes y las skills del proyecto.

---

# El ejercicio

**Se hace antes del directo.** Son unos 45 minutos y hay que ponerles un reloj.

## Cómo funciona este módulo

Tres momentos, y conviene que los sepas antes de empezar:

1. **Lo intentas tú**, aquí, sobre este proyecto. Entregas lo que te salga, con lo que tenga.
2. **Lo ves resuelto en el directo.** El mentor hace esta misma auditoría sobre este mismo proyecto. Si no te salió, ahí ves que se puede y cómo.
3. **Lo replicas después**, con los prompts del mentor, que te llegan por escrito.

Por eso la entrega a medias no es un problema: **el paso 1 no se puntúa por completarlo**. Y por eso conviene mirar el directo sin teclear, porque lo vas a repetir con calma luego.

> ⚠️ **En el paso 3 no esperes salidas idénticas.** El agente no es determinista: con el mismo prompt y el mismo repositorio cambian la redacción, el orden de las filas y hasta cuántas devuelve. Lo que se repite es **la forma**, no el texto.

## Antes de lanzar nada: apunta tu apuesta

Abre `CLAUDE.md`, busca la sección **Reglas de proceso** y, sin comprobar nada todavía, marca cuáles crees que se están cumpliendo. Una palabra por regla vale: *sí*, *no*, *ni idea*.

Son treinta segundos y es la mitad del ejercicio. Sin esa apuesta escrita antes, cuando salga el resultado te va a parecer obvio, y no lo era.

## Parte A: la auditoría, con reloj

Con un agente, contrasta esas reglas contra **los últimos 15 commits de este repositorio y el estado actual del árbol**, y deja el resultado escrito en `docs/auditoria/<tus-iniciales>.md`, no en el chat. El directorio se crea con tu archivo.

**El formato no es negociable**: una fila por regla, con estas cinco casillas.

1. **Qué pide la regla.** Una frase, con tus palabras. Si necesitas tres, es que ahí hay dos reglas metidas en una.
2. **Qué se miró para comprobarlo.** El comando concreto, o el archivo. Sin esta casilla la fila no se escribe: es lo único que separa una auditoría de una opinión.
3. **Veredicto**, y solo hay tres: **se cumple**, **no se cumple**, o **no se puede comprobar con lo que hay**.
4. **La evidencia**, en una línea. Si el veredicto es *no se cumple*, el sitio donde se rompió. Si es *no se puede comprobar*, qué falta para poder comprobarla.
5. **Qué harías con ella.** Una palabra: *dejarla*, *borrarla* o *bajarla* a algo que se ejecute solo.

> ⚠️ **Esto es una auditoría, no un arreglo.** Dile al agente explícitamente que no cambie ningún archivo. Sin esa restricción se pone a corregir lo que encuentra, y entonces ya no puedes saber qué había antes: el propio arreglo borra la evidencia.

> ⚠️ **Cuando suene el reloj, para. Aunque esté a medias.** Una fila con dos casillas rellenas y tres en blanco **es información**: dice hasta dónde llegaste. Una fila completada de memoria diez minutos después es ruido con formato, y encima es indistinguible de la buena.

**El resultado no lo controlas tú, lo produce el historial.** Puede salir que varias reglas se incumplen, que la mayoría no se pueden comprobar, o que se cumplen todas. Los tres resultados sirven y ninguno es un fallo tuyo.

## Parte B: las tres líneas

Debajo de la tabla, en el mismo archivo. **Esta parte no se puede fallar**, y es la que hay que traer sí o sí.

1. **La regla sobre la que te equivocaste.** Compara tu apuesta con el veredicto y escribe la que más se separó. Si acertaste todas, escríbelo tal cual y añade en qué te apoyabas para acertar.
2. **La regla que no se puede comprobar con lo que hay**, y en una frase qué tendría que cambiar para que dejara rastro.
3. **La regla que borrarías, y por qué.** La que se cumple sola porque algo ya lo impide, o la que no se cumple nunca y a nadie le ha importado.

---

# Cómo se entrega

**Es un pull request desde tu fork.** Cinco pasos.

### 1. Forkea este repositorio

Con el botón **Fork** de arriba. Sobre un clon directo no tienes permiso de escritura, y aquí vas a crear una rama y commitear.

```bash
git clone git@github.com:<tu-usuario>/flowsync-ai4devs-202610-ro.git
cd flowsync-ai4devs-202610-ro
git remote add upstream git@github.com:LIDR-academy/flowsync-ai4devs-202610-ro.git
git fetch upstream
git checkout -b s5/start upstream/s5/start
```

> 📌 Si te sale `Permission denied (publickey)`, es SSH y no el fork. La guía oficial está en `docs.github.com/es/authentication/connecting-to-github-with-ssh`.

### 2. Crea tu rama

```bash
git checkout -b auditoria-<tus-iniciales>
```

### 3. Haz el ejercicio

El archivo de la auditoría va en `docs/auditoria/`, con la tabla de la Parte A y las tres líneas de la Parte B.

### 4. Rellena `prompts.md`

Está en la raíz, con la plantilla puesta. **Es obligatorio y es la mitad de lo que se revisa**: lo que se mira no es solo tu resultado, es cómo lo pediste. Un prompt por bloque, con el modelo y la herramienta que usaste.

### 5. Abre el pull request

Contra este repositorio. Con tu rama empujada, GitHub te ofrece el botón arriba.

```bash
git add docs/auditoria prompts.md
git commit -m "auditoria: reglas de proceso + prompts"
git push -u origin auditoria-<tus-iniciales>
```

## El plazo

**Antes del directo.** Lo que llegue a tiempo recibe feedback de tu TA antes de la sesión, que es el momento en que te sirve. Lo que llegue después **se marca como recibido pero no se revisa**: el feedback existe para que llegues al directo sabiendo dónde fallaste, y después de la sesión ya no puede hacer eso.

## Antes de conectarte, comprueba

- [ ] Estás en tu **fork**, en tu rama, y `git push` funciona.
- [ ] `make start` levanta backend y frontend, y `(cd backend && npm test)` corre.
- [ ] Existe tu archivo en `docs/auditoria/`, con la tabla y las tres líneas.
- [ ] `prompts.md` está relleno, con modelo y herramienta en cada bloque.
- [ ] El pull request está abierto.

> La checklist completa para dejar el entorno listo está en la última lección del módulo asíncrono, «Ejercicio FlowSync».
