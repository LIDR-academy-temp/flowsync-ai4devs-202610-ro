# Plan: spec viva del módulo "Cuentas y acceso" en docs/spec-viva/josesilva.md

## Context
Hay que documentar cómo se comporta **hoy** el módulo de cuentas y acceso (backend + frontend), sin proponer funcionalidades ni tocar código. El resultado va en `docs/spec-viva/josesilva.md` con formato Purpose / Requirements (SHALL) / Scenario (WHEN/THEN, precondiciones dentro de WHEN, sin GIVEN).

Fuentes analizadas: `backend/start/routes.ts`, `start/kernel.ts`, `config/auth.ts`, `app/controllers/{new_account,access_tokens,profile}_controller.ts`, `app/validators/user.ts`, `app/models/user.ts`, `app/transformers/user_transformer.ts`, `providers/api_provider.ts`, migraciones de `users` y `auth_access_tokens`; `frontend/src/lib/{api,types}.ts`, `auth/*`, `routes/*`, `pages/*`.

## Pasos
1. Escribir en `docs/spec-viva/josesilva.md` exactamente el contenido de la sección "Contenido" de abajo (único fichero tocado).
2. Rama actual `spec-viva-josesilva` ya es de trabajo (no es main/s1/start). Stage solo `docs/spec-viva/josesilva.md`, `/commit`, `gh pr create` con descripción completa, y pasar el subagente `adversarial-reviewer` sobre el PR (reglas de CLAUDE.md). Respuesta final: solo la URL del PR.

## Verificación
- Releer el fichero y cotejar cada escenario contra el código citado (mensajes literales, códigos HTTP, rutas).
- Opcional (solo lectura): levantar backend y lanzar `curl` a signup/login/profile/logout para confirmar códigos 200/400/401/422 y forma `{ data }`.

---

## Contenido

