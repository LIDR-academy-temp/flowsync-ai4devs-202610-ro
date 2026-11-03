# Cuentas y acceso

## Purpose

Permite que una persona cree una cuenta en FlowSync, inicie y cierre sesión, consulte su perfil y mantenga la sesión entre visitas, e impide que alguien sin sesión acceda a las partes privadas de la aplicación, tanto en la API como en la interfaz.

## Requirements

### Requirement: [API-01] Registro de cuenta

> **Capa:** Backend (API)

El sistema SHALL crear una cuenta cuando reciba en `POST /api/v1/auth/signup` un nombre (texto o `null`), un email válido que no esté registrado, una contraseña de 8 a 32 caracteres y una confirmación idéntica. Tras crearla, SHALL devolver los datos públicos del usuario y un token de acceso con el que ya está autenticado.

#### Scenario: [API-01.1] Registro con datos válidos

- **WHEN** se envía `POST /api/v1/auth/signup` con `fullName: "Ada Lovelace"`, un `email` que no existe, `password` de 8 a 32 caracteres y `passwordConfirmation` igual a `password`
- **THEN** la respuesta es 200 con `{ "data": { "user": { … }, "token": "…" } }` y el token permite acceder de inmediato a las peticiones autenticadas

#### Scenario: [API-01.2] Registro sin nombre

- **WHEN** se envía la petición de registro con `fullName: null` y el resto de datos válidos
- **THEN** la respuesta es 200 y el usuario devuelto tiene `fullName: null`

#### Scenario: [API-01.3] Falta la clave del nombre

- **WHEN** se envía la petición de registro sin la clave `fullName` en el cuerpo
- **THEN** la respuesta es 422 con un error de regla `required` sobre `fullName` y no se crea la cuenta

---

### Requirement: [API-02] Validación del registro

> **Capa:** Backend (API)

El sistema SHALL rechazar con un 422 cualquier registro con datos inválidos, sin crear la cuenta. La respuesta SHALL incluir `{ "errors": [ … ] }`, y cada error SHALL indicar `message`, `rule`, `field` y, si corresponde, `meta`.

#### Scenario: [API-02.1] Email ya registrado

- **WHEN** se envía la petición de registro con un `email` que ya pertenece a otra cuenta, escrito exactamente igual
- **THEN** la respuesta es 422 con un error de regla `database.unique` sobre `email`

#### Scenario: [API-02.2] Email que solo difiere en mayúsculas

- **WHEN** existe una cuenta con `ada@flowsync.dev` y se envía un registro con `Ada@flowsync.dev`
- **THEN** la respuesta es 200 y se crea una segunda cuenta independiente

#### Scenario: [API-02.3] Email con formato inválido o demasiado largo

- **WHEN** se envía la petición de registro con un `email` sin formato de email o de más de 254 caracteres
- **THEN** la respuesta es 422 con un error de regla `email` o `maxLength` sobre `email`

#### Scenario: [API-02.4] Contraseña fuera de rango

- **WHEN** se envía la petición de registro con una `password` de menos de 8 o de más de 32 caracteres
- **THEN** la respuesta es 422 con un error de regla `minLength` o `maxLength` sobre `password`

#### Scenario: [API-02.5] Confirmación distinta

- **WHEN** se envía la petición de registro con una `passwordConfirmation` distinta de `password`
- **THEN** la respuesta es 422 con un error de regla `sameAs` sobre `passwordConfirmation`

#### Scenario: [API-02.6] Nombre vacío aceptado

- **WHEN** se envía la petición de registro con `fullName: ""` o solo con espacios, y el resto de datos válidos
- **THEN** la respuesta es 200 y el nombre se guarda tal cual

---

### Requirement: [API-03] Inicio de sesión

> **Capa:** Backend (API)

El sistema SHALL emitir un token de acceso nuevo cuando reciba en `POST /api/v1/auth/login` un email y una contraseña que coincidan con una cuenta. Los tokens emitidos antes SHALL seguir siendo válidos. Los tokens SHALL NOT caducar por tiempo. El login SHALL NOT aplicar a la contraseña las reglas de longitud del registro, para no revelar a quien intenta entrar ninguna pista sobre la política de contraseñas ni sobre cómo se procesan.

#### Scenario: [API-03.1] Credenciales correctas

- **WHEN** existe una cuenta y se envía `POST /api/v1/auth/login` con su `email` y su `password` correctos
- **THEN** la respuesta es 200 con `{ "data": { "user": { … }, "token": "…" } }`, y el token devuelto es distinto de los anteriores

#### Scenario: [API-03.2] Sesiones simultáneas

