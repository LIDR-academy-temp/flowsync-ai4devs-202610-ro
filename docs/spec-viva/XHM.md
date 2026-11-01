# PARTE A - LA SPECIFICACIÓN MÓDULO "CUENTAS Y ACCESO"

## Purpose

Permitir que una persona cree su cuenta en FlowSync, inicie y cierre sesión, y consulte su perfil, de modo que solo quien está identificado pueda acceder a su información.

## Requirements

### Requirement: Registro de una cuenta nueva

El sistema SHALL permitir crear una cuenta con un email, una contraseña, la confirmación de esa contraseña y, opcionalmente, un nombre completo, y SHALL dejar a la persona con la sesión iniciada en cuanto la cuenta se crea.

#### Scenario: Registro correcto por la API

- **WHEN** se envía una petición de registro con un email no registrado, una contraseña de entre 8 y 32 caracteres, una confirmación idéntica y un nombre completo
- **THEN** la respuesta tiene estado 200 y contiene, dentro de un objeto de datos, el usuario creado (identificador, nombre completo, email, iniciales, fecha de creación y fecha de actualización) y un token de acceso, sin incluir nunca la contraseña

#### Scenario: Registro sin nombre completo

- **WHEN** se envía una petición de registro válida con el nombre completo vacío o nulo
- **THEN** la cuenta se crea igualmente y el usuario devuelto tiene el nombre completo nulo

#### Scenario: Registro correcto desde la pantalla

- **WHEN** una persona sin sesión rellena el formulario de registro con datos válidos y pulsa "Crear cuenta"
- **THEN** el botón muestra "Creando cuenta…" y queda deshabilitado mientras se procesa, y al terminar la persona ve su pantalla de perfil sin tener que iniciar sesión

### Requirement: Validación de los datos de registro

El sistema SHALL rechazar un registro cuyos datos no cumplan las reglas y SHALL indicar qué campo falla y por qué.

#### Scenario: Email ya registrado

- **WHEN** se envía una petición de registro con un email que ya pertenece a otra cuenta
- **THEN** la respuesta tiene estado 422, no se crea ninguna cuenta y en pantalla aparece bajo el campo email el mensaje "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Email con formato inválido

- **WHEN** se envía una petición de registro con un email que no tiene formato de dirección de correo o que supera los 254 caracteres
- **THEN** la respuesta tiene estado 422 con un error asociado al campo email, y en pantalla se muestra el mensaje bajo ese campo

#### Scenario: Contraseña fuera de longitud

- **WHEN** se envía una petición de registro con una contraseña de menos de 8 caracteres o de más de 32
- **THEN** la respuesta tiene estado 422 con un error asociado al campo contraseña, y en pantalla aparece bajo ese campo un mensaje que indica el mínimo o el máximo de caracteres

#### Scenario: Campo obligatorio vacío

- **WHEN** se envía una petición de registro sin email, sin contraseña o sin confirmación
- **THEN** la respuesta tiene estado 422 con un error por cada campo que falta, y en pantalla cada campo afectado muestra "Falta rellenar …" con el nombre del campo

#### Scenario: Las contraseñas no coinciden en la pantalla

- **WHEN** una persona escribe en el formulario de registro una confirmación distinta de la contraseña y pulsa "Crear cuenta"
- **THEN** bajo el campo de confirmación aparece "Las contraseñas no coinciden." y no se envía ninguna petición al servidor

#### Scenario: Las contraseñas no coinciden en la API

- **WHEN** se envía una petición de registro cuya confirmación no coincide con la contraseña
- **THEN** la respuesta tiene estado 422 con un error asociado al campo de confirmación y no se crea ninguna cuenta

#### Scenario: Ayuda visible sobre la contraseña

- **WHEN** una persona abre el formulario de registro y el campo contraseña no tiene ningún error
- **THEN** bajo ese campo ve el texto "Entre 8 y 32 caracteres." y el nombre completo aparece marcado como "(opcional)"

### Requirement: Inicio de sesión

El sistema SHALL permitir iniciar sesión con email y contraseña de una cuenta existente y SHALL entregar un token de acceso nuevo en cada inicio de sesión correcto.

#### Scenario: Credenciales correctas por la API

- **WHEN** se envía una petición de inicio de sesión con el email y la contraseña de una cuenta existente
- **THEN** la respuesta tiene estado 200 y contiene, dentro de un objeto de datos, el usuario (sin contraseña) y un token de acceso

#### Scenario: Credenciales incorrectas

- **WHEN** se envía una petición de inicio de sesión con un email que no existe o con una contraseña que no corresponde a ese email
- **THEN** la respuesta tiene estado 400, no se entrega ningún token, y en pantalla aparece un aviso general "El email o la contraseña no son correctos." sin revelar cuál de los dos falla

