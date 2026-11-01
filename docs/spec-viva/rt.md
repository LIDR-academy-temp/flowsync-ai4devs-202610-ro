# Cuentas y acceso

## Purpose

Permitir que una persona cree una cuenta en FlowSync, inicie y cierre sesión, y consulte su perfil, de modo que solo quien tiene una sesión válida accede a las pantallas privadas de la aplicación.

## Requirements

### Requirement: Registro de cuenta en la API

El sistema SHALL crear una cuenta nueva a partir de un nombre completo opcional, un email, una contraseña y su confirmación, y SHALL devolver en la misma respuesta los datos públicos del usuario y un token de acceso con el que ya queda autenticado.

#### Scenario: Registro con datos válidos

- **WHEN** un cliente envía `POST /api/v1/auth/signup` con `fullName` "Ada Lovelace", un `email` no registrado, una `password` de entre 8 y 32 caracteres y una `passwordConfirmation` idéntica
- **THEN** la API responde 200 con `{ "data": { "user": {...}, "token": "<token>" } }`, donde `user` contiene `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y nunca la contraseña

#### Scenario: Registro sin nombre

- **WHEN** un cliente envía el registro con `fullName` a `null` y el resto de campos válidos
- **THEN** la API crea la cuenta y responde 200 con `fullName: null` en el usuario devuelto

### Requirement: Validación del registro

El sistema SHALL rechazar el registro con estado 422 y un cuerpo `{ "errors": [...] }`, en el que cada error indica el campo (`field`) y la regla incumplida (`rule`), cuando los datos no cumplen las reglas de la cuenta.

#### Scenario: Email ya registrado

- **WHEN** un cliente envía el registro con un `email` que ya pertenece a otra cuenta
- **THEN** la API responde 422 con un error sobre el campo `email` y la regla de unicidad, y no crea ninguna cuenta

#### Scenario: Email con formato inválido o demasiado largo

- **WHEN** un cliente envía el registro con un `email` que no tiene formato de email o que supera los 254 caracteres
- **THEN** la API responde 422 con un error sobre el campo `email`

#### Scenario: Contraseña fuera de longitud

- **WHEN** un cliente envía el registro con una `password` de menos de 8 caracteres o de más de 32
- **THEN** la API responde 422 con un error sobre el campo `password` que indica la longitud mínima o máxima

#### Scenario: Confirmación distinta

- **WHEN** un cliente envía el registro con una `passwordConfirmation` diferente de `password`
- **THEN** la API responde 422 con un error sobre el campo `passwordConfirmation`

#### Scenario: Campos obligatorios ausentes

- **WHEN** un cliente envía el registro sin `email`, sin `password` o sin `passwordConfirmation`
- **THEN** la API responde 422 con un error de campo obligatorio por cada campo que falta

### Requirement: Iniciales del usuario

El sistema SHALL calcular unas iniciales en mayúsculas para cada usuario y SHALL incluirlas en todas las respuestas que devuelven sus datos.

#### Scenario: Usuario con nombre de dos o más palabras

- **WHEN** se devuelven los datos de un usuario cuyo nombre es "Ada Lovelace"
- **THEN** `initials` vale "AL" (primera letra de las dos primeras palabras)

#### Scenario: Usuario con nombre de una sola palabra

- **WHEN** se devuelven los datos de un usuario cuyo nombre es "Ada"
- **THEN** `initials` vale "AD" (los dos primeros caracteres del nombre)

#### Scenario: Usuario sin nombre

- **WHEN** se devuelven los datos de un usuario sin nombre cuyo email es "ana@ejemplo.com"
- **THEN** `initials` vale "AE" (primera letra de la parte anterior y de la parte posterior a la arroba)

### Requirement: Inicio de sesión en la API

El sistema SHALL autenticar a un usuario a partir de su email y contraseña y SHALL emitir un token de acceso nuevo en cada inicio de sesión correcto, sin invalidar los tokens emitidos antes.

#### Scenario: Credenciales correctas

- **WHEN** un cliente envía `POST /api/v1/auth/login` con el `email` y la `password` de una cuenta existente
- **THEN** la API responde 200 con `{ "data": { "user": {...}, "token": "<token>" } }`

#### Scenario: Varios inicios de sesión

- **WHEN** un mismo usuario inicia sesión dos veces y obtiene dos tokens distintos
- **THEN** ambos tokens siguen siendo válidos para consultar el perfil

### Requirement: Rechazo del inicio de sesión

El sistema SHALL rechazar el inicio de sesión sin revelar si el email existe cuando las credenciales no son correctas, y SHALL rechazarlo con errores por campo cuando los datos no tienen el formato esperado.

#### Scenario: Email inexistente o contraseña incorrecta

- **WHEN** un cliente envía el login con un `email` que no está registrado, o con un `email` registrado y una `password` que no le corresponde
- **THEN** la API responde 400 con una lista `errors` cuyo error no indica ningún campo, y no emite token

#### Scenario: Datos con formato inválido

- **WHEN** un cliente envía el login con un `email` sin formato de email, o sin `email` o sin `password`
- **THEN** la API responde 422 con un error por cada campo afectado

### Requirement: Consulta del perfil en la API

El sistema SHALL devolver los datos del usuario autenticado a quien presente un token de acceso válido, y SHALL rechazar con 401 cualquier petición sin token válido.

#### Scenario: Token válido

- **WHEN** un cliente envía `GET /api/v1/account/profile` con la cabecera `Authorization: Bearer <token>` de una sesión activa
- **THEN** la API responde 200 con `{ "data": { "id", "fullName", "email", "createdAt", "updatedAt", "initials" } }` del usuario dueño del token

#### Scenario: Sin token o con token no válido

- **WHEN** un cliente pide el perfil sin cabecera `Authorization`, o con un token inventado o ya revocado
- **THEN** la API responde 401

### Requirement: Cierre de sesión en la API

El sistema SHALL revocar el token con el que se hace la petición de cierre de sesión, de modo que deje de servir para autenticarse.

#### Scenario: Cierre con token válido

- **WHEN** un cliente envía `POST /api/v1/account/logout` con un token válido
- **THEN** la API responde 200 con `{ "message": "Logged out successfully" }`, sin el envoltorio `data` que usan el resto de respuestas, y una petición posterior al perfil con ese mismo token recibe 401

#### Scenario: Otros tokens del mismo usuario

- **WHEN** un usuario con dos tokens activos cierra sesión con uno de ellos
- **THEN** el otro token sigue siendo válido

#### Scenario: Cierre sin token

- **WHEN** un cliente envía el cierre de sesión sin token o con un token no válido
- **THEN** la API responde 401

### Requirement: Respuestas en JSON

El sistema SHALL responder en JSON a todas las peticiones del módulo, incluidos los errores, con independencia del tipo de contenido que pida el cliente.

#### Scenario: Cliente que no pide JSON

- **WHEN** un cliente pide el perfil sin token y con la cabecera `Accept: text/html`
- **THEN** la API responde 401 con un cuerpo JSON

### Requirement: Pantalla de registro

El sistema SHALL ofrecer una pantalla "Crea tu cuenta" con un formulario de registro y un enlace a la pantalla de inicio de sesión.

#### Scenario: Contenido de la pantalla

- **WHEN** una persona sin sesión abre la pantalla de registro
- **THEN** ve el nombre "FlowSync", el título "Crea tu cuenta", el texto "Regístrate para empezar a organizar el trabajo del equipo.", los campos "Nombre completo (opcional)", "Email", "Contraseña" con la indicación "Entre 8 y 32 caracteres." y "Repite la contraseña", el botón "Crear cuenta" y el enlace "¿Ya tienes cuenta? Inicia sesión"

#### Scenario: Envío en curso

- **WHEN** la persona pulsa "Crear cuenta" y la respuesta del servidor aún no ha llegado
- **THEN** el botón muestra "Creando cuenta…" y queda deshabilitado

#### Scenario: Nombre vacío

- **WHEN** la persona deja el nombre vacío o solo con espacios y envía un registro por lo demás válido
- **THEN** la cuenta se crea sin nombre

### Requirement: Comprobación local de la confirmación de contraseña

El sistema SHALL comprobar en el navegador que la contraseña y su confirmación coinciden antes de enviar el registro.

#### Scenario: Contraseñas distintas

- **WHEN** la persona escribe contraseñas distintas en "Contraseña" y "Repite la contraseña" y pulsa "Crear cuenta"
- **THEN** ve "Las contraseñas no coinciden." bajo el campo de confirmación y no se envía ninguna petición al servidor

### Requirement: Errores del registro en pantalla

El sistema SHALL mostrar en castellano los errores que devuelve el servidor, cada uno bajo el campo al que corresponde, y SHALL mostrar en un aviso destacado sobre el formulario los errores que no corresponden a ningún campo visible.

#### Scenario: Email ya registrado

- **WHEN** la persona intenta registrarse con un email que ya tiene cuenta
- **THEN** ve bajo el campo Email el mensaje "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Email o contraseña inválidos

- **WHEN** el servidor rechaza el email por formato o la contraseña por longitud
- **THEN** la persona ve bajo el campo afectado "Introduce una dirección de email válida.", "la contraseña debe tener al menos 8 caracteres." o "la contraseña no puede superar los 32 caracteres.", según el caso; mientras la contraseña muestra un error, la indicación "Entre 8 y 32 caracteres." deja de mostrarse

#### Scenario: Servidor inaccesible

- **WHEN** la persona envía el formulario y el servidor no está disponible
- **THEN** ve sobre el formulario el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado."

#### Scenario: Fallo interno del servidor

- **WHEN** la persona envía el formulario y el servidor responde con un error inesperado
- **THEN** ve sobre el formulario el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

### Requirement: Pantalla de inicio de sesión

El sistema SHALL ofrecer una pantalla "Inicia sesión" con un formulario de email y contraseña y un enlace a la pantalla de registro.

#### Scenario: Contenido de la pantalla

- **WHEN** una persona sin sesión abre la pantalla de inicio de sesión
- **THEN** ve el nombre "FlowSync", el título "Inicia sesión", el texto "Entra con tu cuenta para volver a tus tareas.", los campos "Email" y "Contraseña", el botón "Entrar" y el enlace "¿Aún no tienes cuenta? Crea una"

#### Scenario: Envío en curso

- **WHEN** la persona pulsa "Entrar" y la respuesta del servidor aún no ha llegado
- **THEN** el botón muestra "Entrando…" y queda deshabilitado

#### Scenario: Credenciales incorrectas

- **WHEN** la persona introduce un email no registrado o una contraseña equivocada y pulsa "Entrar"
- **THEN** ve sobre el formulario el aviso "El email o la contraseña no son correctos." y sigue en la pantalla de inicio de sesión

#### Scenario: Datos con formato inválido

- **WHEN** la persona envía el formulario con un email mal formado o con algún campo vacío
- **THEN** ve el error correspondiente bajo el campo afectado, por ejemplo "Introduce una dirección de email válida." o "Falta rellenar la contraseña."

### Requirement: Entrada en la aplicación tras registrarse o iniciar sesión

El sistema SHALL guardar la sesión en el navegador y llevar a la persona a su perfil en cuanto el registro o el inicio de sesión terminan bien.

#### Scenario: Registro correcto

- **WHEN** la persona completa el registro con datos válidos
- **THEN** pasa directamente a la pantalla de perfil sin tener que iniciar sesión

#### Scenario: Inicio de sesión correcto

- **WHEN** la persona inicia sesión con credenciales correctas
- **THEN** pasa a la pantalla de perfil

### Requirement: Pantalla de perfil

El sistema SHALL mostrar a la persona autenticada sus datos de cuenta y un botón para cerrar sesión.

#### Scenario: Usuario con nombre

- **WHEN** una persona con sesión iniciada y nombre "Ada Lovelace" abre su perfil
- **THEN** ve un círculo con sus iniciales "AL", su nombre, su email, la línea "Miembro desde" con la fecha de alta en formato largo en castellano (por ejemplo, "1 de noviembre de 2026") y el botón "Cerrar sesión"

#### Scenario: Usuario sin nombre

- **WHEN** una persona con sesión iniciada y sin nombre abre su perfil
- **THEN** ve "Sin nombre" en lugar del nombre y las iniciales calculadas a partir de su email

### Requirement: Cierre de sesión en pantalla

El sistema SHALL cerrar la sesión en el navegador y llevar a la persona a la pantalla de inicio de sesión cuando pulsa "Cerrar sesión", aunque el servidor no confirme la revocación del token.

#### Scenario: Cierre normal

- **WHEN** la persona pulsa "Cerrar sesión" en su perfil
- **THEN** el botón muestra "Cerrando sesión…", la persona termina en la pantalla de inicio de sesión sin ningún aviso y, al recargar, sigue sin sesión

#### Scenario: Servidor inaccesible al cerrar sesión

- **WHEN** la persona pulsa "Cerrar sesión" y el servidor no está disponible
- **THEN** igualmente termina en la pantalla de inicio de sesión, sin ver ningún error

### Requirement: Control de acceso a las pantallas

El sistema SHALL permitir el acceso a la pantalla de perfil solo con sesión iniciada, y SHALL permitir el acceso a las pantallas de inicio de sesión y registro solo sin sesión.

#### Scenario: Perfil sin sesión

- **WHEN** una persona sin sesión intenta abrir la pantalla de perfil
- **THEN** es llevada a la pantalla de inicio de sesión

#### Scenario: Login o registro con sesión

- **WHEN** una persona con sesión iniciada intenta abrir la pantalla de inicio de sesión o la de registro
- **THEN** es llevada a la pantalla de perfil

#### Scenario: Dirección desconocida

- **WHEN** una persona abre una dirección de la aplicación que no corresponde a ninguna pantalla
- **THEN** es llevada al perfil si tiene sesión iniciada, o a la pantalla de inicio de sesión si no la tiene

### Requirement: Restauración de la sesión al volver a la aplicación

El sistema SHALL conservar la sesión entre recargas y visitas en el mismo navegador, y SHALL validarla con el servidor antes de mostrar cualquier pantalla del módulo.

#### Scenario: Validación en curso

- **WHEN** una persona con una sesión guardada abre o recarga la aplicación y el servidor aún no ha respondido
- **THEN** ve solo un indicador de carga, sin ser redirigida

#### Scenario: Sesión guardada válida

- **WHEN** una persona con una sesión guardada que el servidor sigue aceptando abre o recarga la aplicación
- **THEN** entra con su sesión activa sin volver a introducir credenciales

#### Scenario: Sesión guardada rechazada

- **WHEN** una persona abre la aplicación con una sesión guardada que el servidor ya no reconoce
- **THEN** la sesión se borra del navegador y la persona ve la pantalla de inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión."

#### Scenario: Servidor inaccesible al restaurar

- **WHEN** una persona abre la aplicación con una sesión guardada y el servidor no está disponible
- **THEN** ve la pantalla de inicio de sesión con el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado.", la sesión guardada no se borra y, al recargar con el servidor ya disponible, entra con su sesión activa

#### Scenario: Aviso de sesión perdida frente a un intento nuevo

- **WHEN** la pantalla de inicio de sesión muestra un aviso de sesión perdida y la persona intenta iniciar sesión con credenciales incorrectas
- **THEN** el aviso pasa a mostrar "El email o la contraseña no son correctos." en lugar del motivo de la sesión perdida


# Parte B

Se generaron **17 requisitos** en la Parte A. Esta parte los contrasta con el código existente.

Leyenda de la lista de comprobación: ✅ coincide con el código · ⚠️ coincide solo en parte o con matices · ❌ no coincide. Método: **[L]** comprobado leyendo el código; **[E]** comprobado además ejecutando la lógica real (validador de VineJS del proyecto, o la expresión de las iniciales copiada literalmente). No se arrancó el servidor ni el navegador: ningún punto se ha probado de extremo a extremo con peticiones HTTP reales ni en pantalla.

## 1. Requisitos generados y comprobados

Requisitos escritos: **17**. Requisitos comprobados: **17** (8 de API y 9 de pantalla). Resultado: 11 sin incoherencias, 6 con alguna (R1, R2, R3, R14, R15, R17) (ver sección 2).

### B.1 Registro de cuenta en la API (línea 9)

| Requisito | Ubicación en código |
|---|---|
| Registro con `POST /api/v1/auth/signup` | `backend/start/routes.ts:22`, `backend/app/controllers/new_account_controller.ts:7-17`, `backend/app/validators/user.ts:12-17`, `backend/app/transformers/user_transformer.ts:6-13`, `backend/database/schema.ts` (`password` con `serializeAs: null`, `updatedAt` con `autoCreate`) |

- ✅ [L] Responde `{ data: { user, token } }` con estado 200 por defecto (el controlador no fija otro).
- ✅ [L] `user` contiene exactamente `id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`; no incluye la contraseña.
- ✅ [E] `fullName: null` valida y se conserva como `null`.
- ⚠️ [E] "Nombre completo opcional": en la API la clave es obligatoria; solo admite el valor `null` (ver sección 2).

### B.2 Validación del registro (línea 23)

| Requisito | Ubicación en código |
|---|---|
| 422 con `errors[]` con `field` y `rule` | `backend/app/validators/user.ts:6-17`; `backend/config/bodyparser.ts` (cadenas vacías pasan a `null`) |

- ✅ [E] Contraseña corta o larga: reglas `minLength` (meta `min: 8`) y `maxLength` (meta `max: 32`).
- ✅ [E] Email con formato inválido: regla `email`; email > 254: `maxLength`.
- ✅ [L] Email repetido: regla `database.unique` (`node_modules/@adonisjs/lucid/build/src/bindings/vinejs.js:15`).
- ✅ [L] Confirmación distinta: regla `sameAs` sobre `passwordConfirmation` (`user.ts:16`).
- ✅ [E] Campo ausente o vacío: regla `required`.
- ⚠️ [E] El escenario de longitud solo nombra `password`; la misma regla se aplica a `passwordConfirmation`. Tampoco se menciona que `fullName` ausente da `required`.

### B.3 Iniciales del usuario (línea 52)

| Requisito | Ubicación en código |
|---|---|
| Cálculo de `initials` | `backend/app/models/user.ts:11-17`; expuesto en `backend/app/transformers/user_transformer.ts:12` |

- ✅ [E] "Ada Lovelace" → "AL"; "Ada" → "AD"; sin nombre y `ana@ejemplo.com` → "AE"; "Ada María Lovelace" → "AM".
- ⚠️ [E] Separa solo por un espacio simple: "Ada  Lovelace" (dos espacios) → "AD" y " Ada" (espacio inicial) → "" (ver sección 2).

### B.4 Inicio de sesión en la API (línea 71)

| Requisito | Ubicación en código |
|---|---|
| `POST /api/v1/auth/login` emite token nuevo | `backend/start/routes.ts:23`, `backend/app/controllers/access_tokens_controller.ts:8-17`, `backend/app/models/user.ts:7` |

- ✅ [L] Responde `{ data: { user, token } }` con 200.
- ✅ [L] Cada login crea un token (`accessTokens.create`) y no borra ninguno anterior.
- ✅ [L] No se define caducidad: el proveedor solo la aplica si se pasa `expiresIn` (`node_modules/@adonisjs/auth/build/modules/access_tokens_guard/main.js:1041`) y el modelo no lo pasa.

### B.5 Rechazo del inicio de sesión (línea 85)

| Requisito | Ubicación en código |
|---|---|
| 400 por credenciales, 422 por formato | `backend/app/controllers/access_tokens_controller.ts:9-11`, `backend/app/validators/user.ts:23-26`, `node_modules/@adonisjs/auth/build/errors-eDV8ejO0.js:170` (estado 400) |

- ✅ [L] Email inexistente y contraseña errónea producen el mismo error (400, `{ errors: [{ message }] }`, sin `field`).
- ✅ [L] Email mal formado o campos ausentes: 422 por el validador del login.

### B.6 Consulta del perfil en la API (línea 99)

| Requisito | Ubicación en código |
|---|---|
| `GET /api/v1/account/profile` | `backend/start/routes.ts:27,31`, `backend/app/controllers/profile_controller.ts:5-7`, `backend/app/middleware/auth_middleware.ts`, `backend/config/auth.ts:11` (guard por defecto `api`) |

- ✅ [L] Token válido: 200 con `{ data: usuario }`.
- ✅ [L] Sin token, inventado o revocado: el middleware lanza `E_UNAUTHORIZED_ACCESS`, estado 401 (`errors-eDV8ejO0.js:30`).

### B.7 Cierre de sesión en la API (línea 113)

| Requisito | Ubicación en código |
|---|---|
| `POST /api/v1/account/logout` | `backend/start/routes.ts:28`, `backend/app/controllers/access_tokens_controller.ts:19-26` |

- ✅ [L] Borra solo el token usado (`accessTokens.delete(user, identifier)`); los demás siguen válidos.
- ✅ [L] Responde `{ message: 'Logged out successfully' }` sin `data`.
- ✅ [L] Sin token: 401 por el middleware de autenticación.

### B.8 Respuestas en JSON (línea 132)

| Requisito | Ubicación en código |
|---|---|
| JSON siempre | `backend/start/kernel.ts:26` (middleware global), `backend/app/middleware/force_json_response_middleware.ts:5-8` |

- ✅ [L] El middleware fija `Accept: application/json` en todas las peticiones; el 401 del guard responde entonces con el formato JSON (`errors-eDV8ejO0.js:98-100`).

### B.9 Pantalla de registro (línea 141)

| Requisito | Ubicación en código |
|---|---|
| Pantalla "Crea tu cuenta" | `frontend/src/pages/register-page.tsx`, `frontend/src/components/auth-layout.tsx` |

- ✅ [L] Textos, campos, indicación "Entre 8 y 32 caracteres." y enlace "Inicia sesión" coinciden literalmente.
- ✅ [L] Botón "Creando cuenta…" y deshabilitado mientras envía.
- ✅ [L] Nombre vacío o solo espacios se envía como `null` (`fullName.trim() || null`).

### B.10 Comprobación local de la confirmación (línea 160)

| Requisito | Ubicación en código |
|---|---|
| "Las contraseñas no coinciden." sin llamar al servidor | `frontend/src/pages/register-page.tsx` (`handleSubmit`), `frontend/src/auth/use-auth-form.ts` (`failWith`) |

- ✅ [L] Si no coinciden se muestra bajo la confirmación y se hace `return` antes de `signup`.

### B.11 Errores del registro en pantalla (línea 169)

| Requisito | Ubicación en código |
|---|---|
| Traducción y reparto de errores | `frontend/src/lib/api.ts:46-70` (`translate`), `api.ts:72-102` (`toApiError`), `frontend/src/auth/use-auth-form.ts` |

- ✅ [L] "Ese email ya está registrado. Inicia sesión en su lugar.", "Introduce una dirección de email válida.", mensajes de longitud con `min`/`max` (los metadatos existen, comprobado en [E] de B.2).
- ✅ [L] Sin conexión: "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." (`api.ts:125-129`); error inesperado: "Algo ha ido mal en el servidor…" (`api.ts:98-101`).
- ✅ [L] La indicación de contraseña se sustituye por el error cuando lo hay (`register-page.tsx`).

### B.12 Pantalla de inicio de sesión (línea 193)

| Requisito | Ubicación en código |
|---|---|
| Pantalla "Inicia sesión" | `frontend/src/pages/login-page.tsx`, `frontend/src/lib/api.ts:83-85` |

- ✅ [L] Textos, botón "Entrar"/"Entrando…" y enlace "Crea una" coinciden.
- ✅ [L] Un 400 se traduce a "El email o la contraseña no son correctos." y se muestra como aviso.
- ✅ [L] Un campo vacío llega como `null` (`bodyparser.ts`, `json.convertEmptyStringsToNull`) y da `required`, que se muestra como "Falta rellenar la contraseña.".

### B.13 Entrada tras registrarse o iniciar sesión (línea 217)

| Requisito | Ubicación en código |
|---|---|
| Guardar sesión y pasar al perfil | `frontend/src/auth/auth-provider.tsx:30-39` (`startSession`), `frontend/src/routes/public-only-route.tsx` |

- ✅ [L] Guarda el token en el almacenamiento local y marca la sesión como autenticada; la ruta pública redirige a `/profile`.

### B.14 Pantalla de perfil (línea 231)

| Requisito | Ubicación en código |
|---|---|
| Datos de cuenta y botón de cierre | `frontend/src/pages/profile-page.tsx` |

- ✅ [L] Iniciales, nombre o "Sin nombre", email, "Miembro desde" con fecha larga `es-ES` y botón "Cerrar sesión".
- ⚠️ [L] El formateador de fecha no fija zona horaria: se usa la del navegador, así que el día mostrado puede diferir del día UTC de alta (ver sección 2).

### B.15 Cierre de sesión en pantalla (línea 245)

| Requisito | Ubicación en código |
|---|---|
| Cierre local siempre | `frontend/src/pages/profile-page.tsx:24-28`, `frontend/src/auth/auth-provider.tsx:98-108` |

- ✅ [L] Se borra la sesión local antes de llamar al servidor y el fallo de la llamada se ignora (`.catch(() => undefined)`).
- ✅ [L] Se limpia el aviso de sesión (`setSessionError(null)`), por lo que el login aparece sin aviso.
- ❌ [L] El texto "Cerrando sesión…" casi seguro no llega a verse (ver sección 2).

### B.16 Control de acceso a las pantallas (línea 259)

| Requisito | Ubicación en código |
|---|---|
| Rutas protegidas y públicas | `frontend/src/routes/app-routes.tsx`, `protected-route.tsx`, `public-only-route.tsx` |

- ✅ [L] Sin sesión: `/profile` → `/login`. Con sesión: `/login` y `/register` → `/profile`. Ruta desconocida → `/profile` y, si no hay sesión, de ahí a `/login`.

### B.17 Restauración de la sesión (línea 278)

| Requisito | Ubicación en código |
|---|---|
| Rehidratación contra el servidor | `frontend/src/auth/auth-provider.tsx:15-21,45-86`, `frontend/src/components/full-screen-loader.tsx`, `frontend/src/lib/api.ts:78-83` |

- ✅ [L] Con token guardado el estado inicial es "cargando" y los guards muestran solo el indicador.
- ✅ [L] 401: se borra el token y el aviso es "Tu sesión ha caducado. Vuelve a iniciar sesión.".
- ✅ [L] Servidor inaccesible: el token se conserva en el almacenamiento y el aviso es el de conexión.
- ⚠️ [L] El aviso solo se pinta en la pantalla de inicio de sesión (ver sección 2).

## 2. Incoherencias detectadas

Una línea por incoherencia entre lo que dice la spec y lo que hace el código. Los requisitos sin entrada no tienen incoherencias detectadas.

- **R1** — La spec dice "nombre completo opcional" (`rt.md:11`), pero la API exige la clave `fullName` y solo admite `null` (`backend/app/validators/user.ts:13`); omitirla da 422 `required` [E].
- **R2** — El escenario "Contraseña fuera de longitud" (`rt.md:37`) solo cita `password`, pero la regla también rige `passwordConfirmation` (`user.ts:16`); y "Campos obligatorios ausentes" (`rt.md:47`) omite que `fullName` también es obligatorio (`user.ts:13`).
- **R3** — La spec habla de "las dos primeras palabras" (`rt.md:56`), pero el código separa por un único espacio: "Ada  Lovelace" da "AD" y " Ada" da cadena vacía (`backend/app/models/user.ts:12`) [E].
- **R4** — Sin incoherencias.
- **R5** — Sin incoherencias.
- **R6** — Sin incoherencias.
- **R7** — Sin incoherencias.
- **R8** — Sin incoherencias.
- **R9** — Sin incoherencias.
- **R10** — Sin incoherencias.
- **R11** — Sin incoherencias.
- **R12** — Sin incoherencias.
- **R13** — Sin incoherencias.
- **R14** — El ejemplo "1 de noviembre de 2026" (`rt.md`, escenario "Usuario con nombre") depende de la zona horaria del navegador: el formateador no fija zona (`frontend/src/pages/profile-page.tsx:13-15`), así que cerca de medianoche UTC puede mostrarse otro día.
- **R15** — El escenario "Cierre normal" (`rt.md:249`) dice que el botón muestra "Cerrando sesión…", pero `logout` limpia la sesión de forma síncrona (`auth-provider.tsx:102`) en el mismo evento que activa ese texto (`profile-page.tsx:25`), y la ruta protegida redirige al login antes de que se pinte. Deducido por lectura; no probado en navegador.
- **R16** — Sin incoherencias.
- **R17** — Los escenarios "Sesión guardada rechazada" (`rt.md:292`) y "Servidor inaccesible al restaurar" (`rt.md:297`) dicen que se ve el aviso en la pantalla de inicio de sesión, pero si la persona abre `/register` se queda ahí y la pantalla de registro no pinta ese aviso (`frontend/src/pages/register-page.tsx`, sin uso del aviso de sesión); además, un error 5xx durante la restauración muestra "Algo ha ido mal en el servidor…", caso no recogido en la spec (`auth-provider.tsx:69-73`).

## 3. Comportamientos que no supe clasificar como bug o contrato

**3.1 El email distingue mayúsculas y minúsculas.**
- *Es un bug* si se espera que `Ana@x.com` y `ana@x.com` sean la misma cuenta: hoy podrían registrarse las dos, y alguien que escriba su email con otra capitalización no podrá entrar.
- *Es contrato* si se decidió tratar el email tal cual se escribe.
- *Por qué el código no lo aclara:* no hay normalización del email ni en el validador ni en el modelo, y la regla de unicidad admite una opción `caseInsensitive` (`node_modules/@adonisjs/lucid/build/src/bindings/vinejs.js:42`) que aquí no se usa; no hay comentario ni prueba que diga si fue una decisión o un olvido. No lo probé contra la base de datos real: la conclusión sobre SQLite sale de leer el código.

**3.2 El cierre de sesión responde sin el envoltorio `data` y en inglés.**
- *Es un bug* si la convención es que toda respuesta lleve `{ data: ... }` y los textos estén en castellano: es la única que rompe ambas cosas.
- *Es contrato* si se pretendía un acuse sin datos; el proyecto prevé respuestas sin envoltorio.
- *Por qué el código no lo aclara:* el frontend descarta el cuerpo del logout (`frontend/src/lib/api.ts:162-166`), así que nada depende de la forma, y ningún comentario explica la elección.

**3.3 Los tokens no caducan y se acumulan.**
- *Es un bug* (o carencia de seguridad) si se espera que una sesión olvidada deje de valer: cada login añade un token que vale indefinidamente y el cierre de sesión solo revoca el usado.
- *Es contrato* si se aceptó así para la práctica o para clientes que no reinician sesión.
- *Por qué el código no lo aclara:* el proveedor admite caducidad, pero no se configura (`backend/app/models/user.ts:7`); la ausencia de configuración es idéntica tanto si se decidió como si no.

**3.4 La contraseña no puede superar los 32 caracteres.**
- *Es un bug* si se quiere admitir frases de contraseña largas: el tope impide gestores de contraseñas con claves largas y no es necesario al guardar un hash.
- *Es contrato* si es un límite de producto deliberado (la pantalla lo anuncia: "Entre 8 y 32 caracteres.").
- *Por qué el código no lo aclara:* el límite está duplicado de forma coherente en backend y frontend, lo que apunta a decisión, pero no hay documento de requisitos ni comentario que lo justifique; el PRD no se consultó para este análisis.
