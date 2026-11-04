# Spec Delta

## MODIFIED Requirements

### Requirement: Pantalla de registro

La aplicación web SHALL ofrecer en `/register` un formulario "Crea tu cuenta" con nombre completo marcado como opcional, email, contraseña con la indicación "Entre 8 y 32 caracteres." y repetición de la contraseña, además de un enlace a la pantalla de inicio de sesión.

#### Scenario: Registro correcto

- **WHEN** una persona rellena el formulario con datos válidos y pulsa "Crear cuenta"
- **THEN** se crea la cuenta, sigue sin sesión iniciada y ve la pantalla de inicio de sesión con el aviso "Cuenta creada. Inicia sesión para continuar."

#### Scenario: Nombre en blanco

- **WHEN** una persona se registra dejando el nombre vacío o solo con espacios y después inicia sesión
- **THEN** su perfil muestra "Sin nombre"

#### Scenario: Contraseñas distintas

- **WHEN** una persona pulsa "Crear cuenta" con dos contraseñas diferentes
- **THEN** ve "Las contraseñas no coinciden." bajo el campo de repetición, sin que se envíe ninguna petición al servidor

#### Scenario: Email ya registrado

- **WHEN** una persona se registra con un email que ya tiene cuenta
- **THEN** ve bajo el campo de email "Ese email ya está registrado. Inicia sesión en su lugar."

#### Scenario: Email inválido

- **WHEN** una persona se registra con un email de formato incorrecto
- **THEN** ve bajo el campo de email "Introduce una dirección de email válida."

#### Scenario: Contraseña corta

- **WHEN** una persona se registra con la misma contraseña de menos de 8 caracteres en ambos campos
- **THEN** ve bajo la contraseña "la contraseña debe tener al menos 8 caracteres.", bajo la repetición "la confirmación de la contraseña debe tener al menos 8 caracteres." y la indicación de longitud desaparece

#### Scenario: Contraseña larga

- **WHEN** una persona se registra con la misma contraseña de más de 32 caracteres en ambos campos
- **THEN** ve bajo la contraseña "la contraseña no puede superar los 32 caracteres." y bajo la repetición "la confirmación de la contraseña no puede superar los 32 caracteres."

#### Scenario: Formulario vacío

- **WHEN** una persona pulsa "Crear cuenta" sin rellenar nada
- **THEN** ve "Falta rellenar el email.", "Falta rellenar la contraseña." y "Falta rellenar la confirmación de la contraseña." bajo sus campos

#### Scenario: Envío en curso

- **WHEN** una persona ha pulsado "Crear cuenta" y el servidor aún no ha respondido
- **THEN** el botón muestra "Creando cuenta…" y está deshabilitado

### Requirement: Pantalla de inicio de sesión

La aplicación web SHALL ofrecer en `/login` un formulario "Inicia sesión" con email y contraseña, además de un enlace a la pantalla de registro.

#### Scenario: Credenciales correctas

- **WHEN** una persona introduce credenciales correctas y pulsa "Entrar"
- **THEN** queda con la sesión iniciada y ve la lista de tareas

#### Scenario: Credenciales incorrectas

- **WHEN** una persona introduce un email o una contraseña incorrectos
- **THEN** ve el aviso "El email o la contraseña no son correctos." sobre el formulario y permanece en la pantalla

#### Scenario: Formulario vacío

- **WHEN** una persona pulsa "Entrar" sin rellenar nada
- **THEN** ve "Falta rellenar el email." y "Falta rellenar la contraseña." bajo sus campos

#### Scenario: Email inválido

- **WHEN** una persona pulsa "Entrar" con un email de formato incorrecto y una contraseña
- **THEN** ve bajo el campo de email "Introduce una dirección de email válida."

#### Scenario: Envío en curso

- **WHEN** una persona ha pulsado "Entrar" y el servidor aún no ha respondido
- **THEN** el botón muestra "Entrando…" y está deshabilitado

#### Scenario: Aviso de cuenta creada tras un intento fallido

- **WHEN** hay un aviso de cuenta creada y un intento de inicio de sesión falla por credenciales incorrectas
- **THEN** la persona ve el aviso de credenciales en lugar del de cuenta creada

#### Scenario: Recarga con el aviso de cuenta creada

- **WHEN** la persona recarga la página después de ver el aviso de cuenta creada
- **THEN** ve la pantalla de inicio de sesión sin ese aviso

### Requirement: Protección de pantallas según la sesión

La aplicación web SHALL permitir ver el perfil solo con sesión iniciada, y las pantallas de inicio de sesión y registro solo sin ella.

#### Scenario: Perfil sin sesión

- **WHEN** una persona sin sesión abre `/profile`
- **THEN** es redirigida a `/login`

#### Scenario: Acceso con sesión

- **WHEN** una persona con sesión iniciada abre `/login` o `/register`
- **THEN** es redirigida a `/profile`

#### Scenario: Dirección desconocida

- **WHEN** una persona abre `/` o cualquier otra dirección no definida
- **THEN** es redirigida a `/profile` si tiene sesión y a `/login` si no la tiene

#### Scenario: Destino tras identificarse

- **WHEN** una persona sin sesión abre cualquier dirección protegida o desconocida y después inicia sesión
- **THEN** llega siempre a `/tasks`
