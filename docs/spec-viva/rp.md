# Spec viva — E1 · Cuentas y acceso

Requisitos extraídos del comportamiento **observado** en el código a fecha 2026-11-01 (rama `spec-viva-rp`). No es una propuesta: describe lo que el sistema hace hoy y clasifica cada comportamiento.

## Cómo leer la clasificación

| Etiqueta | Significado | Criterio usado |
|---|---|---|
| **Contrato** | Hay que preservarlo; romperlo rompe a alguien. | Lo exige el PRD (`docs/prd/flowsync-mvp.md`, RF-1 a RF-4) o lo consume explícitamente otra pieza del sistema (el frontend lee esa forma, ese status o ese campo). |
| **Accidental** | Sale así por cómo está construido; nadie depende de ello. | Detalle de implementación, valor por defecto del framework o texto que ningún consumidor lee. |
| **Dudoso** | No se sabe si es intencional. | Contradice o no encaja del todo con el PRD, es incoherente con el resto del módulo o tiene consecuencias que nadie ha decidido de forma explícita. |

Notación: `REQ-<capacidad>-<n>`. Cada requisito cita los ficheros donde se observa.

---

## 1. Registro

### REQ-REG-1 — Alta con email y contraseña devuelve usuario y token — **Contrato**
- WHEN se hace `POST /api/v1/auth/signup` con `email` válido y no registrado, `password` de 8–32 caracteres y `passwordConfirmation` igual
- THEN se crea el usuario, se emite un access token y la respuesta es `{ data: { user, token } }`

**Por qué:** RF-1 («crear una cuenta… y quedar automáticamente dentro»). El frontend desenvuelve exactamente `data.user` y `data.token` (`frontend/src/lib/api.ts:142-147`, `frontend/src/lib/types.ts:16-19`).
Fuentes: `backend/start/routes.ts:22`, `backend/app/controllers/new_account_controller.ts:7-16`.

### REQ-REG-2 — Tras registrarse se entra directamente al perfil — **Contrato**
- WHEN el registro en la pantalla `/register` tiene éxito
- THEN el token se guarda en `localStorage` (`flowsync.token`), el estado pasa a `authenticated` y `PublicOnlyRoute` redirige a `/profile` sin más pasos

**Por qué:** la aceptación de RF-1 dice literalmente «tras registrarse queda con sesión iniciada… sin ningún paso adicional».
Fuentes: `frontend/src/auth/auth-provider.tsx:30-39,91-96`, `frontend/src/routes/public-only-route.tsx:13`.

### REQ-REG-3 — El nombre completo es opcional — **Dudoso**
- WHEN se registra alguien sin nombre (campo vacío o solo espacios)
- THEN el frontend envía `fullName: null`, el backend lo acepta y la cuenta se crea sin nombre

**Por qué:** RF-1 habla de crear la cuenta «con nombre, email y contraseña», pero el validador declara `fullName` como `.nullable()`, la columna admite null y la UI lo rotula «(opcional)». No hay nada que indique cuál de los dos es la intención.
Fuentes: `backend/app/validators/user.ts:13`, `backend/database/migrations/1761885935168_create_users_table.ts`, `frontend/src/pages/register-page.tsx:42,64-68`.

### REQ-REG-4 — La clave `fullName` debe viajar siempre — **Contrato**
- WHEN se envía el signup
- THEN el payload incluye `fullName` aunque valga `null` (si se omite, VineJS responde `required`)

**Por qué:** el backend usa `.nullable()` (no `.optional()`), y el frontend lo documenta y lo respeta de forma explícita en el tipo y en la llamada.
Fuentes: `backend/app/validators/user.ts:13`, `frontend/src/lib/types.ts:22-23`, `frontend/src/pages/register-page.tsx:41-42`.

### REQ-REG-5 — El nombre no tiene límite de longitud en la validación — **Dudoso**
- WHEN se envía un `fullName` muy largo
- THEN el validador no lo rechaza; el límite queda a merced de la columna `string` de la BD

**Por qué:** email y contraseña tienen máximos explícitos y el nombre no; no se sabe si es intencional o un olvido.
Fuentes: `backend/app/validators/user.ts:13`.