- **WHEN** el mismo usuario inicia sesión dos veces y obtiene dos tokens
- **THEN** ambos tokens permiten acceder a las peticiones autenticadas

#### Scenario: [API-03.3] Credenciales incorrectas

- **WHEN** se envía la petición de login con un `email` que no existe, o con un `email` existente y una `password` incorrecta
- **THEN** la respuesta es 400 en ambos casos, sin indicar cuál de los dos datos ha fallado, y no se emite ningún token

#### Scenario: [API-03.4] Datos de login inválidos

- **WHEN** se envía la petición de login sin `email` o `password`, o con un `email` sin formato válido
- **THEN** la respuesta es 422 con los errores de validación por campo

#### Scenario: [API-03.5] Contraseña de login sin límite de longitud

- **WHEN** se envía la petición de login con una `password` de más de 32 caracteres
- **THEN** la petición no se rechaza por longitud y se responde como a unas credenciales normales (200 si coinciden, 400 si no)

---

### Requirement: [API-04] Consulta del perfil

> **Capa:** Backend (API)

El sistema SHALL devolver, en `GET /api/v1/account/profile`, los datos públicos del usuario dueño del token enviado en `Authorization: Bearer <token>`.

#### Scenario: [API-04.1] Token válido

- **WHEN** se envía `GET /api/v1/account/profile` con un token válido
- **THEN** la respuesta es 200 con `{ "data": { "id", "fullName", "email", "createdAt", "updatedAt", "initials" } }` de ese usuario

---

### Requirement: [API-05] Datos públicos del usuario

> **Capa:** Backend (API)

Toda respuesta que incluya un usuario SHALL contener exactamente `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`, y SHALL NOT incluir la contraseña ni su hash.

#### Scenario: [API-05.1] La contraseña nunca se expone

- **WHEN** se registra una cuenta, se inicia sesión o se consulta el perfil
- **THEN** el objeto de usuario de la respuesta no contiene ningún campo con la contraseña

#### Scenario: [API-05.2] Iniciales a partir del nombre

- **WHEN** el usuario tiene `fullName: "Ada Lovelace"` o `fullName: "Ana María López"`
- **THEN** `initials` es `"AL"` en el primer caso y `"AM"` en el segundo: la inicial de las dos primeras palabras, en mayúsculas

#### Scenario: [API-05.3] Iniciales con una sola palabra

- **WHEN** el usuario tiene `fullName: "Ada"`
- **THEN** `initials` es `"AD"`: los dos primeros caracteres en mayúsculas

#### Scenario: [API-05.4] Iniciales sin nombre

- **WHEN** el usuario tiene `fullName: null` o `""` y su email es `ada@flowsync.dev`
- **THEN** `initials` es `"AF"`: la primera letra de lo que hay antes y después de la `@`

---

### Requirement: [API-06] Cierre de sesión

> **Capa:** Backend (API)

El sistema SHALL invalidar, en `POST /api/v1/account/logout`, únicamente el token con el que se hace la petición. Las demás sesiones abiertas del mismo usuario SHALL seguir activas: cerrar sesión afecta solo a la sesión desde la que se solicita.

#### Scenario: [API-06.1] Logout con token válido

- **WHEN** se envía `POST /api/v1/account/logout` con un token válido
- **THEN** la respuesta es 200 con `{ "message": "Logged out successfully" }`, sin envoltorio `data`, y una petición posterior con ese mismo token recibe 401

#### Scenario: [API-06.2] Otros tokens siguen activos

- **WHEN** el usuario tiene dos tokens válidos y cierra sesión con uno de ellos
- **THEN** el otro token sigue permitiendo acceder a las peticiones autenticadas

---

### Requirement: [API-07] Protección de la API

> **Capa:** Backend (API)

El sistema SHALL responder 401 a cualquier petición a las operaciones de cuenta (`/api/v1/account/*`) que no lleve un token válido.

#### Scenario: [API-07.1] Sin token

- **WHEN** se envía `GET /api/v1/account/profile` o `POST /api/v1/account/logout` sin cabecera `Authorization`
- **THEN** la respuesta es 401

#### Scenario: [API-07.2] Token inválido o revocado

- **WHEN** se envía una petición a una operación de cuenta con un token inventado o con uno ya cerrado mediante logout
- **THEN** la respuesta es 401

---

### Requirement: [API-08] Formato de respuesta de la API

> **Capa:** Backend (API)

El sistema SHALL responder siempre en JSON. Las respuestas correctas de registro, login y perfil SHALL ir envueltas en `{ "data": … }`.

