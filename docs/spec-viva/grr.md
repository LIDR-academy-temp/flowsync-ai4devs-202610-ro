# Cuentas y acceso

## Purpose

Permitir que una persona cree su cuenta en FlowSync, inicie y cierre sesión, y consulte su perfil, de forma que solo quien tiene una sesión válida accede a las partes privadas de la aplicación.

## Requirements

### Requirement: Registro de cuenta por la API

El sistema SHALL crear una cuenta cuando recibe en `POST /api/v1/auth/signup` un nombre completo (que puede ser nulo), un email no registrado y una contraseña repetida dos veces, y SHALL devolver en la misma respuesta los datos públicos del usuario y un token de acceso.

#### Scenario: Registro correcto

- **WHEN** se envía `fullName`, `email` con formato válido y no registrado, `password` de entre 8 y 32 caracteres y `passwordConfirmation` igual a `password`
- **THEN** la respuesta tiene estado 200 y un cuerpo `{ "data": { "user": {...}, "token": "..." } }`, donde `user` contiene `id`, `fullName`, `email`, `initials`, `createdAt` y `updatedAt`, y nunca la contraseña

#### Scenario: Registro sin nombre

- **WHEN** se envía `fullName: null` con el resto de campos válidos
- **THEN** la cuenta se crea y el usuario devuelto tiene `fullName: null`

#### Scenario: Registro omitiendo la clave del nombre

- **WHEN** se envía la petición sin la clave `fullName` (ni siquiera con valor nulo)
- **THEN** la respuesta tiene estado 422 y un error de campo obligatorio sobre `fullName`

### Requirement: Validación del registro

El sistema SHALL rechazar con estado 422 un registro cuyos datos no cumplan las reglas, devolviendo `{ "errors": [...] }` con un elemento por fallo que indica el campo y la regla incumplida.

#### Scenario: Email ya registrado

- **WHEN** se envía un `email` idéntico al de una cuenta existente
- **THEN** la respuesta es 422 con un error de unicidad sobre `email` y no se crea ninguna cuenta

#### Scenario: Email con formato inválido o demasiado largo

- **WHEN** el `email` no tiene formato de email o supera los 254 caracteres
- **THEN** la respuesta es 422 con un error sobre `email`

#### Scenario: Contraseña fuera de longitud

- **WHEN** `password` tiene menos de 8 o más de 32 caracteres
- **THEN** la respuesta es 422 con un error de longitud sobre `password`

#### Scenario: Confirmación distinta

- **WHEN** `passwordConfirmation` no coincide con `password`
- **THEN** la respuesta es 422 con un error sobre `passwordConfirmation`

### Requirement: El email se guarda y se compara tal cual

El sistema SHALL guardar el email tal como se envía, sin más cambio que quitar los espacios de los extremos, y SHALL compararlo distinguiendo mayúsculas de minúsculas, tanto al comprobar si ya está registrado como al iniciar sesión.

#### Scenario: Mismo email con otras mayúsculas en el registro

- **WHEN** ya existe una cuenta con `ada@flowsync.dev` y se registra `Ada@FlowSync.dev` con el resto de campos válidos
- **THEN** la respuesta es 200 y se crea una segunda cuenta, independiente de la primera

#### Scenario: Inicio de sesión con otras mayúsculas

- **WHEN** la cuenta se registró como `ada@flowsync.dev` y se inicia sesión con `ADA@flowsync.dev` y la contraseña correcta
- **THEN** la respuesta es 400, igual que con unas credenciales incorrectas

#### Scenario: Email con espacios alrededor enviado a la API

- **WHEN** se envía a la API un `email` con espacios al principio o al final
- **THEN** los espacios se recortan antes de validar y la petición se trata como si el email hubiera llegado sin ellos

### Requirement: Inicio de sesión por la API

El sistema SHALL emitir un token de acceso nuevo cuando recibe en `POST /api/v1/auth/login` un email y una contraseña que corresponden a una cuenta existente.

#### Scenario: Credenciales correctas

- **WHEN** se envían el `email` y la `password` de una cuenta existente
- **THEN** la respuesta es 200 con `{ "data": { "user": {...}, "token": "..." } }`, con el mismo formato de usuario que el registro

#### Scenario: Credenciales incorrectas

- **WHEN** el email no corresponde a ninguna cuenta, o la contraseña no es la de esa cuenta
- **THEN** la respuesta es 400, sin indicar cuál de los dos datos falló

#### Scenario: Email con formato inválido en el login

- **WHEN** el `email` no tiene formato de email
- **THEN** la respuesta es 422 con un error sobre `email`, antes de comprobar ninguna credencial

