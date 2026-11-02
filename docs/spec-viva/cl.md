# Cuentas y acceso

## Purpose
Permite a una persona crear una cuenta, entrar y salir de FlowSync y consultar su perfil. Reserva las pantallas y las peticiones privadas a quien tiene una sesión válida.

## Requirements

### Requirement: Registro de usuario
El sistema SHALL permitir crear una cuenta con email, contraseña, confirmación de la contraseña y un nombre opcional, y SHALL dejar la sesión iniciada al terminar.

#### Scenario: Registro con datos válidos
- **WHEN** un visitante sin cuenta envía el formulario de registro con un email válido sin registrar, una contraseña de 8 a 32 caracteres y la misma contraseña repetida
- **THEN** el sistema responde 200 con los datos del usuario y un token, y el usuario ve su perfil con la sesión iniciada

#### Scenario: Email ya registrado
- **WHEN** un visitante envía el formulario de registro con exactamente el mismo email de una cuenta existente
- **THEN** el sistema responde 422 con un error en el campo `email`, no crea la cuenta y el usuario ve bajo ese campo «Ese email ya está registrado. Inicia sesión en su lugar.»

#### Scenario: Email con formato inválido
- **WHEN** un visitante envía el formulario de registro con un email sin formato de dirección válida
- **THEN** el sistema responde 422 con un error en el campo `email` y el usuario ve bajo ese campo «Introduce una dirección de email válida.»

#### Scenario: Contraseña demasiado corta
- **WHEN** un visitante envía el formulario de registro con una contraseña de 7 caracteres, repetida igual en la confirmación
- **THEN** el sistema responde 422 con errores en `password` y `passwordConfirmation`, y el usuario ve bajo cada campo un aviso con el mínimo de 8 caracteres

#### Scenario: Contraseña demasiado larga
- **WHEN** un visitante envía el formulario de registro con una contraseña de 33 caracteres, repetida igual en la confirmación
- **THEN** el sistema responde 422 con errores en `password` y `passwordConfirmation`, y el usuario ve bajo cada campo un aviso con el máximo de 32 caracteres

#### Scenario: Contraseñas distintas en la pantalla
- **WHEN** un visitante envía el formulario de registro con la contraseña y su repetición distintas
- **THEN** no se envía ninguna petición y el usuario ve bajo la repetición «Las contraseñas no coinciden.»

#### Scenario: Contraseñas distintas en la API
- **WHEN** un cliente envía `POST /api/v1/auth/signup` con `password` y `passwordConfirmation` distintos
- **THEN** el sistema responde 422 con un error en el campo `passwordConfirmation` y no crea la cuenta

#### Scenario: Campos obligatorios vacíos
- **WHEN** un visitante envía el formulario de registro sin rellenar ningún campo
- **THEN** el sistema responde 422 y el usuario ve un aviso de que falta rellenar el email, la contraseña y la confirmación, cada uno bajo su campo

#### Scenario: Registro sin nombre desde la pantalla
- **WHEN** un visitante envía el formulario de registro con datos válidos y el nombre vacío o solo con espacios
- **THEN** el sistema crea la cuenta sin nombre y el usuario ve «Sin nombre» en su perfil

#### Scenario: Nombre nulo o vacío en la API
- **WHEN** un cliente envía `POST /api/v1/auth/signup` con datos válidos y `fullName` nulo o como cadena vacía
- **THEN** el sistema responde 200 y devuelve `fullName` como nulo

#### Scenario: Nombre ausente en la API
- **WHEN** un cliente envía `POST /api/v1/auth/signup` con datos válidos pero sin la clave `fullName`
- **THEN** el sistema responde 422 con un error en el campo `fullName`

#### Scenario: Pista sobre la contraseña
- **WHEN** un visitante ve el formulario de registro y el campo de contraseña no tiene ningún error
- **THEN** el usuario ve bajo ese campo «Entre 8 y 32 caracteres.»

### Requirement: Inicio de sesión
El sistema SHALL permitir entrar con email y contraseña, y SHALL entregar una sesión nueva cada vez que las credenciales son correctas.

#### Scenario: Credenciales correctas
- **WHEN** un visitante con cuenta envía el formulario de inicio de sesión con su email y su contraseña
- **THEN** el sistema responde 200 con los datos del usuario y un token, y el usuario ve su perfil

