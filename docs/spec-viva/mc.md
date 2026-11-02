# Spec viva — cuentas y acceso

## Purpose

Describe el comportamiento observable hoy del vertical de cuentas y acceso de
FlowSync: registro de nuevas cuentas, inicio de sesión, sesión persistente y
consulta de perfil, tanto en la API como en la interfaz de usuario.

---

## Requirements

### Requirement: registro de cuenta nueva

El sistema SHALL crear una cuenta nueva y emitir un token de acceso cuando se
envía un formulario de registro con datos válidos.

#### Scenario: registro exitoso

- **WHEN** se hace `POST /api/v1/auth/signup` con cuerpo JSON
  `{ fullName, email, password, passwordConfirmation }` donde `email` no existe
  ya en el sistema, `password` tiene entre 8 y 32 caracteres,
  `passwordConfirmation` es idéntico a `password`, y `fullName` es una cadena
  o `null`
- **THEN** la respuesta es `200 OK` con cuerpo
  `{ data: { user: { id, fullName, email, initials, createdAt, updatedAt }, token } }`

#### Scenario: email duplicado

- **WHEN** se hace `POST /api/v1/auth/signup` con un `email` que ya pertenece a
  una cuenta existente
- **THEN** la respuesta es `422 Unprocessable Entity` con cuerpo
  `{ errors: [{ rule: "database.unique", field: "email", message: "..." }] }`

#### Scenario: contraseñas que no coinciden

- **WHEN** se hace `POST /api/v1/auth/signup` y `passwordConfirmation` no
  coincide con `password`
- **THEN** la respuesta es `422 Unprocessable Entity` con cuerpo
  `{ errors: [{ rule: "sameAs", field: "passwordConfirmation", message: "..." }] }`

#### Scenario: contraseña fuera de rango

- **WHEN** se hace `POST /api/v1/auth/signup` y `password` tiene menos de 8 o
  más de 32 caracteres
- **THEN** la respuesta es `422 Unprocessable Entity` con `errors[].rule` igual a
  `"minLength"` o `"maxLength"` respectivamente

#### Scenario: email con formato inválido

- **WHEN** se hace `POST /api/v1/auth/signup` con un `email` que no tiene formato
  de dirección de correo válida, o que supera 254 caracteres
- **THEN** la respuesta es `422 Unprocessable Entity`

---

### Requirement: inicio de sesión

El sistema SHALL autenticar a un usuario existente y emitir un token de acceso
nuevo cuando las credenciales son correctas.

#### Scenario: inicio de sesión exitoso

- **WHEN** se hace `POST /api/v1/auth/login` con `{ email, password }` que
  corresponden a una cuenta existente
- **THEN** la respuesta es `200 OK` con cuerpo
  `{ data: { user: { id, fullName, email, initials, createdAt, updatedAt }, token } }`

#### Scenario: credenciales incorrectas

- **WHEN** se hace `POST /api/v1/auth/login` con un `email` que no existe o con
  una `password` incorrecta para ese email
- **THEN** la respuesta es `400 Bad Request` (sin `errors` individuales por campo)

#### Scenario: validación de formato fallida en login

- **WHEN** se hace `POST /api/v1/auth/login` y `email` no tiene formato válido o
  supera 254 caracteres
- **THEN** la respuesta es `422 Unprocessable Entity`

---

### Requirement: representación del usuario

El sistema SHALL exponer únicamente los campos públicos del usuario; la
contraseña nunca aparece en ninguna respuesta.

#### Scenario: campos expuestos en respuesta de usuario

- **WHEN** cualquier respuesta exitosa incluye un objeto de usuario
- **THEN** ese objeto contiene exactamente: `id` (número), `fullName` (cadena o
  `null`), `email` (cadena), `initials` (cadena de dos letras mayúsculas),
  `createdAt` (cadena ISO 8601) y `updatedAt` (cadena ISO 8601 o `null`), sin
  incluir la contraseña

#### Scenario: cálculo de iniciales con nombre completo

- **WHEN** el usuario tiene `fullName` con al menos dos palabras separadas por
  espacio
- **THEN** `initials` es la primera letra de cada una de las dos primeras
  palabras, en mayúsculas

#### Scenario: cálculo de iniciales con nombre de una sola palabra

- **WHEN** el usuario tiene `fullName` con una sola palabra (sin espacio)
- **THEN** `initials` son las dos primeras letras de esa palabra, en mayúsculas

