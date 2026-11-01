# Cuentas y acceso

## Purpose

Describe el comportamiento observable del módulo de cuentas y acceso de FlowSync: cómo una persona crea su cuenta, inicia y cierra sesión, mantiene su sesión activa y consulta su perfil. Cubre tanto lo que el cliente puede pedir a la API como lo que el usuario ve y hace en la aplicación web.

## Requirements

**Bloque: Registro**

### Requirement: 1. Registro de cuenta por API

El sistema SHALL permitir crear una cuenta mediante `POST /api/v1/auth/signup` enviando `fullName`, `email`, `password` y `passwordConfirmation`, y SHALL devolver el usuario creado junto con un token de acceso, dentro de un envoltorio `data`.

#### Scenario: 1.1 Registro correcto

*   **WHEN** el cliente envía un nombre, un email válido y no registrado, una contraseña de entre 8 y 32 caracteres y una confirmación idéntica
*   **THEN** el sistema crea la cuenta y responde con éxito y `data` con el usuario (`id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`) y un `token`
*   **AND** la respuesta no incluye la contraseña

#### Scenario: 1.2 Registro sin nombre

*   **WHEN** el cliente envía `fullName` con valor `null` y el resto de datos válidos
*   **THEN** el sistema crea la cuenta con nombre vacío

#### Scenario: 1.3 Falta un dato obligatorio

*   **WHEN** el cliente omite `email`, `password`, `passwordConfirmation` o la clave `fullName`
*   **THEN** el sistema responde 422 con un error asociado a cada campo que falta

### Requirement: 2. Validación de los datos de registro

El sistema SHALL rechazar con 422 los registros cuyos datos no cumplan las reglas de email, contraseña o confirmación, indicando el campo y la regla incumplida.

#### Scenario: 2.1 Email con formato inválido

*   **WHEN** el cliente envía un `email` que no es una dirección válida
*   **THEN** el sistema responde 422 con un error sobre el campo `email`

#### Scenario: 2.2 Email demasiado largo

*   **WHEN** el cliente envía un `email` de más de 254 caracteres
*   **THEN** el sistema responde 422 con un error de longitud máxima sobre `email`

#### Scenario: 2.3 Email ya registrado

*   **WHEN** el cliente envía un `email` que ya pertenece a otra cuenta
*   **THEN** el sistema responde 422 con un error de unicidad sobre `email` y no crea la cuenta

#### Scenario: 2.4 Contraseña demasiado corta o demasiado larga

*   **WHEN** el cliente envía una `password` de menos de 8 o de más de 32 caracteres
*   **THEN** el sistema responde 422 con un error de longitud sobre `password`

#### Scenario: 2.5 La confirmación no coincide

*   **WHEN** `passwordConfirmation` es distinta de `password`
*   **THEN** el sistema responde 422 con un error sobre `passwordConfirmation` y no crea la cuenta

### Requirement: 3. Pantalla de registro

La aplicación SHALL ofrecer en `/register` un formulario con nombre completo (opcional), email, contraseña (con la indicación «Entre 8 y 32 caracteres») y repetición de contraseña, además de un enlace para ir a iniciar sesión.

#### Scenario: 3.1 Registro correcto desde la web

*   **WHEN** una persona sin sesión completa el formulario con datos válidos y pulsa «Crear cuenta»
*   **THEN** la aplicación crea la cuenta, inicia la sesión y la lleva a su perfil

#### Scenario: 3.2 Envío en curso

*   **WHEN** el formulario se está enviando
*   **THEN** el botón muestra «Creando cuenta…» y permanece deshabilitado

#### Scenario: 3.3 Nombre en blanco

*   **WHEN** la persona deja el nombre vacío o solo con espacios
*   **THEN** la cuenta se crea sin nombre

#### Scenario: 3.4 Las contraseñas no coinciden

*   **WHEN** la contraseña y su repetición son distintas al pulsar «Crear cuenta»
*   **THEN** la aplicación muestra «Las contraseñas no coinciden.» bajo la repetición de contraseña, sin enviar el formulario

#### Scenario: 3.5 Email ya registrado

*   **WHEN** el email ya pertenece a otra cuenta
*   **THEN** la aplicación muestra bajo el campo email «Ese email ya está registrado. Inicia sesión en su lugar.»

#### Scenario: 3.6 Otros errores de validación

*   **WHEN** el servidor rechaza algún dato por formato o longitud
*   **THEN** la aplicación muestra, bajo el campo correspondiente, un mensaje en castellano, por ejemplo «Introduce una dirección de email válida.» o «la contraseña debe tener al menos 8 caracteres.»

#### Scenario: 3.7 Error sin campo asociado

*   **WHEN** el error no corresponde a un campo visible del formulario
*   **THEN** la aplicación lo muestra en una alerta en la parte superior del formulario

#### Scenario: 3.8 Servidor inaccesible

*   **WHEN** la aplicación no puede conectar con el servidor
*   **THEN** muestra el mensaje «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

**Bloque: Inicio de sesión**

### Requirement: 4. Inicio de sesión por API

