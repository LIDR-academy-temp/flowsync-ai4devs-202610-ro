## Purpose

Esta capability permite a una persona crear una cuenta, entrar y salir de FlowSync, conservar su sesión y consultar su perfil. Cubre tanto la API como las pantallas de acceso.

## Requirements

### Requirement: Registro de cuenta por API

El sistema SHALL crear una cuenta y emitir un token de acceso cuando reciba un registro válido en `POST /api/v1/auth/signup`.

#### Scenario: Registro correcto con nombre
- **WHEN** un cliente envía `fullName`, un `email` no registrado, una `password` de 8 a 32 caracteres y una `passwordConfirmation` idéntica
- **THEN** la API responde 200 con `{ "data": { "user": { "id", "fullName", "email", "createdAt", "updatedAt", "initials" }, "token": "<cadena opaca>" } }`, sin incluir la contraseña

#### Scenario: Registro correcto sin nombre
- **WHEN** un cliente envía un registro válido con `fullName` igual a `null`
- **THEN** la API responde 200 y `data.user.fullName` es `null`

#### Scenario: Token utilizable de inmediato
- **WHEN** un cliente usa el token recibido al registrarse para pedir `GET /api/v1/account/profile`
- **THEN** la API responde 200 con los datos de la cuenta recién creada

### Requirement: Validación del registro por API

El sistema SHALL rechazar con 422 un registro no válido, con un cuerpo `{ "errors": [ { "message", "rule", "field", "meta" } ] }` donde `meta` solo aparece si la regla aporta datos, y SHALL informar como máximo de un error por campo.

#### Scenario: Campos ausentes
- **WHEN** un cliente omite cualquiera de `fullName`, `email`, `password` o `passwordConfirmation`
- **THEN** la API responde 422 con un error por cada campo ausente, con `rule` igual a `required` y `message` del tipo `The email field must be defined`

#### Scenario: Valor no textual
- **WHEN** un cliente envía en cualquiera de los cuatro campos un valor que no es una cadena ni, en `fullName`, `null`
- **THEN** la API responde 422 con `rule` igual a `string` y `message` del tipo `The email field must be a string`

#### Scenario: Email con formato no válido
- **WHEN** un cliente envía un `email` que no tiene formato de dirección de correo
- **THEN** la API responde 422 con `field` igual a `email`, `rule` igual a `email` y `message` igual a `The email field must be a valid email address`

#### Scenario: Email demasiado largo
- **WHEN** un cliente envía un `email` bien construido de más de 254 caracteres
- **THEN** la API responde 422 con `field` igual a `email` y `rule` igual a `email`, no `maxLength`

#### Scenario: Contraseña demasiado corta
- **WHEN** un cliente envía `password` o `passwordConfirmation` con menos de 8 caracteres
- **THEN** la API responde 422 para ese campo con `rule` igual a `minLength` y `meta.min` igual a 8

#### Scenario: Contraseña demasiado larga
- **WHEN** un cliente envía `password` o `passwordConfirmation` con más de 32 caracteres
- **THEN** la API responde 422 para ese campo con `rule` igual a `maxLength` y `meta.max` igual a 32

#### Scenario: Confirmación distinta
- **WHEN** un cliente envía una `passwordConfirmation` de longitud válida distinta de `password`
- **THEN** la API responde 422 con `field` igual a `passwordConfirmation`, `rule` igual a `sameAs`, `meta.otherField` igual a `password` y `message` igual a `The passwordConfirmation field and password field must be the same`

### Requirement: Unicidad del email

El sistema SHALL impedir que se registre un email que coincida exactamente con el de otra cuenta.

#### Scenario: Email ya registrado
- **WHEN** un cliente envía un registro con un `email` idéntico al de una cuenta existente
- **THEN** la API responde 422 con `field` igual a `email`, `rule` igual a `database.unique` y `message` igual a `The email has already been taken`

