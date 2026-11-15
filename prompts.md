# Prompts

## Prompt 1

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Haz un analysis de si las reglas de processo se estan cumpliendo. Contrasta las reglas en la lista de la seccion "Reglas de Proceso" en CLAUDE.md contra los ultimos commits, no mas de 15 commits. El formato del analisis y de la tabla es el siguiente.

La table tendra 5 columnas:
1. Qué pide la regla
2. Qué se miró para comprobarlo
3. Veredicto
4. La evidencia
5. Qué harías con ella

A continuacion es lo que vas a analizar e includir en cada columna:

1. Qué pide la regla. Una frase, con tus palabras. Si necesitas tres, es que ahí hay dos reglas metidas en una.
2. Qué se miró para comprobarlo. El comando concreto, o el archivo. Sin esta casilla la fila no se escribe: es lo único que separa una auditoría de una opinión.
3. Veredicto. Una de las siguientes tres: se cumple, no se cumple, o no se puede comprobar con lo que hay. Este tercero no es rendirse, es un dato: significa que esa regla no deja rastro en ninguna parte. Un se cumple sin evidencia detrás es en realidad un no se puede comprobar con lo que hay.
4. La evidencia. En una línea; si el veredicto es no se cumple, el sitio donde se rompió. Si es no se puede comprobar, qué falta para poder comprobarla.
5. Qué harías con ella. Una palabra: dejarla, borrarla o bajarla a algo que se ejecute solo.

Haz esto por cada regla, una linea por regla.

Esto es solo una auditoría, no hagas ningun cambio, solo el resultado del analisis en docs/auditoria/HR.md es lo que se modifica o se escribe, y nada mas. 
```

**Qué salió:** Tuve que insistir. Malintepreto la regla uno y tuve que corregirlo. 

## Prompt 2

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```
Interpretaste mal la primer regla, dice que solo si estás en `main` o en una `sN/*` es que se crea una rama nueva, no que siempre se crea una rama Nueva desde `main` o en una `sN/*`, pero si estas en cualquier otra rama sigue en ella en vez de crear otra. Corrigela y el analysis sis es necesarui con esta correccion.
```

**Qué salió:** Funcionó a la primera.