#### Scenario: Datos de inicio de sesión incompletos o mal formados

- **WHEN** se envía una petición de inicio de sesión sin email, sin contraseña o con un email sin formato válido
- **THEN** la respuesta tiene estado 422 con el error asociado al campo correspondiente, y en pantalla el mensaje aparece bajo ese campo

#### Scenario: Inicio de sesión correcto desde la pantalla

- **WHEN** una persona sin sesión introduce credenciales válidas en la pantalla de inicio de sesión y pulsa "Entrar"
- **THEN** el botón muestra "Entrando…" y queda deshabilitado mientras se procesa, y al terminar la persona ve su pantalla de perfil

#### Scenario: Navegación entre registro e inicio de sesión

- **WHEN** una persona sin sesión está en la pantalla de inicio de sesión o en la de registro
- **THEN** ve un enlace ("Crea una" o "Inicia sesión", respectivamente) que la lleva a la otra pantalla

### Requirement: Acceso protegido por token

El sistema SHALL exigir un token de acceso válido para consultar el perfil y para cerrar sesión, y SHALL rechazar cualquier petición a esas operaciones sin token o con un token no reconocido.

#### Scenario: Petición sin token

- **WHEN** se solicita el perfil o el cierre de sesión sin enviar token de acceso
- **THEN** la respuesta tiene estado 401 y no devuelve datos de ningún usuario

#### Scenario: Petición con token revocado o inventado

- **WHEN** se solicita el perfil enviando un token que nunca existió o que ya se invalidó al cerrar sesión
- **THEN** la respuesta tiene estado 401

### Requirement: Persistencia de la sesión en el navegador

El sistema SHALL mantener la sesión iniciada al recargar la página o volver a abrir la aplicación mientras el token siga siendo válido, y SHALL explicar a la persona por qué ha perdido la sesión cuando no pueda restaurarla.

#### Scenario: Recarga con sesión válida

- **WHEN** una persona con sesión iniciada recarga la página
- **THEN** ve brevemente un indicador de carga y después su perfil, sin tener que volver a iniciar sesión

#### Scenario: Token rechazado al volver

- **WHEN** una persona abre la aplicación con un token guardado que el servidor ya no reconoce
- **THEN** ve la pantalla de inicio de sesión con el aviso "Tu sesión ha caducado. Vuelve a iniciar sesión." y el token deja de conservarse

#### Scenario: Servidor no disponible al volver

- **WHEN** una persona abre la aplicación con un token guardado y el servidor no responde
- **THEN** ve la pantalla de inicio de sesión con el aviso "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y, al recargar con el servidor ya disponible, recupera su sesión sin volver a introducir credenciales

### Requirement: Separación entre pantallas públicas y privadas

El sistema SHALL mostrar las pantallas de registro e inicio de sesión solo a quien no tiene sesión, y la pantalla de perfil solo a quien sí la tiene.

#### Scenario: Acceso al perfil sin sesión

- **WHEN** una persona sin sesión intenta abrir la pantalla de perfil
- **THEN** es llevada a la pantalla de inicio de sesión

#### Scenario: Acceso a registro o inicio de sesión con sesión activa

- **WHEN** una persona con sesión iniciada intenta abrir la pantalla de registro o la de inicio de sesión
- **THEN** es llevada a su pantalla de perfil

#### Scenario: Dirección desconocida

- **WHEN** una persona abre una dirección de la aplicación que no corresponde a ninguna pantalla
- **THEN** es llevada al perfil si tiene sesión, o al inicio de sesión si no la tiene

### Requirement: Consulta del perfil

El sistema SHALL devolver y mostrar los datos de la cuenta de quien tiene la sesión iniciada, y solo los de esa cuenta.

#### Scenario: Perfil por la API

- **WHEN** se solicita el perfil con un token válido
- **THEN** la respuesta tiene estado 200 y contiene, dentro de un objeto de datos, el identificador, nombre completo, email, iniciales, fecha de creación y fecha de actualización del dueño del token, sin la contraseña

#### Scenario: Perfil en pantalla

- **WHEN** una persona con sesión iniciada está en su pantalla de perfil
- **THEN** ve un círculo con sus iniciales, su nombre completo, su email, la fecha de alta como "Miembro desde" en formato largo en castellano, y un botón "Cerrar sesión"

#### Scenario: Perfil sin nombre completo

- **WHEN** una persona que se registró sin nombre completo ve su perfil
- **THEN** en lugar del nombre aparece "Sin nombre"