#### Scenario: Email que solo difiere en mayúsculas
- **WHEN** un cliente envía un registro válido con un `email` que solo difiere de uno existente en mayúsculas o minúsculas
- **THEN** la API responde 200 y crea una cuenta distinta

### Requirement: Normalización de textos de entrada

El sistema SHALL eliminar los espacios iniciales y finales de cada texto del cuerpo de las peticiones de registro e inicio de sesión, y SHALL tratar como `null` el texto que quede vacío.

#### Scenario: Email con espacios alrededor
- **WHEN** un cliente envía un `email` válido con espacios al principio o al final
- **THEN** la API lo procesa sin esos espacios y lo devuelve sin ellos en `data.user.email`

#### Scenario: Nombre en blanco por API
- **WHEN** un cliente envía un registro válido con `fullName` vacío o formado solo por espacios
- **THEN** la API responde 200 y `data.user.fullName` es `null`

#### Scenario: Campo obligatorio en blanco
- **WHEN** un cliente envía `email` o `password` vacíos o formados solo por espacios
- **THEN** la API responde 422 con `rule` igual a `required` para ese campo

#### Scenario: Contraseña con espacios alrededor
- **WHEN** una cuenta se registró con una contraseña rodeada de espacios y un cliente inicia sesión con la misma contraseña sin esos espacios
- **THEN** la API responde 200

#### Scenario: Longitud medida tras recortar
- **WHEN** un cliente envía una `password` de 9 caracteres de los que solo 7 no son espacios iniciales o finales
- **THEN** la API responde 422 con `rule` igual a `minLength` para ese campo

### Requirement: Inicio de sesión por API

El sistema SHALL emitir un token de acceso nuevo cada vez que reciba credenciales correctas en `POST /api/v1/auth/login`.

#### Scenario: Credenciales correctas
- **WHEN** un cliente envía el `email` y la `password` de una cuenta existente
- **THEN** la API responde 200 con `{ "data": { "user": { "id", "fullName", "email", "createdAt", "updatedAt", "initials" }, "token": "<cadena opaca>" } }`, sin incluir la contraseña

#### Scenario: Inicios de sesión repetidos
- **WHEN** un cliente inicia sesión dos veces con la misma cuenta
- **THEN** la API entrega un token diferente en cada respuesta y ambos permiten acceder a las rutas protegidas

### Requirement: Rechazo de credenciales incorrectas

El sistema SHALL responder 400 con el mismo cuerpo cuando el email no exista y cuando la contraseña no sea correcta.

#### Scenario: Email desconocido
- **WHEN** un cliente envía un `email` con formato válido que no pertenece a ninguna cuenta
- **THEN** la API responde 400 con `{ "errors": [ { "message": "Invalid user credentials" } ] }`

#### Scenario: Contraseña incorrecta
- **WHEN** un cliente envía el `email` de una cuenta existente con una `password` incorrecta de cualquier longitud
- **THEN** la API responde 400 con `{ "errors": [ { "message": "Invalid user credentials" } ] }`

#### Scenario: Email con otras mayúsculas
- **WHEN** un cliente envía la contraseña correcta con un `email` que solo difiere en mayúsculas o minúsculas del registrado y no hay otra cuenta con esa grafía
- **THEN** la API responde 400 con `{ "errors": [ { "message": "Invalid user credentials" } ] }`

### Requirement: Validación del inicio de sesión por API

El sistema SHALL rechazar con 422 un inicio de sesión cuyo email no sea válido o al que le falte algún dato, y SHALL NOT aplicar reglas de longitud a la contraseña.

#### Scenario: Datos ausentes
- **WHEN** un cliente omite `email` o `password`
- **THEN** la API responde 422 con un error por cada campo ausente y `rule` igual a `required`

#### Scenario: Email no válido
- **WHEN** un cliente envía un `email` sin formato de dirección de correo
- **THEN** la API responde 422 con `field` igual a `email` y `rule` igual a `email`

