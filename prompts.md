
---

### 🅰️ Parte A: la spec, con reloj

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

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
We'll write the specification of the behavior of an already existent code that works. We will not modify any code or propose any new functionality or fix. We want to understand the system behavior and translate code functionality  into WHEN/THEN specifications. If there is something not undestandable or if there is a confusion we wil identify it and mark it with a tag of "FOR FURHTER REVIEW".  

The section/module that will be analyzed is Access and Accounts from end to end. Check backend code and front-end code. For Backend make sure to trace Rutes, controllers, models, validators and middlewares. Describe request/responses from the fron-end perspective only For Front-end make sure to trace Access page, session state and route proteccion.
We need to document what the API does and what the user sees on the screen.  Describe only the observed behavior from the user perspective

When documenting use the following format
'## Purpose.' wirte in two or three phrases that explain why the module/capability exists
'## Requirements.'  This section will contain the requirements starting by a heading/title with '### Requirement: <Name of the requirement>' and it will use verbs such as 'SHALL' that indicates what the system does.
'### Scenario.' That states at least one per requisite with at least two section that use '**WHEN**...**THEN**'. Do not use '**GIVEN**' 
DO NOT write the documentation in English. USE Spanish exept by the commonly know RFC kewords 

Do not modify code. If thera are mistmaches, errors or inconsistencies Do Not modify code but instead document them with  "FOR FURHTER REVIEW" tag.
```

**Qué salió:** En el tiempo asignado no me fue suficiente para revisar toda las especificaciones que se generaron. Como es de esperar, hay unas que se ven bien y completas. En otras, a mi parecer, (cabe señalar que los frameworks aquí manejados tanto front-end como backend no son de mi dominio) se confundió un poco e inventó escenarios que no se pudieran visualizar a simple vista de código. Por otro lado, al leer archivos propios configuración como ".env.example" no supo como tratarlos y los asoció a la etiqueta pedida de "FOR FURTHER REVIEW" (en este punto me corrigió un typo que puse en inglés) y por lo que puedo apreciar se salió a analizar archivos que no corresponden a la vertical especificada. 

---

## Prompt 2

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
save this documentation into docs/spec-viva/av.md
```


**Qué salió:** Funcionó a la primera.


---

### 🅱️ Parte B: las tres listas

DISCLAIMER: Tal vez no me quedó claro el ejercicio, pero en 45 minutos no me alcanzó el tiempo para analizar el código a detalle y revisar todo el texto generado por el Agente. Además, los frameworks aquí manejados tanto front-end como backend no son de mi dominio lo cual me dificultó esta actividad.

1. Requisitos generados y comprobados. El agente escribió 14 requisitos. Consultando el código pude ver 8

2. Incoherencias detectadas. 
Manejo de errores no es 100% correcto como fue descrito por el agente. En una parte dice que se debe mostrar solo uno en otra parte dice que se deben mostart todos.

3. Comportamientos que no supiste clasificar como bug o contrato. No me alcanzó el tiempo. 