### REQ-REG-6 — Email único — **Contrato**
- WHEN se intenta registrar un email que ya existe
- THEN el backend responde 422 con regla `database.unique` sobre `email`, y la pantalla muestra bajo el campo «Ese email ya está registrado. Inicia sesión en su lugar.»

**Por qué:** la identidad de la cuenta es el email (es la credencial de login); la unicidad está reforzada a la vez en el validador y en un índice único de la BD, y el frontend tiene un mensaje específico para este caso.
Fuentes: `backend/app/validators/user.ts:14`, `backend/database/migrations/1761885935168_create_users_table.ts`, `frontend/src/lib/api.ts:50-53`.

### REQ-REG-7 — Reglas de formato de email y contraseña — **Contrato**
- WHEN el email no tiene formato válido o supera 254 caracteres
- THEN 422 con regla `email` / `maxLength`
- WHEN la contraseña tiene menos de 8 o más de 32 caracteres
- THEN 422 con regla `minLength` / `maxLength`, y la UI muestra el mensaje con el límite que envía el backend (`meta.min` / `meta.max`)

**Por qué:** la UI anuncia de forma explícita «Entre 8 y 32 caracteres», así que el rango es una promesa visible para el usuario; el máximo de 254 coincide con la columna de la BD.
Fuentes: `backend/app/validators/user.ts:6-7,14-15`, `frontend/src/pages/register-page.tsx:121-123`, `frontend/src/lib/api.ts:56-63`.

### REQ-REG-8 — Confirmación de contraseña comprobada en cliente y en servidor — **Contrato**
- WHEN `password` y `passwordConfirmation` no coinciden en la pantalla de registro
- THEN el frontend muestra «Las contraseñas no coinciden.» bajo la confirmación **sin llamar al backend**
- WHEN aun así llega al backend una confirmación distinta
- THEN 422 con regla `sameAs`, traducida al mismo mensaje

**Por qué:** la regla existe en los dos lados con el mismo texto; el comentario del frontend deja claro que la validación autoritativa es la del backend.
Fuentes: `frontend/src/pages/register-page.tsx:31-37`, `backend/app/validators/user.ts:16`, `frontend/src/lib/api.ts:54-55`.

### REQ-REG-9 — La confirmación también se valida en longitud — **Accidental**
- WHEN `passwordConfirmation` tiene menos de 8 caracteres
- THEN el backend puede devolver un error `minLength` sobre la confirmación además del de `sameAs`

**Por qué:** es consecuencia de reutilizar el builder `password()` para la confirmación, no una regla con sentido propio.
Fuentes: `backend/app/validators/user.ts:16`.

---

## 2. Login

### REQ-LOG-1 — Login con credenciales correctas devuelve usuario y token — **Contrato**
- WHEN se hace `POST /api/v1/auth/login` con email y contraseña correctos
- THEN la respuesta es `{ data: { user, token } }` con un token nuevo

**Por qué:** RF-2; el frontend consume esa forma exacta.
Fuentes: `backend/app/controllers/access_tokens_controller.ts:7-17`, `frontend/src/lib/api.ts:149-154`.

### REQ-LOG-2 — Credenciales incorrectas: error comprensible y sin acceso — **Contrato**
- WHEN el email no existe o la contraseña no coincide
- THEN `verifyCredentials` lanza `E_INVALID_CREDENTIALS` (400), no se emite token y la pantalla muestra arriba «El email o la contraseña no son correctos.»

**Por qué:** aceptación literal de RF-2. El mensaje no distingue entre email inexistente y contraseña errónea.
Fuentes: `backend/app/controllers/access_tokens_controller.ts:10`, `frontend/src/lib/api.ts:82-85`, `frontend/src/pages/login-page.tsx:23,36-41`.

### REQ-LOG-3 — Todo 400 se presenta como «credenciales incorrectas» — **Dudoso**
- WHEN cualquier endpoint responde 400 (no solo login)
- THEN el cliente lo traduce siempre a «El email o la contraseña no son correctos.»

**Por qué:** solo es correcto mientras el único 400 del sistema sea `E_INVALID_CREDENTIALS`; el mapeo está en el cliente genérico, no en la función de login.
Fuentes: `frontend/src/lib/api.ts:82-85`.

### REQ-LOG-4 — La contraseña del login no tiene reglas de longitud — **Dudoso**
- WHEN se envía un login con contraseña de cualquier longitud (incluida vacía)
- THEN el validador solo exige que sea un string y la decisión se deja a `verifyCredentials`

