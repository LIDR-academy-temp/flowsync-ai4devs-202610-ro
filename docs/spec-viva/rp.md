# Cuentas y acceso

## Purpose

La capability de cuentas y acceso permite a una persona crear una cuenta, iniciar y cerrar sesión, consultar su perfil y conservar la sesión entre visitas. Además protege el espacio compartido frente a quien no tiene sesión iniciada.

## Requirements

### Requirement: Alta de cuenta

La API SHALL crear una cuenta y emitir un token de acceso cuando recibe un registro válido.

#### Scenario: Registro válido
- **WHEN** se envía `POST /api/v1/auth/signup` con un `email` válido que no está registrado, un `password` de 8 a 32 caracteres y un `passwordConfirmation` idéntico
- **THEN** la API crea el usuario y responde con `{ data: { user, token } }`, donde `token` es un token de acceso nuevo

### Requirement: Entrada directa tras el registro

La aplicación SHALL dejar a la persona con la sesión iniciada y en su perfil nada más registrarse, sin pasos adicionales.

#### Scenario: Registro completado desde la pantalla de registro
- **WHEN** una persona sin sesión rellena el formulario de registro y la API acepta el alta
- **THEN** la aplicación guarda la sesión en el navegador y lleva a la persona a la pantalla de perfil

### Requirement: Nombre completo opcional

El registro SHALL permitir crear una cuenta sin nombre completo.

#### Scenario: Registro sin nombre
- **WHEN** una persona deja vacío el campo «Nombre completo», o solo pone espacios, y el resto del formulario es válido
- **THEN** la aplicación envía el nombre como `null` y la cuenta se crea sin nombre

#### Scenario: El formulario indica que el nombre es opcional
- **WHEN** una persona abre la pantalla de registro
- **THEN** el campo «Nombre completo» aparece marcado como «(opcional)»

### Requirement: El campo nombre viaja siempre en el registro

La API MUST exigir que la petición de registro incluya el campo `fullName`, aunque su valor sea `null`.

#### Scenario: Registro sin el campo nombre
- **WHEN** se envía `POST /api/v1/auth/signup` sin el campo `fullName`
- **THEN** la API responde 422 con un error de campo obligatorio sobre `fullName`

