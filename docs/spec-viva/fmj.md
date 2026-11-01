# Spec viva: cuentas y acceso

## Purpose

Permitir que una persona cree una cuenta, entre y salga de FlowSync, mantenga su sesión entre visitas y consulte su perfil, y que quien no tenga sesión no acceda a las pantallas privadas.

## Requirements

### Requirement: Crear una cuenta

El sistema SHALL crear una cuenta a partir de un nombre opcional, un email y una contraseña confirmada, y SHALL dejar la sesión iniciada en la misma respuesta.

#### Scenario: Registro correcto

- **WHEN** se envía `POST /api/v1/auth/signup` con un email libre y una contraseña válida confirmada
- **THEN** la respuesta es 200 y contiene, dentro de `data`, el usuario y un token de acceso

#### Scenario: Registro sin nombre

- **WHEN** se envía el registro con `fullName` a `null`, vacío o solo con espacios
- **THEN** la cuenta se crea con `fullName` a `null`

### Requirement: Validar los datos de registro

El sistema SHALL rechazar con 422 un registro con datos inválidos, y SHALL indicar en `errors` el campo y la regla de cada fallo.

#### Scenario: Falta la clave del nombre

- **WHEN** se envía el registro sin la clave `fullName`
- **THEN** la respuesta es 422 con un error de regla `required` sobre `fullName`

#### Scenario: Email con formato inválido

- **WHEN** se envía el registro con un email mal formado o de más de 254 caracteres
- **THEN** la respuesta es 422 con un error sobre `email`

#### Scenario: Contraseña fuera de longitud

- **WHEN** la contraseña tiene menos de 8 o más de 32 caracteres
- **THEN** la respuesta es 422 con un error sobre `password`

#### Scenario: Confirmación distinta

- **WHEN** la confirmación tiene una longitud válida y no coincide con la contraseña
- **THEN** la respuesta es 422 con un error de regla `sameAs` sobre `passwordConfirmation`

### Requirement: Email único según su escritura exacta

El sistema SHALL rechazar el registro de un email idéntico a uno existente, y SHALL tratar como distintos dos emails que solo difieran en mayúsculas.

#### Scenario: Email ya registrado

- **WHEN** se registra un email escrito exactamente igual que uno existente
- **THEN** la respuesta es 422 con un error de regla `database.unique` sobre `email`

#### Scenario: Mismo email con otras mayúsculas

- **WHEN** existe `a@x.com` y se registra `A@X.com`
- **THEN** se crea una segunda cuenta

### Requirement: Recortar espacios en los extremos

El sistema SHALL ignorar los espacios iniciales y finales de los textos recibidos, también en las contraseñas, antes de validarlos y de usarlos.

#### Scenario: Contraseña rodeada de espacios

- **WHEN** alguien se registra con `"  clave12345  "`
- **THEN** puede iniciar sesión tanto con `"clave12345"` como con `"  clave12345  "`

#### Scenario: La longitud se mide tras recortar

- **WHEN** la contraseña tiene 8 caracteres contando un espacio inicial
- **THEN** la respuesta es 422 con un error de longitud mínima

### Requirement: Iniciar sesión

El sistema SHALL devolver el usuario y un token de acceso nuevo cuando las credenciales son correctas.

#### Scenario: Credenciales correctas

- **WHEN** se envía `POST /api/v1/auth/login` con el email escrito como se registró y su contraseña
- **THEN** la respuesta es 200 y contiene, dentro de `data`, el usuario y un token distinto de los anteriores

### Requirement: Rechazar credenciales incorrectas sin decir cuál falla

El sistema SHALL responder igual a una contraseña equivocada y a un email inexistente.

#### Scenario: Contraseña equivocada o email desconocido

- **WHEN** se intenta entrar con una contraseña incorrecta, con un email no registrado o con el email en otras mayúsculas
- **THEN** la respuesta es 400 con el mensaje `Invalid user credentials` y sin indicar campo

### Requirement: Validar la forma del inicio de sesión

El sistema SHALL rechazar con 422 un inicio de sesión mal formado antes de comprobar las credenciales.

