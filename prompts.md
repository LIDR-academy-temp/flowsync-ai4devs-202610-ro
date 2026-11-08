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

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Estamos realizando un ejercicio de Spec-Driven Development (SDD) del Módulo 2 del máster AI-Powered Development.

Antes de proponer cualquier funcionalidad, analiza el repositorio actual de FlowSync.

Lee README.md, CLAUDE.md y revisa la estructura del frontend, backend, modelos de datos y rutas existentes.

Devuélveme exclusivamente:
1. Un resumen de 3 a 5 líneas de las capacidades que YA están implementadas.
2. El modelo de datos actual, distinguiendo entidades existentes de funcionalidades pendientes.
3. Las principales limitaciones del estado actual del proyecto.

No propongas funcionalidades nuevas todavía. No modifiques archivos, no instales dependencias y no ejecutes migraciones. Este paso es únicamente de análisis.
```

**Resultado:** Se analizó el repositorio y se describieron las capacidades existentes, las entidades de autenticación y las limitaciones, sin modificar archivos.

## Prompt 2

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Actúa como Product Manager especializado en definición de MVP mediante Spec-Driven Development.

Ya analizaste el repositorio FlowSync. Ahora necesitamos transformar una idea de producto en un alcance mínimo, concreto y defendible.

Idea inicial: FlowSync debe ayudar a equipos remotos pequeños a saber en qué está trabajando cada integrante, evitando preguntas constantes de seguimiento y reduciendo la necesidad de reuniones de sincronización.

Antes de proponer funcionalidades, formula exactamente las CINCO preguntas que más reduzcan la incertidumbre sobre el problema, los usuarios, el valor esperado y los límites del MVP.

No propongas soluciones todavía. No diseñes arquitectura, modelos de datos ni endpoints. No modifiques ningún archivo.

Presenta las cinco preguntas numeradas y espera mis respuestas.
```

**Resultado:** Se formularon cinco preguntas sobre el problema, los usuarios, el valor, la actualización y los límites del MVP.

## Prompt 3

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Estas son las respuestas y decisiones de producto establecidas para FlowSync:

1. PROBLEMA: El equipo pierde tiempo en reuniones diarias de sincronización y preguntas constantes por Slack o chat. Dos personas llegaron a trabajar sobre el mismo módulo por falta de visibilidad.

2. USUARIOS: Equipos remotos pequeños de 3 a 10 integrantes. El principal beneficiario es cada compañero de equipo, no un gerente que necesite reportes.

3. VALOR: Cada integrante debe poder ver qué tareas están pendientes, cuáles están en curso y quién es responsable, para evitar duplicar trabajo y elegir qué hacer después. No prometemos eliminar todas las reuniones.

4. ACTUALIZACIÓN: La persona responsable actualiza manualmente el estado de su tarea. La información debe reflejarse de forma suficientemente rápida para otros integrantes. FlowSync será el lugar donde se gestionan estas tareas, no una copia de Jira ni una integración con Slack.

5. ÉXITO: Después de una semana de uso, el equipo debería poder eliminar la ronda de preguntas de estado de la reunión diaria sin necesitar recuperarla.

FUNCIONALIDADES MÍNIMAS: crear tareas con título, responsable, estado y fecha de vencimiento; actualizar el estado; consultar y filtrar las tareas por estado.

FUERA DEL MVP: notificaciones push, integración con Slack, permisos avanzados, analítica, reportes, comentarios, sprints, estimaciones y gestión compleja de proyectos.

Con base en estas respuestas, propón un alcance MVP en exactamente cinco bloques: problema, usuarios, propuesta de valor, alcance y NO-alcance.

Sé agresivo al recortar funcionalidades y justifica cada exclusión según la hipótesis del producto que no ayuda a validar. No incluyas arquitectura, endpoints ni diseño de base de datos. No modifiques archivos todavía.