#### Scenario: Registro con nombre nulo
- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName: null` y el resto de campos válidos
- **THEN** la API acepta el registro

### Requirement: Nombre sin longitud máxima propia

La API SHALL aceptar el nombre completo sin aplicarle un límite de longitud en la validación.

#### Scenario: Nombre muy largo
- **WHEN** se envía un registro válido con un `fullName` muy largo
- **THEN** la validación no rechaza la petición por la longitud del nombre

### Requirement: Email único

La API MUST rechazar el registro de un email que ya pertenece a una cuenta.

#### Scenario: Email ya registrado
- **WHEN** se envía un registro con un `email` que ya existe
- **THEN** la API responde 422 con un error de unicidad sobre `email`, y la pantalla de registro muestra bajo el campo email «Ese email ya está registrado. Inicia sesión en su lugar.»

### Requirement: Formato de email y longitud de contraseña en el registro

La API MUST validar que el email tenga formato válido y como máximo 254 caracteres, y que la contraseña tenga entre 8 y 32 caracteres.

#### Scenario: Email inválido o demasiado largo
- **WHEN** se envía un registro con un `email` sin formato de email o de más de 254 caracteres
- **THEN** la API responde 422 con un error sobre `email`, y la pantalla muestra «Introduce una dirección de email válida.» o el mensaje de longitud máxima

#### Scenario: Contraseña fuera de rango
- **WHEN** se envía un registro con un `password` de menos de 8 o más de 32 caracteres
- **THEN** la API responde 422 con un error de longitud sobre `password`, y la pantalla muestra el mensaje con el límite que indica la API

#### Scenario: Pista visible de longitud
- **WHEN** una persona abre la pantalla de registro y no hay errores sobre la contraseña
- **THEN** bajo el campo contraseña se muestra «Entre 8 y 32 caracteres.»

### Requirement: Confirmación de contraseña

El registro MUST exigir que la confirmación coincida con la contraseña, y la aplicación SHALL comprobarlo antes de llamar a la API.

#### Scenario: Confirmación distinta en la pantalla
- **WHEN** una persona envía el formulario de registro con contraseña y confirmación distintas
- **THEN** la aplicación muestra «Las contraseñas no coinciden.» bajo la confirmación sin hacer ninguna petición a la API

#### Scenario: Confirmación distinta en la API
- **WHEN** se envía `POST /api/v1/auth/signup` con `passwordConfirmation` distinto de `password`
- **THEN** la API responde 422 con un error sobre `passwordConfirmation`, que la aplicación muestra como «Las contraseñas no coinciden.»

### Requirement: La confirmación también se valida en longitud

La API SHALL aplicar a la confirmación de contraseña las mismas reglas de longitud que a la contraseña.

#### Scenario: Confirmación corta
- **WHEN** se envía un registro con un `passwordConfirmation` de menos de 8 caracteres
- **THEN** la API puede devolver, sobre `passwordConfirmation`, un error de longitud además del de no coincidencia

### Requirement: Inicio de sesión con credenciales correctas

La API SHALL devolver el usuario y un token de acceso nuevo cuando las credenciales son correctas.

#### Scenario: Login válido
- **WHEN** se envía `POST /api/v1/auth/login` con el `email` y el `password` de una cuenta existente
- **THEN** la API responde con `{ data: { user, token } }`, donde `token` es un token de acceso nuevo

#### Scenario: Login desde la pantalla
- **WHEN** una persona sin sesión introduce credenciales correctas en la pantalla de login
- **THEN** la aplicación guarda la sesión en el navegador y la lleva a la pantalla de perfil

### Requirement: Credenciales incorrectas

La API MUST NOT emitir un token con credenciales incorrectas, y la aplicación SHALL mostrar un error comprensible que no distinga si falló el email o la contraseña.

#### Scenario: Email inexistente o contraseña errónea
- **WHEN** se envía un login con un email que no existe o con una contraseña que no corresponde
- **THEN** la API responde 400 sin token, y la pantalla de login muestra arriba «El email o la contraseña no son correctos.»

### Requirement: Cualquier 400 se presenta como credenciales incorrectas

La aplicación SHALL mostrar «El email o la contraseña no son correctos.» ante cualquier respuesta 400 de la API, sea cual sea la petición.

#### Scenario: Respuesta 400 de la API
- **WHEN** cualquier petición de la aplicación a la API recibe una respuesta 400
- **THEN** el mensaje que se presenta es «El email o la contraseña no son correctos.»

### Requirement: Contraseña del login sin reglas de longitud

La API SHALL aceptar en el login una contraseña de cualquier longitud y decidir solo si las credenciales son correctas.

#### Scenario: Contraseña de longitud arbitraria
- **WHEN** se envía un login con un `email` válido y un `password` de cualquier longitud
- **THEN** la API no devuelve errores de longitud y responde según sean o no correctas las credenciales

### Requirement: Varios tokens válidos a la vez

La API SHALL emitir un token nuevo en cada login sin invalidar los anteriores.

#### Scenario: Logins repetidos
- **WHEN** la misma persona hace login varias veces
- **THEN** todos los tokens emitidos siguen siendo válidos para acceder a la API

### Requirement: Tokens sin caducidad

La API SHALL emitir los tokens de acceso sin fecha de caducidad.

#### Scenario: Token antiguo
- **WHEN** se usa un token emitido en un registro o en un login y que no se ha revocado con un logout, pase el tiempo que pase
- **THEN** la API lo sigue aceptando

### Requirement: Estado del botón durante el envío

La aplicación SHALL desactivar el botón de envío de los formularios de acceso mientras espera la respuesta e indicar que está trabajando.

#### Scenario: Envío del login
- **WHEN** una persona envía el formulario de login
- **THEN** el botón se desactiva y muestra «Entrando…» hasta que llega la respuesta

#### Scenario: Envío del registro
- **WHEN** una persona envía el formulario de registro
- **THEN** el botón se desactiva y muestra «Creando cuenta…» hasta que llega la respuesta

### Requirement: Reparto de errores entre campos y aviso general

La aplicación SHALL mostrar cada error de validación bajo el campo al que corresponde y MUST mostrar en un aviso general cualquier error que no pueda colocar bajo un campo visible.

#### Scenario: Todos los errores son de campos visibles
- **WHEN** la API rechaza el formulario con errores de validación que corresponden a campos que la pantalla muestra
- **THEN** cada error aparece bajo su campo y no se muestra aviso general

#### Scenario: Error de un campo que no está en pantalla o que no es de validación
- **WHEN** la API devuelve un error de un campo que la pantalla no muestra, o un error que no es de validación
- **THEN** su mensaje aparece en el aviso general de la parte superior del formulario

#### Scenario: Error inesperado
- **WHEN** el envío falla por un motivo que no es una respuesta de error de la API
- **THEN** el aviso general muestra «Algo ha ido mal. Inténtalo de nuevo.»

### Requirement: Un solo error por campo

La aplicación SHALL mostrar como mucho un error por campo.

#### Scenario: Varios errores sobre el mismo campo
- **WHEN** la API devuelve varios errores de validación para el mismo campo
- **THEN** bajo ese campo solo se muestra el primero

### Requirement: Sin validación nativa del navegador

Los formularios de acceso SHALL enviarse sin que el navegador los bloquee por su validación nativa.

#### Scenario: Campos vacíos o mal formados
- **WHEN** una persona envía el formulario de login o de registro con campos vacíos o un email mal formado
- **THEN** el navegador no impide el envío, y los errores que se muestran son los que devuelve la API

### Requirement: La sesión sobrevive a recargas y cierres de pestaña

La aplicación SHALL restaurar la sesión guardada en el navegador al volver a abrirse, tras comprobar con la API que sigue siendo válida.

#### Scenario: Recarga con sesión válida
- **WHEN** una persona con sesión iniciada recarga la página o vuelve a abrir la aplicación
- **THEN** la aplicación muestra un indicador de carga mientras consulta el perfil a la API y, si la API acepta el token, la deja dentro sin pedir credenciales

### Requirement: Sesión rechazada por la API

La aplicación MUST descartar la sesión guardada cuando la API la rechaza al restaurarla, y SHALL explicar el motivo en la pantalla de login.

#### Scenario: Token rechazado al recargar
- **WHEN** al restaurar la sesión la API responde 401
- **THEN** la aplicación borra la sesión guardada, lleva a la persona al login y muestra «Tu sesión ha caducado. Vuelve a iniciar sesión.»

### Requirement: API inaccesible al restaurar la sesión

Cuando no puede restaurar la sesión por un fallo que no es un rechazo del token, la aplicación SHALL tratar a la persona como si no tuviera sesión pero MUST conservar la sesión guardada.

#### Scenario: Backend caído o error del servidor al recargar
- **WHEN** al restaurar la sesión la API no responde o responde con un error que no es 401
- **THEN** la aplicación lleva a la persona al login con un aviso que explica el motivo, y la sesión guardada se conserva, de modo que una recarga con la API disponible la restaura

### Requirement: El cierre de sesión local es incondicional

Al cerrar sesión, la aplicación SHALL dejar a la persona sin sesión aunque falle la petición de logout a la API.

#### Scenario: Cerrar sesión
- **WHEN** una persona con sesión pulsa «Cerrar sesión»
- **THEN** la aplicación borra la sesión guardada y deja a la persona sin sesión antes de avisar a la API, e ignora cualquier error de esa petición

### Requirement: El logout revoca solo el token usado

La API SHALL invalidar en el logout únicamente el token con el que se hace la petición.

#### Scenario: Logout con varios tokens activos
- **WHEN** se envía `POST /api/v1/account/logout` con un token válido, y la persona tiene otros tokens activos
- **THEN** el token usado deja de ser válido y los demás siguen siéndolo

### Requirement: Volver atrás tras cerrar sesión no muestra el espacio

La aplicación MUST NOT mostrar contenido protegido al navegar hacia atrás después de cerrar sesión.

#### Scenario: Botón atrás tras el logout
- **WHEN** una persona cierra sesión y pulsa «atrás» en el navegador para volver al perfil
- **THEN** la aplicación la redirige al login

### Requirement: Respuesta del logout sin envoltorio de datos

La API SHALL responder al logout con un objeto que contiene directamente un mensaje, sin el envoltorio `data` del resto de respuestas.

#### Scenario: Logout correcto
- **WHEN** se envía `POST /api/v1/account/logout` con un token válido
- **THEN** la API responde `{ message: "Logged out successfully" }`

### Requirement: Mensaje del logout en inglés

El mensaje de confirmación del logout que devuelve la API SHALL estar en inglés.

#### Scenario: Texto de confirmación
- **WHEN** el logout se completa
- **THEN** el mensaje devuelto es «Logged out successfully»

### Requirement: El fallo de conexión se distingue del token rechazado

La aplicación MUST tratar de forma distinta que la API no responda y que la API rechace el token.

#### Scenario: La API no responde
- **WHEN** una petición de la aplicación no llega a la API
- **THEN** se trata como un fallo de conexión y no como una sesión caducada

### Requirement: Texto del fallo de conexión

Ante un fallo de conexión, la aplicación SHALL mostrar un mensaje que invite a comprobar el servidor.

#### Scenario: La API no responde
- **WHEN** una petición de la aplicación no llega a la API
- **THEN** el mensaje es «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

### Requirement: Respuestas de error del servidor

Ante un error del servidor sin una traducción específica, la aplicación SHALL mostrar un mensaje genérico, aunque la respuesta no venga en JSON.

#### Scenario: Error del servidor con cuerpo no JSON
- **WHEN** la API responde con un código de error distinto de 400, 401 y 422, con o sin cuerpo JSON
- **THEN** la aplicación muestra «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.»

### Requirement: Autenticación solo por token Bearer

La API SHALL autenticar las peticiones únicamente mediante un token de acceso enviado en la cabecera `Authorization: Bearer`.

#### Scenario: Petición autenticada
- **WHEN** se envía una petición a una ruta protegida
- **THEN** la API solo reconoce a la persona si la petición incluye un token de acceso válido como Bearer

### Requirement: Consulta del perfil propio

La API SHALL devolver los datos de la persona autenticada.

#### Scenario: Perfil con token válido
- **WHEN** se envía `GET /api/v1/account/profile` con un token válido
- **THEN** la API responde con `{ data: user }` con los datos de esa persona

### Requirement: Rutas de cuenta sin token válido

La API MUST rechazar con 401 las peticiones a las rutas de cuenta que no traen un token válido.

#### Scenario: Sin token o con un token inválido
- **WHEN** se envía `GET /api/v1/account/profile` o `POST /api/v1/account/logout` sin token o con un token inválido
- **THEN** la API responde 401

### Requirement: Datos expuestos del usuario

Cada vez que la API devuelve un usuario, SHALL incluir exactamente `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y MUST NOT incluir la contraseña ni su hash.

