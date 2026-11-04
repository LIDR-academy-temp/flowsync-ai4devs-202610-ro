# auth Specification

## Purpose

Permite a una persona crear una cuenta, iniciar y cerrar sesión, conservar la sesión entre recargas y consultar su perfil. Cubre tanto la API HTTP como las pantallas de acceso y perfil de la aplicación web.

## Requirements

### Requirement: Registro de cuenta por API

El sistema SHALL crear una cuenta y abrir una sesión cuando `POST /api/v1/auth/signup` recibe `fullName`, `email`, `password` y `passwordConfirmation` válidos, respondiendo 200 con `{ "data": { "user": ..., "token": ... } }`.

#### Scenario: Registro correcto con nombre

- **WHEN** se envía un registro con `fullName` "Ada Lovelace", un email libre y una contraseña válida repetida en `passwordConfirmation`
- **THEN** la respuesta es 200 y `data` contiene un `token` utilizable de inmediato y un `user` con ese `fullName` y ese `email`

#### Scenario: Registro correcto sin nombre

- **WHEN** se envía un registro con `fullName` nulo, vacío o formado solo por espacios
- **THEN** la respuesta es 200 y `data.user.fullName` es `null`

#### Scenario: Clave de nombre ausente

- **WHEN** se envía un registro sin la clave `fullName`
- **THEN** la respuesta es 422 con un error de regla `required` sobre el campo `fullName`

### Requirement: Reglas de validación del registro

El sistema SHALL rechazar con 422 cualquier registro que incumpla las reglas de email o contraseña, devolviendo `{ "errors": [...] }` con todos los errores detectados, cada uno con `message`, `rule`, `field` y, cuando la regla lo aporta, `meta`.

#### Scenario: Email con formato inválido

- **WHEN** se envía un registro con `email` "nope"
- **THEN** la respuesta es 422 con un error de regla `email` sobre el campo `email`

#### Scenario: Email demasiado largo

- **WHEN** se envía un registro con un `email` de más de 254 caracteres
- **THEN** la respuesta es 422 con un error sobre el campo `email` y no se crea la cuenta

#### Scenario: Email ya registrado

- **WHEN** se envía un registro con un `email` idéntico al de una cuenta existente
- **THEN** la respuesta es 422 con un error de regla `database.unique` sobre el campo `email`

#### Scenario: Contraseña demasiado corta

- **WHEN** se envía un registro con `password` y `passwordConfirmation` de menos de 8 caracteres
- **THEN** la respuesta es 422 con un error de regla `minLength` y `meta.min` 8 sobre cada uno de los dos campos

#### Scenario: Contraseña demasiado larga

- **WHEN** se envía un registro con `password` y `passwordConfirmation` de 33 caracteres
- **THEN** la respuesta es 422 con un error de regla `maxLength` y `meta.max` 32 sobre cada uno de los dos campos

#### Scenario: Contraseña en el límite superior

- **WHEN** se envía un registro por lo demás válido con `password` y `passwordConfirmation` de 32 caracteres
- **THEN** la respuesta es 200 y la cuenta queda creada

#### Scenario: Confirmación distinta de la contraseña

- **WHEN** se envía un registro con `passwordConfirmation` distinto de `password`
- **THEN** la respuesta es 422 con un error de regla `sameAs` sobre el campo `passwordConfirmation`

#### Scenario: Campos obligatorios vacíos

- **WHEN** se envía un registro con `email`, `password` y `passwordConfirmation` como cadenas vacías
- **THEN** la respuesta es 422 con un error de regla `required` sobre cada uno de esos tres campos

#### Scenario: Nombre que no es texto

- **WHEN** se envía un registro con `fullName` numérico
- **THEN** la respuesta es 422 con un error de regla `string` sobre el campo `fullName`

### Requirement: Recorte de espacios en los datos de entrada

El sistema SHALL eliminar los espacios del principio y del final de los valores de texto de registro e inicio de sesión, incluida la contraseña, antes de validarlos y usarlos.

#### Scenario: Email y nombre con espacios

- **WHEN** se envía un registro con `email` " ana@example.com " y `fullName` "  Eva Paz "
- **THEN** la cuenta creada devuelve `email` "ana@example.com" y `fullName` "Eva Paz"