#### Scenario: Email mal formado o campos vacíos

- **WHEN** el email no tiene formato válido, o el email o la contraseña están vacíos
- **THEN** la respuesta es 422 con un error por cada campo afectado

### Requirement: Consultar el perfil propio

El sistema SHALL devolver los datos de la persona a la que pertenece el token.

#### Scenario: Token válido

- **WHEN** se envía `GET /api/v1/account/profile` con un token válido
- **THEN** la respuesta es 200 y `data` contiene `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`

### Requirement: Exigir sesión en lo privado

El sistema SHALL responder 401 en el perfil y en el cierre de sesión cuando no haya un token válido.

#### Scenario: Sin token o con token inválido

- **WHEN** se llama al perfil o al cierre de sesión sin token, con un token inventado o con uno ya cerrado
- **THEN** la respuesta es 401 con el mensaje `Unauthorized access`

### Requirement: Cerrar la sesión del token usado

El sistema SHALL invalidar únicamente el token con el que se pide el cierre.

#### Scenario: Cierre correcto

- **WHEN** se envía `POST /api/v1/account/logout` con un token válido
- **THEN** la respuesta es 200 con `{ "message": "Logged out successfully" }`, sin envoltorio `data`, y ese token deja de servir

#### Scenario: Otras sesiones abiertas

- **WHEN** la misma persona tiene dos tokens y cierra uno
- **THEN** el otro sigue funcionando

### Requirement: Nunca devolver la contraseña

El sistema SHALL omitir la contraseña en toda respuesta con datos de usuario.

#### Scenario: Respuestas con usuario

- **WHEN** se registra, inicia sesión o consulta su perfil
- **THEN** ni la contraseña ni ningún derivado aparecen en la respuesta

### Requirement: Pantalla de registro

La aplicación SHALL ofrecer un formulario de registro con nombre opcional, email, contraseña y repetición, y SHALL llevar al perfil al completarlo.

#### Scenario: Contraseñas distintas en pantalla

- **WHEN** las dos contraseñas escritas no son idénticas y se pulsa crear cuenta
- **THEN** aparece «Las contraseñas no coinciden.» bajo la repetición y no se envía nada al servidor

#### Scenario: Registro completado

- **WHEN** el registro se acepta
- **THEN** la persona ve su perfil sin ningún paso adicional

### Requirement: Pantalla de inicio de sesión

La aplicación SHALL ofrecer un formulario de email y contraseña, con enlace al registro, y SHALL llevar al perfil al entrar.

#### Scenario: Credenciales rechazadas

- **WHEN** el servidor rechaza las credenciales
- **THEN** aparece el aviso «El email o la contraseña no son correctos.» y la persona sigue en la pantalla

### Requirement: Errores comprensibles en castellano

La aplicación SHALL traducir los errores del servidor, mostrando bajo su campo los que afectan a un campo visible y en un aviso general los demás.

#### Scenario: Error de un campo

- **WHEN** el servidor rechaza un dato concreto del formulario
- **THEN** aparece en castellano bajo ese campo, por ejemplo «Ese email ya está registrado. Inicia sesión en su lugar.»

#### Scenario: Servidor inalcanzable al enviar

- **WHEN** no se puede contactar con el servidor al enviar un formulario
- **THEN** aparece un aviso general de que no se pudo conectar

### Requirement: Evitar envíos repetidos

La aplicación SHALL desactivar la acción mientras se procesa, e indicarlo en el botón.

#### Scenario: Envío en curso

- **WHEN** se está enviando un formulario o cerrando la sesión
- **THEN** el botón queda desactivado y muestra «Entrando…», «Creando cuenta…» o «Cerrando sesión…»

### Requirement: Conservar la sesión entre visitas

La aplicación SHALL recuperar la sesión guardada en el navegador sin pedir credenciales, tras validarla contra el servidor.

#### Scenario: Recarga o vuelta con sesión válida

- **WHEN** se recarga la página o se vuelve tras cerrar la pestaña, con un token que el servidor acepta
- **THEN** se ve un indicador de carga y después la pantalla pedida, sin pasar por el inicio de sesión

