# Especificación de comportamiento: Acceso y Cuentas

## Purpose

El módulo permite que una persona cree una cuenta, inicie sesión, consulte su perfil y cierre sesión. Protege las pantallas y los endpoints que requieren identidad y explica al usuario, en español, por qué una operación falló. La autenticación se basa en un token Bearer que el backend emite y el frontend conserva.

## Requirements

### Requirement: Contrato general de la API de acceso

La API SHALL exponer sus endpoints bajo el prefijo `/api/v1`: `POST /auth/signup`, `POST /auth/login`, `GET /account/profile` y `POST /account/logout`. SHALL responder siempre en JSON, aunque la petición no envíe `Accept: application/json`. Las respuestas exitosas de signup, login y profile SHALL envolver su contenido en la clave `data`. Los errores de validación SHALL tener la forma `{ errors: [{ message, rule, field, meta }] }`.

### Scenario: Respuesta exitosa envuelta en `data`
- **WHEN** el frontend llama a signup, login o profile con datos válidos
- **THEN** la respuesta SHALL contener `{ data: ... }` y el frontend SHALL leer su contenido desde `response.data`.

### Scenario: Petición a una ruta sin soporte de formato
- **WHEN** el cliente envía una petición con `Accept` distinto de JSON
- **THEN** el servidor SHALL tratarla como si fuera `application/json` y responder en JSON.

### Scenario: Acceso desde un origen distinto
- **WHEN** el frontend, servido desde otro origen, llama a la API en un entorno de desarrollo
- **THEN** el servidor SHALL aceptar cualquier origen y permitir credenciales.

- **WHEN** el mismo acceso ocurre con el backend en producción
- **THEN** el servidor SHALL rechazar los orígenes cruzados, porque la lista de orígenes permitidos está vacía.

**FOR FURTHER REVIEW:** `.env.example` documenta `CORS_ORIGIN`, pero `config/cors.ts` no la lee y `start/env.ts` no la declara. En producción no hay forma configurable de permitir el frontend.

**FOR FURTHER REVIEW:** Ningún controlador fija un código de estado explícito. Signup y login parecen responder con el código por defecto (200), no 201 para la creación de cuenta. Esto se deduce del código, no de una ejecución.

---

### Requirement: Registro de cuenta (signup)

El sistema SHALL crear una cuenta cuando `POST /api/v1/auth/signup` recibe `fullName` (texto o `null`), `email`, `password` y `passwordConfirmation` válidos. La respuesta SHALL incluir el usuario (`id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`) y un `token`. La respuesta SHALL NOT incluir la contraseña. Tras el registro, la persona SHALL quedar autenticada sin pasar por login.

### Scenario: Registro exitoso con nombre
- **WHEN** el frontend envía `fullName: "Ada Lovelace"`, un email nuevo y válido, y contraseña y confirmación iguales de 8 a 32 caracteres
- **THEN** la API SHALL responder con `data.user` y `data.token`, y el frontend SHALL guardar el token y mostrar `/profile`.

### Scenario: Registro exitoso sin nombre
- **WHEN** la persona deja vacío el campo "Nombre completo (opcional)"
- **THEN** el frontend SHALL enviar `fullName: null` y la API SHALL crear la cuenta con `fullName` nulo.

### Scenario: Email ya registrado
- **WHEN** el email enviado ya pertenece a otra cuenta
- **THEN** la API SHALL responder 422 con error de regla `database.unique` sobre `email`, y el frontend SHALL mostrar bajo el campo Email: "Ese email ya está registrado. Inicia sesión en su lugar."

**FOR FURTHER REVIEW:** La unicidad del email y el login comparan el texto tal cual. El código no normaliza mayúsculas/minúsculas ni espacios, así que `Ada@x.com` y `ada@x.com` podrían crear cuentas distintas. Depende del comportamiento del motor de base de datos.

---

### Requirement: Validación de los datos de registro

La API SHALL rechazar con 422 las peticiones de signup que incumplan estas reglas: `fullName` presente (puede ser `null`), `email` con formato válido, máximo 254 caracteres y único, `password` de 8 a 32 caracteres, y `passwordConfirmation` de 8 a 32 caracteres e igual a `password`. SHALL informar cada campo con error de forma independiente.

### Scenario: Contraseña demasiado corta
- **WHEN** `password` y `passwordConfirmation` son iguales pero tienen menos de 8 caracteres
- **THEN** la API SHALL responder 422 con errores `minLength` en ambos campos, y el frontend SHALL mostrar "la contraseña debe tener al menos 8 caracteres." y el mismo aviso para la confirmación.