#### Scenario: Contraseña que se queda corta al recortarla

- **WHEN** se envía un registro con una contraseña de 9 caracteres de los que 4 son espacios en los extremos
- **THEN** la respuesta es 422 con un error de regla `minLength` porque solo cuentan los 5 caracteres restantes

#### Scenario: Inicio de sesión sin los espacios de la contraseña original

- **WHEN** una cuenta se registró con la contraseña "  abcdefgh  " y se inicia sesión con "abcdefgh"
- **THEN** la respuesta es 200 y se abre la sesión

### Requirement: Distinción de mayúsculas en el email

El sistema SHALL tratar el email de forma sensible a mayúsculas y minúsculas, tanto al comprobar si está libre como al iniciar sesión.

#### Scenario: Registro con el mismo email en otra capitalización

- **WHEN** existe una cuenta con `ada@example.com` y se envía un registro válido con `ADA@example.com`
- **THEN** la respuesta es 200 y se crea una segunda cuenta independiente

#### Scenario: Inicio de sesión con otra capitalización

- **WHEN** existe una cuenta con `ada@example.com` y se inicia sesión con `Ada@example.com` y la contraseña correcta
- **THEN** la respuesta es 400 con el error de credenciales inválidas

### Requirement: Inicio de sesión por API

El sistema SHALL abrir una sesión nueva cuando `POST /api/v1/auth/login` recibe el `email` y la `password` de una cuenta existente, respondiendo 200 con `{ "data": { "user": ..., "token": ... } }`.

#### Scenario: Credenciales correctas

- **WHEN** se inicia sesión con el email y la contraseña de una cuenta existente
- **THEN** la respuesta es 200 y `data` contiene un `token` y el `user` de esa cuenta

#### Scenario: Cada inicio de sesión emite un token distinto

- **WHEN** la misma cuenta inicia sesión dos veces
- **THEN** cada respuesta contiene un `token` diferente y ambos son válidos a la vez

#### Scenario: Cabecera de autorización inválida en el inicio de sesión

- **WHEN** se inicia sesión con credenciales correctas y una cabecera `Authorization` con un token inválido
- **THEN** la cabecera se ignora y la respuesta es 200

### Requirement: Rechazo del inicio de sesión

El sistema SHALL rechazar los intentos de inicio de sesión con datos inválidos sin revelar si el email corresponde a una cuenta existente.

#### Scenario: Contraseña incorrecta

- **WHEN** se inicia sesión con un email existente y una contraseña incorrecta
- **THEN** la respuesta es 400 con `{ "errors": [{ "message": "Invalid user credentials" }] }`

#### Scenario: Email desconocido

- **WHEN** se inicia sesión con un email con formato válido que no pertenece a ninguna cuenta
- **THEN** la respuesta es 400 con el mismo cuerpo que para una contraseña incorrecta

#### Scenario: Reglas de longitud de contraseña no aplicadas

- **WHEN** se inicia sesión con un email existente y una contraseña incorrecta de 1 o de 40 caracteres
- **THEN** la respuesta es 400 de credenciales inválidas y no un error de validación 422

#### Scenario: Email con formato inválido

- **WHEN** se inicia sesión con `email` "nope"
- **THEN** la respuesta es 422 con un error de regla `email` sobre el campo `email`

#### Scenario: Campos vacíos

- **WHEN** se inicia sesión con `email` y `password` como cadenas vacías
- **THEN** la respuesta es 422 con un error de regla `required` sobre cada uno de los dos campos

### Requirement: Representación del usuario en la API