#### Scenario: [API-08.1] Respuesta JSON aunque el cliente no la pida

- **WHEN** se envía una petición a la API sin cabecera `Accept` o con `Accept: text/html`
- **THEN** la respuesta, sea de éxito o de error, es JSON

---

### Requirement: [UI-01] Pantalla de registro

> **Capa:** Frontend (interfaz)

La aplicación SHALL ofrecer un formulario «Crea tu cuenta» con los campos «Nombre completo (opcional)», «Email», «Contraseña» (con la pista «Entre 8 y 32 caracteres.») y «Repite la contraseña», además de un enlace «¿Ya tienes cuenta? Inicia sesión» que lleva a la pantalla de inicio de sesión.

#### Scenario: [UI-01.1] Registro correcto

- **WHEN** un visitante sin sesión rellena el formulario con datos válidos y pulsa «Crear cuenta»
- **THEN** queda con la sesión iniciada y ve su perfil, sin ningún paso adicional

#### Scenario: [UI-01.2] Contraseñas que no coinciden

- **WHEN** un visitante escribe dos contraseñas distintas y pulsa «Crear cuenta»
- **THEN** ve «Las contraseñas no coinciden.» bajo «Repite la contraseña» y no se envía ninguna petición al servidor

#### Scenario: [UI-01.3] Email ya registrado

- **WHEN** un visitante intenta registrarse con un email que ya existe
- **THEN** ve «Ese email ya está registrado. Inicia sesión en su lugar.» bajo el campo «Email»

#### Scenario: [UI-01.4] Contraseña demasiado corta

- **WHEN** un visitante intenta registrarse con una contraseña de menos de 8 caracteres
- **THEN** ve «la contraseña debe tener al menos 8 caracteres.» bajo «Contraseña», en lugar de la pista

#### Scenario: [UI-01.5] Nombre en blanco

- **WHEN** un visitante deja el nombre vacío o escribe solo espacios y se registra
- **THEN** la cuenta se crea sin nombre, y en el perfil aparece «Sin nombre» con iniciales sacadas del email

#### Scenario: [UI-01.6] Envío en curso

- **WHEN** un visitante pulsa «Crear cuenta» y el servidor aún no ha respondido
- **THEN** el botón muestra «Creando cuenta…» y no se puede volver a pulsar

---

### Requirement: [UI-02] Pantalla de inicio de sesión

> **Capa:** Frontend (interfaz)

La aplicación SHALL ofrecer un formulario «Inicia sesión» con los campos «Email» y «Contraseña», además de un enlace «¿Aún no tienes cuenta? Crea una» que lleva a la pantalla de registro.

#### Scenario: [UI-02.1] Login correcto

- **WHEN** un visitante sin sesión introduce credenciales correctas y pulsa «Entrar»
- **THEN** queda con la sesión iniciada y ve su perfil

#### Scenario: [UI-02.2] Credenciales incorrectas

- **WHEN** un visitante introduce un email inexistente o una contraseña errónea y pulsa «Entrar»
- **THEN** ve el aviso «El email o la contraseña no son correctos.» y sigue sin sesión

#### Scenario: [UI-02.3] Email con formato inválido

- **WHEN** un visitante escribe un email sin formato válido y pulsa «Entrar»
- **THEN** ve «Introduce una dirección de email válida.» bajo el campo «Email»

#### Scenario: [UI-02.4] Envío en curso

- **WHEN** un visitante pulsa «Entrar» y el servidor aún no ha respondido
- **THEN** el botón muestra «Entrando…» y no se puede volver a pulsar

#### Scenario: [UI-02.5] Explicación de una sesión perdida

- **WHEN** un usuario llega a la pantalla de inicio de sesión porque su sesión anterior no se pudo restaurar, y aún no ha hecho ningún intento
- **THEN** ve como aviso el motivo, por ejemplo «Tu sesión ha caducado. Vuelve a iniciar sesión.»

---

### Requirement: [UI-03] Pantalla de perfil

> **Capa:** Frontend (interfaz)

La aplicación SHALL mostrar al usuario con sesión un círculo con sus iniciales, su nombre (o «Sin nombre» si no tiene), su email, la fecha «Miembro desde» en formato largo en español y un botón «Cerrar sesión».

#### Scenario: [UI-03.1] Ver el perfil

- **WHEN** un usuario con sesión, llamado «Ada Lovelace» y registrado el 2 de noviembre de 2026, abre su perfil
- **THEN** ve «AL», «Ada Lovelace», su email y «Miembro desde 2 de noviembre de 2026»

---

### Requirement: [UI-04] Cierre de sesión en la interfaz

> **Capa:** Frontend (interfaz)

