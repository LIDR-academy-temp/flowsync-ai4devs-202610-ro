# Cuentas y acceso

## Purpose

Permite que una persona cree una cuenta en FlowSync, inicie y cierre sesión, y consulte su perfil, de modo que solo quien tiene una sesión válida accede a las partes privadas de la aplicación, tanto a través de la API como desde la interfaz web.

## Requirements

### Requirement: Registro de una cuenta nueva por la API

La API SHALL crear una cuenta cuando recibe `POST /api/v1/auth/signup` con un cuerpo JSON válido que contiene `fullName`, `email`, `password` y `passwordConfirmation`, y SHALL responder con el usuario creado y un token de acceso ya utilizable, envueltos en `data`.

#### Scenario: Registro correcto con nombre

- **WHEN** se envía `POST /api/v1/auth/signup` con `{ "fullName": "Ada Lovelace", "email": "ada@example.com", "password": "secreto123", "passwordConfirmation": "secreto123" }` y no existe ninguna cuenta con ese email
- **THEN** la respuesta es `200` con `{ "data": { "user": { ... }, "token": "<token>" } }`, donde `user.email` es `ada@example.com`, `user.fullName` es `Ada Lovelace` y el token sirve inmediatamente para acceder al perfil

#### Scenario: Registro correcto sin nombre

- **WHEN** se envía el registro con `fullName` igual a `null` o a una cadena vacía, y el resto de campos válidos
- **THEN** la cuenta se crea con `fullName` igual a `null` y la respuesta es `200` con el usuario y el token

### Requirement: Validación de los datos de registro

La API SHALL rechazar el registro con un `422` y una lista `errors` en la que cada elemento indica el campo (`field`), la regla incumplida (`rule`) y un mensaje, cuando los datos no cumplen las reglas: el email debe tener formato de email, como máximo 254 caracteres y no estar ya registrado; la contraseña debe tener entre 8 y 32 caracteres; la confirmación debe tener también entre 8 y 32 caracteres y coincidir con la contraseña; y la clave `fullName` debe estar presente, aunque su valor sea `null`. Ante un rechazo, la API SHALL NOT crear la cuenta.

#### Scenario: Email ya registrado

- **WHEN** se envía un registro con un email idéntico, carácter a carácter, al de una cuenta existente
- **THEN** la respuesta es `422` con un error sobre `email` cuya regla es `database.unique`, y no se crea una segunda cuenta

#### Scenario: Mismo email con distinta capitalización

- **WHEN** existe una cuenta con `ada@example.com` y se envía un registro con `Ada@Example.com`
- **THEN** el registro se acepta y se crea una cuenta distinta, porque la comparación de emails distingue mayúsculas de minúsculas

#### Scenario: Contraseña demasiado corta o demasiado larga

- **WHEN** se envía un registro con una contraseña de menos de 8 caracteres o de más de 32
- **THEN** la respuesta es `422` con un error sobre `password` de regla `minLength` o `maxLength`, con el límite en `meta`

#### Scenario: Confirmación que no coincide

- **WHEN** se envía un registro con una `passwordConfirmation` de longitud válida pero distinta de `password`
- **THEN** la respuesta es `422` con un error sobre `passwordConfirmation` de regla `sameAs`

#### Scenario: Email con formato inválido o vacío

- **WHEN** se envía un registro con `email` igual a `no-es-un-email`, o con `email` vacío o ausente
- **THEN** la respuesta es `422` con un error sobre `email` de regla `email` en el primer caso y `required` en el segundo

#### Scenario: Falta la clave del nombre

- **WHEN** se envía un registro válido en todo lo demás pero sin la clave `fullName` en el cuerpo
- **THEN** la respuesta es `422` con un error sobre `fullName`

### Requirement: Inicio de sesión por la API

La API SHALL emitir un token de acceso nuevo cuando recibe `POST /api/v1/auth/login` con un `email` y una `password` que corresponden a una cuenta existente, y SHALL responder con el usuario y el token envueltos en `data`. Cada inicio de sesión SHALL emitir un token distinto sin invalidar los emitidos antes.

#### Scenario: Credenciales correctas

- **WHEN** existe una cuenta `ada@example.com` con contraseña `secreto123` y se envía `POST /api/v1/auth/login` con esos mismos valores
- **THEN** la respuesta es `200` con `{ "data": { "user": { ... }, "token": "<token>" } }`

#### Scenario: Dos inicios de sesión seguidos

- **WHEN** la misma cuenta inicia sesión dos veces y obtiene dos tokens
- **THEN** ambos tokens permiten consultar el perfil

### Requirement: Rechazo de credenciales incorrectas

La API SHALL responder `400` con una lista `errors` que contiene el mensaje `Invalid user credentials` cuando el email no corresponde a ninguna cuenta o la contraseña no es la de esa cuenta, sin distinguir en la respuesta entre ambos casos.

