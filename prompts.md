## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (extensión de VS Code)

```
da un resume de qué capabilities hay ya construidas y cómo es el modelo de datos actual
```

**Qué salió:** exploró el código y vio que el CLAUDE.md estaba desactualizado: el frontend ya tenía login, registro y perfil, no era la plantilla de Vite. Devolvió el resumen del terreno.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (extensión de VS Code)

```
2.  Genera las cinco preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance, no bajes al modelo de datos o los enpoints
```

**Qué salió:** lo tomó como orden y lanzó las cinco preguntas en una sola ronda, sin bajar a datos ni endpoints.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (extensión de VS Code)

```
Genera el alcance en cinco bloques. Problema · usuarios · propuesta de valor · alcance · NO-alcance. Recorta y que justifica cada exclusión.
```

**Qué salió:** como la ficha seguía sin pegarse, la sacó del README (desviación del proceso). Propuso los cinco bloques: 9 puntos de alcance, 17 exclusiones justificadas, supuestos declarados y dos tensiones detectadas en la ficha.

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (extensión de VS Code)

```
quita los puntos 5, 8 y 9 del alcance inicial
```

**Qué salió:** recorte mío de 9 a 6 (fuera la fecha de vencimiento, el "qué se ha movido desde tu última visita" y editar o borrar). La IA señaló que quitar la fecha contradice la ficha y que quitar el punto 8 debilita "llego por la mañana y veo qué se ha movido".