#### Scenario: Credenciales incorrectas
- **WHEN** un visitante envía el formulario de inicio de sesión con una contraseña errónea o con un email sin cuenta
- **THEN** el sistema responde 400 con el mismo error en ambos casos, sin indicar el campo, y el usuario ve «El email o la contraseña no son correctos.»

#### Scenario: Contraseña que no cumpliría las reglas del registro
- **WHEN** un visitante envía el formulario de inicio de sesión con un email de una cuenta existente y una contraseña de 1 carácter
- **THEN** el sistema responde 400 como credenciales incorrectas, no como error de validación

#### Scenario: Campos vacíos
- **WHEN** un visitante envía el formulario de inicio de sesión sin rellenar el email ni la contraseña
- **THEN** el sistema responde 422 con un error en cada campo y el usuario ve bajo cada uno un aviso de que falta rellenarlo

#### Scenario: Email con formato inválido
- **WHEN** un visitante envía el formulario de inicio de sesión con un email sin formato de dirección válida
- **THEN** el sistema responde 422 con un error en el campo `email` y el usuario ve bajo ese campo «Introduce una dirección de email válida.»

### Requirement: Perfil de la cuenta
El sistema SHALL mostrar a quien tiene sesión los datos de su propia cuenta, SHALL NOT incluir la contraseña en ninguna respuesta y SHALL NOT ofrecer ninguna forma de modificar esos datos.

#### Scenario: Consulta del perfil en la API
- **WHEN** un cliente envía `GET /api/v1/account/profile` con un token válido
- **THEN** el sistema responde 200 con el identificador, el nombre, el email, las fechas de creación y actualización y las iniciales, sin la contraseña

#### Scenario: Pantalla de perfil
- **WHEN** una persona con sesión abre su perfil
- **THEN** el usuario ve sus iniciales, su nombre, su email, la fecha en que se hizo miembro y un botón para cerrar sesión

#### Scenario: Iniciales con nombre de dos o más palabras
- **WHEN** una cuenta tiene como nombre «Ada Lovelace» o «Ada King Lovelace»
- **THEN** sus iniciales son «AL» en el primer caso y «AK» en el segundo, las de las dos primeras palabras

#### Scenario: Iniciales con nombre de una palabra
- **WHEN** una cuenta tiene como nombre «Ada»
- **THEN** sus iniciales son «AD», las dos primeras letras en mayúsculas

#### Scenario: Iniciales sin nombre
- **WHEN** una cuenta sin nombre tiene como email `b2@x.com`
- **THEN** sus iniciales son «BX», la primera letra de lo que hay a cada lado de la arroba

#### Scenario: Perfil sin edición en la pantalla
- **WHEN** una persona con sesión abre su perfil
- **THEN** el usuario no ve ningún campo editable ni más acción que «Cerrar sesión»

#### Scenario: Perfil sin edición en la API
- **WHEN** un cliente envía `PUT`, `PATCH` o `DELETE` a `/api/v1/account/profile` con un token válido
- **THEN** el sistema responde 404 y los datos de la cuenta no cambian

### Requirement: Peticiones privadas de la API
El sistema SHALL rechazar las peticiones de perfil y de cierre de sesión que no lleven un token válido.

#### Scenario: Petición sin token
- **WHEN** un cliente envía `GET /api/v1/account/profile` o `POST /api/v1/account/logout` sin token
- **THEN** el sistema responde 401

#### Scenario: Petición con token no reconocido
- **WHEN** un cliente envía `GET /api/v1/account/profile` con un token que el sistema no reconoce
- **THEN** el sistema responde 401

### Requirement: Cierre de sesión
El sistema SHALL permitir cerrar la sesión actual, y SHALL dejar de aceptar su token sin afectar a otras sesiones de la misma cuenta.

#### Scenario: Cierre de sesión en la API
- **WHEN** un cliente envía `POST /api/v1/account/logout` con un token válido
- **THEN** el sistema responde 200 con un mensaje de confirmación y las peticiones posteriores con ese token reciben 401

#### Scenario: Otra sesión de la misma cuenta
- **WHEN** una cuenta ha iniciado sesión dos veces y cierra una de las dos sesiones
- **THEN** el token de la otra sesión sigue siendo válido

#### Scenario: Cierre de sesión desde la pantalla
- **WHEN** una persona con sesión pulsa «Cerrar sesión» en su perfil
- **THEN** el usuario ve la pantalla de inicio de sesión sin ningún aviso de error