### Scenario: Confirmación distinta, detectada por la API
- **WHEN** una petición llega a la API con `passwordConfirmation` distinto de `password` y ambos con longitud válida
- **THEN** la API SHALL responder 422 con regla `sameAs` sobre `passwordConfirmation`, que el frontend traduce a "Las contraseñas no coinciden."

### Scenario: Email con formato inválido
- **WHEN** el email no tiene formato de dirección
- **THEN** la API SHALL responder 422 con regla `email` y el frontend SHALL mostrar "Introduce una dirección de email válida." bajo el campo.

### Scenario: Cadena vacía convertida en `null`
- **WHEN** el cuerpo JSON trae una cadena vacía en `email` o `password`
- **THEN** la API SHALL tratarla como `null` y responder 422 con regla `required`, que el frontend muestra como "Falta rellenar el email." o "Falta rellenar la contraseña."

**FOR FURTHER REVIEW:** `fullName` no tiene longitud máxima en el validador, mientras la columna `full_name` es `string`. No se comprobó el comportamiento con nombres muy largos.

**FOR FURTHER REVIEW:** `passwordConfirmation` hereda el mínimo y máximo de la contraseña. Una confirmación corta produce además un error de longitud en ese campo.

---

### Requirement: Inicio de sesión (login)

El sistema SHALL autenticar a la persona cuando `POST /api/v1/auth/login` recibe un `email` y un `password` que corresponden a una cuenta existente. SHALL responder con `data.user` y un `data.token` nuevo. Cada login SHALL generar un token distinto sin invalidar los anteriores.

### Scenario: Login exitoso
- **WHEN** la persona introduce email y contraseña correctos y pulsa "Entrar"
- **THEN** la API SHALL responder con usuario y token, el frontend SHALL guardar la sesión y SHALL mostrar `/profile`.

### Scenario: Credenciales incorrectas
- **WHEN** el email no existe o la contraseña no coincide
- **THEN** la API SHALL responder con estado 400 sin campo asociado, y el frontend SHALL mostrar en un aviso rojo: "El email o la contraseña no son correctos."

### Scenario: Campos vacíos o email mal formado
- **WHEN** la persona envía el formulario con email vacío, contraseña vacía o un email sin formato válido
- **THEN** la API SHALL responder 422 con errores por campo y el frontend SHALL mostrarlos bajo el input correspondiente, sin aviso general.

### Scenario: Varias sesiones simultáneas
- **WHEN** la misma cuenta inicia sesión desde dos navegadores
- **THEN** cada uno SHALL recibir un token propio y ambos SHALL seguir siendo válidos.

**FOR FURTHER REVIEW:** El frontend interpreta cualquier 400 como "credenciales incorrectas". El código solo sustenta que `verifyCredentials` produce ese 400. Otro 400 (por ejemplo, un JSON mal formado) se mostraría con el mismo texto engañoso.

**FOR FURTHER REVIEW:** `loginValidator` exige para la contraseña solo que sea texto, sin longitud mínima. Es coherente con no filtrar reglas en login, pero queda distinto de signup.

**FOR FURTHER REVIEW:** No hay limitación de intentos ni bloqueo por fallos repetidos en el código revisado.

**FOR FURTHER REVIEW:** `DbAccessTokensProvider.forModel(User)` se declara sin expiración, y la migración deja `expires_at` nulo. Los tokens parecen no caducar, aunque el frontend habla de sesión "caducada". Depende de los valores por defecto de la librería, que no se verificaron.

---

### Requirement: Consulta del perfil

`GET /api/v1/account/profile` SHALL devolver `data` con `id`, `fullName`, `email`, `createdAt`, `updatedAt` e `initials` del usuario dueño del token. SHALL requerir el encabezado `Authorization: Bearer <token>` válido.

### Scenario: Perfil con token válido
- **WHEN** el frontend llama a profile con un token vigente
- **THEN** la API SHALL responder con los datos del usuario y el frontend SHALL poblar el estado de sesión.

### Scenario: Perfil sin token o con token inválido
- **WHEN** la petición no trae token, o el token no existe o fue revocado
- **THEN** la API SHALL responder 401 y el frontend SHALL interpretarlo como "Tu sesión ha caducado. Vuelve a iniciar sesión."

---

### Requirement: Protección de endpoints de cuenta

Los endpoints bajo `/api/v1/account` SHALL ejecutar un middleware de autenticación y SHALL NOT ejecutar su controlador si no hay un usuario autenticado. Los endpoints `/api/v1/auth/*` SHALL ser públicos.