#### Scenario: cálculo de iniciales sin nombre

- **WHEN** `fullName` es `null`
- **THEN** `initials` se deriva del email: la primera letra de la parte local
  (antes de `@`) y la primera letra del dominio (después de `@`), en mayúsculas

---

### Requirement: consulta de perfil propio

El sistema SHALL devolver los datos del usuario autenticado cuando se presenta
un token válido.

#### Scenario: perfil con token válido

- **WHEN** se hace `GET /api/v1/account/profile` con cabecera
  `Authorization: Bearer <token>`
- **THEN** la respuesta es `200 OK` con cuerpo `{ data: { id, fullName, email, initials, createdAt, updatedAt } }`

#### Scenario: perfil sin token o con token inválido

- **WHEN** se hace `GET /api/v1/account/profile` sin cabecera `Authorization`,
  con un token malformado o con un token que ya no existe en el sistema
- **THEN** la respuesta es `401 Unauthorized`

---

### Requirement: cierre de sesión

El sistema SHALL invalidar el token de acceso cuando el usuario solicita cerrar
sesión.

#### Scenario: logout exitoso

- **WHEN** se hace `POST /api/v1/account/logout` con cabecera
  `Authorization: Bearer <token>` válido
- **THEN** la respuesta es `200 OK` con cuerpo `{ message: "Logged out successfully" }`
  y el token queda eliminado del sistema (llamadas posteriores con ese mismo
  token reciben `401`)

#### Scenario: logout sin token

- **WHEN** se hace `POST /api/v1/account/logout` sin cabecera `Authorization` o
  con token inválido
- **THEN** la respuesta es `401 Unauthorized`

---

### Requirement: respuesta JSON forzada

El sistema SHALL responder siempre con `Content-Type: application/json`,
independientemente de la cabecera `Accept` que envíe el cliente.

#### Scenario: petición sin Accept

- **WHEN** se hace cualquier petición HTTP al servidor, con o sin cabecera
  `Accept`
- **THEN** el servidor trata la petición como si el cliente hubiera enviado
  `Accept: application/json` y formatea errores y respuestas en JSON

---

### Requirement: pantalla de inicio de sesión

El sistema SHALL mostrar un formulario de inicio de sesión accesible desde `/login`.

#### Scenario: acceso a /login sin sesión

- **WHEN** un usuario sin sesión activa navega a `/login`
- **THEN** ve un formulario con los campos "Email" y "Contraseña", un botón
  "Entrar" y un enlace hacia `/register`

#### Scenario: intento de login con credenciales incorrectas

- **WHEN** el usuario envía el formulario con credenciales que el servidor rechaza
- **THEN** aparece un aviso de error con el texto "El email o la contraseña no
  son correctos." y el botón vuelve a estar disponible

#### Scenario: errores de campo bajo cada input

- **WHEN** el servidor devuelve errores de validación con `field` reconocido
  (`email`, `password`)
- **THEN** el mensaje de error aparece debajo del input correspondiente; si todos
  los errores van a campos visibles no se muestra aviso general

#### Scenario: login exitoso

- **WHEN** el servidor acepta las credenciales
- **THEN** la aplicación redirige automáticamente a `/profile`

#### Scenario: botón deshabilitado durante el envío

- **WHEN** el formulario está en curso de envío
- **THEN** el botón muestra "Entrando…" y no puede volver a pulsarse

#### Scenario: motivo de sesión perdida

- **WHEN** el usuario llega a `/login` porque una sesión anterior falló al
  rehidratarse (token expirado, servidor no disponible al arrancar)
- **THEN** se muestra el motivo de ese fallo como aviso informativo, salvo que
  haya ya un error del intento actual, que tiene preferencia

#### Scenario: acceso a /login con sesión activa

- **WHEN** un usuario con sesión activa navega a `/login`
- **THEN** es redirigido automáticamente a `/profile`

---

### Requirement: pantalla de registro

El sistema SHALL mostrar un formulario de creación de cuenta accesible desde `/register`.

#### Scenario: acceso a /register sin sesión

- **WHEN** un usuario sin sesión activa navega a `/register`
- **THEN** ve un formulario con los campos "Nombre completo (opcional)", "Email",
  "Contraseña" y "Repite la contraseña", un botón "Crear cuenta" y un enlace
  hacia `/login`