El sistema SHALL representar al usuario en las respuestas con exactamente los campos `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, sin incluir nunca la contraseña.

#### Scenario: Campos devueltos

- **WHEN** una respuesta de registro, inicio de sesión o perfil incluye un usuario
- **THEN** el objeto contiene solo esos seis campos

#### Scenario: Iniciales con nombre y apellido

- **WHEN** el `fullName` es "Ada Lovelace" o "Ana Maria Ruiz"
- **THEN** `initials` son la primera letra de las dos primeras palabras en mayúsculas: "AL" y "AM" respectivamente

#### Scenario: Iniciales con una sola palabra

- **WHEN** el `fullName` es "Cher"
- **THEN** `initials` es "CH", las dos primeras letras en mayúsculas

#### Scenario: Iniciales con dos espacios seguidos en el nombre

- **WHEN** el `fullName` es "Ana  Ruiz", con dos espacios entre las palabras
- **THEN** `initials` es "AN", las dos primeras letras de la primera palabra

#### Scenario: Iniciales sin nombre

- **WHEN** el `fullName` es `null` y el email es `ada@example.com`
- **THEN** `initials` es "AE", la primera letra de lo que hay antes y de lo que hay después de la arroba

### Requirement: Acceso autenticado a la API

El sistema SHALL exigir un token vigente en la cabecera `Authorization: Bearer` para `GET /api/v1/account/profile` y `POST /api/v1/account/logout`, y responder 401 con `{ "errors": [{ "message": "Unauthorized access" }] }` en caso contrario.

#### Scenario: Sin token

- **WHEN** se llama a cualquiera de los dos endpoints sin cabecera `Authorization`
- **THEN** la respuesta es 401 con ese cuerpo

#### Scenario: Token inválido

- **WHEN** se llama a cualquiera de los dos endpoints con un token que el sistema no ha emitido
- **THEN** la respuesta es 401 con ese cuerpo

### Requirement: Consulta del perfil por API

El sistema SHALL devolver los datos de la cuenta dueña del token cuando `GET /api/v1/account/profile` recibe un token vigente.

#### Scenario: Perfil con token vigente

- **WHEN** se consulta el perfil con un token vigente
- **THEN** la respuesta es 200 con `{ "data": <usuario> }`, siendo el usuario el dueño del token

### Requirement: Cierre de sesión por API

El sistema SHALL revocar únicamente el token usado en la petición cuando `POST /api/v1/account/logout` recibe un token vigente, y responder 200 con `{ "message": "Logged out successfully" }`.

#### Scenario: Cierre de sesión correcto

- **WHEN** se cierra sesión con un token vigente
- **THEN** la respuesta es 200 con ese mensaje, sin envoltorio `data`

#### Scenario: Token revocado

- **WHEN** se usa en el perfil o en el cierre de sesión un token ya revocado
- **THEN** la respuesta es 401

#### Scenario: Otras sesiones de la misma cuenta

- **WHEN** una cuenta tiene dos tokens vigentes y cierra sesión con uno de ellos
- **THEN** el otro token sigue permitiendo consultar el perfil

### Requirement: Pantalla de registro

La aplicación web SHALL ofrecer en `/register` un formulario "Crea tu cuenta" con nombre completo marcado como opcional, email, contraseña con la indicación "Entre 8 y 32 caracteres." y repetición de la contraseña, además de un enlace a la pantalla de inicio de sesión.

#### Scenario: Registro correcto

- **WHEN** una persona rellena el formulario con datos válidos y pulsa "Crear cuenta"
- **THEN** se crea la cuenta, sigue sin sesión iniciada y ve la pantalla de inicio de sesión con el aviso "Cuenta creada. Inicia sesión para continuar."

#### Scenario: Nombre en blanco

- **WHEN** una persona se registra dejando el nombre vacío o solo con espacios y después inicia sesión
- **THEN** su perfil muestra "Sin nombre"

#### Scenario: Contraseñas distintas

- **WHEN** una persona pulsa "Crear cuenta" con dos contraseñas diferentes
- **THEN** ve "Las contraseñas no coinciden." bajo el campo de repetición, sin que se envíe ninguna petición al servidor

#### Scenario: Email ya registrado

- **WHEN** una persona se registra con un email que ya tiene cuenta
- **THEN** ve bajo el campo de email "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Email inválido

- **WHEN** una persona se registra con un email de formato incorrecto
- **THEN** ve bajo el campo de email "Introduce una dirección de email válida."

#### Scenario: Contraseña corta

- **WHEN** una persona se registra con la misma contraseña de menos de 8 caracteres en ambos campos
- **THEN** ve bajo la contraseña "la contraseña debe tener al menos 8 caracteres.", bajo la repetición "la confirmación de la contraseña debe tener al menos 8 caracteres." y la indicación de longitud desaparece

#### Scenario: Contraseña larga

- **WHEN** una persona se registra con la misma contraseña de más de 32 caracteres en ambos campos
- **THEN** ve bajo la contraseña "la contraseña no puede superar los 32 caracteres." y bajo la repetición "la confirmación de la contraseña no puede superar los 32 caracteres."

#### Scenario: Formulario vacío

- **WHEN** una persona pulsa "Crear cuenta" sin rellenar nada
- **THEN** ve "Falta rellenar el email.", "Falta rellenar la contraseña." y "Falta rellenar la confirmación de la contraseña." bajo sus campos

#### Scenario: Envío en curso

- **WHEN** una persona ha pulsado "Crear cuenta" y el servidor aún no ha respondido
- **THEN** el botón muestra "Creando cuenta…" y está deshabilitado

### Requirement: Pantalla de inicio de sesión

La aplicación web SHALL ofrecer en `/login` un formulario "Inicia sesión" con email y contraseña, además de un enlace a la pantalla de registro.

#### Scenario: Credenciales correctas

- **WHEN** una persona introduce credenciales correctas y pulsa "Entrar"
- **THEN** queda con la sesión iniciada y ve la lista de tareas

#### Scenario: Credenciales incorrectas

- **WHEN** una persona introduce un email o una contraseña incorrectos
- **THEN** ve el aviso "El email o la contraseña no son correctos." sobre el formulario y permanece en la pantalla

#### Scenario: Formulario vacío

- **WHEN** una persona pulsa "Entrar" sin rellenar nada
- **THEN** ve "Falta rellenar el email." y "Falta rellenar la contraseña." bajo sus campos

#### Scenario: Email inválido

- **WHEN** una persona pulsa "Entrar" con un email de formato incorrecto y una contraseña
- **THEN** ve bajo el campo de email "Introduce una dirección de email válida."

#### Scenario: Envío en curso

- **WHEN** una persona ha pulsado "Entrar" y el servidor aún no ha respondido
- **THEN** el botón muestra "Entrando…" y está deshabilitado

#### Scenario: Aviso de cuenta creada tras un intento fallido

- **WHEN** hay un aviso de cuenta creada y un intento de inicio de sesión falla por credenciales incorrectas
- **THEN** la persona ve el aviso de credenciales en lugar del de cuenta creada

#### Scenario: Recarga con el aviso de cuenta creada

- **WHEN** la persona recarga la página después de ver el aviso de cuenta creada
- **THEN** ve la pantalla de inicio de sesión sin ese aviso

### Requirement: Fallos de comunicación en los formularios de acceso

La aplicación web SHALL informar con un aviso sobre el formulario de registro o de inicio de sesión cuando el envío falla por causas ajenas a los datos introducidos, y permitir reintentarlo.

#### Scenario: Servidor inaccesible

- **WHEN** una persona envía el formulario y no se puede contactar con el servidor
- **THEN** ve "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y puede volver a enviarlo

#### Scenario: Error del servidor

- **WHEN** una persona envía el formulario y el servidor responde con un error interno
- **THEN** ve "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento." y puede volver a enviarlo

### Requirement: Restauración de la sesión al cargar la aplicación

La aplicación web SHALL conservar la sesión entre recargas y cierres del navegador, comprobándola contra el servidor cada vez que se carga antes de mostrar una pantalla de acceso o de perfil.

#### Scenario: Comprobación en curso

- **WHEN** se carga la aplicación con una sesión guardada y el servidor aún no ha respondido
- **THEN** la persona ve un indicador de carga a pantalla completa

#### Scenario: Sesión reconocida

- **WHEN** se carga `/profile` con una sesión guardada que el servidor reconoce
- **THEN** la persona ve su perfil sin tener que volver a identificarse

#### Scenario: Sesión rechazada

- **WHEN** se carga la aplicación con una sesión guardada que el servidor rechaza con 401
- **THEN** la persona ve la pantalla de inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión." y la sesión guardada se pierde

#### Scenario: Recarga tras una sesión rechazada

- **WHEN** la persona recarga la página después de que se rechazara su sesión
- **THEN** ve la pantalla de inicio de sesión sin aviso

#### Scenario: Servidor inaccesible durante la comprobación

- **WHEN** se carga la aplicación con una sesión guardada y no se puede contactar con el servidor
- **THEN** la persona ve la pantalla de inicio de sesión con el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado."

#### Scenario: Error del servidor durante la comprobación

- **WHEN** se carga la aplicación con una sesión guardada y el servidor responde con un error interno
- **THEN** la persona ve la pantalla de inicio de sesión con el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

#### Scenario: Recuperación tras un fallo pasajero

- **WHEN** la comprobación falló por un corte o un error interno, el servidor vuelve a funcionar y la persona recarga la página
- **THEN** recupera su sesión y ve su perfil sin volver a identificarse

#### Scenario: Prioridad de los avisos en el inicio de sesión

- **WHEN** hay un aviso de sesión perdida y un nuevo intento de inicio de sesión falla por credenciales incorrectas
- **THEN** la persona ve el aviso de credenciales en lugar del de sesión perdida

#### Scenario: Aviso solo en la pantalla de inicio de sesión

- **WHEN** hay un aviso de sesión perdida y la persona navega a la pantalla de registro
- **THEN** no ve el aviso allí, y lo vuelve a ver si regresa a la pantalla de inicio de sesión

#### Scenario: Desaparición del aviso

- **WHEN** hay un aviso de sesión perdida y la persona inicia sesión o se registra con éxito
- **THEN** el aviso deja de existir

#### Scenario: Sesión revocada con la página ya abierta

- **WHEN** una sesión deja de ser válida en el servidor mientras la persona sigue en su perfil sin recargar
- **THEN** sigue viendo su perfil hasta la siguiente carga de la aplicación

### Requirement: Protección de pantallas según la sesión

La aplicación web SHALL permitir ver el perfil solo con sesión iniciada, y las pantallas de inicio de sesión y registro solo sin ella.

#### Scenario: Perfil sin sesión

- **WHEN** una persona sin sesión abre `/profile`
- **THEN** es redirigida a `/login`

#### Scenario: Acceso con sesión

- **WHEN** una persona con sesión iniciada abre `/login` o `/register`
- **THEN** es redirigida a `/profile`

#### Scenario: Dirección desconocida

- **WHEN** una persona abre `/` o cualquier otra dirección no definida
- **THEN** es redirigida a `/profile` si tiene sesión y a `/login` si no la tiene

#### Scenario: Destino tras identificarse

- **WHEN** una persona sin sesión abre cualquier dirección protegida o desconocida y después inicia sesión
- **THEN** llega siempre a `/tasks`

### Requirement: Pantalla de perfil

La aplicación web SHALL mostrar en `/profile` las iniciales, el nombre, el email y la fecha de alta de la persona con sesión iniciada, en modo de solo lectura.

#### Scenario: Persona con nombre

- **WHEN** una persona con nombre completo abre su perfil
- **THEN** ve sus iniciales, su nombre, su email y "Miembro desde" con la fecha de alta en formato largo en castellano

#### Scenario: Persona sin nombre

- **WHEN** una persona sin nombre completo abre su perfil
- **THEN** ve "Sin nombre" en el lugar del nombre y unas iniciales calculadas a partir de su email

### Requirement: Cierre de sesión en la aplicación web

La aplicación web SHALL cerrar la sesión de la persona en cuanto pulsa "Cerrar sesión" en su perfil, con independencia de lo que responda el servidor.

#### Scenario: Cierre de sesión correcto

- **WHEN** una persona pulsa "Cerrar sesión" y el servidor está disponible
- **THEN** ve la pantalla de inicio de sesión sin aviso y su token queda revocado en el servidor

#### Scenario: Cierre de sesión sin servidor

- **WHEN** una persona pulsa "Cerrar sesión" y no se puede contactar con el servidor
- **THEN** ve igualmente la pantalla de inicio de sesión, sin aviso de error

#### Scenario: Recarga tras cerrar sesión

- **WHEN** una persona ha cerrado sesión y recarga la aplicación
- **THEN** sigue sin sesión y ve la pantalla de inicio de sesión