La aplicación SHALL cerrar la sesión en el navegador en cuanto el usuario pulse «Cerrar sesión», aunque el servidor no confirme el cierre.

#### Scenario: [UI-04.1] Cerrar sesión

- **WHEN** un usuario con sesión pulsa «Cerrar sesión» en su perfil
- **THEN** el botón muestra «Cerrando sesión…», el usuario acaba en la pantalla de inicio de sesión y su token deja de ser válido en el servidor

#### Scenario: [UI-04.2] Volver atrás tras cerrar sesión

- **WHEN** un usuario ha cerrado sesión y pulsa «atrás» en el navegador
- **THEN** no ve su perfil y vuelve a la pantalla de inicio de sesión

#### Scenario: [UI-04.3] Servidor caído al cerrar sesión

- **WHEN** un usuario pulsa «Cerrar sesión» con el servidor inaccesible
- **THEN** la sesión se cierra igualmente en el navegador y no se muestra ningún error

---

### Requirement: [UI-05] Persistencia de la sesión

> **Capa:** Frontend (interfaz)

La aplicación SHALL conservar la sesión entre recargas y entre cierres de pestaña o de navegador, y SHALL comprobar con el servidor que sigue siendo válida antes de mostrar contenido privado.

#### Scenario: [UI-05.1] Recargar con sesión válida

- **WHEN** un usuario con sesión recarga la página o la vuelve a abrir más tarde
- **THEN** ve un indicador de carga y después su perfil, sin volver a introducir credenciales

#### Scenario: [UI-05.2] Sesión rechazada por el servidor

- **WHEN** un usuario abre la aplicación con una sesión guardada que el servidor ya no reconoce
- **THEN** la sesión guardada se descarta y el usuario ve la pantalla de inicio de sesión con el aviso «Tu sesión ha caducado. Vuelve a iniciar sesión.»

#### Scenario: [UI-05.3] Servidor inaccesible al abrir

- **WHEN** un usuario abre la aplicación con una sesión guardada y el servidor no responde
- **THEN** ve la pantalla de inicio de sesión con el aviso «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.», la sesión guardada se conserva y, si recarga con el servidor ya disponible, vuelve a entrar sin credenciales

---

### Requirement: [UI-06] Protección de pantallas

> **Capa:** Frontend (interfaz)

La aplicación SHALL mostrar el perfil solo a usuarios con sesión, y las pantallas de registro e inicio de sesión solo a visitantes sin sesión. Mientras comprueba la sesión, SHALL mostrar un indicador de carga en lugar de redirigir.

#### Scenario: [UI-06.1] Visitante sin sesión intenta ver el perfil

- **WHEN** un visitante sin sesión abre la dirección del perfil
- **THEN** acaba en la pantalla de inicio de sesión

#### Scenario: [UI-06.2] Usuario con sesión abre registro o login

- **WHEN** un usuario con sesión abre la pantalla de registro o la de inicio de sesión
- **THEN** acaba en su perfil

#### Scenario: [UI-06.3] Dirección desconocida

- **WHEN** alguien abre una dirección que la aplicación no conoce
- **THEN** acaba en el perfil si tiene sesión, o en la pantalla de inicio de sesión si no la tiene

---

### Requirement: [UI-07] Mensajes de error comprensibles

> **Capa:** Frontend (interfaz)

La aplicación SHALL mostrar los errores en español. Los errores de un campo SHALL aparecer bajo ese campo, marcado como inválido para tecnologías de asistencia, y los errores generales SHALL aparecer como aviso encima del formulario.

#### Scenario: [UI-07.1] Servidor inaccesible al enviar un formulario

- **WHEN** un visitante envía el formulario de registro o de inicio de sesión con el servidor caído
- **THEN** ve el aviso «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

#### Scenario: [UI-07.2] Error inesperado del servidor

- **WHEN** el servidor responde con un error que no es de validación, de credenciales ni de sesión
- **THEN** el visitante ve el aviso «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.»

#### Scenario: [UI-07.3] Errores en campos visibles

- **WHEN** todos los errores de validación que devuelve el servidor corresponden a campos que la pantalla muestra
- **THEN** cada error aparece bajo su campo y no se muestra ningún aviso general

#### Scenario: [UI-07.4] Error en un campo que no está en pantalla

- **WHEN** el servidor devuelve un error de validación sobre un dato que la pantalla no muestra
- **THEN** el mensaje aparece como aviso general encima del formulario

---

## 1. Requisitos generados y comprobados