### Scenario: Endpoint protegido sin credenciales
- **WHEN** se llama a `GET /account/profile` o `POST /account/logout` sin `Authorization`
- **THEN** la API SHALL responder 401 sin ejecutar la acción.

### Scenario: Endpoint público con un token residual
- **WHEN** el cliente llama a signup o login enviando además un token cualquiera
- **THEN** la API SHALL procesar la petición con normalidad, porque la comprobación silenciosa de autenticación no bloquea.

**FOR FURTHER REVIEW:** El cuerpo exacto del 401 y del 400 de credenciales lo genera la librería de autenticación, no este repositorio. El frontend solo depende del código de estado.

---

### Requirement: Cierre de sesión

`POST /api/v1/account/logout` SHALL revocar el token con el que se hizo la petición y SHALL responder `{ message: "Logged out successfully" }`. SHALL NOT afectar a otros tokens de la misma cuenta.

### Scenario: Cierre de sesión con token válido
- **WHEN** el frontend llama a logout con un token vigente
- **THEN** la API SHALL eliminar ese token y responder con el mensaje, y el token SHALL dejar de servir en peticiones siguientes.

### Scenario: Cierre de sesión con token ya inválido
- **WHEN** el frontend llama a logout con un token inexistente
- **THEN** la API SHALL responder 401, y el frontend SHALL ignorar el error porque su sesión local ya está cerrada.

**FOR FURTHER REVIEW:** El mensaje de logout está en inglés y sin envoltorio `data`, a diferencia de las demás respuestas. El frontend no lo lee ni lo muestra.

---

### Requirement: Datos de usuario devueltos e iniciales

La API SHALL calcular `initials` así: con `fullName`, las iniciales de sus dos primeras palabras en mayúsculas; con una sola palabra, sus dos primeras letras; sin `fullName`, SHALL derivarlas del email.

### Scenario: Nombre de dos palabras
- **WHEN** el usuario tiene `fullName: "Ada Lovelace"`
- **THEN** `initials` SHALL ser `"AL"`.

### Scenario: Nombre de una palabra
- **WHEN** el usuario tiene `fullName: "Ada"`
- **THEN** `initials` SHALL ser `"AD"`.

### Scenario: Nombre de tres palabras
- **WHEN** el usuario tiene `fullName: "Ana María López"`
- **THEN** `initials` SHALL ser `"AM"`, usando solo las dos primeras palabras.

### Scenario: Usuario sin nombre
- **WHEN** el usuario no tiene `fullName` y su email es `ada@example.com`
- **THEN** `initials` SHALL ser `"AE"`, formada por la primera letra del texto antes de `@` y la primera del dominio.

**FOR FURTHER REVIEW:** Para usuarios sin nombre, las iniciales salen de la parte local y del dominio del email (`"AE"`). Probablemente se pretendían las dos primeras letras de la parte local (`"AD"`). Si hay espacios dobles, la segunda "palabra" queda vacía y se usan las dos primeras letras.

---

### Requirement: Persistencia y restauración de la sesión en el frontend

El frontend SHALL guardar el token en `localStorage` bajo la clave `flowsync.token` al registrarse o iniciar sesión. Al cargar la aplicación con un token guardado, SHALL validarlo con `GET /account/profile` antes de considerar autenticada a la persona, y mientras tanto el estado SHALL ser `loading`.

### Scenario: Recarga con token válido
- **WHEN** la persona recarga la página con un token guardado que el backend acepta
- **THEN** el frontend SHALL mostrar un cargador a pantalla completa y después restaurar el usuario y el estado `authenticated`.

### Scenario: Recarga con token rechazado
- **WHEN** el backend responde 401 al validar el token guardado
- **THEN** el frontend SHALL borrar el token, pasar a `anonymous` y mostrar en el login "Tu sesión ha caducado. Vuelve a iniciar sesión."

### Scenario: Recarga con backend caído o con error
- **WHEN** la validación falla por error de red o de servidor (no 401)
- **THEN** el frontend SHALL pasar a `anonymous`, conservar el token guardado y mostrar en el login el mensaje del error (por ejemplo, "No se pudo conectar con el servidor. Comprueba que el backend está arrancado.").

### Scenario: Sin token guardado
- **WHEN** no hay token en `localStorage`
- **THEN** el estado SHALL ser `anonymous` desde el inicio, sin llamada al backend.

**FOR FURTHER REVIEW:** `sessionError` solo se limpia al iniciar sesión o cerrar sesión. Puede seguir apareciendo cuando la persona va de `/register` a `/login`.