#### Scenario: Usuario en registro, login o perfil
- **WHEN** la API devuelve un usuario en el registro, el login o la consulta de perfil
- **THEN** el objeto contiene solo `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`

### Requirement: Cálculo de las iniciales

La API SHALL calcular las iniciales del usuario a partir del nombre completo o, si no hay nombre, a partir del email, y SHALL devolverlas en mayúsculas.

#### Scenario: Nombre de dos o más palabras
- **WHEN** el usuario tiene un nombre completo de al menos dos palabras
- **THEN** las iniciales son la primera letra de cada una de las dos primeras palabras

#### Scenario: Nombre de una palabra
- **WHEN** el nombre completo tiene una sola palabra
- **THEN** las iniciales son sus dos primeras letras

#### Scenario: Sin nombre
- **WHEN** el usuario no tiene nombre completo
- **THEN** las iniciales son la primera letra de la parte del email anterior a la arroba y la primera letra de la parte posterior

### Requirement: Punto de cierre de sesión en la interfaz

La aplicación SHALL ofrecer un botón «Cerrar sesión» a la persona con sesión iniciada.

#### Scenario: Pantalla de perfil
- **WHEN** una persona con sesión abre la pantalla de perfil
- **THEN** ve un botón «Cerrar sesión», que se desactiva y muestra «Cerrando sesión…» al pulsarlo