#### Scenario: Email demasiado largo
- **WHEN** un cliente envía un `email` bien construido de más de 254 caracteres
- **THEN** la API responde 422 con `field` igual a `email` y `rule` igual a `email`, no `maxLength`

#### Scenario: Contraseña corta
- **WHEN** un cliente envía una `password` incorrecta de menos de 8 caracteres
- **THEN** la API responde 400 y no 422

### Requirement: Respuestas de error en JSON

El sistema SHALL responder con errores en formato JSON sea cual sea la cabecera `Accept` de la petición.

#### Scenario: Cliente que pide HTML
- **WHEN** un cliente envía `Accept: text/html` en un registro no válido
- **THEN** la API responde 422 con el cuerpo JSON `{ "errors": [ ... ] }`

#### Scenario: Error inesperado en producción
- **WHEN** se produce un error interno no controlado con la aplicación en entorno de producción
- **THEN** la API responde con el estado del error y `{ "message": "<mensaje del error>" }`

#### Scenario: Error inesperado fuera de producción
- **WHEN** se produce un error interno no controlado con la aplicación fuera del entorno de producción
- **THEN** la API responde con el estado del error y un informe JSON detallado del error

### Requirement: Autenticación por token

El sistema SHALL exigir en `GET /api/v1/account/profile` y `POST /api/v1/account/logout` una cabecera `Authorization: Bearer <token>` con un token vigente.

#### Scenario: Sin credencial
- **WHEN** un cliente llama a una de esas rutas sin cabecera `Authorization`, aunque envíe cookies
- **THEN** la API responde 401 con `{ "errors": [ { "message": "Unauthorized access" } ] }`

#### Scenario: Esquema o token mal formados
- **WHEN** un cliente llama a una de esas rutas con un esquema distinto de `Bearer` o con un token mal formado
- **THEN** la API responde 401 con `{ "errors": [ { "message": "Unauthorized access" } ] }`

#### Scenario: Token desconocido o revocado
- **WHEN** un cliente llama a una de esas rutas con un token que no existe o que se revocó al cerrar sesión
- **THEN** la API responde 401 con `{ "errors": [ { "message": "Unauthorized access" } ] }`

### Requirement: Indiferencia de las rutas públicas al token

El sistema SHALL procesar el registro y el inicio de sesión de forma independiente de cualquier token que acompañe a la petición.

#### Scenario: Token no válido en ruta pública
- **WHEN** un cliente envía un inicio de sesión correcto con una cabecera `Authorization` cuyo token no es válido
- **THEN** la API responde 200 y emite un token nuevo

#### Scenario: Token válido en ruta pública
- **WHEN** un cliente con un token vigente envía un registro válido con otro email
- **THEN** la API responde 200 y crea la nueva cuenta

### Requirement: Consulta del perfil por API

El sistema SHALL devolver los datos de la cuenta a la que pertenece el token.

#### Scenario: Perfil con token vigente
- **WHEN** un cliente pide `GET /api/v1/account/profile` con un token vigente
- **THEN** la API responde 200 con `{ "data": { "id", "fullName", "email", "createdAt", "updatedAt", "initials" } }`, sin incluir la contraseña

### Requirement: Cierre de sesión por API

El sistema SHALL revocar únicamente el token usado en `POST /api/v1/account/logout`.

#### Scenario: Cierre correcto
- **WHEN** un cliente envía la petición con un token vigente
- **THEN** la API responde 200 con `{ "message": "Logged out successfully" }`, sin envoltorio `data`

#### Scenario: Reutilización del token revocado
- **WHEN** un cliente reutiliza el token de un cierre de sesión ya realizado para pedir el perfil o cerrar sesión otra vez
- **THEN** la API responde 401

#### Scenario: Otros tokens de la misma cuenta
- **WHEN** una cuenta tiene dos tokens vigentes y un cliente cierra sesión con uno de ellos
- **THEN** el otro token sigue permitiendo acceder a las rutas protegidas