**FOR FURTHER REVIEW:** En el login, el aviso es `formError ?? sessionError`. Si el intento falla con errores solo por campo (`formError` nulo), reaparece el mensaje antiguo de sesión perdida junto al error del campo.

**FOR FURTHER REVIEW:** No hay manejo global de 401 posterior a la carga inicial. Si el token se revoca con la aplicación abierta, la interfaz no se entera hasta recargar. Tampoco hay sincronización entre pestañas: cerrar sesión en una no afecta a las demás.

**FOR FURTHER REVIEW:** El token queda en `localStorage`, accesible a cualquier script de la página.

---

### Requirement: Protección de rutas en el frontend

El frontend SHALL aplicar tres reglas de enrutado. `/profile` SHALL exigir sesión (`ProtectedRoute`). `/login` y `/register` SHALL ser accesibles solo sin sesión (`PublicOnlyRoute`). Cualquier otra ruta SHALL redirigir a `/profile`. Mientras el estado sea `loading`, ambos guardianes SHALL mostrar el cargador y SHALL NOT redirigir.

### Scenario: Acceso a `/profile` sin sesión
- **WHEN** una persona anónima abre `/profile`
- **THEN** el frontend SHALL redirigirla a `/login` reemplazando la entrada del historial.

### Scenario: Acceso a login o registro con sesión activa
- **WHEN** una persona autenticada abre `/login` o `/register`
- **THEN** el frontend SHALL redirigirla a `/profile`.

### Scenario: Ruta desconocida o raíz
- **WHEN** la persona abre `/` o cualquier ruta no definida
- **THEN** el frontend SHALL redirigir a `/profile` y, si no hay sesión, de ahí a `/login`.

### Scenario: Recarga durante la validación del token
- **WHEN** la página recarga con un token guardado y la validación está en curso
- **THEN** el frontend SHALL mostrar el indicador "Cargando…" (accesible solo para lectores de pantalla) y SHALL NOT expulsar a la persona.

### Scenario: Cambio de estado tras login o logout
- **WHEN** el login tiene éxito, o la persona cierra sesión
- **THEN** el frontend SHALL llevarla a `/profile` o a `/login` respectivamente, mediante el cambio de estado y sin redirección manual.

**FOR FURTHER REVIEW:** `ProtectedRoute` no recuerda la ruta de destino original. Hoy solo existe `/profile`, así que no tiene efecto visible.

---

### Requirement: Pantalla de registro

La ruta `/register` SHALL mostrar el título "Crea tu cuenta" y un formulario con "Nombre completo (opcional)", "Email", "Contraseña" (con la pista "Entre 8 y 32 caracteres.") y "Repite la contraseña". SHALL incluir el botón "Crear cuenta" y un enlace "Inicia sesión" hacia `/login`. SHALL validar localmente solo que las contraseñas coincidan.

### Scenario: Contraseñas distintas
- **WHEN** la persona pulsa "Crear cuenta" con contraseñas diferentes
- **THEN** la pantalla SHALL mostrar "Las contraseñas no coinciden." bajo "Repite la contraseña" y SHALL NOT llamar a la API.

### Scenario: Envío en curso
- **WHEN** el formulario se envía a la API
- **THEN** el botón SHALL deshabilitarse y mostrar "Creando cuenta…" hasta recibir la respuesta.

### Scenario: Error de la API
- **WHEN** la API devuelve errores y todos corresponden a campos visibles
- **THEN** cada error SHALL mostrarse bajo su campo y no habrá aviso general.

- **WHEN** hay algún error cuyo campo no está en pantalla, o la causa es de red o servidor
- **THEN** SHALL aparecer un aviso rojo en la parte superior con el mensaje.

**FOR FURTHER REVIEW:** La pista dice "Entre 8 y 32 caracteres." pero el input solo declara `minLength={8}`, sin `maxLength`. Además el formulario usa `noValidate`, así que el navegador no aplica `required` ni `minLength`. Las reglas se aplican solo en el servidor.

**FOR FURTHER REVIEW:** Al cambiar la pista por un error de campo en la contraseña, el texto "Entre 8 y 32 caracteres." desaparece mientras el error está visible.

---

### Requirement: Pantalla de inicio de sesión

La ruta `/login` SHALL mostrar el título "Inicia sesión", los campos "Email" y "Contraseña", el botón "Entrar" y un enlace "Crea una" hacia `/register`. SHALL mostrar el aviso rojo con el error del último intento o, si no lo hay, el motivo por el que se perdió una sesión anterior.