#### Scenario: Cálculo de las iniciales

- **WHEN** se obtiene el perfil de un usuario
- **THEN** las iniciales, en mayúsculas, son la primera letra de las dos primeras palabras del nombre completo; si el nombre tiene una sola palabra, sus dos primeras letras; y si no hay nombre, la primera letra de la parte del email anterior a la arroba y la primera de la parte posterior

### Requirement: Cierre de sesión

El sistema SHALL invalidar en el servidor el token con el que se cierra la sesión y SHALL dejar a la persona sin sesión en el navegador aunque el servidor no confirme el cierre.

#### Scenario: Cierre de sesión por la API

- **WHEN** se solicita el cierre de sesión con un token válido
- **THEN** la respuesta tiene estado 200 con un mensaje de confirmación, y cualquier petición posterior con ese mismo token recibe 401

#### Scenario: Otros tokens no se ven afectados

- **WHEN** un usuario tiene varias sesiones abiertas con tokens distintos y cierra sesión con uno de ellos
- **THEN** solo ese token deja de ser válido y los demás siguen permitiendo consultar el perfil

#### Scenario: Cierre de sesión desde la pantalla

- **WHEN** una persona con sesión iniciada pulsa "Cerrar sesión" en su perfil
- **THEN** el botón muestra "Cerrando sesión…" y queda deshabilitado, y la persona pasa a la pantalla de inicio de sesión sin ningún aviso de error

#### Scenario: Cierre de sesión con el servidor caído

- **WHEN** una persona pulsa "Cerrar sesión" y el servidor no responde
- **THEN** igualmente pasa a la pantalla de inicio de sesión y, al recargar, sigue sin sesión

### Requirement: Mensajes de error comprensibles

El sistema SHALL mostrar en castellano y en lenguaje no técnico cualquier fallo de registro o de inicio de sesión, colocando junto a cada campo los errores que le corresponden.

#### Scenario: Error inesperado del servidor

- **WHEN** una persona envía el formulario de registro o de inicio de sesión y el servidor responde con un error no previsto
- **THEN** ve un aviso general "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento." y puede volver a enviar el formulario

#### Scenario: Sin conexión con el servidor

- **WHEN** una persona envía el formulario de registro o de inicio de sesión y el servidor no está accesible
- **THEN** ve un aviso general "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." y el botón de envío vuelve a estar habilitado

# PARTE B - LAS TRES LISTAS

## Cuántos requisitos escribió el agente, y cuántos comprobaste tú abriendo el código.

- 9 Requisitos escritos por el Agente.
- 7 requisitos validados.

## Las incoherencias que aparecieron al escribirla. Una línea cada una, con dónde se ve. No las busques a propósito: aparecen solas, porque una regla que se cumple en casi todas partes canta en cuanto intentas escribirla como si se cumpliera siempre

- En el formulario de registro, aunque si se especifica la longitud minima de la contraseña, no veo que se especifique la longitud máxima.
Si hay un mensaje de error que tiene que ser entre 8 y 32 y desde el lado de servidor si se hace el control, pero para evitar hacer un envío al server, este control tambien debería estar en el lado cliente.

- Se recibe el mensaje de que la sesión ha caducado, pero una sesión nunca caduca. En el caso de realmente activar el campo "ExpiresAt", este mensaje que se devuelve podría llevar a confusión. El mensaje correcto, sería algo del estilo "Tu sesión ha sido anulada/cancelada".

- El cierre de sesión con el servidor caído, tiene un comportamiento raro. Si pasa, si que el token que tengo en mi sesión se borra, pero no se borraría del servidor, esto incumple con el requisito que al pulsar el cierre de sesion de la línea 172.

## Lo que no supiste decidir si era un bug o el contrato. Al menos una, y en una frase, qué dos lecturas se contradecían. Esta es la lista que importa. No es lo que estaba mal: es lo que podría estar bien o mal según a quién le preguntes, y no había forma de decidirlo leyendo el código

- El modelo "AuthAccessTokenSchema" tiene el campo "expiresAt" que no veo que se use en el momento de crear la sesión. Por lo tanto siempre está a NULL y el token nunca expira no ser que se haga un "Finalizar sesión". No sé si es correcto y si deberíamos tener definido un perido máximo de validez

- Que al poner una página que no existe en la ruta, vaya a tu perfil o a la pàgina de registro, para mi no es un mensaje claro para el usuario, ¿La página existe y la he escrito mal? Personalmente, es mas claro mostrar una página indicando algo como "Página no existe", que el comportamiento especificado.

- No existe una opción de recuperar contraseña o cambiarla en caso de olvido. ¿Qué hago si no la recuerdo?