### Requirement: Vigencia de los tokens

El sistema SHALL emitir tokens sin fecha de caducidad.

#### Scenario: Token antiguo no revocado
- **WHEN** un cliente usa un token emitido en cualquier momento anterior que no se ha revocado y cuya cuenta sigue existiendo
- **THEN** la API lo acepta en las rutas protegidas

### Requirement: Cálculo de iniciales

El sistema SHALL devolver en `initials` un texto en mayúsculas derivado del nombre o, si no hay nombre, del email.

#### Scenario: Nombre de dos o más palabras
- **WHEN** la cuenta tiene como nombre `Ana María López`
- **THEN** `initials` vale `AM`

#### Scenario: Nombre de una palabra
- **WHEN** la cuenta tiene como nombre `Ada`
- **THEN** `initials` vale `AD`

#### Scenario: Nombre con doble espacio interior
- **WHEN** la cuenta tiene como nombre `Ada  Lovelace`, con dos espacios seguidos
- **THEN** `initials` vale `AD`

#### Scenario: Cuenta sin nombre
- **WHEN** la cuenta no tiene nombre y su email es `ana@example.com`
- **THEN** `initials` vale `AE`

### Requirement: Acceso a pantallas según la sesión

La aplicación SHALL decidir qué pantalla muestra según exista o no una sesión activa.

#### Scenario: Pantalla protegida sin sesión
- **WHEN** una persona sin sesión abre `/profile`
- **THEN** la aplicación la lleva a `/login`

#### Scenario: Pantallas de acceso con sesión
- **WHEN** una persona con sesión activa abre `/login` o `/register`
- **THEN** la aplicación la lleva a `/profile`

#### Scenario: Otra dirección
- **WHEN** una persona abre cualquier dirección distinta de `/login`, `/register` y `/profile`
- **THEN** la aplicación la lleva a `/profile`, y de ahí a `/login` si no tiene sesión

### Requirement: Indicador de comprobación de sesión

La aplicación SHALL mostrar solo un indicador de carga mientras comprueba una sesión guardada.

#### Scenario: Carga con sesión guardada
- **WHEN** una persona abre `/login`, `/register` o `/profile` con una sesión guardada en el navegador y el servidor aún no ha respondido
- **THEN** ve un indicador giratorio, con el texto `Cargando…` disponible para lectores de pantalla, y no ve formularios ni perfil

### Requirement: Pantalla de inicio de sesión

La aplicación SHALL ofrecer en `/login` un formulario para entrar con email y contraseña.

#### Scenario: Contenido de la pantalla
- **WHEN** una persona sin sesión abre `/login`
- **THEN** ve `FlowSync`, el título `Inicia sesión`, el texto `Entra con tu cuenta para volver a tus tareas.`, los campos `Email` (con ejemplo `tu@email.com`) y `Contraseña`, el botón `Entrar` y el texto `¿Aún no tienes cuenta?` con el enlace `Crea una`

#### Scenario: Ir al registro
- **WHEN** una persona pulsa `Crea una`
- **THEN** la aplicación la lleva a `/register`

### Requirement: Envío del inicio de sesión

La aplicación SHALL iniciar la sesión y llevar al perfil cuando el servidor acepte las credenciales.

#### Scenario: Envío en curso
- **WHEN** una persona envía el formulario y el servidor aún no ha respondido
- **THEN** el botón muestra `Entrando…` y está deshabilitado

#### Scenario: Credenciales aceptadas
- **WHEN** el servidor acepta las credenciales
- **THEN** la aplicación lleva a la persona a `/profile` con sus datos

### Requirement: Errores del inicio de sesión

La aplicación SHALL mostrar en un aviso general los errores de credenciales y bajo cada campo los errores de validación.

#### Scenario: Credenciales rechazadas
- **WHEN** el servidor rechaza el email o la contraseña por incorrectos
- **THEN** la persona sigue en `/login` y ve el aviso `El email o la contraseña no son correctos.`

