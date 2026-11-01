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