#### Scenario: Varias sesiones a la vez

- **WHEN** la misma cuenta inicia sesión varias veces
- **THEN** cada inicio de sesión devuelve un token distinto y todos siguen siendo válidos a la vez

### Requirement: Acceso autenticado con token

El sistema SHALL aceptar en las rutas de cuenta un token enviado en la cabecera `Authorization: Bearer <token>` y SHALL rechazar con estado 401 las peticiones sin token o con un token que no reconoce.

#### Scenario: Petición sin token

- **WHEN** se llama a `GET /api/v1/account/profile` o `POST /api/v1/account/logout` sin cabecera `Authorization`
- **THEN** la respuesta es 401 con `{ "errors": [{ "message": ... }] }`

#### Scenario: Token revocado

- **WHEN** se usa un token sobre el que ya se cerró sesión
- **THEN** la respuesta es 401

#### Scenario: Antigüedad del token

- **WHEN** se usa un token válido días o semanas después de emitirlo, sin haber cerrado sesión
- **THEN** el token sigue siendo aceptado: no caduca por tiempo

### Requirement: Consulta del perfil

El sistema SHALL devolver en `GET /api/v1/account/profile` los datos públicos del usuario dueño del token.

#### Scenario: Perfil con sesión válida

- **WHEN** se llama con un token válido
- **THEN** la respuesta es 200 con `{ "data": { "id", "fullName", "email", "initials", "createdAt", "updatedAt" } }`

### Requirement: Iniciales del usuario

El sistema SHALL calcular unas iniciales en mayúsculas para cada usuario: la primera letra de las dos primeras palabras del nombre o, si no hay nombre, la primera letra de lo que va antes y después de la arroba del email; y las dos primeras letras de la primera palabra cuando no hay segunda.

#### Scenario: Nombre de dos palabras

- **WHEN** el usuario se llama "Ada Lovelace"
- **THEN** sus iniciales son "AL"

#### Scenario: Nombre de una sola palabra

- **WHEN** el usuario se llama "Ada"
- **THEN** sus iniciales son "AD"

#### Scenario: Sin nombre

- **WHEN** el usuario no tiene nombre y su email es "ada@flowsync.dev"
- **THEN** sus iniciales son "AF"

### Requirement: Cierre de sesión por la API

El sistema SHALL invalidar únicamente el token usado en `POST /api/v1/account/logout`, dejando intactos los demás tokens de la misma cuenta.

#### Scenario: Cierre de sesión correcto

- **WHEN** se llama con un token válido
- **THEN** la respuesta es 200 con `{ "message": "Logged out successfully" }`, sin envoltorio `data`, y ese token deja de ser aceptado

#### Scenario: Otras sesiones abiertas

- **WHEN** la cuenta tenía otro token emitido en otro inicio de sesión
- **THEN** ese otro token sigue siendo aceptado tras el cierre

### Requirement: Pantalla de registro

La aplicación SHALL ofrecer una pantalla "Crea tu cuenta" con nombre completo (marcado como opcional), email, contraseña con la pista "Entre 8 y 32 caracteres." y "Repite la contraseña", y SHALL dejar a la persona dentro de su perfil al registrarse con éxito.

#### Scenario: Registro con éxito desde la pantalla

- **WHEN** la persona rellena datos válidos y pulsa "Crear cuenta"
- **THEN** el botón muestra "Creando cuenta…" y queda deshabilitado mientras espera, y después la persona ve su perfil con la sesión iniciada

#### Scenario: Contraseñas distintas en pantalla

- **WHEN** las dos contraseñas no coinciden y la persona pulsa "Crear cuenta"
- **THEN** ve "Las contraseñas no coinciden." bajo el campo de repetición, sin que se envíe nada al servidor

#### Scenario: Nombre en blanco

- **WHEN** la persona deja el nombre vacío o con solo espacios
- **THEN** la cuenta se crea sin nombre

#### Scenario: Email ya registrado en pantalla

- **WHEN** el email ya tiene cuenta
- **THEN** la persona ve bajo el campo de email "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Enlace al login

- **WHEN** la persona pulsa "Inicia sesión" bajo el formulario
- **THEN** llega a la pantalla de inicio de sesión

### Requirement: Pantalla de inicio de sesión

La aplicación SHALL ofrecer una pantalla "Inicia sesión" con email y contraseña, y SHALL dejar a la persona en su perfil al entrar con éxito.

#### Scenario: Entrada correcta

- **WHEN** la persona introduce credenciales válidas y pulsa "Entrar"
- **THEN** el botón muestra "Entrando…" deshabilitado mientras espera, y después ve su perfil