#### Scenario: Formulario vacío
- **WHEN** una persona envía el formulario con ambos campos vacíos
- **THEN** ve `Falta rellenar el email.` bajo `Email` y `Falta rellenar la contraseña.` bajo `Contraseña`

#### Scenario: Email con formato no válido
- **WHEN** una persona envía un email sin formato de dirección de correo y una contraseña
- **THEN** ve `Introduce una dirección de email válida.` bajo `Email`

#### Scenario: Email demasiado largo
- **WHEN** una persona envía un email bien construido de más de 254 caracteres
- **THEN** ve `Introduce una dirección de email válida.` bajo `Email`

#### Scenario: Nuevo intento
- **WHEN** una persona vuelve a enviar el formulario tras un error
- **THEN** los errores del intento anterior desaparecen mientras se procesa el nuevo envío

### Requirement: Pantalla de registro

La aplicación SHALL ofrecer en `/register` un formulario para crear una cuenta.

#### Scenario: Contenido de la pantalla
- **WHEN** una persona sin sesión abre `/register`
- **THEN** ve `FlowSync`, el título `Crea tu cuenta`, el texto `Regístrate para empezar a organizar el trabajo del equipo.`, los campos `Nombre completo (opcional)` (con ejemplo `Ada Lovelace`), `Email` (con ejemplo `tu@email.com`), `Contraseña` (con la indicación `Entre 8 y 32 caracteres.`) y `Repite la contraseña`, el botón `Crear cuenta` y el texto `¿Ya tienes cuenta?` con el enlace `Inicia sesión`

#### Scenario: Ir al inicio de sesión
- **WHEN** una persona pulsa `Inicia sesión`
- **THEN** la aplicación la lleva a `/login`

### Requirement: Comprobación local de contraseñas

La aplicación SHALL comprobar antes de contactar con el servidor que los dos campos de contraseña son idénticos.

#### Scenario: Contraseñas distintas
- **WHEN** una persona envía el formulario con un texto distinto en `Contraseña` y `Repite la contraseña`
- **THEN** ve `Las contraseñas no coinciden.` bajo `Repite la contraseña` y no se envía ninguna petición, aunque otros campos también tengan errores

### Requirement: Envío del registro

La aplicación SHALL iniciar la sesión y llevar al perfil cuando el servidor acepte el registro.

#### Scenario: Envío en curso
- **WHEN** una persona envía el formulario con contraseñas idénticas y el servidor aún no ha respondido
- **THEN** el botón muestra `Creando cuenta…` y está deshabilitado

#### Scenario: Registro aceptado
- **WHEN** el servidor acepta el registro
- **THEN** la aplicación lleva a la persona a `/profile` con la sesión iniciada

#### Scenario: Nombre en blanco
- **WHEN** una persona se registra con `Nombre completo` vacío o formado solo por espacios
- **THEN** el registro se acepta y su perfil muestra `Sin nombre`

### Requirement: Errores de validación del registro

La aplicación SHALL mostrar los errores de validación del registro bajo el campo al que corresponden, sin aviso general.

#### Scenario: Email ya registrado
- **WHEN** el servidor rechaza el registro porque el email ya existe
- **THEN** la persona ve `Ese email ya está registrado. Inicia sesión en su lugar.` bajo `Email`

#### Scenario: Formulario vacío
- **WHEN** una persona envía el formulario con todos los campos vacíos
- **THEN** ve `Falta rellenar el email.`, `Falta rellenar la contraseña.` y `Falta rellenar la confirmación de la contraseña.` bajo sus campos, y ningún error bajo `Nombre completo`

#### Scenario: Email con formato no válido
- **WHEN** una persona envía un email sin formato de dirección de correo
- **THEN** ve `Introduce una dirección de email válida.` bajo `Email`