**Por qué:** puede ser deliberado (no revelar la política de contraseñas en el login) o una asimetría no pensada respecto al signup; el código no lo explica.
Fuentes: `backend/app/validators/user.ts:23-26`.

### REQ-LOG-5 — Cada login acumula un token nuevo — **Dudoso**
- WHEN el mismo usuario hace login varias veces
- THEN se crea un token por login y los anteriores siguen siendo válidos

**Por qué:** permite sesiones en varios dispositivos, pero nada indica si se buscó; tampoco hay ningún límite ni limpieza.
Fuentes: `backend/app/controllers/access_tokens_controller.ts:11`.

### REQ-LOG-6 — Los tokens no caducan — **Dudoso**
- WHEN se emite un token en login o signup
- THEN se crea sin `expiresIn`; `expires_at` queda a null y el token vale indefinidamente hasta el logout

**Por qué:** RF-3 pide que la sesión sobreviva a recargas y cierres de pestaña, lo que cumple, pero «para siempre» va mucho más allá de lo pedido. El cliente, además, ya tiene preparado el mensaje «Tu sesión ha caducado».
Fuentes: `backend/app/controllers/access_tokens_controller.ts:11`, `backend/app/controllers/new_account_controller.ts:11`, `backend/database/migrations/1768620764696_create_access_tokens_table.ts`.

### REQ-LOG-7 — Estado del botón durante el envío — **Accidental**
- WHEN se envía el formulario de login o de registro
- THEN el botón se desactiva y su texto cambia a «Entrando…» / «Creando cuenta…» hasta que hay respuesta

**Por qué:** detalle de UX sin requisito asociado; útil, pero nadie depende de los textos exactos.
Fuentes: `frontend/src/pages/login-page.tsx:78-80`, `frontend/src/pages/register-page.tsx:150-152`, `frontend/src/auth/use-auth-form.ts:25-32`.

### REQ-LOG-8 — Reparto de errores entre campo y aviso general — **Contrato**
- WHEN el backend devuelve errores 422 y todos son de campos que la pantalla pinta
- THEN cada error aparece bajo su input y no hay aviso general
- WHEN alguno es de un campo que la pantalla no pinta, o el error no es de validación
- THEN se muestra el mensaje en el aviso superior para que no se pierda
- WHEN el error no es un `ApiError`
- THEN aviso genérico «Algo ha ido mal. Inténtalo de nuevo.»

**Por qué:** es la regla documentada de `useAuthForm` que comparten ambas pantallas; garantiza que ningún error quede sin enseñar.
Fuentes: `frontend/src/auth/use-auth-form.ts:12-58`.

### REQ-LOG-9 — Solo se muestra el primer error por campo — **Accidental**
- WHEN el backend devuelve varios errores para el mismo campo
- THEN el cliente se queda con el primero

Fuentes: `frontend/src/lib/api.ts:89-93`.

### REQ-LOG-10 — Validación nativa del navegador desactivada — **Accidental**
- WHEN se envía un formulario de auth con campos vacíos o mal formados
- THEN el navegador no bloquea el envío (`noValidate`) y los errores llegan del backend

**Por qué:** los atributos `required`/`type=email`/`minLength` quedan solo como semántica; la decisión parece de estilo, coherente con mostrar mensajes propios.
Fuentes: `frontend/src/pages/login-page.tsx:35`, `frontend/src/pages/register-page.tsx:55`.

---

## 3. Sesión y logout

### REQ-SES-1 — La sesión sobrevive a recargas y cierres de pestaña — **Contrato**
- WHEN el usuario recarga o vuelve a abrir la app con un token en `localStorage`
- THEN el estado arranca en `loading`, se valida el token con `GET /account/profile` y, si es válido, pasa a `authenticated` sin pedir credenciales

**Por qué:** RF-3 y su aceptación literal.
Fuentes: `frontend/src/auth/auth-provider.tsx:12-18,43-56`.

### REQ-SES-2 — Token rechazado por el backend: se descarta — **Contrato**
- WHEN la rehidratación recibe un 401
- THEN se borra el token de `localStorage`, el estado pasa a `anonymous` y la pantalla de login explica «Tu sesión ha caducado. Vuelve a iniciar sesión.»