#### Scenario: Contraseña incorrecta

- **WHEN** existe la cuenta `ada@example.com` y se envía el login con esa dirección y una contraseña distinta
- **THEN** la respuesta es `400` con el mensaje `Invalid user credentials` y no se emite ningún token

#### Scenario: Email inexistente

- **WHEN** se envía el login con un email bien formado que no pertenece a ninguna cuenta
- **THEN** la respuesta es `400` con el mismo mensaje `Invalid user credentials`

#### Scenario: Email con distinta capitalización

- **WHEN** existe la cuenta `ada@example.com` y se envía el login con `Ada@Example.com` y la contraseña correcta
- **THEN** la respuesta es `400` con `Invalid user credentials`

### Requirement: Validación de los datos de inicio de sesión

La API SHALL rechazar el login con un `422` y la lista `errors` por campo, antes de comprobar las credenciales, cuando el email falta, no tiene formato de email o supera 254 caracteres, o cuando la contraseña falta o está vacía. La API SHALL NOT aplicar límites de longitud a la contraseña en el login.

#### Scenario: Email mal formado

- **WHEN** se envía el login con `email` igual a `ada`
- **THEN** la respuesta es `422` con un error sobre `email` de regla `email`

#### Scenario: Contraseña vacía

- **WHEN** se envía el login con un email válido y `password` igual a una cadena vacía
- **THEN** la respuesta es `422` con un error sobre `password` de regla `required`, no un `400` de credenciales

### Requirement: Representación pública del usuario