#### Scenario: Contraseña corta
- **WHEN** una persona envía la misma contraseña de menos de 8 caracteres en ambos campos
- **THEN** ve `la contraseña debe tener al menos 8 caracteres.` en lugar de la indicación de longitud y `la confirmación de la contraseña debe tener al menos 8 caracteres.` bajo `Repite la contraseña`

#### Scenario: Contraseña larga
- **WHEN** una persona envía la misma contraseña de más de 32 caracteres en ambos campos
- **THEN** ve `la contraseña no puede superar los 32 caracteres.` en lugar de la indicación de longitud y `la confirmación de la contraseña no puede superar los 32 caracteres.` bajo `Repite la contraseña`

### Requirement: Fallos de comunicación en los formularios

La aplicación SHALL mostrar en un aviso general los fallos de conexión y de servidor al iniciar sesión o registrarse, y SHALL volver a habilitar el botón de envío.

#### Scenario: Servidor inalcanzable
- **WHEN** una persona envía uno de los formularios y no se puede conectar con el servidor
- **THEN** ve el aviso `No se pudo conectar con el servidor. Comprueba que el backend está arrancado.`

#### Scenario: Error del servidor
- **WHEN** una persona envía uno de los formularios y el servidor responde con un error interno
- **THEN** ve el aviso `Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.`

### Requirement: Persistencia de la sesión

La aplicación SHALL guardar la sesión en el navegador y restaurarla al cargar si el servidor sigue aceptándola.

#### Scenario: Recarga con sesión válida
- **WHEN** una persona con sesión iniciada recarga la página o vuelve a abrir la aplicación en el mismo navegador y el servidor acepta su sesión
- **THEN** ve su perfil sin volver a introducir credenciales

### Requirement: Sesión rechazada por el servidor

La aplicación SHALL eliminar la sesión guardada cuando el servidor la rechace al restaurarla.

#### Scenario: Sesión rechazada
- **WHEN** una persona abre `/profile` con una sesión guardada que el servidor rechaza como no autorizada
- **THEN** la aplicación la lleva a `/login` con el aviso `Tu sesión ha caducado. Vuelve a iniciar sesión.` y al recargar no intenta restaurar esa sesión

### Requirement: Fallo transitorio al restaurar la sesión

La aplicación SHALL conservar la sesión guardada, aunque trate a la persona como si no tuviera sesión, cuando no pueda comprobarla por un fallo de conexión o de servidor.

#### Scenario: Servidor inalcanzable al restaurar
- **WHEN** una persona abre `/profile` con una sesión guardada y no se puede conectar con el servidor
- **THEN** la aplicación la lleva a `/login` con el aviso `No se pudo conectar con el servidor. Comprueba que el backend está arrancado.`

#### Scenario: Error del servidor al restaurar
- **WHEN** una persona abre `/profile` con una sesión guardada y el servidor responde con un error interno
- **THEN** la aplicación la lleva a `/login` con el aviso `Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.`

#### Scenario: Recuperación al recargar
- **WHEN** tras un fallo de ese tipo la persona recarga la página, el servidor ya responde y acepta la sesión guardada
- **THEN** ve su perfil sin volver a introducir credenciales

### Requirement: Aviso de sesión perdida

La aplicación SHALL mostrar el motivo de la pérdida de sesión solo en `/login`, y SHALL darle prioridad al error general del intento actual.

#### Scenario: Pérdida de sesión desde el registro
- **WHEN** una persona abre `/register` y falla la restauración de su sesión guardada
- **THEN** ve el formulario de registro sin ningún aviso

#### Scenario: El aviso se conserva al pasar a inicio de sesión
- **WHEN** tras ese fallo la persona pulsa `Inicia sesión`
- **THEN** ve en `/login` el aviso con el motivo de la pérdida de sesión

#### Scenario: Error general del intento actual
- **WHEN** hay un aviso de sesión perdida en `/login` y la persona envía credenciales que el servidor rechaza
- **THEN** ve `El email o la contraseña no son correctos.` en lugar del aviso de sesión perdida

