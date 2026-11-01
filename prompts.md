# Prompts

---

## Prompt 1

**Modelo:** Opus 5.5 with medium effort

**Herramienta:** Claude Code

```
Escribe la spec de lo que el sistema hace actualmente y déjala en un archivo 
versionado del proyecto en docs/spec-viva/rt.md (si no existe, crealo). 
Considera el backend y frontend, pero solo el módulo de cuentas y 
acceso, No cosnideres otras funcionalidades. Documenta lo que ocurre en la API y
lo que ve el usuario en pantalla. No amplíes el alcance

Sigue este formato obligatorio:
- ## Purpose: una o dos frases que expliquen para qué existe esta capability.
- ## Requirements: sección que contiene los requisitos, cada uno encabezado 
por ### Requirement: y redactado con SHALL para indicar lo que debe hacer el 
sistema.
 #### Scenario:: al menos uno por requisito, con dos viñetas: **WHEN***. 
Incluye las precondiciones dentro de WHEN, sin utilizar GIVEN.
- Idioma: español, excepto las palabras clave de la RFC.

Respeta estas tres reglas:
1) No utilices ADDED, MODIFIED ni REMOVED. Son secciones propias de una 
especificación de cambios (delta). En este ejercicio nos centramos en documentar 
el comportamiento actual del sistema.
2) Describe solo comportamientos observables desde fuera. No incluyas nombres de 
clases, archivos ni rutas del código. En la API, describe peticiones y 
respuestas; en el frontend, lo que el usuario ve y puede hacer.
3) No modifiques el código. Aunque encuentres errores o inconsistencias, déjalos 
tal como están.
```

**Qué salió:** Hizo demasiado. Además de la tarea, realizó el commit e intento 
hacer push al main del repo de LIDR. 

---

## Prompt 2

**Modelo:** Opus 5.5 with medium effort

**Herramienta:** Claude Code

```
no realices el PR ni el push!

```

**Qué salió:**  Disculpa y resumen lo que había realizado. Guarda en memoria que
en este repo no haga push ni abra PRs salvo que le pida, aunque CLAUDE.md diga 
lo contrario. 

---

## Prompt 2

**Modelo:** Sonnet 5.5 with medium effort
**Herramienta:** Claude Code

```
No deshagas nada, estamos en una práctica. Dime cuantos requisitos escribiste.

```

**Qué salió:** Escribió 17 requisitos (### Requirement:) en docs/spec-viva/rt.md.

---

## Prompt 3

**Modelo:** Sonnet 5.5 with medium effort

**Herramienta:** Claude Code

```
Verifica el requisito 1 contra el código. Indicame donde se encuentra.

```

**Qué salió:** Un análisis detallado del requisito 1 contra el código existente.
Un cuadro comparativo entre el requisito y el código, la impresisión.

---

## Prompt 4

**Modelo:** Sonnet 5.5 with medium effort

**Herramienta:** Claude Code

```
Realiza el análisis de todos los requisitos generados vs el código existente. Agrega al archivo de spec (docs/spec-viva/rt.md) un título que diga "Parte B". Incia indicando el número de requisitos generados y a continuación genera 3 secciones:
1. Requisitos generados y comprobados: Indica cuántos requisitos escribiste y 
los que comprobaste. Para cada requisito genera el cuadro de req  y su ubicación
en código con la lista de comprobación.
2. Incoherencia detectadas: Para cada requisito anota cada inconsistencia en una
línea e indica dónde aparece.
3. Comportamientos que no supiste clasificar como bug o contrato: Incluye al 
menos un caso en el que hayas encontrado un comportamiento y no tengas claro si 
es un error o si el sistema está diseñado para funcionar así. 
Explica brevemente las dos posibilidades y por qué el código no permite 
saber cuál es la correcta.

```

**Qué salió:** Genero la parte B de la tarea, detallando las incosnsitencias y 
halló 4 comportamientos que no supo clasificar como bug o contrato.