#### Scenario: Cierre de sesión sin respuesta del servidor
- **WHEN** una persona con sesión pulsa «Cerrar sesión» y el servidor no responde o devuelve un error
- **THEN** el usuario ve igualmente la pantalla de inicio de sesión, sin ningún aviso de error

#### Scenario: Volver atrás tras cerrar sesión
- **WHEN** una persona cierra sesión y pulsa «atrás» en el navegador
- **THEN** el usuario sigue en la pantalla de inicio de sesión y no ve los datos de su perfil

### Requirement: Continuidad de la sesión en el navegador
El sistema SHALL conservar la sesión al recargar o volver a abrir la aplicación en el mismo navegador, y SHALL comprobar con el servidor que sigue siendo válida antes de darla por buena.

#### Scenario: Recarga con sesión válida
- **WHEN** una persona con sesión recarga la página y el servidor reconoce su token
- **THEN** el usuario ve un indicador de carga y después sigue en la aplicación con su sesión

#### Scenario: Navegador cerrado y vuelto a abrir
- **WHEN** una persona con sesión cierra el navegador, lo vuelve a abrir y entra en la aplicación
- **THEN** el usuario ve su perfil sin volver a introducir sus credenciales

#### Scenario: Sesión rechazada por el servidor
- **WHEN** una persona con sesión guardada abre la aplicación y el servidor responde 401 a su token
- **THEN** el usuario ve la pantalla de inicio de sesión con «Tu sesión ha caducado. Vuelve a iniciar sesión.» y, aunque recargue, tiene que volver a entrar

#### Scenario: Servidor inaccesible al restaurar la sesión
- **WHEN** una persona con sesión guardada abre la aplicación y no se puede conectar con el servidor
- **THEN** el usuario ve la pantalla de inicio de sesión con «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.» y recupera la sesión si recarga cuando el servidor vuelve y sigue reconociendo su token

#### Scenario: Error del servidor al restaurar la sesión
- **WHEN** una persona con sesión guardada abre la aplicación y el servidor responde con un error que no es 401
- **THEN** el usuario ve la pantalla de inicio de sesión con «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.» y recupera la sesión si recarga cuando el servidor se recupera y sigue reconociendo su token

### Requirement: Protección de pantallas
El sistema SHALL mostrar el perfil solo a quien tiene sesión, y SHALL mostrar las pantallas de inicio de sesión y registro solo a quien no la tiene.

#### Scenario: Visitante sin sesión en el perfil
- **WHEN** un visitante sin sesión abre la dirección `/profile`
- **THEN** el usuario ve la pantalla de inicio de sesión

#### Scenario: Persona con sesión en las pantallas de acceso
- **WHEN** una persona con sesión abre la dirección `/login` o `/register`
- **THEN** el usuario ve su perfil

#### Scenario: Dirección desconocida sin sesión
- **WHEN** un visitante sin sesión abre una dirección que no existe en la aplicación
- **THEN** el usuario ve la pantalla de inicio de sesión

#### Scenario: Dirección desconocida con sesión
- **WHEN** una persona con sesión abre una dirección que no existe en la aplicación
- **THEN** el usuario ve su perfil

#### Scenario: Sesión pendiente de comprobar
- **WHEN** alguien abre cualquier pantalla de acceso o de perfil mientras se comprueba su sesión guardada
- **THEN** el usuario ve un indicador de carga y ni el formulario ni el perfil

### Requirement: Uso de los formularios de acceso
El sistema SHALL indicar el estado del envío en los formularios de inicio de sesión y registro, explicar los fallos de conexión o de servidor y permitir pasar de un formulario al otro.

#### Scenario: Envío en curso al iniciar sesión
- **WHEN** un visitante envía el formulario de inicio de sesión y aún no hay respuesta
- **THEN** el usuario ve el botón desactivado con el texto «Entrando…»

#### Scenario: Envío en curso al registrarse
- **WHEN** un visitante envía el formulario de registro y aún no hay respuesta
- **THEN** el usuario ve el botón desactivado con el texto «Creando cuenta…»

#### Scenario: Servidor inaccesible al enviar
- **WHEN** un visitante envía uno de los dos formularios y no se puede conectar con el servidor
- **THEN** el usuario ve un aviso general con «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.» y puede volver a enviarlo

#### Scenario: Error del servidor al enviar
- **WHEN** un visitante envía uno de los dos formularios y el servidor responde con un error 5xx
- **THEN** el usuario ve un aviso general con «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.» y puede volver a enviarlo