#### Scenario: Error de campo del intento actual
- **WHEN** hay un aviso de sesión perdida en `/login` y la persona envía el formulario con un error de validación de campo
- **THEN** ve el error bajo el campo y el aviso de sesión perdida sigue visible

#### Scenario: Envío en curso con aviso previo
- **WHEN** hay un aviso de sesión perdida en `/login`, la persona envía el formulario y el servidor aún no ha respondido
- **THEN** sigue viendo el aviso de sesión perdida

#### Scenario: Entrada correcta
- **WHEN** hay un aviso de sesión perdida y la persona inicia sesión o se registra correctamente
- **THEN** el aviso desaparece y no vuelve a mostrarse por esa pérdida de sesión

### Requirement: Pantalla de perfil

La aplicación SHALL mostrar en `/profile` los datos de la cuenta en modo de solo lectura.

#### Scenario: Cuenta con nombre
- **WHEN** una persona con sesión y nombre abre `/profile`
- **THEN** ve sus iniciales en un círculo, su nombre, su email, la etiqueta `Miembro desde` con la fecha de alta en formato largo en español (por ejemplo, `3 de noviembre de 2026`) y el botón `Cerrar sesión`

#### Scenario: Cuenta sin nombre
- **WHEN** una persona con sesión y sin nombre abre `/profile`
- **THEN** ve `Sin nombre` en el lugar del nombre

#### Scenario: Acciones disponibles
- **WHEN** una persona con sesión consulta `/profile`
- **THEN** la única acción que se le ofrece es `Cerrar sesión`

### Requirement: Cierre de sesión en pantalla

La aplicación SHALL cerrar la sesión en el navegador sin esperar la respuesta del servidor ni depender de ella.

#### Scenario: Cerrar sesión
- **WHEN** una persona pulsa `Cerrar sesión`
- **THEN** la aplicación la lleva a `/login` sin ningún aviso

#### Scenario: Fallo del servidor al cerrar
- **WHEN** una persona pulsa `Cerrar sesión` y la petición al servidor falla
- **THEN** no ve ningún error y su sesión en ese navegador queda cerrada igualmente

#### Scenario: Volver al perfil tras salir
- **WHEN** una persona ha cerrado sesión e intenta volver a `/profile` con el botón de retroceso o abriendo la dirección
- **THEN** no ve datos del perfil: el retroceso no vuelve a `/profile`, porque esa entrada ya no está en el historial, y abrir la dirección la lleva a `/login`

### Requirement: Sesión sin revalidación durante el uso

La aplicación SHALL comprobar una sesión guardada solo al cargar, y SHALL NOT reaccionar mientras tanto a cambios de esa sesión hechos en otra pestaña o en el servidor.

#### Scenario: Cierre en otra pestaña
- **WHEN** una persona tiene `/profile` abierto en dos pestañas y cierra sesión en una de ellas
- **THEN** la otra pestaña sigue mostrando el perfil hasta que se recarga

#### Scenario: Salir con una sesión ya revocada
- **WHEN** una pestaña sigue mostrando el perfil de una sesión ya revocada y la persona pulsa `Cerrar sesión`
- **THEN** la aplicación la lleva a `/login` sin ningún error

## Parte B: las tres listas

### 1. Requisitos escritos por el agente y comprobados en el código

- Escritos por el agente: 31
- Comprobados: 31, mediante tests

### 2. Incoherencias que aparecieron al escribirla