### Requirement: Explicar la pérdida de una sesión

La aplicación SHALL olvidar la sesión guardada si el servidor la rechaza, y SHALL explicarlo en la pantalla de inicio de sesión.

#### Scenario: Token rechazado al volver

- **WHEN** el servidor responde 401 al validar la sesión guardada
- **THEN** la sesión se borra y el inicio de sesión muestra «Tu sesión ha caducado. Vuelve a iniciar sesión.»

### Requirement: Sobrevivir a un fallo temporal del servidor

La aplicación SHALL conservar la sesión guardada cuando no pueda validarla por un fallo que no sea un 401.

#### Scenario: Servidor caído al volver

- **WHEN** el servidor no responde o falla al validar la sesión guardada
- **THEN** la persona ve el inicio de sesión con un aviso, y recargar con el servidor recuperado restaura la sesión

### Requirement: Proteger las pantallas privadas

La aplicación SHALL llevar al inicio de sesión a quien entre sin sesión en una pantalla privada.

#### Scenario: Perfil sin sesión

- **WHEN** alguien sin sesión abre `/profile`
- **THEN** acaba en `/login`, y volver atrás tras cerrar sesión no devuelve el perfil

### Requirement: Rebotar de las pantallas públicas con sesión

La aplicación SHALL llevar al perfil a quien abra el inicio de sesión o el registro con sesión activa.

#### Scenario: Login con sesión activa

- **WHEN** alguien con sesión abre `/login` o `/register`
- **THEN** acaba en `/profile`

### Requirement: Rutas desconocidas

La aplicación SHALL tratar cualquier dirección desconocida como una visita al perfil.

#### Scenario: Dirección inexistente

- **WHEN** se abre una dirección que no existe
- **THEN** se va a `/profile`, y de ahí a `/login` si no hay sesión

### Requirement: Mostrar el perfil

La aplicación SHALL mostrar las iniciales, el nombre, el email y la fecha de alta de la persona.

#### Scenario: Persona sin nombre

- **WHEN** la cuenta no tiene nombre
- **THEN** se muestra «Sin nombre» en su lugar y las iniciales que da el servidor

#### Scenario: Fecha de alta

- **WHEN** se abre el perfil
- **THEN** «Miembro desde» muestra la fecha larga en castellano

### Requirement: Cerrar sesión desde la pantalla

La aplicación SHALL dar la sesión por cerrada en ese navegador aunque el servidor no confirme el cierre.

#### Scenario: Cierre con el servidor inalcanzable

- **WHEN** se pulsa «Cerrar sesión» y la petición al servidor falla
- **THEN** la persona acaba en el inicio de sesión sin ver ningún error

---

# Parte B: las tres listas

## 1. Requisitos escritos y comprobados

- **Escritos por el agente:** 23.
- **Comprobados por mí:** 7 de 23 (crear cuenta, validar registro, email único, rechazo de credenciales, mostrar perfil y los dos de cierre de sesión). La revisión se paró ahí por falta de tiempo.
- **Comprobados por el agente, solo como referencia:** 11 de API ejecutándolos contra una copia aislada, y 12 de pantalla solo leyendo el código, sin abrir un navegador.

## 2. Incoherencias que aparecieron al escribirla

