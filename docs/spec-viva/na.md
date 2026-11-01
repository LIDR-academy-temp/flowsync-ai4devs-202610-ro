# Cuentas y acceso

## Purpose
Permite que una persona cree una cuenta con email y contraseña, entre y salga de FlowSync, mantenga la sesión entre recargas y consulte su perfil. Es la puerta de entrada al resto de la aplicación: sin sesión válida no se accede a nada más.

## Requirements

### Requirement: Registro de cuenta (API)
El sistema SHALL crear una cuenta a partir de un nombre opcional, un email y una contraseña repetida dos veces, y SHALL devolver en la misma respuesta los datos públicos de la cuenta creada y un token de acceso, de modo que la persona queda autenticada sin tener que iniciar sesión después.

#### Scenario: Registro correcto con nombre
- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName: "Ada Lovelace"`, un email no registrado, una contraseña de 8 a 32 caracteres y la misma contraseña como confirmación
- **THEN** la respuesta es 200 con `{ data: { user, token } }`, donde `user` contiene el nombre y el email enviados y `token` es una cadena que sirve como credencial

#### Scenario: Registro correcto sin nombre
- **WHEN** se envía el registro con `fullName: null` y el resto de datos válidos
- **THEN** la cuenta se crea y `user.fullName` vale `null`

#### Scenario: Nombre vacío o solo con espacios
- **WHEN** se envía el registro con `fullName: ""` o `fullName: "   "`
- **THEN** la cuenta se crea igualmente y `user.fullName` vale `null`

#### Scenario: Falta la clave del nombre
- **WHEN** se envía el registro sin la clave `fullName` en el cuerpo
- **THEN** la respuesta es 422 con un error de campo obligatorio sobre `fullName`

### Requirement: Validación del registro (API)
El sistema SHALL rechazar el registro con 422 y una lista `errors` (cada error con `message`, `rule` y `field`) cuando el email no tenga formato válido, supere 254 caracteres o ya esté registrado, cuando la contraseña tenga menos de 8 o más de 32 caracteres, o cuando la confirmación no coincida con la contraseña.

#### Scenario: Email ya registrado
- **WHEN** se intenta registrar un email idéntico a uno existente
- **THEN** la respuesta es 422 con un error de unicidad sobre `email` y no se crea ninguna cuenta

#### Scenario: Contraseña demasiado corta
- **WHEN** se envía una contraseña de 7 caracteres
- **THEN** la respuesta es 422 con un error de longitud mínima sobre `password` (y otro sobre `passwordConfirmation` si también es corta)

#### Scenario: Contraseña demasiado larga
- **WHEN** se envía una contraseña de 33 caracteres
- **THEN** la respuesta es 422 con un error de longitud máxima sobre `password`

#### Scenario: Confirmación distinta
- **WHEN** la confirmación no coincide con la contraseña
- **THEN** la respuesta es 422 con un error sobre `passwordConfirmation`

### Requirement: Inicio de sesión (API)
El sistema SHALL emitir un nuevo token de acceso cuando el email y la contraseña correspondan a una cuenta existente, y SHALL responder con un error genérico, sin indicar qué dato falló, cuando no correspondan.

#### Scenario: Credenciales correctas
- **WHEN** se envía `POST /api/v1/auth/login` con el email y la contraseña de una cuenta existente
- **THEN** la respuesta es 200 con `{ data: { user, token } }`

#### Scenario: Contraseña incorrecta o email inexistente
- **WHEN** se envía un email registrado con una contraseña equivocada, o un email que no existe
- **THEN** la respuesta es 400 con `{ errors: [{ message: "Invalid user credentials" }] }`, sin `field` e idéntica en ambos casos

#### Scenario: Email con formato inválido
- **WHEN** se envía un email sin formato de email
- **THEN** la respuesta es 422 con un error de formato sobre `email`, antes de comprobar credenciales

#### Scenario: Contraseña vacía
- **WHEN** se envía un email válido con la contraseña vacía
- **THEN** la respuesta es 422 con un error de campo obligatorio sobre `password`

#### Scenario: Varios inicios de sesión
- **WHEN** la misma cuenta inicia sesión dos veces
- **THEN** se emiten dos tokens distintos y ambos siguen siendo válidos

### Requirement: Consulta del perfil autenticado (API)
El sistema SHALL devolver los datos públicos de la cuenta dueña del token cuando la petición incluya `Authorization: Bearer <token>` válido, y SHALL responder 401 en cualquier otro caso.

#### Scenario: Token válido
- **WHEN** se envía `GET /api/v1/account/profile` con un token vigente
- **THEN** la respuesta es 200 con `{ data: user }` de la cuenta dueña del token

#### Scenario: Sin token o token no reconocido
- **WHEN** se envía la petición sin cabecera de autorización, o con un token revocado o inventado
- **THEN** la respuesta es 401 con `{ errors: [{ message }] }`

### Requirement: Cierre de sesión (API)
El sistema SHALL revocar el token con el que se hace la petición de cierre de sesión, de modo que deje de servir para peticiones posteriores, sin afectar a otros tokens de la misma cuenta.

#### Scenario: Cierre con token válido
- **WHEN** se envía `POST /api/v1/account/logout` con un token vigente
- **THEN** la respuesta es 200 con `{ message: "Logged out successfully" }` y una consulta posterior del perfil con ese token responde 401

#### Scenario: Otros tokens de la misma cuenta
- **WHEN** una cuenta tiene dos tokens y cierra sesión con uno de ellos
- **THEN** el otro token sigue permitiendo consultar el perfil

#### Scenario: Cierre sin token
- **WHEN** se envía la petición de cierre de sesión sin token válido
- **THEN** la respuesta es 401

### Requirement: Datos públicos de una cuenta
El sistema SHALL representar una cuenta, en todas sus respuestas, solo con `id`, `fullName`, `email`, `initials`, `createdAt` y `updatedAt`, y SHALL NOT exponer nunca la contraseña ni ningún derivado de ella.

#### Scenario: Respuesta de registro, login o perfil
- **WHEN** cualquier respuesta incluye una cuenta
- **THEN** contiene exactamente esos seis campos y ninguno relacionado con la contraseña

### Requirement: Iniciales de la cuenta
El sistema SHALL calcular `initials` en mayúsculas: con nombre de dos o más palabras separadas por un espacio, la primera letra de las dos primeras; con nombre de una sola palabra, sus dos primeras letras; sin nombre, a partir del email.

#### Scenario: Nombre de dos palabras
- **WHEN** el nombre es "Ada Lovelace"
- **THEN** `initials` vale "AL"

#### Scenario: Nombre de una palabra
- **WHEN** el nombre es "Ada"
- **THEN** `initials` vale "AD"

#### Scenario: Sin nombre
- **WHEN** el nombre es `null` y el email es "ana@flowsync.io"
- **THEN** `initials` vale "AF" (primera letra antes de la arroba y primera letra del dominio)

### Requirement: Respuestas siempre en JSON
El sistema SHALL responder en JSON a cualquier petición de la API, aunque el cliente no lo pida, y SHALL envolver los datos de éxito de registro, login y perfil en una clave `data`.

#### Scenario: Petición sin cabecera Accept
- **WHEN** se hace una petición sin `Accept: application/json` que provoca un error de validación o de autenticación
- **THEN** el error llega como JSON con una lista `errors`, no como HTML

### Requirement: Pantalla de registro
El sistema SHALL ofrecer una pantalla de registro con nombre (marcado como opcional), email, contraseña con la pista "Entre 8 y 32 caracteres." y repetición de contraseña; al registrarse con éxito SHALL dejar a la persona dentro, en su perfil.

#### Scenario: Contraseñas distintas
- **WHEN** la persona escribe dos contraseñas distintas y pulsa "Crear cuenta"
- **THEN** ve "Las contraseñas no coinciden." bajo la repetición, sin que se envíe nada al servidor

#### Scenario: Nombre en blanco
- **WHEN** la persona deja el nombre vacío o solo con espacios
- **THEN** la cuenta se crea sin nombre

#### Scenario: Registro correcto
- **WHEN** los datos son válidos y la persona pulsa "Crear cuenta"
- **THEN** el botón muestra "Creando cuenta…" y está deshabilitado mientras espera, y después aparece la pantalla de perfil

### Requirement: Pantalla de inicio de sesión
El sistema SHALL ofrecer una pantalla de inicio de sesión con email y contraseña y un enlace a la de registro; al entrar con éxito SHALL llevar al perfil.

#### Scenario: Credenciales incorrectas
- **WHEN** la persona introduce un email o una contraseña que no corresponden a ninguna cuenta
- **THEN** ve un aviso general "El email o la contraseña no son correctos." y sigue en la pantalla

#### Scenario: Entrada correcta
- **WHEN** las credenciales son correctas y la persona pulsa "Entrar"
- **THEN** el botón muestra "Entrando…" mientras espera y después aparece el perfil

### Requirement: Mensajes de error en castellano
El sistema SHALL mostrar los errores de validación del servidor traducidos al castellano, colocados bajo el campo al que se refieren cuando ese campo está en pantalla, y como aviso general en caso contrario.

#### Scenario: Email ya registrado en la pantalla de registro
- **WHEN** la persona intenta registrarse con un email existente
- **THEN** ve bajo el email "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Contraseña corta en la pantalla de registro
- **WHEN** la persona envía una contraseña de 3 caracteres repetida igual
- **THEN** ve un error de longitud mínima bajo la contraseña y otro bajo la repetición

#### Scenario: Servidor inaccesible
- **WHEN** el servidor no responde al enviar cualquiera de los formularios
- **THEN** la persona ve "No se pudo conectar con el servidor. Comprueba que el backend está arrancado."

### Requirement: Sesión persistente entre recargas
El sistema SHALL recordar la sesión en el navegador y, al recargar o volver a abrir la aplicación, SHALL comprobar con el servidor que sigue siendo válida antes de mostrar contenido protegido, enseñando mientras tanto una pantalla de carga.

#### Scenario: Recarga con sesión válida
- **WHEN** la persona con sesión iniciada recarga la página del perfil
- **THEN** ve una pantalla de carga y después su perfil, sin pasar por el inicio de sesión

#### Scenario: Sesión rechazada por el servidor
- **WHEN** al recargar el servidor ya no reconoce la sesión guardada
- **THEN** la sesión guardada se borra y la persona llega al inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión."

#### Scenario: Servidor caído al recargar
- **WHEN** al recargar el servidor no responde
- **THEN** la persona llega al inicio de sesión con el motivo del fallo, y la sesión guardada no se borra, de modo que al recargar con el servidor ya disponible vuelve a entrar sin escribir credenciales

### Requirement: Protección de pantallas
El sistema SHALL mostrar el perfil solo con sesión válida, SHALL mostrar el inicio de sesión y el registro solo sin sesión, y SHALL redirigir cualquier dirección desconocida al perfil.

#### Scenario: Perfil sin sesión
- **WHEN** alguien sin sesión abre el perfil
- **THEN** llega al inicio de sesión

#### Scenario: Inicio de sesión con sesión activa
- **WHEN** alguien con sesión abre el inicio de sesión o el registro
- **THEN** llega a su perfil

#### Scenario: Dirección desconocida
- **WHEN** se abre una dirección que no existe
- **THEN** se redirige al perfil, y desde ahí al inicio de sesión si no hay sesión

### Requirement: Pantalla de perfil
El sistema SHALL mostrar en el perfil las iniciales, el nombre (o "Sin nombre" si no tiene), el email y la fecha de alta como "Miembro desde" en formato largo en castellano.

#### Scenario: Cuenta sin nombre
- **WHEN** una cuenta sin nombre abre su perfil
- **THEN** ve "Sin nombre" como título y las iniciales calculadas desde el email

#### Scenario: Fecha de alta
- **WHEN** la cuenta se creó el 1 de noviembre de 2026
- **THEN** ve "Miembro desde" junto a "1 de noviembre de 2026"

### Requirement: Cierre de sesión en pantalla
El sistema SHALL cerrar la sesión en el navegador al pulsar "Cerrar sesión" aunque el servidor no confirme la revocación, y SHALL llevar a la persona al inicio de sesión.

#### Scenario: Cierre normal
- **WHEN** la persona pulsa "Cerrar sesión"
- **THEN** el botón muestra "Cerrando sesión…" y después aparece el inicio de sesión, sin aviso de error

#### Scenario: Servidor caído al cerrar sesión
- **WHEN** la persona pulsa "Cerrar sesión" y el servidor no responde
- **THEN** igualmente sale al inicio de sesión y no ve ningún error

---

## Las tres listas

### 1. Requisitos generados y comprobados
- Requisitos escritos por el agente: **15** (8 de API y 7 de pantalla).
- Requisitos comprobados contra el código: **15** (comprobación hecha por el agente leyendo backend, frontend y las fuentes del framework).
- Requisitos comprobados además en ejecución, con todos sus scenarios: **11** (los 8 de API con curl contra el backend en local, más sesión persistente, protección de pantallas y perfil en el navegador). Los otros 4 solo en parte: en registro e inicio de sesión no llegó a verse el texto de carga del botón ("Creando cuenta…", "Entrando…") porque la respuesta local es inmediata, y no se ejecutaron "Servidor inaccesible" al enviar un formulario ni "Servidor caído al cerrar sesión".
- La primera versión, escrita solo leyendo el código, tenía 1 incoherencia falsa (que la API guardaba un nombre de solo espacios) y 3 scenarios sin cubrir (nombre vacío, contraseña larga y contraseña vacía en el login). Salieron al ejecutar.
- Requisitos revisados a mano por mí, aparte de la comprobación del agente: **0**.

### 2. Incoherencias detectadas
- El cierre de sesión responde `{ message }` sin la clave `data`, al contrario que registro, login y perfil (API, respuesta de logout).
- La pantalla dice "Tu sesión ha caducado" ante cualquier 401, pero los tokens no caducan nunca: solo dejan de valer si se cierra sesión con ellos (mensaje de sesión perdida frente a la emisión de tokens sin expiración).
- La pantalla traduce cualquier 400 como "El email o la contraseña no son correctos.", también en el registro, donde un 400 (por ejemplo, un cuerpo mal formado) no tiene nada que ver con credenciales (traducción de errores del frontend).
- El registro exige una contraseña de 8 a 32 caracteres y el inicio de sesión acepta cualquier longitud (validación de login frente a la de registro).
- Los mensajes de longitud de la pantalla de registro empiezan en minúscula ("la contraseña debe tener al menos 8 caracteres."), al contrario que el resto de mensajes (traducción de errores del frontend).
- Un cuerpo JSON mal formado devuelve 400 con el mensaje interno del error y su traza, no con la lista `errors` del resto de la API; al menos en el entorno de desarrollo (respuesta de error de la API).
- La pantalla de inicio de sesión dice "Entra con tu cuenta para volver a tus tareas.", pero no existe ninguna funcionalidad de tareas (texto de la pantalla de login).
- El campo de contraseña del registro declara un mínimo de 8 caracteres, pero el formulario desactiva la validación del navegador; la única comprobación previa al envío es la de contraseñas iguales (pantalla de registro).

### 3. Comportamientos que no supe clasificar como bug o contrato
- **Emails que solo se diferencian en mayúsculas.** Ni el registro ni el login normalizan el email, y la base de datos compara distinguiendo mayúsculas. "Ana@flowsync.io" y "ana@flowsync.io" pueden ser dos cuentas distintas, y quien se registró con mayúscula no entra si la escribe en minúscula. *Si es contrato*, el email es un identificador literal y la exactitud es responsabilidad de quien lo escribe. *Si es bug*, el sistema debería tratar como iguales emails que el correo real trata como iguales. Comprobado en ejecución: se registró "Ada@flowsync.io" aunque ya existía "ada@flowsync.io", y el login con "ADA@flowsync.io" responde 400. El código no lo comenta ni lo prueba; puede ser una decisión o un olvido, así que no lo he convertido en requisito.
- **Iniciales tomadas del dominio del email.** Sin nombre, "ana@flowsync.io" da "AF": la segunda letra sale del dominio, no de la persona. *Si es contrato*, es una forma deliberada de tener siempre dos letras. *Si es bug*, la intención era dos letras de la parte local, y el caso de una sola palabra del nombre ("AD") sugiere que se buscaba eso. Lo he documentado tal cual en el requisito de iniciales, marcado aquí como duda.
- **El cierre de sesión solo revoca un token.** Cerrar sesión en un navegador no cierra las demás sesiones, y como los tokens no caducan, una sesión abierta en otro dispositivo dura para siempre. *Si es contrato*, "cerrar sesión" significa "en este dispositivo". *Si es bug*, la persona espera dejar de estar dentro en todas partes. No hay ninguna pantalla para cerrar las demás sesiones que permita decidir cuál es la intención.