- El cierre de sesión responde sin `data`, y el resto de respuestas correctas lo llevan: `backend/app/controllers/access_tokens_controller.ts:25-27`.
- Conviven tres formas de error: `{ errors: [{ message, rule, field }] }` en 422, `{ errors: [{ message }] }` en 400 y 401, y `{ message }` en 500 en producción.
- El límite de 254 caracteres del email nunca se aplica, porque la regla de formato ya rechaza esos emails antes: `backend/app/validators/user.ts:6`.
- La pantalla dice `Tu sesión ha caducado`, pero los tokens no caducan: `frontend/src/lib/api.ts:77` frente a `backend/app/models/user.ts:8`.
- Al iniciar sesión, un email demasiado largo da 422 y una contraseña demasiado larga da 400: `backend/app/validators/user.ts:24-25`.
- El navegador compara las contraseñas sin recortar y el servidor las recorta: `frontend/src/pages/register-page.tsx:34`.
- Los campos declaran `required`, pero el formulario lleva `noValidate` y no actúa: `frontend/src/pages/login-page.tsx:35` y `frontend/src/pages/register-page.tsx:55`.
- Unos errores de campo empiezan en mayúscula y otros en minúscula: `frontend/src/lib/api.ts:59` frente a `frontend/src/lib/api.ts:61`.
- `Cerrando sesión…` no llega a verse, porque la pantalla redirige antes: `frontend/src/pages/profile-page.tsx:67`.
- El login promete `volver a tus tareas` y lleva al perfil: `frontend/src/pages/login-page.tsx:33`.
- El PRD pide crear la cuenta con nombre y la pantalla lo marca como opcional: `docs/prd/flowsync-mvp.md:150` frente a `frontend/src/pages/register-page.tsx:64`.
- `.env.example` ofrece `CORS_ORIGIN` y la configuración no lo lee: `backend/.env.example:18` frente a `backend/config/cors.ts`.

### 3. Lo que no supe decidir si era un bug o el contrato

- **Middleware de autenticación:** quitado de las rutas protegidas, la API responde igual en todos los escenarios. Puede ser defensa en profundidad o una capa redundante, y desde fuera las dos implementaciones son indistinguibles.
- **Cierre de sesión con fallo de red:** puede bastar con cerrar la sesión en el navegador, como dice un comentario del código, o ser un bug, porque el token sigue vigente en el servidor y no caduca. El código muestra la decisión, no si se aceptó ese riesgo.
- **Tokens sin caducidad:** puede ser sesión persistente deliberada o un olvido, porque existe la columna `expires_at` y la pantalla habla de caducidad. Nada en el repo dice cuál de las dos.
- **Recorte de contraseñas:** puede ser una normalización aceptada o una alteración silenciosa de lo que escribe la persona. Viene de un valor por defecto de la librería, sin rastro de que alguien lo decidiera.
- **Mayúsculas en el email:** `Ana@example.com` y `ana@example.com` son cuentas distintas. Puede ser una comparación exacta deliberada o un descuido, porque un email suele entenderse como una sola identidad, y no hay ningún requisito sobre esto.
- **Credenciales rechazadas con 400:** un comentario del frontend lo da por conocido, pero en HTTP lo esperable sería 401. El frontend depende de ese 400, así que el código no distingue contrato de costumbre.
- **Registro con 200:** es una creación y lo esperable sería 201, pero el login responde igual y el frontend solo mira si la respuesta es correcta. Nada indica si se eligió.
- **Enumeración de cuentas:** el login oculta si un email existe y el registro lo revela. Puede ser un compromiso aceptado o un hueco, y el código no explica por qué cada ruta hace una cosa.
- **Error 500 en producción:** al provocar un fallo de base de datos, `message` devuelve la consulta SQL. Puede ser el comportamiento por defecto aceptado o una fuga de información, y no hay nada que lo trate de forma explícita.
- **Iniciales:** `ana@example.com` da `AE`, con la primera letra del dominio, y `Ada  Lovelace` da `AD`. Pueden ser reglas decididas o efectos de partir el texto, y no hay comentario que indique la intención.
- **Aviso al perder la conexión:** menciona `backend` a un usuario final y lo lleva al login aunque conserva su sesión. Puede ser un mensaje pensado para desarrollo que se quedó o el comportamiento buscado, y el comentario solo justifica conservar el token.
