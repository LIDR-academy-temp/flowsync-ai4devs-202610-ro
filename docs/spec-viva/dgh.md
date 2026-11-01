# Registro

## Purpose

Permitir que una persona sin cuenta en FlowSync cree una con su email y una contraseña, y que entre en la aplicación con la sesión ya iniciada, sin tener que hacer login aparte.

## Requirements

### Requirement: Alta de cuenta con datos válidos

El sistema SHALL aceptar una petición de registro con nombre completo, email, contraseña y confirmación de contraseña. Si todos los datos son válidos, SHALL crear la cuenta y responder con éxito (código 200) con un cuerpo `{ data: { user, token } }`.

#### Scenario: Registro correcto vía API

- **WHEN** no existe ninguna cuenta con el email `ada@example.com` y se envía una petición de registro con `fullName: "Ada Lovelace"`, `email: "ada@example.com"`, `password: "secreto123"` y `passwordConfirmation: "secreto123"`
- **THEN** la respuesta tiene código 200 y un cuerpo `{ data: { user, token } }`, donde `user` contiene los datos de la cuenta recién creada y `token` es una cadena no vacía

### Requirement: Datos públicos de la cuenta en la respuesta

El sistema SHALL devolver en `user` únicamente `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`. La contraseña SHALL NOT aparecer en la respuesta, ni en claro ni hasheada.

#### Scenario: La respuesta no expone la contraseña

