# Prompts

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Vamos unicamente a revisar el código que ya existe y funciona, no realices ninguna modificacion o sugerencia a menos que te lo solicite puntualmente. 
Enumera los requerimientos que hacen parte del módulo de cuentas y acceso de FlowSync (registro, inicio de sesión, sesión y perfil) que hoy funciona de extremo a extremo, teniendo en cuenta backend y frontend.
Backend: rutas, controladores, modelo de usuario, validadores y middlewares.
Frontend: pantallas de acceso, estado de sesión y protección de rutas.
```

**Qué salió:** Realizo la lectura de multiples archivos tanto en el backend como en el frontend y me informo los diferentes requisitos (Registro: 7, Inicio Sesion: 4, Sesion: 8, Perfil: 4, Proteccion de rutas: 10, Middlewares: 7). adicional, me indico informacion de la base de datos: las tablas y sus columnas.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Escribe la especificación de lo que se hace actualmente para Registro y guárdala en el archivo docs/spec-viva/dgh.md
Sigue este formato obligatorio:

## Purpose: una o dos frases que expliquen para qué existe esta capability.

## Requirements: sección que contiene los requisitos, cada uno encabezado por ### Requirement: y redactado con SHALL para indicar lo que debe hacer el sistema.

#### Scenario:: al menos uno por requisito, con dos viñetas: **WHEN***. Incluye las precondiciones dentro de WHEN, sin utilizar GIVEN.

Idioma: español, excepto las palabras clave de la RFC.

Respeta estas tres reglas:

No utilices ADDED, MODIFIED ni REMOVED. Son secciones propias de una especificación de cambios (delta). nos centramos en documentar el comportamiento actual del sistema.

Describe solo comportamientos observables desde fuera. No incluyas nombres de clases, archivos ni rutas del código. En la API, describe peticiones y respuestas; en el frontend, lo que el usuario ve y puede hacer.

No modifiques el código. Aunque encuentres errores o inconsistencias, déjalos tal como están. 
```

**Qué salió:** Indico que habia tenido en cuenta 18 requisitos y que habia respetado tanto el formato como las reglas, con ello creo el archivo docs/spec-viva/dgh.md según lo solicitado. Adicional indico que existian 3 comportamientos raros (Codigo exito al registrar, iniciales y mensajes en minuscula, no los detalla bien pero tampoco lo corrige como se solicito)