El sistema SHALL permitir iniciar sesión mediante `POST /api/v1/auth/login` con `email` y `password`, y SHALL devolver el usuario y un token de acceso nuevo, dentro de un envoltorio `data`.

#### Scenario: 4.1 Credenciales correctas

*   **WHEN** el cliente envía el email y la contraseña de una cuenta existente
*   **THEN** el sistema responde con éxito y `data` con el usuario y un `token`

#### Scenario: 4.2 Varios inicios de sesión

*   **WHEN** el mismo usuario inicia sesión varias veces
*   **THEN** cada inicio devuelve un token distinto y los tokens anteriores siguen siendo válidos

#### Scenario: 4.3 Credenciales incorrectas

*   **WHEN** el cliente envía un email inexistente o una contraseña errónea
*   **THEN** el sistema responde con un error de credenciales inválidas (400), sin distinguir cuál de los dos datos es incorrecto, y no entrega ningún token

#### Scenario: 4.4 Datos de login mal formados

*   **WHEN** el cliente envía un `email` con formato inválido o de más de 254 caracteres, o no envía `email` o `password`
*   **THEN** el sistema responde 422 con un error asociado a cada campo afectado

### Requirement: 5. Pantalla de inicio de sesión

La aplicación SHALL ofrecer en `/login` un formulario con email y contraseña, y un enlace para crear una cuenta.

#### Scenario: 5.1 Inicio de sesión correcto desde la web

*   **WHEN** una persona sin sesión introduce credenciales válidas y pulsa «Entrar»
*   **THEN** la aplicación inicia la sesión y la lleva a su perfil

#### Scenario: 5.2 Envío en curso

*   **WHEN** el formulario se está enviando
*   **THEN** el botón muestra «Entrando…» y permanece deshabilitado

#### Scenario: 5.3 Credenciales incorrectas

*   **WHEN** el servidor rechaza el email o la contraseña
*   **THEN** la aplicación muestra la alerta «El email o la contraseña no son correctos.»

#### Scenario: 5.4 Datos con formato inválido

*   **WHEN** el servidor rechaza un campo por formato o por faltar
*   **THEN** la aplicación muestra el mensaje en castellano bajo ese campo

#### Scenario: 5.5 Motivo de una sesión perdida

*   **WHEN** una sesión previa se ha perdido al abrir la aplicación y la persona llega a `/login`
*   **THEN** la pantalla muestra una alerta con el motivo, mientras no haya un error del intento de login actual
*   **AND** si hay un error del intento actual, se muestra ese en lugar del motivo anterior

**Bloque: Sesión**

### Requirement: 6. Acceso con token a rutas protegidas

El sistema SHALL exigir un token de acceso válido, enviado como `Authorization: Bearer <token>`, para consultar el perfil y para cerrar sesión, y SHALL responder 401 en caso contrario.

#### Scenario: 6.1 Petición sin token

*   **WHEN** el cliente solicita el perfil o cierra sesión sin cabecera de autorización
*   **THEN** el sistema responde 401

#### Scenario: 6.2 Token inválido o revocado

*   **WHEN** el cliente envía un token que no existe o que ya fue revocado
*   **THEN** el sistema responde 401

#### Scenario: 6.3 Respuestas siempre en JSON

*   **WHEN** el cliente realiza cualquier petición a la API, con o sin cabecera `Accept`
*   **THEN** el sistema responde en formato JSON

### Requirement: 7. Cierre de sesión por API

El sistema SHALL permitir cerrar sesión mediante `POST /api/v1/account/logout`, revocando únicamente el token con el que se realiza la petición.

#### Scenario: 7.1 Cierre correcto

*   **WHEN** el cliente envía la petición con un token válido
*   **THEN** el sistema responde con éxito y el mensaje «Logged out successfully», sin envoltorio `data`
*   **AND** ese token deja de ser válido: una petición posterior con él recibe 401

#### Scenario: 7.2 Otros tokens del usuario

*   **WHEN** un usuario con varios tokens cierra sesión con uno de ellos
*   **THEN** los demás tokens siguen siendo válidos

### Requirement: 8. Acceso según estado de la sesión

La aplicación SHALL restringir `/profile` a personas con sesión y `/login` y `/register` a personas sin sesión, y SHALL redirigir cualquier otra ruta al perfil.

#### Scenario: 8.1 Perfil sin sesión

*   **WHEN** una persona sin sesión visita `/profile`
*   **THEN** la aplicación la redirige a `/login`

#### Scenario: 8.2 Login o registro con sesión

*   **WHEN** una persona con sesión visita `/login` o `/register`
*   **THEN** la aplicación la redirige a `/profile`

#### Scenario: 8.3 Ruta desconocida

*   **WHEN** una persona visita una ruta que no existe, incluida la raíz `/`
*   **THEN** la aplicación la lleva a `/profile` y, si no tiene sesión, de ahí a `/login`

#### Scenario: 8.4 Comprobación de sesión en curso

*   **WHEN** la aplicación está validando una sesión guardada
*   **THEN** muestra un indicador de carga a pantalla completa y no redirige hasta terminar

### Requirement: 9. Persistencia y restauración de la sesión