**Por qué:** un token inválido no sirve para nada; el aviso evita que el usuario aparezca en el login sin saber por qué (comentario explícito).
Fuentes: `frontend/src/auth/auth-provider.tsx:60-62,72-76`, `frontend/src/lib/api.ts:75-80`, `frontend/src/pages/login-page.tsx:21-23`.

### REQ-SES-3 — Backend caído al rehidratar: anónimo pero conservando el token — **Dudoso**
- WHEN la rehidratación falla por red o por un error que no es 401
- THEN el estado pasa a `anonymous` y se muestra el motivo en el login, pero el token **sigue en `localStorage`**; una recarga posterior con el backend levantado restaura la sesión

**Por qué:** el comentario lo justifica (no cerrar sesión por un corte pasajero), pero mientras tanto el usuario ve el login como si no tuviera sesión, y un login nuevo en ese estado sobrescribe el token guardado. La intención está documentada; el resultado para el usuario no está claro que sea el buscado.
Fuentes: `frontend/src/auth/auth-provider.tsx:63-70`.

### REQ-SES-4 — Logout cierra la sesión local pase lo que pase — **Contrato**
- WHEN el usuario pulsa «Cerrar sesión»
- THEN se borra el token local y el estado pasa a `anonymous` **antes** de llamar al backend; si la llamada a `POST /account/logout` falla, se ignora

**Por qué:** RF-2 (cerrar sesión explícitamente); el comentario fija como objetivo «dejar de estar logueado» con independencia del servidor.
Fuentes: `frontend/src/auth/auth-provider.tsx:98-107`.

### REQ-SES-5 — Logout revoca solo el token actual — **Contrato**
- WHEN se llama a `POST /api/v1/account/logout` con un token válido
- THEN se borra de la BD ese token concreto; los demás tokens del usuario siguen activos

**Por qué:** es lo que hace que el logout sea real en el servidor y no solo en el cliente; el alcance (solo este dispositivo) es coherente con REQ-LOG-5.
Fuentes: `backend/app/controllers/access_tokens_controller.ts:19-23`.

### REQ-SES-6 — Tras logout, «atrás» no devuelve el contenido — **Contrato**
- WHEN tras cerrar sesión se navega hacia atrás a `/profile`
- THEN `ProtectedRoute` ve el estado `anonymous` y redirige a `/login` (con `replace`)

**Por qué:** aceptación literal de RF-2.
Fuentes: `frontend/src/routes/protected-route.tsx:13`, `frontend/src/pages/profile-page.tsx:26`.

### REQ-SES-7 — La respuesta del logout no lleva envoltorio `data` — **Dudoso**
- WHEN el logout tiene éxito
- THEN el backend responde `{ message: 'Logged out successfully' }` sin pasar por `serialize()`

**Por qué:** contradice la convención del proyecto de que toda respuesta pase por `serialize()`. Hoy no afecta a nadie porque el cliente descarta el cuerpo (`frontend/src/lib/api.ts:165-169`).
Fuentes: `backend/app/controllers/access_tokens_controller.ts:25-27`.

### REQ-SES-8 — Mensaje del logout en inglés — **Accidental**
- WHEN el logout tiene éxito
- THEN el texto devuelto es «Logged out successfully»

**Por qué:** ningún consumidor lo lee; restos del scaffolding.
Fuentes: `backend/app/controllers/access_tokens_controller.ts:26`.

### REQ-SES-9 — Error de conexión con el backend — **Contrato**
- WHEN `fetch` no llega al servidor
- THEN se lanza `ApiError` con status 0 y el mensaje «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

**Por qué:** es la base de la distinción entre «token inválido» y «backend caído» de REQ-SES-2/3.
Fuentes: `frontend/src/lib/api.ts:119-129`.

### REQ-SES-10 — Respuestas no JSON — **Accidental**
- WHEN el backend responde con un cuerpo que no es JSON (p. ej. un 500 en HTML)
- THEN el cliente lo trata como `null` y aplica el mensaje genérico del servidor

Fuentes: `frontend/src/lib/api.ts:132-137,98-101`.

### REQ-SES-11 — Guard de sesión `web` configurado sin uso — **Accidental**
- WHEN una petición se autentica
- THEN se usa siempre el guard `api` (tokens opacos), que es el de por defecto; el guard `web` (sesión) existe en la configuración pero ninguna ruta lo usa