```markdown
# Spec viva — Cuentas y acceso

## Purpose

Permitir que una persona cree una cuenta en FlowSync, inicie y cierre sesión mediante un token de acceso, y consulte su perfil, tanto a través de la API (`/api/v1`) como de las pantallas de login, registro y perfil del frontend.

## Requirements

### Requirement: Registro de cuenta

El backend SHALL exponer `POST /api/v1/auth/signup`, sin autenticación, que crea un usuario con `fullName`, `email` y `password`, y responde con el usuario serializado y un token de acceso nuevo.

#### Scenario: Registro válido
- **WHEN** se envía `fullName` (texto o `null`), un `email` con formato válido de como máximo 254 caracteres que no existe en `users`, un `password` de 8 a 32 caracteres y un `passwordConfirmation` idéntico
- **THEN** se crea el usuario con la contraseña almacenada como hash, se emite un token de acceso y se responde 200 con `{ data: { user, token } }`

#### Scenario: Email ya registrado
- **WHEN** se envía un `email` que ya existe en la tabla `users`
- **THEN** se responde 422 con un error de regla `database.unique` sobre el campo `email` y no se crea el usuario

#### Scenario: Contraseñas que no coinciden
- **WHEN** `passwordConfirmation` difiere de `password`
- **THEN** se responde 422 con un error de regla `sameAs` sobre `passwordConfirmation`

#### Scenario: Contraseña fuera de longitud
- **WHEN** `password` tiene menos de 8 o más de 32 caracteres
- **THEN** se responde 422 con un error `minLength` o `maxLength` sobre `password`

#### Scenario: Email con formato inválido
- **WHEN** `email` no es una dirección válida o supera 254 caracteres
- **THEN** se responde 422 con un error `email` o `maxLength` sobre `email`

#### Scenario: Falta la clave fullName
- **WHEN** el cuerpo no incluye la clave `fullName` (ni siquiera con valor `null`)
- **THEN** se responde 422 con un error `required` sobre `fullName`

### Requirement: Inicio de sesión

El backend SHALL exponer `POST /api/v1/auth/login`, sin autenticación, que verifica email y contraseña y emite un token de acceso nuevo.

#### Scenario: Credenciales correctas
- **WHEN** se envía un `email` y `password` que coinciden con un usuario existente
- **THEN** se emite un token de acceso nuevo y se responde 200 con `{ data: { user, token } }`

#### Scenario: Credenciales incorrectas
- **WHEN** el email no existe o la contraseña no coincide
- **THEN** se responde 400 (`E_INVALID_CREDENTIALS`) y no se emite token

#### Scenario: Cuerpo inválido
- **WHEN** falta `email` o `password`, o `email` no tiene formato válido
- **THEN** se responde 422 con los errores de validación por campo

### Requirement: Tokens de acceso

El backend SHALL autenticar por defecto con el guard `api`: tokens opacos almacenados como hash en `auth_access_tokens`, enviados en la cabecera `Authorization: Bearer <token>`, sin fecha de caducidad configurada.

#### Scenario: Varias sesiones simultáneas
- **WHEN** un mismo usuario hace login o signup varias veces
- **THEN** cada llamada crea un token independiente y todos siguen siendo válidos hasta que se revoquen

#### Scenario: Borrado de usuario
- **WHEN** se elimina un registro de `users`
- **THEN** sus tokens se eliminan en cascada

### Requirement: Rutas protegidas

El backend SHALL exigir un token válido en las rutas del grupo `/api/v1/account/*`.

#### Scenario: Petición sin token o con token inválido
- **WHEN** se llama a `/api/v1/account/profile` o `/api/v1/account/logout` sin cabecera `Authorization` o con un token inexistente o revocado
- **THEN** se responde 401 y no se ejecuta el controlador

### Requirement: Consulta de perfil

El backend SHALL exponer `GET /api/v1/account/profile` que devuelve el usuario dueño del token.

#### Scenario: Perfil con token válido
- **WHEN** se llama con un token válido
- **THEN** se responde 200 con `{ data: user }`

### Requirement: Representación pública del usuario

El backend SHALL serializar al usuario exclusivamente con los campos `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, sin exponer nunca la contraseña.

#### Scenario: Iniciales con nombre de dos o más palabras
- **WHEN** `fullName` contiene al menos dos palabras separadas por espacio (p. ej. "Ada Lovelace")
- **THEN** `initials` es la primera letra de la primera y de la segunda palabra en mayúsculas ("AL")

#### Scenario: Iniciales con nombre de una palabra
- **WHEN** `fullName` es una sola palabra (p. ej. "Ada")
- **THEN** `initials` son sus dos primeros caracteres en mayúsculas ("AD")

#### Scenario: Iniciales sin nombre
- **WHEN** `fullName` es `null` (p. ej. email "ada@example.com")
- **THEN** `initials` es la primera letra de la parte local y la primera del dominio del email en mayúsculas ("AE")

### Requirement: Cierre de sesión en el backend

El backend SHALL exponer `POST /api/v1/account/logout` que revoca el token usado en la petición.

#### Scenario: Logout con token válido
- **WHEN** se llama con un token válido
- **THEN** ese token se borra de `auth_access_tokens` y se responde 200 con `{ message: 'Logged out successfully' }` (sin envoltorio `data`)

#### Scenario: Uso del token tras logout
- **WHEN** se reutiliza el token revocado en cualquier ruta protegida
- **THEN** se responde 401

#### Scenario: Otros tokens del usuario
- **WHEN** el usuario tiene otros tokens activos y cierra sesión con uno de ellos
- **THEN** los demás tokens siguen siendo válidos

### Requirement: Formato de respuestas y errores

El backend SHALL responder siempre en JSON; las respuestas de éxito de signup, login y perfil SHALL ir envueltas en `{ data: ... }` y los errores de validación en `{ errors: [{ message, rule, field, meta }] }` con estado 422.

#### Scenario: Cliente sin cabecera Accept
- **WHEN** una petición llega sin `Accept: application/json`
- **THEN** se responde igualmente en JSON, también en errores

### Requirement: Persistencia de la sesión en el cliente

El frontend SHALL guardar el token en `localStorage` bajo la clave `flowsync.token` y mantener un estado de sesión `loading`, `authenticated` o `anonymous`.

#### Scenario: Login o registro correctos
- **WHEN** el backend devuelve `{ user, token }` tras login o signup
- **THEN** se guarda el token en `localStorage`, el estado pasa a `authenticated` y se borra cualquier `sessionError` previo

#### Scenario: Arranque sin token guardado
- **WHEN** la app arranca y no hay `flowsync.token`
- **THEN** el estado es `anonymous` sin llamar al backend

### Requirement: Rehidratación de la sesión al arrancar

El frontend SHALL validar el token guardado contra `GET /api/v1/account/profile` antes de considerar la sesión activa.

#### Scenario: Token guardado válido
- **WHEN** la app arranca con un token guardado y el backend devuelve el perfil
- **THEN** el estado pasa de `loading` a `authenticated` con ese usuario

#### Scenario: Token guardado rechazado
- **WHEN** la app arranca con un token guardado y el backend responde 401
- **THEN** se borra el token de `localStorage`, el estado pasa a `anonymous` y `sessionError` vale "Tu sesión ha caducado. Vuelve a iniciar sesión."

#### Scenario: Backend inaccesible o con error
- **WHEN** la app arranca con un token guardado y la petición falla por red o con un estado distinto de 401
- **THEN** el estado pasa a `anonymous`, el token se conserva en `localStorage` y `sessionError` contiene el mensaje traducido del error (p. ej. "No se pudo conectar con el servidor. Comprueba que el backend está arrancado.")

### Requirement: Control de acceso a pantallas

El frontend SHALL restringir `/profile` a sesiones autenticadas y `/login` y `/register` a sesiones anónimas.

#### Scenario: Sesión resolviéndose
- **WHEN** el estado es `loading` y se visita cualquiera de esas rutas
- **THEN** se muestra un loader a pantalla completa sin redirigir

#### Scenario: Anónimo en ruta protegida
- **WHEN** el estado es `anonymous` y se visita `/profile`
- **THEN** se redirige (replace) a `/login`

#### Scenario: Autenticado en ruta pública
- **WHEN** el estado es `authenticated` y se visita `/login` o `/register`
- **THEN** se redirige (replace) a `/profile`

#### Scenario: Ruta desconocida
- **WHEN** se visita cualquier ruta no declarada
- **THEN** se redirige a `/profile` (que a su vez aplica el control anterior)

### Requirement: Pantalla de login

El frontend SHALL ofrecer en `/login` un formulario de email y contraseña que inicia sesión contra el backend.

#### Scenario: Envío en curso
- **WHEN** el usuario envía el formulario y la petición no ha terminado
- **THEN** el botón queda deshabilitado con el texto "Entrando…"

#### Scenario: Credenciales incorrectas
- **WHEN** el backend responde 400
- **THEN** se muestra una alerta con "El email o la contraseña no son correctos."

#### Scenario: Sesión anterior perdida
- **WHEN** se llega a `/login` con un `sessionError` y aún no hay error del intento actual
- **THEN** la alerta muestra el `sessionError`; si hay error del intento actual, este tiene prioridad

#### Scenario: Enlace a registro
- **WHEN** el usuario pulsa "Crea una"
- **THEN** navega a `/register`

### Requirement: Pantalla de registro

El frontend SHALL ofrecer en `/register` un formulario con nombre completo (opcional), email, contraseña y confirmación.

#### Scenario: Contraseñas distintas en cliente
- **WHEN** el usuario envía con `password` distinto de `passwordConfirmation`
- **THEN** se muestra "Las contraseñas no coinciden." bajo la confirmación y no se llama al backend

#### Scenario: Nombre vacío
- **WHEN** el campo nombre está vacío o solo contiene espacios
- **THEN** se envía `fullName: null`; en otro caso se envía el nombre recortado

#### Scenario: Envío en curso
- **WHEN** la petición de registro no ha terminado
- **THEN** el botón queda deshabilitado con el texto "Creando cuenta…"

#### Scenario: Pista de contraseña
- **WHEN** el campo contraseña no tiene error
- **THEN** se muestra la pista "Entre 8 y 32 caracteres."

#### Scenario: Enlace a login
- **WHEN** el usuario pulsa "Inicia sesión"
- **THEN** navega a `/login`

### Requirement: Traducción de errores de la API

El frontend SHALL convertir toda respuesta fallida en un `ApiError` con mensaje en castellano y errores por campo.

#### Scenario: Error de validación 422
- **WHEN** el backend responde 422 con `errors`
- **THEN** cada campo recibe el mensaje traducido de su primer error y el mensaje general es el del primer error; traducciones: `database.unique` en email → "Ese email ya está registrado. Inicia sesión en su lugar."; `sameAs` → "Las contraseñas no coinciden."; `email` → "Introduce una dirección de email válida."; `required` → "Falta rellenar <campo>."; `minLength`/`maxLength` → "<campo> debe tener al menos N caracteres." / "<campo> no puede superar los N caracteres."; otra regla → "Revisa <campo>."

#### Scenario: Respuesta 401
- **WHEN** el backend responde 401
- **THEN** el mensaje es "Tu sesión ha caducado. Vuelve a iniciar sesión."

#### Scenario: Fallo de red
- **WHEN** `fetch` no llega al servidor
- **THEN** se lanza un `ApiError` con estado 0 y "No se pudo conectar con el servidor. Comprueba que el backend está arrancado."

#### Scenario: Otro error
- **WHEN** el backend responde cualquier otro estado de error (p. ej. 500, incluso con cuerpo no JSON)
- **THEN** el mensaje es "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

### Requirement: Reparto de errores en los formularios

El frontend SHALL mostrar los errores por campo bajo su input y usar la alerta general solo cuando algún error no pueda mostrarse en línea.

#### Scenario: Todos los errores tienen campo en pantalla
- **WHEN** todos los `fieldErrors` corresponden a inputs del formulario
- **THEN** se muestran bajo cada input (marcados con `aria-invalid`) y no aparece alerta general

#### Scenario: Error sin campo visible
- **WHEN** hay errores sin campo o de campos que la pantalla no pinta
- **THEN** se muestra el mensaje general en la alerta

#### Scenario: Excepción no prevista
- **WHEN** la acción lanza algo que no es `ApiError`
- **THEN** la alerta muestra "Algo ha ido mal. Inténtalo de nuevo."

### Requirement: Pantalla de perfil y cierre de sesión

El frontend SHALL mostrar en `/profile` las iniciales, el nombre (o "Sin nombre"), el email y la fecha de alta ("Miembro desde", formato largo es-ES), con un botón para cerrar sesión.

#### Scenario: Cerrar sesión
- **WHEN** el usuario pulsa "Cerrar sesión"
- **THEN** el botón pasa a "Cerrando sesión…" deshabilitado, se borra el token local, el estado pasa a `anonymous`, se limpia `sessionError`, se redirige a `/login` y se llama a `POST /api/v1/account/logout` con el token anterior

#### Scenario: Fallo del logout remoto
- **WHEN** la llamada de logout al backend falla (token ya inválido, red caída…)
- **THEN** el error se ignora y la sesión local queda cerrada igualmente
```



### Parte B: las tres listas
1. Requisitos generados y comprobados:
8 requisitos de Front end y 27 escenarios
8 requisitos de Backend y 20 escenarios
Total 16 requisitos de los cuales se comprobé 7

2. Incoherencias detectadas
11 incoherencias

### Bugs

| # | Incoherencia | Dónde | Efecto |
|---|---|---|---|
| B1 | **El email distingue mayúsculas.** `email()` no normaliza el valor. `unique` y `findForAuth` comparan con `=`, y SQLite compara distinguiendo mayúsculas. | `backend/app/validators/user.ts:6`, `findForAuth` en `@adonisjs/auth` | `Ada@x.com` y `ada@x.com` pueden ser dos cuentas distintas. Si te registraste como `Ada@x.com` y entras con `ada@x.com`, recibes 400 "El email o la contraseña no son correctos". |
| B2 | **Las iniciales fallan con espacios de más.** `split(' ')` no colapsa espacios. `"Ada  Lovelace"`, con doble espacio, da `"AD"` en vez de `"AL"`, y el frontend solo recorta los extremos, así que se puede provocar desde la UI. `" Ada"`, con espacio inicial, deja las iniciales vacías (solo por API directa). | `backend/app/models/user.ts:10-16` | El avatar sale con iniciales incorrectas o vacío. |
| B3 | **Se acepta `fullName: ""` o solo espacios.** El backend no recorta el valor ni exige longitud mínima. El frontend muestra `fullName ?? 'Sin nombre'`, y `??` no cubre la cadena vacía. | `backend/app/validators/user.ts:13`, `frontend/src/pages/profile-page.tsx` | Por API directa se crea un usuario cuyo perfil sale con el título vacío en vez de "Sin nombre". |
| B4 | **Condición de carrera en el registro.** `unique` consulta antes del `INSERT`. Si llegan dos registros simultáneos con el mismo email, el segundo choca con la restricción de la BD. | `backend/app/controllers/new_account_controller.ts:9` | Se devuelve un 500 ("Algo ha ido mal en el servidor…") en vez del 422 "Ese email ya está registrado". La probabilidad es baja. |

### Faltas de especificación del contrato

| # | Incoherencia | Dónde | Efecto |
|---|---|---|---|
| C1 | **El logout no usa `serialize()`.** Devuelve `{ message }` sin el envoltorio `{ data }`, en contra de la convención "toda respuesta pasa por `serialize()`". | `backend/app/controllers/access_tokens_controller.ts:26` | No rompe nada porque el frontend ignora el cuerpo, pero es la única respuesta con otra forma. |
| C2 | **El mensaje de 401 habla de "caducada", pero los tokens no caducan.** `expires_at` nunca se rellena, así que un 401 solo puede significar un token revocado o inexistente. | `frontend/src/lib/api.ts` (`toApiError`) | El mensaje no corresponde con la causa real. La vida del token no está definida en ningún sitio. |
| C3 | **El frontend trata cualquier 400 como credenciales incorrectas.** El backend no documenta qué endpoints devuelven 400. | `frontend/src/lib/api.ts` | Hoy solo lo devuelve el login. Un 400 de otro origen, por ejemplo un cuerpo mal formado, mostraría un mensaje engañoso. Es un bug latente. |
| C4 | **Errores duplicados en la confirmación.** `passwordConfirmation` reutiliza las reglas de `password()` (8 a 32 caracteres). | `backend/app/validators/user.ts:16` | Con una contraseña corta que coincide con la confirmación, aparece el mismo error de longitud bajo los dos campos. |
| C5 | **El signup responde 200, no 201.** El contrato no fija el código de éxito al crear un recurso. | `backend/app/controllers/new_account_controller.ts` | Queda indefinido para cualquier otro cliente de la API. |
| C6 | **Tipos distintos para `updatedAt`.** En la BD y en el esquema generado es `DateTime \| null`; en el frontend es `string`, sin `null`. | `backend/database/schema.ts`, `frontend/src/lib/types.ts` | En la práctica nunca llega `null` porque se rellena al crear el usuario, pero el contrato tipado no coincide. |
| C7 | **La rehidratación con el backend caído deja un estado ambiguo.** El token se queda en `localStorage` pero la sesión pasa a `anonymous`. El `sessionError` solo se muestra en `/login`, no en `/register`, y no se limpia hasta un login correcto. | `frontend/src/auth/auth-provider.tsx` | Si el usuario vuelve a hacer login sin recargar, el token anterior queda huérfano en el servidor y nunca se revoca. |

3. Comportamientos que no supiste clasificar como bug o contrato
La sesion ha caducado, en la UI describe un escenario que no puede ocurrir, porque los tokens no expiran segun la especificacion vs el codigo
El nombre del usuario acepta el fullName: "" en ningun lado dice que sea invalida lo cual seria falta de especificacion y podria llegar a ser un bug al ver vacio el perfil