La aplicación SHALL conservar la sesión entre recargas y visitas, y SHALL validarla contra el servidor al arrancar.

#### Scenario: 9.1 Recarga con sesión válida

*   **WHEN** una persona con sesión recarga la página o la reabre más tarde
*   **THEN** la aplicación recupera su sesión sin pedirle credenciales y muestra el contenido protegido

#### Scenario: 9.2 Sesión rechazada por el servidor

*   **WHEN** al arrancar el servidor rechaza la sesión guardada (401)
*   **THEN** la aplicación elimina la sesión guardada, lleva a la persona a `/login` y muestra «Tu sesión ha caducado. Vuelve a iniciar sesión.»

#### Scenario: 9.3 Servidor caído al arrancar

*   **WHEN** al arrancar el servidor no responde o falla con otro error
*   **THEN** la aplicación lleva a la persona a `/login` mostrando el motivo, sin eliminar la sesión guardada
*   **AND** al recargar cuando el servidor vuelva a responder, la sesión se restaura

### Requirement: 10. Cierre de sesión desde la web

La aplicación SHALL ofrecer en el perfil un botón «Cerrar sesión» que termine la sesión de la persona.

#### Scenario: 10.1 Cierre correcto

*   **WHEN** la persona pulsa «Cerrar sesión»
*   **THEN** el botón muestra «Cerrando sesión…», la sesión local se elimina y la aplicación la lleva a `/login` sin motivo de sesión perdida

#### Scenario: 10.2 Fallo al avisar al servidor

*   **WHEN** la persona cierra sesión y el servidor no responde o rechaza la petición
*   **THEN** la sesión local se cierra igualmente y la persona llega a `/login`

**Bloque: Perfil**

### Requirement: 11. Consulta del perfil por API

El sistema SHALL devolver los datos de la persona autenticada mediante `GET /api/v1/account/profile`.

#### Scenario: 11.1 Perfil con token válido

*   **WHEN** el cliente solicita el perfil con un token válido
*   **THEN** el sistema responde con éxito y `data` con `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials`

#### Scenario: 11.2 Iniciales con nombre de dos o más palabras

*   **WHEN** la cuenta tiene un nombre como «Ada Lovelace»
*   **THEN** `initials` contiene la primera letra de las dos primeras palabras, en mayúsculas («AL»)

#### Scenario: 11.3 Iniciales con nombre de una palabra

*   **WHEN** la cuenta tiene un nombre de una sola palabra, como «Ada»
*   **THEN** `initials` contiene sus dos primeras letras en mayúsculas («AD»)

#### Scenario: 11.4 Iniciales sin nombre

*   **WHEN** la cuenta no tiene nombre
*   **THEN** `initials` se calcula a partir del email siguiendo las mismas reglas aplicadas a la parte anterior a la `@`

### Requirement: 12. Pantalla de perfil

La aplicación SHALL mostrar en `/profile` los datos de la persona autenticada.

#### Scenario: 12.1 Cuenta con nombre

*   **WHEN** una persona con nombre accede a su perfil
*   **THEN** ve su avatar con las iniciales, su nombre, su email y «Miembro desde» con la fecha de alta en formato largo en español (por ejemplo, «31 de octubre de 2026»)

#### Scenario: 12.2 Cuenta sin nombre

*   **WHEN** una persona sin nombre accede a su perfil
*   **THEN** ve «Sin nombre» como nombre, junto a las iniciales derivadas del email

#### Scenario: 12.3 Perfil de solo lectura

*   **WHEN** la persona está en su perfil
*   **THEN** la única acción disponible es «Cerrar sesión»; no puede editar nombre, email ni contraseña

## Análisis

### 1\. Requisitos generados y comprobados

Requisitos generados: 12  
Requisitos comprobados: 7

### 2\. Incoherencias detectadas

*   Requisito 1:
    *   En el escenario 1.1 y escenario 1.2 se indica que se devuelve una respuesta de exito en la operación sin embargo no veo que el código devuelva un 201 indicando el éxito de la creación.
*   Requisito 2:
    *   No hay una normalización de las mayusculas en el email, lo que puede dar problemas en el escenario 2.3 Email duplicado, ya que el mismo email pero con mayúsuculas podría dar error.
*   Requisito 6:
    *   El error 401 en caso de fallo de autenticación no está indicado en el codigo. Parece ser que el framework lo saca por defecto, sin embargo aparece en el requisito
*   Requisito 11:
    * Los initials en caso de no contener . en el correo  para separar nombres no se crean como el escenario 11.4 indica. Se coge la primera letra de la dirección de correo y la primera del dominio.
*   ...

### 3\. Comportamientos que no supe clasificar como bug o contrato

*   ME parece raro que al crear un usuario sea obligatorio enviar el fullname aunque sea con null y no pueda directamente no enviarse.
*   No se si se está haciendo una gestión correcta de los token, ya que parece que cada vez que se logea y o crea cuenta se asigna un nuevo token, pero no se si se está asegurando el borrado de los antiguos.  Por otra parte, parece ser que los tokens no se les está poniendo la caducidad.