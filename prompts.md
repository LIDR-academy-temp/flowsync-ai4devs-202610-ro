## Prompt 1

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
contrasta las ## Reglas de proceso dentro de claude.md contra los los últimos 15 commits del repositorio y el estado actual del árbol,
escribe el resultado dentreo de docs/auditoria/ap.md, no lo hagas en el chat, genera 1 fila por cada regla , en cada fila debe tener
5 casillas 
1. **Qué pide la regla.** Una frase, con tus palabras. Si necesitas tres, es que ahí hay dos reglas metidas en una.
2. **Qué se miró para comprobarlo.** El comando concreto, o el archivo. Sin esta casilla la fila no se escribe: es lo único que separa una auditoría de una opinión.
3. **Veredicto**, y solo hay tres: **se cumple**, **no se cumple**, o **no se puede comprobar con lo que hay**. Este tercero no es rendirse, es un dato: significa que esa regla no deja rastro en ninguna parte. Un *se cumple* sin evidencia detrás es en realidad este, mal etiquetado.
4. **La evidencia**, en una línea. Si el veredicto es *no se cumple*, el sitio donde se rompió. Si es *no se puede comprobar*, qué falta para poder comprobarla.
5. **Qué harías con ella.** Una palabra: *dejarla*, *borrarla* o *bajarla* a algo que se ejecute solo.

no modifiques ningun archivo
```

**Qué salió:** He escrito la auditoría en docs/auditoria/ap.md. No he tocado ningún otro archivo y no he hecho commit; el archivo estaba vacío.

La regla 4 está en dos filas (4a y 4b) porque mezcla dos obligaciones con veredictos distintos: abrir el PR y pasar el revisor adversarial.

┌─────────────────────────────────┬───────────────────┬──────────┐
│              Regla              │     Veredicto     │   Qué    │
│                                 │                   │  haría   │
├─────────────────────────────────┼───────────────────┼──────────┤
│ 1. Rama por unidad de trabajo   │ no se cumple      │ bajarla  │
├─────────────────────────────────┼───────────────────┼──────────┤
│ 2. Un commit por petición con   │ no se puede       │ bajarla  │
│ /commit                         │ comprobar         │          │
├─────────────────────────────────┼───────────────────┼──────────┤
│ 3. Contrato y README en el      │ se cumple         │ bajarla  │
│ mismo commit                    │                   │          │
├─────────────────────────────────┼───────────────────┼──────────┤
│ 4a. Un solo PR al final         │ no se cumple      │ bajarla  │
├─────────────────────────────────┼───────────────────┼──────────┤
│ 4b. Revisor adversarial al      │ no se puede       │ bajarla  │
│ final                           │ comprobar         │          │
├─────────────────────────────────┼───────────────────┼──────────┤
│ 5. Responder solo con la URL    │ no se puede       │ borrarla │
│ del PR                          │ comprobar         │          │
└─────────────────────────────────┴───────────────────┴──────────┘

- Regla 1: los commits están directamente en ramas s4/end y s5/start, en un historial li*. Es indicio fuerte, no prueba, porque un fast-forward desde otra rama dejaría el mismo historial.
- Regla 3: solo un ce que se añadiera laregla, así que el «se cumple» se apoya en un único caso.