#### Scenario: Credenciales incorrectas en pantalla

- **WHEN** las credenciales no son correctas
- **THEN** ve arriba del formulario el aviso "El email o la contraseña no son correctos."

#### Scenario: Enlace al registro

- **WHEN** la persona pulsa "Crea una" bajo el formulario
- **THEN** llega a la pantalla de registro

### Requirement: Mensajes de error en pantalla

La aplicación SHALL mostrar los errores de validación en castellano bajo el campo al que afectan, y SHALL mostrar un aviso general arriba del formulario cuando el error no corresponde a ningún campo visible.

#### Scenario: Servidor inaccesible

- **WHEN** la persona envía un formulario y el servidor no responde
- **THEN** ve el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado."

#### Scenario: Error inesperado del servidor

- **WHEN** el servidor responde con un error que no es de validación, de credenciales ni de sesión
- **THEN** ve el aviso "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento."

#### Scenario: Error sobre un campo que la pantalla no muestra

- **WHEN** el servidor devuelve un error de validación sobre un campo que no está en el formulario
- **THEN** el mensaje aparece como aviso general arriba del formulario

### Requirement: Pantalla de perfil

La aplicación SHALL mostrar a la persona con sesión iniciada sus iniciales, su nombre (o "Sin nombre" si no tiene), su email y la fecha de alta como "Miembro desde" en formato largo en castellano, junto a un botón "Cerrar sesión".

#### Scenario: Perfil de una persona sin nombre

- **WHEN** una persona registrada sin nombre abre su perfil
- **THEN** ve "Sin nombre" como título y sus iniciales calculadas a partir del email

### Requirement: Cierre de sesión en pantalla

La aplicación SHALL cerrar la sesión local en cuanto la persona pulsa "Cerrar sesión" y llevarla al inicio de sesión, aunque el servidor no confirme el cierre.

#### Scenario: Cierre de sesión con el servidor caído

- **WHEN** la persona pulsa "Cerrar sesión" y el servidor no responde
- **THEN** la persona termina en la pantalla de inicio de sesión igualmente, sin ver ningún error

### Requirement: Persistencia de la sesión en el navegador

La aplicación SHALL recordar la sesión entre recargas del navegador y SHALL validarla contra el servidor al cargar, mostrando un indicador de carga mientras tanto.

#### Scenario: Recarga con sesión válida

- **WHEN** la persona con sesión iniciada recarga la página
- **THEN** ve un indicador de carga y después sigue en la pantalla en la que estaba, sin volver a introducir credenciales

#### Scenario: Recarga con sesión rechazada

- **WHEN** al recargar, el servidor ya no reconoce la sesión guardada
- **THEN** la persona llega al inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión." y la sesión guardada se olvida

#### Scenario: Recarga con el servidor caído

- **WHEN** al recargar, el servidor no responde
- **THEN** la persona llega al inicio de sesión con el aviso de que no se pudo conectar, y la sesión guardada se conserva: al recargar cuando el servidor vuelve, entra sin introducir credenciales

### Requirement: La sesión solo se comprueba al cargar la aplicación

La aplicación SHALL comprobar la sesión contra el servidor únicamente al cargarse cada pestaña, y SHALL seguir mostrando el perfil con los datos de ese momento mientras la persona no recargue, aunque la sesión deje de ser válida entretanto.

#### Scenario: Sesión revocada desde otro lugar

- **WHEN** el token de la persona deja de ser válido en el servidor mientras está viendo su perfil
- **THEN** sigue viendo su perfil sin aviso hasta que recarga, y entonces llega al inicio de sesión con "Tu sesión ha caducado. Vuelve a iniciar sesión."

#### Scenario: Pestaña nueva con sesión iniciada

- **WHEN** la persona tiene sesión iniciada en una pestaña y abre la aplicación en otra
- **THEN** la nueva pestaña entra directamente en su perfil, sin pedir credenciales

#### Scenario: Cierre de sesión en otra pestaña

- **WHEN** la persona cierra sesión en una pestaña y otra pestaña seguía mostrando el perfil
- **THEN** la otra pestaña sigue mostrando el perfil hasta que se recarga, y entonces llega al inicio de sesión sin aviso

### Requirement: Protección de pantallas

La aplicación SHALL dejar ver el perfil solo con sesión iniciada, SHALL impedir ver el inicio de sesión y el registro con la sesión iniciada, y SHALL llevar cualquier otra dirección al perfil.

#### Scenario: Perfil sin sesión

- **WHEN** una persona sin sesión abre el perfil
- **THEN** termina en la pantalla de inicio de sesión