**Por qué:** viene del scaffolding del starter kit.
Fuentes: `backend/config/auth.ts:10-35`, `backend/app/middleware/auth_middleware.ts:17`.

---

## 4. Perfil

### REQ-PER-1 — Consultar el perfil propio con token válido — **Contrato**
- WHEN se hace `GET /api/v1/account/profile` con `Authorization: Bearer <token>` válido
- THEN responde `{ data: user }` con el usuario autenticado

**Por qué:** es el endpoint sobre el que se apoya la rehidratación de sesión (REQ-SES-1).
Fuentes: `backend/app/controllers/profile_controller.ts:5-7`, `frontend/src/lib/api.ts:156-160`.

### REQ-PER-2 — Perfil sin token o con token inválido — **Contrato**
- WHEN se llama a `/account/profile` o `/account/logout` sin token o con uno inválido
- THEN `auth_middleware` rechaza con 401

**Por qué:** RF-4 (sin sesión no se accede); el frontend depende del 401 para descartar el token (REQ-SES-2).
Fuentes: `backend/start/routes.ts:28-35`, `backend/app/middleware/auth_middleware.ts:17`.

### REQ-PER-3 — Campos expuestos del usuario — **Contrato**
- WHEN se serializa un usuario (signup, login, perfil)
- THEN se exponen exactamente `id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`, y **nunca** `password`

**Por qué:** el tipo `User` del frontend reproduce este conjunto a mano y la pantalla de perfil usa `initials`, `fullName`, `email` y `createdAt`. Que no salga la contraseña (ni su hash) es un contrato de seguridad.
Fuentes: `backend/app/transformers/user_transformer.ts:6-13`, `frontend/src/lib/types.ts:1-11`.

### REQ-PER-4 — Cálculo de las iniciales — **Accidental**
- WHEN el usuario tiene `fullName` con al menos dos palabras
- THEN las iniciales son la primera letra de las dos primeras palabras, en mayúsculas
- WHEN tiene una sola palabra
- THEN son sus dos primeras letras
- WHEN no tiene `fullName`
- THEN se calcula igual sobre el email partido por `@` (parte local y dominio)

**Por qué:** que haya iniciales es contrato (la UI las pinta); el algoritmo concreto, incluido usar el dominio del email como «apellido», es un detalle de implementación que nadie ha especificado.
Fuentes: `backend/app/models/user.ts:11-17`, `frontend/src/pages/profile-page.tsx:36`.

### REQ-PER-5 — Pantalla de perfil — **Contrato**
- WHEN un usuario autenticado abre `/profile`
- THEN ve sus iniciales, su nombre (o «Sin nombre» si es null), su email, «Miembro desde» con la fecha de alta en formato largo `es-ES` y un botón «Cerrar sesión»

**Por qué:** es hoy la única vista del espacio con sesión y el único punto de logout de la UI (RF-2).
Fuentes: `frontend/src/pages/profile-page.tsx:13-72`.

### REQ-PER-6 — Perfil sin usuario cargado no pinta nada — **Accidental**
- WHEN `ProfilePage` se renderiza con `user === null`
- THEN devuelve `null`

**Por qué:** salvaguarda de tipos; `ProtectedRoute` ya impide llegar ahí sin sesión.
Fuentes: `frontend/src/pages/profile-page.tsx:21-22`.

### REQ-PER-7 — El perfil no se refresca tras la carga — **Dudoso**
- WHEN cambian los datos del usuario en el servidor durante la sesión
- THEN la UI sigue mostrando el `user` obtenido en login/signup/rehidratación hasta la siguiente recarga

**Por qué:** hoy no existe edición de perfil, así que no se nota; no está claro si es una decisión o simplemente que aún no hacía falta.
Fuentes: `frontend/src/auth/auth-provider.tsx:30-56`.

---

## 5. Protección de rutas

### REQ-RUT-1 — Rutas protegidas exigen sesión — **Contrato**
- WHEN un visitante sin sesión (`anonymous`) entra en una ruta bajo `ProtectedRoute` (hoy `/profile`)
- THEN se le redirige a `/login` con `replace`