### Requirement: Contenido de la pantalla de perfil

La pantalla de perfil SHALL mostrar las iniciales, el nombre, el email y la fecha de alta de la persona.

#### Scenario: Perfil con nombre
- **WHEN** una persona con sesión y nombre completo abre la pantalla de perfil
- **THEN** ve sus iniciales, su nombre, su email y «Miembro desde» seguido de la fecha de alta en formato largo en español

#### Scenario: Perfil sin nombre
- **WHEN** una persona con sesión pero sin nombre completo abre la pantalla de perfil
- **THEN** en lugar del nombre ve «Sin nombre»

### Requirement: Perfil sin datos de usuario

La pantalla de perfil SHALL quedar vacía si no dispone de los datos de la persona.

#### Scenario: Datos de usuario no disponibles
- **WHEN** la pantalla de perfil se muestra sin datos de usuario cargados
- **THEN** no muestra ningún contenido

### Requirement: Las vistas protegidas exigen sesión

La aplicación MUST redirigir al login a quien intente abrir una vista protegida sin sesión.

#### Scenario: Visitante sin sesión
- **WHEN** una persona sin sesión abre la pantalla de perfil
- **THEN** la aplicación la redirige al login, sin dejar la vista protegida en el historial

### Requirement: Sin redirecciones mientras se comprueba la sesión

Mientras comprueba una sesión guardada, la aplicación SHALL mostrar un indicador de carga a pantalla completa en lugar de redirigir.