#### Scenario: Paso de inicio de sesión a registro
- **WHEN** un visitante pulsa «Crea una» en la pantalla de inicio de sesión
- **THEN** el usuario ve el formulario de registro

#### Scenario: Paso de registro a inicio de sesión
- **WHEN** un visitante pulsa «Inicia sesión» en la pantalla de registro
- **THEN** el usuario ve el formulario de inicio de sesión

## Verificación

Comprobación hecha por el agente el 2026-11-01, sin tocar el código, con Chromium sin interfaz y peticiones reales contra copias desechables del backend y del frontend. Resultado: 45 escenarios verificados y 2 pendientes, de 47.

### Registro de usuario: verificado

| Scenario | Estado | Cómo |
|---|---|---|
| Registro con datos válidos | Verificado | Navegador y API |
| Email ya registrado | Verificado | Navegador y API |
| Email con formato inválido | Verificado | Navegador y API |
| Contraseña demasiado corta | Verificado | Navegador y API |
| Contraseña demasiado larga | Verificado | Navegador y API |
| Contraseñas distintas en la pantalla | Verificado | Navegador |
| Contraseñas distintas en la API | Verificado | API |
| Campos obligatorios vacíos | Verificado | Navegador y API |
| Registro sin nombre desde la pantalla | Verificado | Navegador |
| Nombre nulo o vacío en la API | Verificado | API |
| Nombre ausente en la API | Verificado | API |
| Pista sobre la contraseña | Verificado | Navegador |

### Inicio de sesión: verificado

| Scenario | Estado | Cómo |
|---|---|---|
| Credenciales correctas | Verificado | Navegador y API |
| Credenciales incorrectas | Verificado | Navegador y API |
| Contraseña que no cumpliría las reglas del registro | Verificado | API |
| Campos vacíos | Verificado | Navegador y API |
| Email con formato inválido | Verificado | Navegador y API |

### Perfil de la cuenta: verificado

| Scenario | Estado | Cómo |
|---|---|---|
| Consulta del perfil en la API | Verificado | API |
| Pantalla de perfil | Verificado | Navegador |
| Iniciales con nombre de dos o más palabras | Verificado | API |
| Iniciales con nombre de una palabra | Verificado | API |
| Iniciales sin nombre | Verificado | API |
| Perfil sin edición en la pantalla | Verificado | Navegador |
| Perfil sin edición en la API | Verificado | API |

### Peticiones privadas de la API: verificado

| Scenario | Estado | Cómo |
|---|---|---|
| Petición sin token | Verificado | API |
| Petición con token no reconocido | Verificado | API |

### Cierre de sesión: verificado

| Scenario | Estado | Cómo |
|---|---|---|
| Cierre de sesión en la API | Verificado | API |
| Otra sesión de la misma cuenta | Verificado | API |
| Cierre de sesión desde la pantalla | Verificado | Navegador y API |
| Cierre de sesión sin respuesta del servidor | Verificado | Navegador; servidor parado de verdad, error 500 simulado |
| Volver atrás tras cerrar sesión | Verificado | Navegador |

### Continuidad de la sesión en el navegador: pendiente

| Scenario | Estado | Cómo |
|---|---|---|
| Recarga con sesión válida | Verificado | Navegador |
| Navegador cerrado y vuelto a abrir | Verificado | Navegador |
| Sesión rechazada por el servidor | Verificado | Navegador |
| Servidor inaccesible al restaurar la sesión | Verificado | Navegador; servidor parado de verdad |
| Error del servidor al restaurar la sesión | Pendiente | Solo con un error 500 simulado; la reacción de la pantalla es correcta, pero no se ha producido un 500 real sin tocar el código |

### Protección de pantallas: verificado

| Scenario | Estado | Cómo |
|---|---|---|
| Visitante sin sesión en el perfil | Verificado | Navegador |
| Persona con sesión en las pantallas de acceso | Verificado | Navegador |
| Dirección desconocida sin sesión | Verificado | Navegador |
| Dirección desconocida con sesión | Verificado | Navegador |
| Sesión pendiente de comprobar | Verificado | Navegador |

### Uso de los formularios de acceso: pendiente