Al final, enumera cuántas funcionalidades propusiste inicialmente y cuántas conservaste en el MVP, y señala las decisiones que todavía requieran validación.
```

**Resultado:** Se propuso el alcance en cinco bloques, con cuatro funcionalidades conservadas de cuatro y decisiones pendientes de validación; la fecha se interpretó como obligatoria.

## Prompt 4

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Quiero cuestionar críticamente el alcance que acabas de proponer para FlowSync.

Tu propuesta conserva cuatro funcionalidades de cuatro recibidas, pero el objetivo del ejercicio es encontrar el MVP más pequeño que permita validar la hipótesis central: que una lista compartida y actualizada de tareas reduce las preguntas de seguimiento y los solapamientos en equipos remotos pequeños.

Analiza específicamente si exigir una fecha de vencimiento para cada tarea aporta evidencia necesaria para validar esa hipótesis o si introduce fricción innecesaria.

Distingue entre un requisito establecido en la ficha del ejercicio y una recomendación de recorte. No elimines silenciosamente decisiones ya fijadas.

Propón dos alternativas: A) conservar la fecha de vencimiento y B) excluirla o hacerla opcional, explicando el beneficio, riesgo y efecto sobre la hipótesis en cada caso.

Recomienda una alternativa, identifica cualquier contradicción con las decisiones originales y espera mi aprobación. No modifiques archivos ni generes arquitectura, endpoints o modelos de datos.
```

**Resultado:** Se compararon las alternativas y se recomendó excluir la fecha, señalando el cambio respecto a la ficha y solicitando aprobación sin modificar archivos.

## Prompt 5

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Vamos a formalizar el alcance del MVP de FlowSync para el ejercicio de Spec-Driven Development del Módulo 2.

He tomado la siguiente decisión de producto: la fecha de vencimiento será OPCIONAL, no obligatoria. Esta decisión flexibiliza expresamente la ficha original para reducir la fricción al crear tareas.

Crea el archivo docs/prd/alcance-mvp-cb.md, creando los directorios necesarios si no existen.

El documento debe contener exactamente cinco bloques principales:

1. PROBLEMA: preguntas constantes de seguimiento, reuniones de sincronización y duplicación accidental de trabajo en equipos remotos.
2. USUARIOS: equipos remotos pequeños de 3 a 10 integrantes; el valor principal es para los compañeros, no para supervisores.
3. PROPUESTA DE VALOR: visibilidad compartida de tareas, responsables y estados, sin necesidad de preguntar constantemente.
4. ALCANCE: crear tareas con título, responsable, estado y fecha de vencimiento opcional; consultar la lista compartida; actualizar estados; filtrar por estado. Reutilizar la autenticación existente.
5. NO-ALCANCE: notificaciones push, integración con Slack, comentarios, analítica, reportes, permisos avanzados, múltiples equipos, sprints, estimaciones, presencia de usuarios y gestión compleja de proyectos. Justifica cada exclusión según la hipótesis que no ayuda a validar.

Incluye dentro de los bloques correspondientes la hipótesis de producto, el criterio observable de éxito después de una semana y la decisión explícita sobre la fecha opcional.

Debajo de los cinco bloques añade una sección breve llamada 'Reflexión del ejercicio' con exactamente tres puntos:
- Número de funcionalidades consideradas inicialmente y número conservado, explicando el criterio de conteo.
- Tres exclusiones concretas y la hipótesis que no ayudan a validar.
- La exclusión o decisión sobre la que tengo menos certeza y qué evidencia permitiría reconsiderarla.

No incluyas arquitectura, endpoints, tablas técnicas ni código de implementación.

Modifica únicamente el documento solicitado. No modifiques prompts.md todavía, porque primero revisaremos los prompts originales que deben registrarse. Al terminar, muéstrame el contenido creado y el resultado de git status --short. No hagas commit ni push.
```

**Resultado:** Se creó docs/prd/alcance-mvp-cb.md con la fecha opcional, los cinco bloques y tres puntos de reflexión; se mostró su contenido y el estado de Git.

## Prompt 6

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Antes de registrar los prompts del ejercicio FlowSync, revisa el archivo prompts.md que ya existe en la raíz del repositorio.

Indícame su estructura, qué contenido tiene actualmente y cuál sería la forma más segura de añadir los prompts nuevos sin sobrescribir ni alterar los existentes.

Comprueba también que docs/prd/alcance-mvp-cb.md existe y que estamos en la rama alcance-cb.

Este paso es únicamente de inspección: no modifiques archivos, no hagas commit ni push.
```