**Por qué:** RF-4 y su aceptación («acceder a cualquier vista del espacio sin sesión redirige a inicio de sesión»).
Fuentes: `frontend/src/routes/app-routes.tsx:16-18`, `frontend/src/routes/protected-route.tsx:13`.

### REQ-RUT-2 — No se redirige mientras se valida el token — **Contrato**
- WHEN el estado es `loading` (rehidratación en curso)
- THEN tanto `ProtectedRoute` como `PublicOnlyRoute` muestran un loader a pantalla completa en lugar de redirigir

**Por qué:** sin esto, una recarga echaría al usuario al login antes de validar su token, lo que rompería RF-3 (comentario explícito).
Fuentes: `frontend/src/routes/protected-route.tsx:5-12`, `frontend/src/routes/public-only-route.tsx:12`, `frontend/src/components/full-screen-loader.tsx`.

### REQ-RUT-3 — Login y registro solo para anónimos — **Contrato**
- WHEN un usuario autenticado entra en `/login` o `/register`
- THEN se le redirige a `/profile` con `replace`

**Por qué:** es el mecanismo que materializa el «queda dentro» de RF-1 tras el registro y tras el login (REQ-REG-2).
Fuentes: `frontend/src/routes/app-routes.tsx:11-14`, `frontend/src/routes/public-only-route.tsx:13`.

### REQ-RUT-4 — Cualquier ruta desconocida lleva a `/profile` — **Dudoso**
- WHEN se navega a una ruta no declarada (incluida `/`)
- THEN se redirige a `/profile` (y de ahí a `/login` si no hay sesión)

**Por qué:** funciona hoy porque `/profile` es la única vista del espacio; no hay 404 y no está claro si `/profile` es el destino de inicio deseado o un sustituto provisional.
Fuentes: `frontend/src/routes/app-routes.tsx:20`.

### REQ-RUT-5 — Protección en backend por grupo de rutas — **Contrato**
- WHEN se registra una ruta dentro del grupo `/api/v1/account`
- THEN hereda `middleware.auth()`; las rutas fuera de ese grupo (`/auth/*`) son públicas

**Por qué:** RF-4 en el lado del servidor; la protección del frontend sola no impide acceder a los datos.
Fuentes: `backend/start/routes.ts:18-37`.

### REQ-RUT-6 — Autenticación silenciosa en todas las rutas — **Accidental**
- WHEN llega cualquier petición a una ruta registrada
- THEN `silent_auth_middleware` ejecuta `auth.check()`; si hay token válido el usuario queda disponible en `ctx.auth`, y si no, la petición sigue igual

**Por qué:** herencia del starter kit; hoy ninguna ruta pública lee el usuario opcional.
Fuentes: `backend/start/kernel.ts:40`, `backend/app/middleware/silent_auth_middleware.ts:11-15`.

### REQ-RUT-7 — Todas las respuestas son JSON — **Contrato**
- WHEN llega cualquier petición, con independencia de su cabecera `Accept`
- THEN el servidor la trata como `Accept: application/json` y los errores (401, 422, 400) salen en JSON

**Por qué:** el cliente depende de recibir `{ errors: [...] }` en JSON para traducir los errores (`frontend/src/lib/api.ts:72-96`).
Fuentes: `backend/start/kernel.ts:26`, `backend/app/middleware/force_json_response_middleware.ts:6`.

### REQ-RUT-8 — `GET /` responde «hello world» — **Accidental**
- WHEN se hace `GET /` contra el backend
- THEN responde `{ hello: 'world' }`, sin envoltorio `data` y sin autenticación

**Por qué:** ruta de ejemplo del scaffolding.
Fuentes: `backend/start/routes.ts:14-16`.

---

## Resumen

| Capacidad | Contrato | Accidental | Dudoso |
|---|---|---|---|
| Registro | REG-1, 2, 4, 6, 7, 8 | REG-9 | REG-3, 5 |
| Login | LOG-1, 2, 8 | LOG-7, 9, 10 | LOG-3, 4, 5, 6 |
| Sesión / logout | SES-1, 2, 4, 5, 6, 9 | SES-8, 10, 11 | SES-3, 7 |
| Perfil | PER-1, 2, 3, 5 | PER-4, 6 | PER-7 |
| Protección de rutas | RUT-1, 2, 3, 5, 7 | RUT-6, 8 | RUT-4 |
