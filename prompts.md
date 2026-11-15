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
voy a realizar un ejercicio en esta sesión. No cargues ni leas el fichero README.md que está en la raiz para que no se alteren los resultados del ejercicio. En esta sesión te pido que NO toques ningún fichero a excepción del fichero /prompts.md que te pido que lo leas pues contiene instrucciones de como rellenarlo y que vayas registrando mis prompts del chat siguiendo las instrucciones que están en el propio fichero de prompts.md. Empieza por guardar este mismo prompts que te estoy escribiendo ahora. Yo editaré manualmente la parte del "qué salió" dentro del fichero.
```

**Qué salió:** 
Editó el fichero de prompts.md con el primer prompt

## Prompt 2

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
hazme un resumen de los últimos commits de este proyecto
```

**Qué salió:** 
me devolvió los últiomos 15 comits de la rama s5/start ordenados del más reciente al más antiguo y me rellenó el segundo prompt

## Prompt 3

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
! git checkout -b auditoria-jmp
```

**Qué salió:** 
se creó la rama y se posicionó. pregunto si ese comando debia de ponerse en prompts.md

## Prompt 4

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
si. añade el comando como si fuera un prompt en el chat
```

**Qué salió:** 
añadió el prompt último y el comando de terminal

## Prompt 5

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
crea el fichero docs/auditoria/jmp.md y pon un apartado al principio que se titule "Mi apuesta" dentro crea una tabla con 2 columnas. En la primera escribe como titulo "Regla" y añade en filas las reglas del proceso que encontrarás en en fichero Claude.md (una linea por regla como resumen" y el la segunda columna con título "Mi apuesta" y déjala vacia pues la voy a rellenar yo a mano.
```

**Qué salió:** 
Me creo el fichero con las dos columnas y me listó las 7 reglas. me indicó que habia viñetas que contenian 2 reglas y las separó.

## Prompt 6

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
con un agente, contrasta las 7 reglas del proceso que has visto en claude.md con el resultado de los últimos 15 commits del repositorio y el estado actual del árbol. deja el resultado escrito en el fichero docs/auditoria/jmp.md en un apartado que se llame "Tabla contrastada" a continuación del apartado ya existente. El resultado debe ser una tabla de 5 columnas: 

Qué pide la regla. Una frase, con tus palabras. Si necesitas tres, es que ahí hay dos reglas metidas en una.
Qué se miró para comprobarlo. El comando concreto, o el archivo. Sin esta casilla la fila no se escribe: es lo único que separa una auditoría de una opinión.
Veredicto, y solo hay tres: se cumple, no se cumple, o no se puede comprobar con lo que hay. Este tercero no es rendirse, es un dato: significa que esa regla no deja rastro en ninguna parte. Un se cumple sin evidencia detrás es en realidad este, mal etiquetado.
La evidencia, en una línea. Si el veredicto es no se cumple, el sitio donde se rompió. Si es no se puede comprobar, qué falta para poder comprobarla.
Qué harías con ella. Una palabra: dejarla, borrarla o bajarla a algo que se ejecute solo.

. Recuerda que estamos haciendo una auditoria por lo que no cambies ningun archivo ni corrijas nada. Únicamente puedes escribir en el fichero de prompts.md como ya vas haciendo y en el de jmp.md para poner el resultado de este prompt
```

**Qué salió:** 
Creó un agente, lo corrió (en modo lectura) y preparó el resumen de contraste de reglas contra los commits del repo en el fichero indicado usando la tabla indicada

## Prompt 7

**Modelo:** Opus 5.5 (claude-opus-5-5)
**Herramienta:** Claude Code

```
Añade en docs/auditoria/jmp.md un nuevo apartado titulado "Parte B: las tres lineas" al final. 

Con una lista de 3 cosas:

1. Lista la regla sobre la que me equivoqué. Compara mi apuesta con el resultado de la auditoria y escribe la que más se separó, en un sentido o en el otro.
2. Lista la regla que no se puede comprobar con lo que hay, y en una frase qué tendría que cambiar para que dejara rastro. Puede ser reescribirla, puede ser que algo la ejecute, puede ser que no haya arreglo posible y toque asumir que vive de la buena voluntad.
3. Añade la regla: "En el chat, solo la URL del PR" indicando que es la regla que yo borraría puesto que creo que se cumplirá siempre que se cree un PR
```

**Qué salió:** 