#### Scenario: contraseñas que no coinciden en cliente

- **WHEN** el usuario envía el formulario y "Contraseña" y "Repite la contraseña"
  no son idénticos
- **THEN** aparece un error bajo el campo "Repite la contraseña" sin hacer ninguna
  llamada al servidor

#### Scenario: nombre completo vacío

- **WHEN** el usuario deja el campo "Nombre completo" en blanco
- **THEN** el campo se envía al servidor como `null`

#### Scenario: registro exitoso

- **WHEN** el servidor acepta el registro
- **THEN** la aplicación redirige automáticamente a `/profile` con la sesión ya iniciada

#### Scenario: errores de campo del servidor

- **WHEN** el servidor devuelve errores de validación
- **THEN** cada error con `field` reconocido aparece bajo el input
  correspondiente; errores sin campo visible se muestran en el aviso general

#### Scenario: hint de contraseña

- **WHEN** el campo "Contraseña" no tiene error activo
- **THEN** aparece el texto "Entre 8 y 32 caracteres." a modo de pista

#### Scenario: acceso a /register con sesión activa

- **WHEN** un usuario con sesión activa navega a `/register`
- **THEN** es redirigido automáticamente a `/profile`

---

### Requirement: pantalla de perfil

El sistema SHALL mostrar los datos del usuario autenticado en `/profile`.

#### Scenario: perfil de usuario con nombre

- **WHEN** un usuario autenticado con `fullName` no nulo navega a `/profile`
- **THEN** ve un avatar circular con sus iniciales, su nombre completo, su email
  y la fecha de creación de la cuenta formateada en español (estilo largo)

#### Scenario: perfil de usuario sin nombre

- **WHEN** el usuario autenticado tiene `fullName` igual a `null`
- **THEN** se muestra el texto "Sin nombre" donde iría el nombre

#### Scenario: cierre de sesión desde el perfil

- **WHEN** el usuario pulsa "Cerrar sesión"
- **THEN** la sesión local se destruye inmediatamente, se intenta invalidar el
  token en el servidor (sin bloquear si falla), y la aplicación redirige a
  `/login`

#### Scenario: botón de logout deshabilitado durante el proceso

- **WHEN** el usuario ha pulsado "Cerrar sesión" y el proceso está en curso
- **THEN** el botón muestra "Cerrando sesión…" y no puede volver a pulsarse

#### Scenario: acceso a /profile sin sesión

- **WHEN** un usuario sin sesión activa navega a `/profile`
- **THEN** es redirigido automáticamente a `/login`

---

### Requirement: rehidratación de sesión al arrancar

El sistema SHALL restaurar la sesión del usuario al cargar la aplicación si
hay un token guardado localmente.

#### Scenario: token guardado válido

- **WHEN** la aplicación arranca y existe un token en el almacenamiento local del
  navegador
- **THEN** antes de mostrar cualquier pantalla que requiera sesión o redirigir,
  la aplicación verifica el token contra el servidor; si el servidor lo acepta,
  la sesión queda restaurada y se continúa hacia la ruta solicitada

#### Scenario: espera durante la verificación

- **WHEN** la aplicación está verificando el token guardado
- **THEN** se muestra una pantalla de carga completa en lugar de redirigir, para
  que una recarga de página no saque al usuario de sus rutas protegidas

#### Scenario: token guardado rechazado por el servidor (401)

- **WHEN** la aplicación arranca con un token guardado y el servidor responde `401`
- **THEN** el token se elimina del almacenamiento local, la sesión queda como
  anónima y se guarda el mensaje de error para mostrarlo en `/login`

#### Scenario: servidor no disponible al arrancar

- **WHEN** la aplicación arranca con un token guardado y no puede alcanzar el
  servidor
- **THEN** el token se conserva en el almacenamiento local (para poder
  rehidratarse cuando el servidor vuelva), la sesión queda como anónima en
  memoria, y se guarda un mensaje de error para mostrarlo en `/login`

---

### Requirement: rutas desconocidas

El sistema SHALL redirigir al usuario a `/profile` ante cualquier ruta no
reconocida.

#### Scenario: ruta no registrada

- **WHEN** el usuario navega a cualquier ruta que no sea `/login`, `/register`
  ni `/profile`
- **THEN** la aplicación redirige a `/profile`; si no hay sesión activa, esa
  redirección encadena con la de `/profile` → `/login`