1. **«Tu sesión ha caducado»:** ningún token tiene caducidad (22 de 22 creados en la prueba sin fecha de fin). Se ve en el aviso del inicio de sesión.
2. **Envoltorio de respuestas:** todo va dentro de `data` menos el cierre de sesión, que devuelve `message`, y además en inglés. Se ve en logout.
3. **Dos sesiones a la vez:** la autenticación usa token, pero cada respuesta trae una cookie `adonis-session` de 2 horas. Se ve en la cabecera `Set-Cookie`.
4. **Límite de contraseña:** el registro exige 8-32 caracteres y el login admite cualquier longitud (40 caracteres dan 400, no 422). Se ve comparando signup y login.
5. **Nombre «opcional»:** la pantalla lo llama opcional, pero la API da 422 si falta la clave. Se ve en signup sin `fullName`.
6. **Iniciales:** `Ada Lovelace` da `AL`, `Ada  Lovelace` con doble espacio da `AD`, y sin nombre `ada@example.com` da `AE`, con la inicial del dominio. Se ve en `initials`.
7. **Repetir contraseña:** la pantalla rechaza una repetición que solo difiere en un espacio final, y la API la acepta porque recorta. Se ve comparando el formulario con signup.
8. **Fecha de alta:** el mismo `createdAt` llega con milisegundos en el registro (`.145`) y sin ellos en el perfil (`.000`). Se ve comparando signup y profile.
9. **Forma del error:** la mayoría usa `errors`, pero una ruta inexistente o un JSON roto devuelven `message` y `frames` en desarrollo. Se ve en esos dos casos.
10. **Registro simultáneo:** 8 registros a la vez con el mismo email dieron un 200 y siete 500, no 422. En desarrollo, ese 500 incluye la consulta SQL con el hash de la contraseña.
11. **Aviso de sesión perdida:** solo aparece en el inicio de sesión; en `/register` no se ve. Comprobado solo leyendo el código.
12. **Cierre en otra pestaña:** quien cierra sesión a propósito y recarga otra pestaña lee «Tu sesión ha caducado». Comprobado solo leyendo el código.
13. **`CORS_ORIGIN`:** aparece en el ejemplo de configuración, pero nada lo lee, y fuera de desarrollo la lista de orígenes está vacía. Comprobado solo leyendo el código.
14. **Texto del login:** promete «volver a tus tareas», y entrar lleva a un perfil porque no existen tareas. Se ve en la pantalla.
15. **Cierre de sesión con fallo (bug decidido por la persona, sin corregir):** la pantalla da la sesión por cerrada aunque el servidor no reciba el cierre, y ese token sigue valiendo. Al cerrar sesión, el token debería quedar invalidado. Comprobado solo leyendo el código.
16. **Intentos de login ilimitados (bug decidido por la persona por riesgo de seguridad, sin corregir):** 20 fallos seguidos no provocaron bloqueo ni espera, y el siguiente login entró. El login se protege contra ataques de tiempo, pero no contra la fuerza bruta.
17. **Nombre obligatorio según el PRD (bug decidido por la persona, sin corregir):** RF-1 pide crear la cuenta con nombre y las tareas muestran el nombre de su autor, pero se puede registrar una cuenta sin nombre. Se ve en la etiqueta «(opcional)» y en «Sin nombre» del perfil.

## 3. Lo que no se pudo decidir si era bug o contrato

Propuesta del agente. La persona solo revisó la de las mayúsculas en el email; el resto queda tal como lo propuso el agente.

1. **Tokens sin caducidad:** o es lo que pide el requisito de que la sesión sobreviva, o es un olvido, porque el producto habla de sesiones caducadas. Además, comprobarlo desde fuera exige esperar, y solo se ha visto el dato guardado.
2. **Revelar si un email existe:** el login lo oculta con cuidado y el registro lo dice abiertamente. O es el precio de un mensaje útil, o anula la protección del login.
3. **Recorte de contraseñas:** cambiar lo que la persona teclea puede ser una decisión o un efecto del framework. Nadie lo nota porque el login también recorta, pero una contraseña con espacios en los extremos no es la que se escribió.
4. **Registro con 200:** crea un recurso y no responde 201. La aplicación no lo distingue, así que puede ser contrato o casualidad.
5. **Cómo se guarda la contraseña:** en la copia de prueba se guarda con hash, pero desde fuera no se distingue de otra forma de guardarla. Por eso la spec solo promete que no se devuelve, y calla sobre el almacenamiento.
6. **Mayúsculas en el email (revisado por la persona):** `a@x.com` y `A@X.com` son dos cuentas, y entrar con otras mayúsculas da «credenciales incorrectas». O nadie lo decidió y es un bug que duplica cuentas, o es un contrato que respeta el email tal como se escribió.