### Scenario: Envío en curso
- **WHEN** la persona pulsa "Entrar"
- **THEN** el botón SHALL deshabilitarse y mostrar "Entrando…" hasta recibir la respuesta.

### Scenario: Error inesperado no controlado por la API
- **WHEN** ocurre un error que no es de la API
- **THEN** la pantalla SHALL mostrar "Algo ha ido mal. Inténtalo de nuevo."

### Scenario: Llegada tras sesión perdida
- **WHEN** la persona llega a `/login` tras un token rechazado o un fallo de restauración
- **THEN** el aviso rojo SHALL mostrar el motivo de la pérdida de sesión.

---

### Requirement: Pantalla de perfil

La ruta `/profile` SHALL mostrar un círculo con las iniciales, el nombre completo (o "Sin nombre" si no existe), el email, la fecha "Miembro desde" en formato largo español (es-ES) y el botón "Cerrar sesión".

### Scenario: Usuario con nombre
- **WHEN** la persona autenticada tiene nombre completo
- **THEN** la pantalla SHALL mostrarlo junto a su email, iniciales y fecha de alta.

### Scenario: Usuario sin nombre
- **WHEN** el usuario no tiene `fullName`
- **THEN** la pantalla SHALL mostrar "Sin nombre" como título.

### Scenario: Cierre de sesión desde el perfil
- **WHEN** la persona pulsa "Cerrar sesión"
- **THEN** el botón SHALL mostrar "Cerrando sesión…", la sesión local SHALL cerrarse de inmediato y la persona SHALL llegar a `/login`.

### Scenario: Cierre de sesión con fallo del servidor
- **WHEN** la llamada de logout falla por red o error de servidor
- **THEN** la sesión local SHALL permanecer cerrada y la persona NO verá ningún error.

**FOR FURTHER REVIEW:** Si logout falla por red, el token sigue siendo válido en el servidor aunque la interfaz lo dé por cerrado. El código lo asume como aceptable ("el objetivo está cumplido").

---

### Requirement: Mensajes de error comprensibles para la persona

El frontend SHALL traducir los errores de la API a español según el código de estado y la regla. 401 → "Tu sesión ha caducado. Vuelve a iniciar sesión." 400 → "El email o la contraseña no son correctos." Sin conexión → "No se pudo conectar con el servidor. Comprueba que el backend está arrancado." Cualquier otro error, o una respuesta que no sea JSON → "Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento." Los 422 SHALL traducirse por regla: `required`, `email`, `minLength`, `maxLength`, `sameAs`, `database.unique`. Cualquier regla no contemplada SHALL mostrar "Revisa <campo>."

### Scenario: Servidor devuelve HTML en un error 500
- **WHEN** la respuesta de error no es JSON
- **THEN** el frontend SHALL mostrar el mensaje genérico de error del servidor sin fallar al interpretarla.

### Scenario: Backend apagado
- **WHEN** la petición no llega al servidor
- **THEN** el frontend SHALL mostrar el mensaje de falta de conexión.

### Scenario: Varios errores sobre el mismo campo
- **WHEN** la API devuelve más de un error para un campo
- **THEN** el frontend SHALL mostrar solo el primero para ese campo.

**FOR FURTHER REVIEW:** El texto del 401 dice "sesión caducada" aunque también puede significar "token inexistente o revocado".

---

## Resumen de FOR FURTHER REVIEW

1. `CORS_ORIGIN` está documentada en `.env.example` pero no se usa. En producción el origen permitido es una lista vacía.
2. Los códigos de estado de éxito no son explícitos (signup responde probablemente 200, no 201).
3. Los emails no se normalizan (mayúsculas/espacios) en signup ni en login.
4. `fullName` no tiene longitud máxima en el validador.
5. El frontend asume que todo 400 es "credenciales incorrectas".
6. No hay limitación de intentos de login.
7. Los tokens parecen no caducar, mientras la interfaz habla de "caducada".
8. El mensaje de logout está en inglés y sin envoltorio `data`.
9. Iniciales de usuarios sin nombre: salen de la parte local y el dominio del email.
10. `sessionError` persiste entre pantallas y reaparece junto a errores solo por campo.
11. No hay manejo de 401 posterior a la carga inicial ni sincronización entre pestañas.
12. El token vive en `localStorage`.
13. En la pantalla de registro, `minLength`/`required` no actúan por `noValidate`, y no hay `maxLength` pese a la pista "8 a 32".
14. Si logout falla por red, el token sigue válido en el servidor.
15. Existe configuración de sesión por cookie, el guard `web` y CSRF desactivado, pero ninguna ruta de este módulo los usa. Hay infraestructura sin uso aparente.