Toda respuesta de la API que incluya un usuario SHALL exponer exactamente `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y SHALL NOT incluir la contraseña ni ningún derivado de ella.

#### Scenario: Usuario en la respuesta de registro, login o perfil

- **WHEN** cualquiera de esas tres respuestas devuelve un usuario
- **THEN** el objeto contiene solo esos seis campos, con las fechas como cadenas de fecha y hora, y no contiene `password`

### Requirement: Cálculo de las iniciales

La API SHALL calcular `initials` en mayúsculas así: si el usuario tiene nombre, a partir de las dos primeras palabras separadas por un espacio (primera letra de cada una) o, si solo hay una palabra, de sus dos primeras letras; si no tiene nombre, a partir del email partido por la `@`, tomando la primera letra de la parte local y la primera del dominio.

#### Scenario: Nombre y apellido

- **WHEN** el usuario se llama `Ada Lovelace`
- **THEN** `initials` es `AL`

#### Scenario: Una sola palabra en el nombre

- **WHEN** el usuario se llama `Ada`
- **THEN** `initials` es `AD`

#### Scenario: Sin nombre

- **WHEN** el usuario no tiene nombre y su email es `ada@example.com`
- **THEN** `initials` es `AE`

### Requirement: Consulta del perfil propio

La API SHALL devolver el usuario dueño del token cuando recibe `GET /api/v1/account/profile` con una cabecera `Authorization: Bearer <token>` válida, envuelto en `data`.

#### Scenario: Token válido

- **WHEN** se envía `GET /api/v1/account/profile` con el token obtenido en el registro o el login
- **THEN** la respuesta es `200` con `{ "data": { ... } }` con los datos de ese usuario

### Requirement: Protección de las operaciones de cuenta

La API SHALL responder `401` a las peticiones de consulta de perfil y de cierre de sesión que no llevan token, llevan un token desconocido o llevan un token ya revocado.

#### Scenario: Sin token

- **WHEN** se envía `GET /api/v1/account/profile` o `POST /api/v1/account/logout` sin cabecera `Authorization`
- **THEN** la respuesta es `401`

#### Scenario: Token revocado

- **WHEN** se usa un token después de haber cerrado sesión con él
- **THEN** la respuesta es `401`

### Requirement: Cierre de sesión por la API

La API SHALL revocar el token con el que se hace la petición cuando recibe `POST /api/v1/account/logout` autenticado, y SHALL responder `200` con `{ "message": "Logged out successfully" }`, sin el envoltorio `data`. Los demás tokens de la misma cuenta SHALL seguir siendo válidos.

#### Scenario: Cierre de sesión con un token válido

- **WHEN** se envía `POST /api/v1/account/logout` con un token válido
- **THEN** la respuesta es `200` con `{ "message": "Logged out successfully" }` y ese token deja de servir

#### Scenario: Otra sesión abierta de la misma cuenta

- **WHEN** la cuenta tiene dos tokens y cierra sesión con uno de ellos
- **THEN** el otro token sigue permitiendo consultar el perfil

### Requirement: Vigencia de los tokens

Los tokens de acceso SHALL seguir siendo válidos hasta que se revoquen con un cierre de sesión; la API SHALL NOT invalidarlos por el paso del tiempo.

#### Scenario: Token antiguo

- **WHEN** se usa un token emitido hace tiempo y nunca revocado
- **THEN** la consulta del perfil responde `200`

### Requirement: Respuestas siempre en JSON

La API SHALL responder en JSON a todas las peticiones del vertical, incluidas las de error, con independencia de la cabecera `Accept` que envíe el cliente.

#### Scenario: Cliente que pide HTML

- **WHEN** se envía un login con credenciales incorrectas y `Accept: text/html`
- **THEN** la respuesta de error llega en JSON

### Requirement: Pantalla de inicio de sesión

La interfaz SHALL ofrecer, en la dirección `/login`, una pantalla con el título "FlowSync", la tarjeta "Inicia sesión" con el texto "Entra con tu cuenta para volver a tus tareas.", los campos "Email" y "Contraseña", el botón "Entrar" y el enlace "Crea una" que lleva a la pantalla de registro.

#### Scenario: Inicio de sesión correcto

- **WHEN** una persona sin sesión introduce un email y una contraseña correctos y pulsa "Entrar"
- **THEN** el botón muestra "Entrando…" deshabilitado mientras espera, y al terminar la persona ve su pantalla de perfil

#### Scenario: Ir al registro

- **WHEN** la persona pulsa "Crea una"
- **THEN** ve la pantalla de registro

### Requirement: Errores en el inicio de sesión

La interfaz SHALL mostrar los fallos del inicio de sesión en castellano: los errores de credenciales y los generales en un aviso destacado encima del formulario, y los errores de validación de un campo debajo de ese campo, marcándolo como inválido.

#### Scenario: Credenciales incorrectas

- **WHEN** la persona envía un email o una contraseña que no corresponden a ninguna cuenta
- **THEN** ve el aviso "El email o la contraseña no son correctos." y sigue en la pantalla de inicio de sesión

#### Scenario: Email con formato inválido

- **WHEN** la persona envía un email sin formato de email
- **THEN** ve "Introduce una dirección de email válida." debajo del campo "Email", sin aviso general

#### Scenario: Campo vacío

- **WHEN** la persona envía el formulario con la contraseña vacía
- **THEN** ve "Falta rellenar la contraseña." debajo del campo "Contraseña"

#### Scenario: Servidor inalcanzable

- **WHEN** la persona envía el formulario y el servidor no responde
- **THEN** ve el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado."

#### Scenario: Error inesperado del servidor

- **WHEN** el servidor responde con un error distinto de validación, credenciales o sesión
- **THEN** ve el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

### Requirement: Pantalla de registro

La interfaz SHALL ofrecer, en la dirección `/register`, una pantalla con la tarjeta "Crea tu cuenta" y el texto "Regístrate para empezar a organizar el trabajo del equipo.", los campos "Nombre completo (opcional)", "Email", "Contraseña" (con la ayuda "Entre 8 y 32 caracteres.") y "Repite la contraseña", el botón "Crear cuenta" y el enlace "Inicia sesión" que lleva a la pantalla de inicio de sesión.

#### Scenario: Registro correcto

- **WHEN** una persona sin sesión rellena los campos con datos válidos y pulsa "Crear cuenta"
- **THEN** el botón muestra "Creando cuenta…" deshabilitado mientras espera, y al terminar la persona ve su pantalla de perfil con la sesión ya iniciada

#### Scenario: Nombre en blanco

- **WHEN** la persona deja el nombre vacío o solo con espacios y completa el resto
- **THEN** la cuenta se crea sin nombre y el perfil muestra "Sin nombre"

### Requirement: Comprobación local de la confirmación de contraseña

La interfaz SHALL comprobar, antes de enviar el registro, que "Contraseña" y "Repite la contraseña" coinciden, y si no coinciden SHALL mostrar "Las contraseñas no coinciden." debajo del campo de confirmación sin contactar con el servidor.

#### Scenario: Contraseñas distintas

- **WHEN** la persona escribe contraseñas distintas en los dos campos y pulsa "Crear cuenta"
- **THEN** ve "Las contraseñas no coinciden." debajo de "Repite la contraseña" y no se muestra ningún otro error, aunque existan

### Requirement: Errores en el registro

La interfaz SHALL mostrar cada error de validación que devuelve el servidor debajo del campo correspondiente, uno por campo, y SHALL mostrar un aviso encima del formulario solo cuando el error no corresponde a ningún campo de la pantalla o no es de validación.

#### Scenario: Email ya registrado

- **WHEN** la persona intenta registrarse con un email que ya tiene cuenta
- **THEN** ve "Ese email ya está registrado. Inicia sesión en su lugar." debajo del campo "Email"

#### Scenario: Contraseña corta

- **WHEN** la persona envía una contraseña de menos de 8 caracteres, repetida igual en la confirmación
- **THEN** ve "la contraseña debe tener al menos 8 caracteres." debajo de "Contraseña", y el mismo tipo de mensaje para la confirmación debajo de su campo

#### Scenario: Contraseña larga

- **WHEN** la persona envía una contraseña de más de 32 caracteres, repetida igual en la confirmación
- **THEN** ve "la contraseña no puede superar los 32 caracteres." debajo de "Contraseña"

### Requirement: Persistencia de la sesión en el navegador

La interfaz SHALL conservar la sesión iniciada entre recargas y entre visitas del mismo navegador, y al cargar SHALL validarla contra el servidor antes de mostrar contenido privado, enseñando mientras tanto un indicador de carga.

#### Scenario: Recarga con sesión válida

- **WHEN** una persona con sesión iniciada recarga la página del perfil
- **THEN** ve brevemente un indicador de carga y después su perfil, sin pasar por la pantalla de inicio de sesión

#### Scenario: Sesión rechazada por el servidor

- **WHEN** una persona vuelve a la aplicación con una sesión que el servidor ya no reconoce
- **THEN** ve la pantalla de inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión." y la sesión guardada se descarta

#### Scenario: Servidor caído al restaurar

- **WHEN** una persona vuelve a la aplicación con una sesión guardada y el servidor no responde
- **THEN** ve la pantalla de inicio de sesión con el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado.", y si recarga cuando el servidor vuelve a responder recupera su perfil sin volver a introducir credenciales

### Requirement: Acceso a las pantallas según la sesión

La interfaz SHALL mostrar el perfil solo a personas con sesión, SHALL mostrar las pantallas de inicio de sesión y registro solo a personas sin sesión, y SHALL redirigir cualquier otra dirección al perfil.

#### Scenario: Perfil sin sesión

- **WHEN** una persona sin sesión abre `/profile`
- **THEN** es redirigida a la pantalla de inicio de sesión

#### Scenario: Inicio de sesión o registro con sesión

- **WHEN** una persona con sesión abre `/login` o `/register`
- **THEN** es redirigida a su perfil

#### Scenario: Dirección desconocida

- **WHEN** una persona abre una dirección que no existe, como `/` o `/cualquier-cosa`
- **THEN** es enviada al perfil si tiene sesión, o a la pantalla de inicio de sesión si no la tiene

### Requirement: Pantalla de perfil

La interfaz SHALL mostrar en el perfil un círculo con las iniciales del usuario, su nombre o "Sin nombre" si no tiene, su email, la fila "Miembro desde" con la fecha de alta en formato largo en castellano, y el botón "Cerrar sesión".

#### Scenario: Usuario con nombre

- **WHEN** Ada Lovelace, registrada el 30 de octubre de 2026, abre su perfil
- **THEN** ve "AL", "Ada Lovelace", su email y "Miembro desde 30 de octubre de 2026"

### Requirement: Cierre de sesión desde la interfaz

La interfaz SHALL cerrar la sesión en el navegador cuando la persona pulsa "Cerrar sesión", aunque el servidor no confirme la revocación, y SHALL llevarla a la pantalla de inicio de sesión sin ningún aviso.

#### Scenario: Cierre de sesión normal

- **WHEN** una persona con sesión pulsa "Cerrar sesión"
- **THEN** ve la pantalla de inicio de sesión sin aviso, y al recargar sigue sin sesión

#### Scenario: Servidor caído al cerrar sesión

- **WHEN** la persona pulsa "Cerrar sesión" y el servidor no responde
- **THEN** igualmente ve la pantalla de inicio de sesión y queda sin sesión en ese navegador

#### Requisitos generados y comprobados
 21 requisitos, con 12 de API y 9 de interfaz.
 Revisados 14

#### Incoherencias detectadas
  - El cierre de sesión no regresa un response.data cosa que en otras funciones como login si maneja, tambien el mensaje esta en ingles "Logged out successfully" siendo que en las otras funciones estan en español.
  - Los mensajes de longitud de la contraseña empiezan en minúscula al estar formados con los labels de los campos como primera palabra mientras que en otros primero lleva un texto con incial mayuscula.
  - El email y password al registrar tiene un validador de maximo de caracteres de 8 y 32, pero cuando se hace login solo se usa el validador del email de 8 pero ya no se utiliza el de 32 del password.
#### Comportamientos que no supiste clasificar como bug o contrato
  - Se pueden crear dos cuentas con Ada@x.com y ada@x.com.
  - Cuando se obtienen las iniciales si el usuario no tiene nombre, la obtencion de las iniciales se hacen del correo pero el split lo hace en el @ lo que genera que su segunda inicial sea el dominio del correo no del apellido por ejemplo con Ada@x.com serian AX.