#### Scenario: Login o registro con sesión

- **WHEN** una persona con sesión abre el inicio de sesión o el registro
- **THEN** termina en su perfil

#### Scenario: Dirección desconocida

- **WHEN** se abre una dirección que no existe en la aplicación
- **THEN** la persona termina en el perfil si tiene sesión, o en el inicio de sesión si no la tiene

---

## Parte B

### 1. Requisitos escritos y comprobados

- Escritos por el agente: 14
- Comprobados por mí abriendo el código: 2

### 2. Incoherencias que aparecieron al escribirla

Al repasar las omisiones aparecieron varias contradicciones entre la API y la pantalla, y algunas que había dado por buenas resultaron no serlo.

- **Nombre en blanco.** Al principio creí que la API guardaba "   " tal cual y que las iniciales salían vacías. No es así: la API recorta los espacios de los extremos de todos los campos y convierte el texto vacío en nulo, igual que la pantalla. No hay incoherencia, pero la pantalla repite un recorte que la API ya hace. Se ve en el registro con un nombre solo de espacios.
- **Email con espacios.** Igual: el navegador y la API quitan los espacios de los extremos. La spec decía que la API respondía 422 en ese caso; era falso y está corregido. Se ve en el registro y en el inicio de sesión.
- **Contraseña recortada.** El mismo recorte se aplica a la contraseña: "  secreto123  " se guarda como "secreto123", y la longitud mínima de 8 se mide después de recortar. Nada en pantalla avisa de ello. Se ve en el registro y en el inicio de sesión.
- **Email duplicado.** El mensaje "Ese email ya está registrado" no encaja con que el sistema acepte el mismo email con otras mayúsculas como una cuenta nueva. Se ve registrando `ada@flowsync.dev` y `Ada@FlowSync.dev`.
- **"Sesión caducada".** Cualquier 401 se presenta como "Tu sesión ha caducado", aunque los tokens no caducan nunca: solo se invalidan al cerrar sesión. Se ve al recargar con un token revocado.
- **Perfil visible sin sesión válida.** El perfil sigue visible después de que la sesión deje de ser válida, lo que choca con el Purpose ("solo quien tiene una sesión válida accede"). Se ve con la sesión revocada desde otra pestaña.
- **Iniciales con espacios dobles.** La regla de las iniciales no se cumple con espacios dobles entre palabras: "Ada  Lovelace" da "AD" en vez de "AL". Un espacio al principio no la rompe, porque la API lo recorta. Se ve en el perfil.
- **Detalles menores.** El logout responde sin envoltorio `data` y en inglés (`POST /api/v1/account/logout`). Algunos mensajes de error empiezan en minúscula ("la contraseña debe tener al menos 8 caracteres.", en el registro). El texto "Cerrando sesión…" no llega a verse nunca, porque la sesión local se cierra y la pantalla cambia en el mismo instante (en el perfil, deducido del código, no ejecutado).

### 3. Lo que no supe decidir si era bug o contrato

En el fichero escribí como contrato dos de estos comportamientos: que el email distinga mayúsculas y que el perfil no se revalide. Los demás no están en la spec. Lo detecté al revisar el código, y en ninguno supe decidir si es un bug.

- **El email distingue mayúsculas.** Una lectura: el email identifica a una persona y `Ada@FlowSync.dev` es la misma cuenta que `ada@flowsync.dev`, así que crear dos es un bug. La otra: el sistema trata el email como una credencial opaca y lo compara tal cual a propósito. Afecta a la seguridad del acceso.
- **No hay límite de intentos de login.** Una lectura: es una omisión de seguridad que permite probar contraseñas sin freno. La otra: en un MVP de un solo equipo nadie lo pidió y no forma parte del contrato. No está en la spec.
- **El perfil no se revalida ni se sincroniza entre pestañas.** Una lectura: es una simplificación aceptable, porque la sesión se valida al cargar. La otra: contradice el propósito de la spec, porque una sesión inválida sigue viendo datos privados.

Los demás casos tienen un argumento razonable a favor de cada lectura, y tampoco están en la spec:

- **Contraseña del login sin límite de longitud.** Una lectura: debería tener el mismo límite que el registro. La otra: el login no tiene por qué validar reglas de creación, solo comprobar la credencial.
- **Token válido tras cerrar sesión con el servidor caído.** Una lectura: la persona cree haber cerrado sesión y su token sigue sirviendo para siempre en el servidor. La otra: el objetivo local (dejar de estar dentro) se cumple, y es lo que la pantalla promete.

Los tres primeros necesitan que alguien decida antes de pasar a la spec como contrato.
