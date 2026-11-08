# Prompts

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Usa el agente `adversarial-reviewer` para que revise el requisito «Lo que cada tarea muestra de su responsable». solo ese requisito, no la capability entera.

Lee los scenarios de la spec viva de esta feature y los tests existentes.
Genera una tabla de trazabilidad: cada criterio de aceptación → qué prueba lo cubre → cubierto / NO cubierto.
No cambies nada.

El nombre de un test no es prueba de cobertura. Un test puede llamarse igual que el scenario y comprobar otra cosa, o solo la mitad. Para marcar cubierto hay que abrir el test y leer lo que afirma.
```

**Qué salió:** Responde con una tabla donde se evidencia los 3 escenarios del requisito con 7 criterios de aceptacion y todos estan como No cubiertos.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Genera una matriz de trazabilidad con Escenario - Test - Estado - qué faltó
```

**Qué salió:** Retorna la matriz de trazabilidad con los 3 escenarios, indicando que no existen test para ellos y No esta cubiertos. Adicional indica que falta para verificar los escenarios.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Para los No cubierto, escribe el test que falta — uno por scenario — siguiendo el estilo de los que ya existen en el proyecto (backend/tests/functional/auth/). Sin tocar nada fuera de la carpeta de tests. Cuando los tengas, ejecútalos.

Pase lo que pase, no arregles el código ni ajustes el test para que pase. Si algo se pone en rojo, se queda en rojo y se entrega en rojo.
```

**Qué salió:** Crea 3 test, pero solo 1 de ellos pasó, los otros 2 fueron fallidos (realizó commit, pr y ejecucion del adversarial-reviewer)