#### Scenario: Recarga en una vista protegida o pública
- **WHEN** una persona con una sesión guardada recarga la aplicación en cualquier vista y la comprobación con la API aún no ha terminado
- **THEN** ve un indicador de carga a pantalla completa y no se la redirige a ningún sitio

### Requirement: Login y registro solo sin sesión

La aplicación SHALL redirigir al perfil a quien abra el login o el registro teniendo ya la sesión iniciada.

#### Scenario: Persona con sesión abre el login o el registro
- **WHEN** una persona con sesión iniciada abre la pantalla de login o la de registro
- **THEN** la aplicación la redirige al perfil, sin dejar la pantalla anterior en el historial

### Requirement: Las direcciones desconocidas llevan al perfil

La aplicación SHALL redirigir al perfil cualquier dirección que no corresponda a una pantalla conocida, incluida la raíz.

#### Scenario: Dirección desconocida
- **WHEN** una persona abre una dirección de la aplicación que no existe, o la raíz
- **THEN** se la redirige al perfil, y desde ahí al login si no tiene sesión

### Requirement: Rutas de cuenta protegidas y rutas de acceso públicas en la API

La API MUST exigir un token válido en todas las rutas bajo `/api/v1/account` y SHALL atender sin autenticación las rutas bajo `/api/v1/auth`.

#### Scenario: Ruta de cuenta
- **WHEN** se envía cualquier petición a una ruta bajo `/api/v1/account` sin un token válido
- **THEN** la API responde 401

#### Scenario: Ruta de acceso
- **WHEN** se envía una petición de registro o de login sin token
- **THEN** la API la procesa con normalidad

### Requirement: Las rutas públicas ignoran la presencia del token

La API SHALL atender las rutas públicas igual tanto si la petición trae un token, válido o no, como si no lo trae.

#### Scenario: Ruta pública con o sin token
- **WHEN** se envía una petición a una ruta pública con un token válido, con uno inválido o sin token
- **THEN** la API no la rechaza por motivos de autenticación

### Requirement: Respuestas siempre en JSON

La API SHALL responder en JSON, también en los errores, sea cual sea la cabecera `Accept` de la petición.

#### Scenario: Petición que no pide JSON
- **WHEN** se envía una petición que produce un error 400, 401 o 422 sin pedir JSON en `Accept`
- **THEN** la API responde en JSON con la lista de errores

### Requirement: Respuesta de la raíz de la API

La API SHALL responder en su raíz con un saludo fijo, sin autenticación y sin el envoltorio `data`.

#### Scenario: Petición a la raíz
- **WHEN** se envía `GET /` a la API
- **THEN** responde `{ hello: "world" }`

## Parte B

### 1. Requisitos generados y comprobados
- Generados por el agente: 46
- Comprobados por mí en el código: 4 (contraseña de 8–32 caracteres en el registro, login sin límite de longitud de contraseña, tokens creados sin caducidad en registro y login, ruta desconocida → perfil)

### 2. Incoherencias detectadas
- El registro exige contraseña de 8–32 caracteres; el login acepta cualquier longitud (validación de la API).
- El frontend tiene el mensaje «Tu sesión ha caducado», pero la API nunca caduca los tokens (cliente vs API).
- Todas las respuestas de la API van envueltas en `data`, excepto la del logout (API).
- El PRD (RF-1) pide registrarse «con nombre, email y contraseña», pero el nombre es opcional (registro: PRD vs comportamiento).
- El cliente muestra cualquier error 400 como «email o contraseña incorrectos», aunque no todo 400 viene del login (cliente).
- El agente marcó «el logout cierra solo este dispositivo» como contrato y «varias sesiones simultáneas» como dudoso, lo cual es incoherente; lo corregí a dudoso.

### 3. Comportamientos que no supe clasificar como bug o contrato
- **Cada login crea una sesión nueva y las anteriores siguen activas.** Si es diseño: se permite usar FlowSync en varios dispositivos a la vez. Si es bug: el login debería invalidar las sesiones previas, o el logout debería cerrarlas todas. El código no lo aclara: no existe «cerrar sesión en todos los dispositivos» y el PRD no habla de sesiones múltiples.
- **Si el servidor está caído al recargar, el usuario ve el login pero su sesión se conserva.** Si es diseño: evitar que pierda la sesión por un fallo temporal. Si es bug: el PRD pide que recargar no obligue a meter credenciales, y aquí visualmente sí lo obliga. Solo se puede saber probándolo con el backend apagado, y la intención no está escrita en ningún sitio.

📌 El agente me corrigió una cita: cerrar sesión lo exige RF-2, no RF-4 como yo le había indicado, y tenía razón.