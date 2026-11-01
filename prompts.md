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

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
git checkout -b spec-viva-fmj
```

**Qué salió:** La rama ya existía; el agente se cambió a ella porque apuntaba al mismo commit que `s3/start`.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
subela a mi fork
```

**Qué salió:** Subió la rama a mi fork.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
vamos a realizar el ejercicio del readme
```

**Qué salió:** Escribió la spec con 23 requisitos en `docs/spec-viva/fmj.md`, más las listas 2 y 3 de la parte B. Comprobó los 11 de API en una copia aislada del backend, y los 12 de pantalla solo leyendo el código. Primero anotó 24 requisitos y 12 de API por error de conteo, y lo corrigió después. El prompt no fijaba el reloj ni las reglas de formato: el agente las tomó del README.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
para
```

**Qué salió:** Se detuvo y avisó de que había contado mal los requisitos.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
en que punto te has quedado
```

**Qué salió:** Resumió lo hecho y lo pendiente.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
ve poniendo los prompts.md vamos a revisar los criterios. empezando por el de mas prioridad
```

**Qué salió:** Corrigió el conteo, registró los prompts y empezó la revisión por el email único.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
vamos a ponerlo como duda, lleva la cuenta de lo que reviso. pasamos al siguiente
```

**Qué salió:** Movió el email a la lista 3, anotó 1 de 23 revisados y pasó a los tokens sin caducidad y el cierre de sesión.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
es un bug, si cierra sesion se debería cerrar el token
```

**Qué salió:** Pasó el cierre de sesión de la lista 3 a la lista 2 como bug sin corregir, dejó la spec describiendo el comportamiento actual, anotó 3 de 23 revisados y siguió con los intentos de login ilimitados.

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
como bug, puede llegar a ser un fallo de seguridad
```

**Qué salió:** Pasó los intentos ilimitados de la lista 3 a la lista 2 como bug sin corregir, anotó 4 de 23 revisados y siguió con el nombre opcional frente al PRD.

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
lo doy por bug, no puedo dedicar mas tiempo asi que actualiza los ficheros para la entrega
```

**Qué salió:** Pasó el nombre a la lista 2 como bug sin corregir, dejó 7 de 23 requisitos revisados y cerró los archivos para la entrega. La revisión quedó a medias por falta de tiempo.

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
pon los que he revisado y crea una nueva pr como se indica en el readme para la entrega
```

**Qué salió:** Puso 7 de 23 como requisitos comprobados y subió el cambio. Sobre el PR, ver el resumen del agente: aquí no está instalado `gh`.
