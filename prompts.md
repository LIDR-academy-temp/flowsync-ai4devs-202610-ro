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

## Prompt 1

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
lee el readme del proyecto y no hagas ni modifiques nada
```

**Qué salió:** funcionó a la primera: leyó el README y devolvió un resumen sin tocar nada.

---

## Prompt 2

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
ve rellenando los prompts donde lo piden con la información necesaria
```

**Qué salió:** funcionó a la primera: rellenó `prompts.md` con los prompts 1 y 2 y borró el ejemplo de la plantilla.

---

## Prompt 3

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
eso es de la parte B, tenemos que empezar por la parte A
```

**Qué salió:** creó `docs/verificacion/fmj.md` con la matriz de la A.1: 3 scenarios, 0 cubiertos, porque no hay ningún test de `tasks`. Dos tests de `auth` se parecen (iniciales sin nombre, cuenta sin nombre), pero comprueban la cuenta y no el `assignee`.

---

## Prompt 4

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
sigue con el punto A2
```

**Qué salió:** escribió `backend/tests/functional/tasks/assignee.spec.ts` con un test por scenario.
- La primera ejecución falló entera porque la base local no tenía aplicadas las migraciones de `tasks`. Corrió `node ace migration:run`, que no cambió ningún fichero versionado.
- Después salieron 2 verdes y 1 rojo: la lista (`GET /tasks`) expone el email del responsable.
- No se tocó el código.

---

## Prompt 5

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
que es lo que has escrito en los test? para poder pensar las respuestas de la parte B
```

**Qué salió:** explicó qué monta y qué afirma cada test, y qué valores eligió él sin que los fijara el scenario.

---

## Prompt 6

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
mis respuestas de la parte B, punto 1. no tenía claro que test había para poder saber si estaba todo cubierto
```

**Qué salió:** añadió la sección de la parte B en `docs/verificacion/fmj.md` con la línea 1 tal como la di (sin número previo) y el resultado real, 0 de 3. Las líneas 2 y 3 quedan vacías.

---

## Prompt 7

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
punto 2, no se que hacer con el responsable. que tenga a nulo los datos, creo que faltan en la spect definir mejor su comportamiento. puede que sea mejor tener uno con valores por defecto sin hablar del responsable en si
```

**Qué salió:** escribió la línea 2 de la parte B en `docs/verificacion/fmj.md` con mi respuesta, asociada al scenario «Responsable sin nombre».

---

## Prompt 8

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
si hay que añadirlo a los test, no esta probado las iniciales sin mal
```

```
mail
```

(El segundo mensaje lo mandé mientras trabajaba, para corregir «mal» → «mail».)

**Qué salió:** añadió al test «un responsable sin nombre…» la afirmación de que las iniciales no salen del email, y marcó la línea 2 como hueco de spec.
- Primero esperó `GR` para `grace@example.com` y el test salió en verde por accidente.
- El valor real es `GE`, la primera letra de cada lado de la `@`. Se dio cuenta, lo corrigió, y ahora el test sale en rojo.

---

## Prompt 9

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
vamos a revisar los test y los escenarios del requisito
```

**Qué salió:** revisó los tres tests frase a frase contra los scenarios, sin cambiar nada todavía.
- Problemas de robustez: si la tarea no aparece en la lista, el test revienta con un TypeError en vez de fallar con un mensaje claro; y en cuanto falla la lista, la tarea suelta ya no se comprueba.
- El test 3 afirma algo que la spec no dice: la spec de auth fija explícitamente que, sin nombre, las iniciales salen del email.

---

## Prompt 10

**Modelo:** Opus 5.5 (claude-opus-5-5), que lanza el subagente `adversarial-reviewer`
**Herramienta:** Claude Code

```
usa el agente revisión adversarial con el requisito «Lo que cada tarea muestra de su responsable»
```

**Qué salió:** el subagente ejecutó los tests (1 verde, 2 rojos) y devolvió 14 hallazgos priorizados, sin editar nada.
- **Prioridad alta:**
  - la lista, la creación y el cambio de estado exponen el email del responsable; el cambio de estado expone el de un tercero;
  - el `notEqual('GE')` es un falso rojo frente a la spec de auth;
  - la columna «prueba que lo cubre» de la matriz no menciona los tests nuevos.
- **Prioridad media:**
  - fragilidad: falta `assert.exists`, y el bucle corta en el primer fallo;
  - endpoints sin cubrir.
- **Prioridad baja:**
  - la redacción ambigua de «sin recurrir a su email»;
  - la spec no dice nada de un responsable nulo ni de si debe salir el `id`.

---

## Prompt 11

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
si, aplicalo
```

**Qué salió:** reescribió `assignee.spec.ts` aplicando los hallazgos de la revisión adversarial.
- La comprobación de `GE` pasó a un test aparte, nombrado como duda de spec.
- Se añadió `assert.exists`, y cada test compara todas las lecturas en una sola aserción.
- El scenario 2 cubre ahora también POST, PATCH status y PUT due-date.
- Se quitó el `any` del cliente; eso destapó dos errores de tipos, que se arreglaron con casts.
- Resultado: 22 en verde y 2 en rojo. El scenario 2 confirma que GET /tasks, POST /tasks y PATCH /status exponen el email. La duda de spec sale en rojo, como se esperaba.
- También se actualizó la sección A.2 de `docs/verificacion/fmj.md`.

---

## Prompt 12

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
no se me ocurre nada para el punto 3 en este momento. vamos hacer el commit y el pr. asi damos por finalizado el ejercicio
```

**Qué salió:** dejó la línea 3 de la parte B marcada como «sin respuesta» y no inventó nada. Después hizo el commit, abrió el PR y pasó el revisor adversarial sobre él.