| Capa | Requisitos | Escenarios |
|---|---|---|
| Backend (API) | 8 (API-01 … API-08) | 24 |
| Frontend (interfaz) | 7 (UI-01 … UI-07) | 25 |
| **Total** | **15** | **49** |

Todos se han generado leyendo el código y se han comprobado contra él a mano. Ninguno está verificado con tests automáticos: el backend no tiene tests escritos y el frontend no tiene herramienta de tests instalada.

## 2. Incoherencias detectadas

Comportamientos actuales que se contradicen entre sí, con el resto del sistema o con el PRD. Se documentan tal cual; el código no se ha modificado.

| ID | Incoherencia | Requisitos afectados |
|---|---|---|
| INC-01 | **El email distingue mayúsculas.** `ada@flowsync.dev` y `Ada@flowsync.dev` pueden ser dos cuentas distintas, y el login exige escribir el email exactamente igual que en el registro. Contradice el uso habitual del email como identificador único de una persona. | API-02.1, API-02.2, API-03.3 |
| INC-03 | **La respuesta de logout no sigue el formato del resto de la API.** Todas las respuestas correctas van envueltas en `{ "data": … }` salvo la de logout, que además es la única con un mensaje en inglés. | API-06.1, API-08 |
| INC-04 | **El nombre se trata distinto según quién llame.** La interfaz convierte un nombre vacío o con solo espacios en «sin nombre»; la API llamada directamente lo guarda tal cual. En ese caso el perfil muestra el título en blanco en lugar de «Sin nombre», y un nombre de solo espacios produce iniciales vacías, con lo que el círculo del avatar aparece sin letras. | API-02.6, API-05, UI-01.5, UI-03 |
| INC-05 | **El nombre es «opcional», pero la clave es obligatoria.** La interfaz lo marca como opcional y la API acepta `fullName: null`, pero rechaza con un 422 `required` una petición que no lleve la clave `fullName`. Si se decide que el nombre es opcional, omitir la clave debería tratarse igual que enviar `null` (ver NC-01). | API-01.2, API-01.3, UI-01 |
| INC-06 | **«Tu sesión ha caducado» con tokens que no caducan.** Los tokens no tienen fecha de caducidad, pero ante cualquier rechazo de la sesión el usuario lee que ha caducado, también cuando se cerró desde otro sitio o el token nunca fue válido. | API-03, UI-02.5, UI-05.2 |
| INC-08 | **Validación en el navegador a medias.** La interfaz comprueba antes de enviar que las dos contraseñas coinciden, pero no comprueba la longitud que ella misma anuncia («Entre 8 y 32 caracteres.»): para eso hace falta ir al servidor. | UI-01.2, UI-01.4 |
| INC-09 | **Mayúsculas inconsistentes en los mensajes.** Los errores de longitud empiezan en minúscula («la contraseña debe tener al menos 8 caracteres.»), mientras que el resto de mensajes empiezan en mayúscula. | UI-01.4, UI-07 |
| INC-10 | **Con el servidor caído se pide iniciar sesión sin necesidad.** Al abrir la aplicación sin servidor, el usuario ve la pantalla de inicio de sesión aunque su sesión siga guardada y sea válida; basta con recargar más tarde. El aviso, además, usa lenguaje técnico («Comprueba que el backend está arrancado»). | UI-05.3, UI-07.1 |
| INC-11 | **Diferencias con el PRD (RF-1): espacio compartido.** El PRD dice que tras registrarse se entra en el «espacio compartido», que no existe: se llega al perfil, que es la única pantalla privada. La otra diferencia con RF-1, el nombre opcional, está pendiente de decisión en NC-01. | API-01, UI-01.1 |

## 3. Comportamientos que no supiste clasificar como bug o contrato

Comportamientos actuales sobre los que falta una decisión de producto para saber si son el contrato o un defecto.

| ID | Comportamiento | Si es contrato… | Si es bug… | Requisitos afectados |
|---|---|---|---|---|
| NC-01 | **Se puede crear una cuenta sin nombre.** La API acepta `fullName: null` y la pantalla de registro marca el nombre como «(opcional)». El perfil muestra entonces «Sin nombre» y saca las iniciales del email. El código lo trata como opcional de forma explícita y coherente en las dos capas, así que no se puede deducir de él que deba ser obligatorio. | Registrarse cuesta un campo menos, y el nombre se podría completar más adelante, aunque hoy no existe ninguna forma de editarlo. | El PRD (RF-1) pide registrarse con nombre, email y contraseña. Sin nombre, en un producto de equipo, los compañeros solo verían el email de esa persona (por ejemplo, como responsable de una tarea). | API-01.2, UI-01, UI-01.5, UI-03 |