- **WHEN** un registro termina con éxito
- **THEN** el objeto `user` tiene exactamente las claves `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y no tiene ninguna clave `password`

### Requirement: Cálculo de iniciales

El sistema SHALL calcular `initials` en mayúsculas así: con un nombre de dos o más palabras, la primera letra de las dos primeras palabras; con un nombre de una sola palabra, sus dos primeras letras; sin nombre, la primera letra de la parte del email anterior a la `@` seguida de la primera letra de la parte posterior.

#### Scenario: Nombre de dos palabras

- **WHEN** alguien se registra con `fullName: "Ada Lovelace"`
- **THEN** `initials` vale `"AL"`

#### Scenario: Nombre de una sola palabra

- **WHEN** alguien se registra con `fullName: "Ada"`
- **THEN** `initials` vale `"AD"`

#### Scenario: Sin nombre

- **WHEN** alguien se registra con `fullName: null` y `email: "ada@example.com"`
- **THEN** `initials` vale `"AE"`

### Requirement: Sesión iniciada al registrarse

El token devuelto por el registro SHALL ser un token de acceso válido desde ese momento: el sistema SHALL aceptarlo como credencial `Authorization: Bearer` en las peticiones que exigen autenticación.

#### Scenario: Usar el token del registro

- **WHEN** un registro acaba de terminar con éxito y se pide el perfil enviando `Authorization: Bearer <token>` con el token recibido
- **THEN** la petición de perfil tiene éxito y devuelve los datos de la cuenta recién creada

### Requirement: Nombre completo opcional pero presente

El campo `fullName` SHALL aceptar una cadena o `null`. La clave SHALL estar presente en la petición: si falta, el sistema SHALL rechazar el registro con un error de validación.

#### Scenario: Registro sin nombre

- **WHEN** se envía una petición de registro válida con `fullName: null`
- **THEN** la cuenta se crea y `user.fullName` vale `null`

#### Scenario: Petición sin la clave fullName

- **WHEN** se envía una petición de registro sin la clave `fullName` y con el resto de campos válidos
- **THEN** la respuesta tiene código 422 e incluye un error con `field: "fullName"` y `rule: "required"`

### Requirement: Validación del email

El sistema SHALL exigir un `email` con formato de dirección de correo válido y de 254 caracteres como máximo.

#### Scenario: Email con formato inválido

- **WHEN** se envía una petición de registro con `email: "no-es-un-email"`
- **THEN** la respuesta tiene código 422 e incluye un error con `field: "email"` y `rule: "email"`

#### Scenario: Email demasiado largo

- **WHEN** se envía una petición de registro con un email de más de 254 caracteres
- **THEN** la respuesta tiene código 422 e incluye un error sobre `email` con `rule: "maxLength"`

### Requirement: Email único

El sistema SHALL rechazar un registro cuyo email ya esté usado por otra cuenta, y SHALL NOT crear una segunda cuenta con ese email.

#### Scenario: Email ya registrado

- **WHEN** ya existe una cuenta con `ada@example.com` y se envía una petición de registro con ese mismo email
- **THEN** la respuesta tiene código 422 e incluye un error con `field: "email"` y `rule: "database.unique"`, y no se crea ninguna cuenta nueva

### Requirement: Longitud de la contraseña

El sistema SHALL exigir una `password` de entre 8 y 32 caracteres. El campo `passwordConfirmation` SHALL cumplir los mismos límites.

#### Scenario: Contraseña demasiado corta

- **WHEN** se envía una petición de registro con `password: "corta"`
- **THEN** la respuesta tiene código 422 e incluye un error con `field: "password"` y `rule: "minLength"`, cuyo `meta.min` vale 8

#### Scenario: Contraseña demasiado larga

- **WHEN** se envía una petición de registro con una `password` de 33 caracteres o más
- **THEN** la respuesta tiene código 422 e incluye un error con `field: "password"` y `rule: "maxLength"`, cuyo `meta.max` vale 32

### Requirement: Confirmación de contraseña

El sistema SHALL exigir que `passwordConfirmation` sea igual a `password`.

#### Scenario: Confirmación distinta

- **WHEN** se envía una petición de registro con `password: "secreto123"` y `passwordConfirmation: "secreto124"`
- **THEN** la respuesta tiene código 422 e incluye un error con `field: "passwordConfirmation"` y `rule: "sameAs"`

### Requirement: Formato de los errores de validación

Cuando los datos no son válidos, el sistema SHALL responder con código 422 y un cuerpo `{ errors: [...] }`. Cada error SHALL incluir `message`, `rule` y `field`, y `meta` cuando la regla tiene parámetros. El sistema SHALL informar en la misma respuesta de los errores de todos los campos inválidos.

#### Scenario: Varios campos inválidos a la vez

- **WHEN** se envía una petición de registro con `email: "x"` y `password: "1"`
- **THEN** la respuesta tiene código 422 y `errors` contiene al menos un error para `email` y otro para `password`

### Requirement: Pantalla de registro

La aplicación SHALL ofrecer una pantalla "Crea tu cuenta" con cuatro campos: "Nombre completo (opcional)", "Email", "Contraseña" y "Repite la contraseña". Bajo la contraseña SHALL aparecer la indicación "Entre 8 y 32 caracteres." y al pie un enlace "Inicia sesión" que lleva a la pantalla de inicio de sesión.

#### Scenario: Ver el formulario

- **WHEN** un usuario sin sesión abre la pantalla de registro
- **THEN** ve el título "Crea tu cuenta", los cuatro campos, la indicación "Entre 8 y 32 caracteres.", el botón "Crear cuenta" y el texto "¿Ya tienes cuenta? Inicia sesión"

#### Scenario: Ir al inicio de sesión

- **WHEN** un usuario está en la pantalla de registro y pulsa "Inicia sesión"
- **THEN** pasa a la pantalla de inicio de sesión

### Requirement: Registro correcto desde la pantalla

Cuando el registro termina con éxito, la aplicación SHALL dejar al usuario con la sesión iniciada y llevarlo a su perfil. La sesión SHALL mantenerse si después recarga la página.

#### Scenario: Crear cuenta y entrar

- **WHEN** un usuario sin sesión rellena la pantalla de registro con datos válidos y pulsa "Crear cuenta"
- **THEN** aterriza en la pantalla de perfil con su nombre (o "Sin nombre"), su email, sus iniciales y la fecha de alta

#### Scenario: Recargar tras registrarse

- **WHEN** un usuario se acaba de registrar desde la pantalla y recarga la página
- **THEN** sigue en su perfil con la sesión iniciada

### Requirement: Nombre vacío desde la pantalla

La aplicación SHALL quitar los espacios al principio y al final del nombre antes de enviarlo. Si el nombre queda vacío, SHALL enviarlo como `null`.

#### Scenario: Dejar el nombre en blanco

- **WHEN** un usuario se registra con el campo "Nombre completo" vacío o lleno solo de espacios
- **THEN** la cuenta se crea sin nombre y el perfil muestra "Sin nombre"

### Requirement: Comprobación de contraseñas en el navegador

Si la contraseña y su confirmación no coinciden, la aplicación SHALL NOT enviar la petición. En su lugar SHALL mostrar "Las contraseñas no coinciden." bajo "Repite la contraseña" y borrar cualquier otro error que hubiera en pantalla.

#### Scenario: Contraseñas distintas

- **WHEN** un usuario escribe contraseñas diferentes en "Contraseña" y "Repite la contraseña" y pulsa "Crear cuenta"
- **THEN** ve "Las contraseñas no coinciden." bajo "Repite la contraseña" y no se envía nada al servidor

### Requirement: Errores de validación junto a cada campo

Cuando el servidor rechaza el registro por validación, la aplicación SHALL mostrar un mensaje en castellano bajo cada campo afectado (solo el primero si un campo tiene varios errores), marcar ese campo como inválido y no mostrar un aviso general. Si hay error en la contraseña, el mensaje SHALL ocupar el lugar de la indicación "Entre 8 y 32 caracteres.". Los mensajes son:

- email ya registrado: "Ese email ya está registrado. Inicia sesión en su lugar."
- email con formato inválido: "Introduce una dirección de email válida."
- confirmación distinta: "Las contraseñas no coinciden."
- longitud mínima: "la contraseña debe tener al menos 8 caracteres."
- longitud máxima: "<campo> no puede superar los <n> caracteres."
- campo obligatorio ausente: "Falta rellenar <campo>."
- cualquier otra regla: "Revisa <campo>."

#### Scenario: Email ya registrado desde la pantalla

- **WHEN** ya existe una cuenta con el email introducido y un usuario sin sesión envía el formulario de registro con ese email
- **THEN** ve bajo "Email" el mensaje "Ese email ya está registrado. Inicia sesión en su lugar." y sigue en la pantalla de registro

#### Scenario: Contraseña corta desde la pantalla

- **WHEN** un usuario envía el formulario con una contraseña de menos de 8 caracteres repetida igual en la confirmación
- **THEN** en lugar de la indicación ve "la contraseña debe tener al menos 8 caracteres." bajo "Contraseña", y bajo "Repite la contraseña" ve "la confirmación de la contraseña debe tener al menos 8 caracteres."

### Requirement: Errores de servidor y de conexión

Si el servidor no responde, la aplicación SHALL mostrar el aviso general "No se pudo conectar con el servidor. Comprueba que el backend está arrancado.". Ante un error inesperado del servidor, SHALL mostrar "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.". En los dos casos el usuario SHALL seguir en la pantalla de registro con lo que había escrito.

#### Scenario: Backend apagado

- **WHEN** el servidor no está disponible y un usuario envía el formulario de registro
- **THEN** ve el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." encima del formulario y sus datos siguen en los campos

### Requirement: Estado de envío

Mientras la petición de registro está en curso, la aplicación SHALL deshabilitar el botón y cambiar su texto a "Creando cuenta…". Cuando llega la respuesta, SHALL volver a habilitarlo.

#### Scenario: Envío en curso

- **WHEN** un usuario pulsa "Crear cuenta" y el servidor todavía no ha respondido
- **THEN** el botón aparece deshabilitado con el texto "Creando cuenta…"

### Requirement: Pantalla de registro solo sin sesión

La aplicación SHALL mostrar la pantalla de registro solo a quien no tiene la sesión iniciada. Mientras se comprueba una sesión guardada, SHALL mostrar un indicador de carga.

#### Scenario: Usuario con sesión abre el registro

- **WHEN** un usuario con la sesión iniciada intenta abrir la pantalla de registro
- **THEN** la aplicación lo lleva a su perfil

#### Scenario: Comprobando sesión guardada

- **WHEN** hay una sesión guardada en el navegador que aún no se ha comprobado con el servidor y se abre la pantalla de registro
- **THEN** se ve un indicador de carga hasta que termina la comprobación

## Parte B:
### 1. Requisitos generados y comprobados. 
Se generaron 18 requerimientos y 27 escenarios
Se comprobaron 12 requerimientos y 17 escenarios (correctos)

### 2. Incoherencias detectadas
No logre encontrar incoherencias

### 3. Comportamientos que no supe clasificar como bug o contrato
Tenia la duda con respecto al 'fullName' que en un escenario se indicaba que debe enviar siempre el campo a la API, pero por la instruccion vine.string().nullable() y no contar con optional() efectivamente es así-
