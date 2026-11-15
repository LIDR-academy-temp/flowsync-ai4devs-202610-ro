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

**Modelo:** Sonnect 5.5 Medium
**Herramienta:** Claude

```
In the CLAUDE.md file, read the section "Reglas de proceso"  and contrast those rules over the last 15 commits of the repository and the current tree state. Write them in the file docs/auditoria/av.md.
```

**Qué salió:** Funcionó pero no estoy seguro que el historial que Claude leyó era el que esta ejercicio tenía en mente. Leyó el historial pero del repositiorio remoto y en realidad me pareció que fue bueno. Sin embargo si es necesario aclarar en las instrucciones cual era el repositorio target.