| Scenario | Estado | Cómo |
|---|---|---|
| Envío en curso al iniciar sesión | Verificado | Navegador |
| Envío en curso al registrarse | Verificado | Navegador |
| Servidor inaccesible al enviar | Verificado | Navegador; servidor parado de verdad |
| Error del servidor al enviar | Pendiente | Solo con un error 500 simulado; la reacción de la pantalla es correcta, pero no se ha producido un 500 real sin tocar el código |
| Paso de inicio de sesión a registro | Verificado | Navegador |
| Paso de registro a inicio de sesión | Verificado | Navegador |


---

## Lista 1: Requisitos generados y comprobados
- Requisitos generados por el agente: X
- Requisitos que verifiqué en el código: Y

─────────────────────┬────────────┬────────────────────────┐
│           Requisito           │   Estado   │ Escenarios verificados │
├───────────────────────────────┼────────────┼────────────────────────┤
│ Registro de usuario           │ Verificado │ 12 de 12               │
├───────────────────────────────┼────────────┼────────────────────────┤
│ Inicio de sesión              │ Verificado │ 5 de 5                 │
├───────────────────────────────┼────────────┼────────────────────────┤
│ Perfil de la cuenta           │ Verificado │ 7 de 7                 │
├───────────────────────────────┼────────────┼────────────────────────┤
│ Peticiones privadas de la API │ Verificado │ 2 de 2                 │
├───────────────────────────────┼────────────┼────────────────────────┤
│ Cierre de sesión              │ Verificado │ 5 de 5                 │
├───────────────────────────────┼────────────┼────────────────────────┤
│ Continuidad de la sesión      │ Pendiente  │ 5 de 6                 │
├───────────────────────────────┼────────────┼────────────────────────┤
│ Protección de pantallas       │ Verificado │ 5 de 5                 │
├───────────────────────────────┼────────────┼────────────────────────┤
│ Uso de los formularios        │ Pendiente  │ 5 de 6                 │
└───────────────────────────────┴────────────┴────────────────────────┘


## Lista 2: Incoherencias detectadas
- [Descripción en una línea]. Dónde: [backend / frontend / pantalla de login, etc.]
- ...

Por qué hay dos pendientes: los dos escenarios son de errores 5xx del servidor. La pantalla reacciona bien, pero solo pude probarlo con un error 500 simulado, porque provocar uno real exigiría tocar el código. El escenario de logout sin respuesta del servidor sí lo marqué verificado: lo probé con el servidor parado de verdad, aunque su parte del error 500 también es simulada.

 
## Lista 3: Comportamientos sin clasificar (¿bug o contrato?)
- **Comportamiento:** ...
  - **Si es bug:** ...
  - **Si es contrato:** ...
  - **Por qué el código no lo aclara:** ...


- Email y contraseña: se aceptan contraseñas de 8 y 32 caracteres y se rechazan las de 7 y 33. Un email sin formato válido da 422.
- Email ya existente: responde 422, muestra el aviso bajo el campo y no crea la cuenta.
- Credenciales incorrectas: responde 400 con el mismo error si la contraseña es mala o si la cuenta no existe, así que no revela qué emails están registrados.
- Mensajes de error: coinciden con la spec, y además confirmé el aviso en minúscula: «la contraseña debe tener al menos 8 caracteres.»
- Logout: invalida el token y no afecta a otras sesiones de la misma cuenta. Volver atrás no muestra el perfil, que es lo que pide el RF-2 del PRD.
- Ruta protegida sin sesión: redirige a /login.
- Editar el perfil: no se puede. La pantalla no tiene ningún campo editable, y PUT, PATCH y DELETE sobre el perfil dan 404.

Nombre obligatorio u opcional: el RF-1 del PRD dice «con nombre, email y contraseña», pero la pantalla lo marca como opcional. Es el mejor candidato para la lista 3, porque aquí hay dos fuentes que se contradicen.
- Mayúsculas en el email: si la cuenta está en minúsculas, entrar con el email en mayúsculas da «credenciales incorrectas». Con espacios alrededor, en cambio, entra sin problema.
- Aviso que no se va: tras un fallo de conexión al restaurar la sesión, el aviso sigue visible aunque el siguiente intento dé un error de otro tipo.
- Aviso de sesión solo en el login: con un token rechazado, /register no muestra ningún aviso.
- Límite de 254 caracteres del email: no llegué a provocar su error. Un email de 262 caracteres se rechazó por formato.
- Token vivo tras el logout: ya estaba en la lista, y ahora está confirmado: si el servidor no recibe el logout, el token sigue siendo válido.