**Resultado:** Se inspeccionó la plantilla, se confirmó la existencia del documento y la rama alcance-cb, y se explicó cómo añadir entradas sin alterar lo existente.

## Prompt 7

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Necesito completar prompts.md para la entrega del ejercicio FlowSync del Módulo 2.

Primero revisa la plantilla existente y conserva sus instrucciones. Elimina únicamente el ejemplo ficticio, tal como indica la plantilla.

Registra en orden cronológico los seis prompts reales que envié anteriormente en esta sesión de Codex, copiando literalmente el texto original de cada mensaje, sin resumir, corregir, completar ni reconstruir frases.

Para cada entrada incluye:
- Número de prompt.
- Modelo utilizado: GPT-6.1-Sol, según la interfaz de esta sesión.
- Herramienta: OpenAI Codex CLI.
- Texto original íntegro del prompt.
- Resultado breve, claramente separado del texto original.

Si no puedes recuperar literalmente alguno de los mensajes anteriores, no lo inventes: marca esa entrada como pendiente de transcripción y explícame cómo recuperarla.

Incluye también este séptimo prompt literalmente si está disponible para su registro.

Modifica solamente prompts.md. No cambies el documento del MVP, no hagas commit ni push.

Al finalizar, informa cuántos prompts registraste literalmente, cuántos quedaron pendientes y muestra git status --short.
```

**Resultado:** Se registraron literalmente los siete prompts de la sesión, conservando las instrucciones de la plantilla y sustituyendo únicamente el ejemplo ficticio; no quedaron entradas pendientes.

## Prompt 8

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Realiza una auditoría final de los entregables del ejercicio FlowSync del Módulo 2.

Revisa docs/prd/alcance-mvp-cb.md y prompts.md.

Comprueba:
1. Que el documento del MVP tenga los cinco bloques exigidos: problema, usuarios, propuesta de valor, alcance y NO-alcance.
2. Que incluya las tres reflexiones del ejercicio.
3. Que la fecha de vencimiento sea opcional y que esa decisión esté justificada.
4. Que no incluya arquitectura, endpoints ni modelos técnicos innecesarios.
5. Que prompts.md contenga los siete prompts originales completos, en orden cronológico, con modelo y herramienta.
6. Que el ejemplo ficticio de la plantilla haya sido eliminado.
7. Que los archivos no contengan marcadores pendientes ni errores evidentes de Markdown.
8. Que los textos de los prompts coincidan literalmente con los mensajes originales de esta sesión, señalando cualquier diferencia que puedas verificar.

Ejecuta git diff --check y git status --short.

No modifiques archivos, no hagas commit ni push. Devuélveme un informe breve con cada comprobación marcada como correcta, incorrecta o no verificable, y cualquier corrección necesaria.
```

**Resultado:** Las ocho comprobaciones de la auditoría se marcaron como correctas, sin correcciones necesarias; git diff --check terminó sin errores y se mostró git status --short.

## Prompt 9

**Modelo:** GPT-6.1-Sol
**Herramienta:** OpenAI Codex CLI

```
Prepara los entregables finales de FlowSync para el Módulo 2, sin publicarlos todavía.

1. Añade al final de prompts.md el octavo prompt real de esta sesión, correspondiente a la auditoría final. Copia literalmente su texto original desde el historial, sin reconstruirlo, e incluye el modelo, herramienta y resultado. Si no puedes recuperar el texto exacto, detente y avísame.
2. Registra también este noveno prompt literalmente, si puedes recuperar su texto exacto. No inventes ni resumas.
3. Conserva intactos los siete prompts anteriores y docs/prd/alcance-mvp-cb.md.
4. Ejecuta git add -- docs/prd/alcance-mvp-cb.md prompts.md para preparar únicamente los dos archivos de entrega.
5. Ejecuta git diff --cached --check, git diff --cached --stat y git status --short.
6. Comprueba que la rama actual sea alcance-cb y que los únicos archivos preparados sean el documento del MVP y prompts.md.

No hagas commit, push ni pull request. Informa el resultado y cualquier problema encontrado.
```

**Resultado:** Se añadieron literalmente los prompts 8 y 9 y se prepararon únicamente los dos archivos de entrega en alcance-cb; se verificó el diff preparado sin hacer commit, push ni pull request.
