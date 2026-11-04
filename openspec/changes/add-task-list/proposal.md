# Proposal

## Why

FlowSync solo tiene hoy cuentas y acceso: después de entrar no hay nada que hacer. Este change crea la primera capability de producto, una lista única de tareas del equipo que responde «quién está en qué» sin preguntar a nadie. Es además el sustrato del resto de las épicas E2 y E3: sin lista no hay dónde cambiar un estado ni nada que filtrar.

## What Changes

- **Tareas en la API:** nueva entidad con título, estado y responsable, y exactamente tres operaciones autenticadas: listar todas, crear una y actualizarla.
- **Creación mínima:** el título es lo único que se pide. La tarea nace en `pending` y con quien la crea como responsable.
- **Título validado:** obligatorio, no vale solo con espacios y admite como máximo 255 caracteres. Si se pasa, se avisa; nunca se recorta en silencio.
- **Estados cerrados:** `pending`, `in_progress` y `done` en la API, pintados como Pendiente, En curso y Hecho. Cualquier otro valor se rechaza con 422.
- **Actualización abierta a todos:** cualquier persona con sesión puede cambiar el estado y el responsable de cualquier tarea. Un responsable que no existe se rechaza con 422.
- **Pantalla `/tasks`:** nueva pantalla protegida con la lista compartida, el formulario de un solo campo, el cambio de estado en la propia fila y el selector de responsable.
- **Identificación por nombre:** cada fila muestra el nombre del responsable, o «Sin nombre» si no lo tiene. Nunca su correo ni su id.
- **Destino tras identificarse:** al iniciar sesión se llega a `/tasks`, y `/tasks` y `/profile` se enlazan entre sí. El resto de redirecciones con sesión sigue yendo a `/profile`.
- **Registro sin sesión en la web:** al registrarse se llega a `/login` sin sesión abierta, con el aviso «Cuenta creada. Inicia sesión para continuar.», y hay que iniciarla a mano. El contrato de `POST /api/v1/auth/signup` no cambia.

### Fuera de alcance

- Fecha de vencimiento: ni el dato ni marcas de vencida, y tampoco se deja preparada. Por eso E3-1 CA-7 se cubre solo en su parte negativa: la lista no muestra fechas.
- Lectura individual de una tarea, borrado y cualquier endpoint de equipo.
- Edición del título (RF-11), vista «mis tareas», tareas privadas, filtros y agrupación.
- Refresco automático de la lista (E3-2) y señales de presencia.
- Tests y base de pruebas: este change no los incluye.
- Componentes nuevos de design system y dependencias nuevas.

### Decisiones tomadas para este change

- **Reasignación parcial en pantalla:** la API admite cualquier persona registrada, pero sin endpoint de equipo la interfaz solo puede ofrecer a quienes ya aparecen como responsables en la lista. Quien todavía no tenga tareas no se puede elegir desde la pantalla.
- **Límite de título de 255 caracteres:** valor provisional para poder cumplir E2-2 CA-3, hasta que se resuelva PA-9.
- **Destino solo tras iniciar sesión:** el login lleva a `/tasks` y el registro a `/login`. Abrir `/login`, `/register`, `/` o una dirección desconocida con sesión sigue llevando a `/profile`.
- **Desviación de RF-1:** su aceptación pide quedar con sesión iniciada tras registrarse, sin pasos adicionales. Este change añade a propósito el paso de iniciar sesión, y el PRD queda pendiente de actualizar.

### Puntos abiertos

- **Orden de la lista (PA-3):** no hay regla decidida. La API no ordena explícitamente y la interfaz tampoco reordena, de modo que el orden observable no forma parte del contrato. Mientras siga abierto, E3-1 CA-5 se cumple solo a costa de recorrer la lista entera a ojo.
- **Reasignar a cualquier persona desde la pantalla:** necesita una fuente de personas que hoy está prohibida. Hay que decidirlo cuando se aborde RF-10.
- **Personas homónimas o sin nombre en el selector:** al no poder mostrar correo ni id, dos personas con el mismo nombre, o dos «Sin nombre», no se distinguen en la pantalla.
- **Umbral del título (PA-9):** confirmar o sustituir los 255 caracteres.
- **Transiciones de estado (PA-7):** ningún requisito las limita, así que se permite cualquier cambio entre los tres estados, incluido volver atrás desde Hecho.
- **Coste del gesto (PA-9):** «2 interacciones o menos» sigue sin definir qué cuenta como interacción.
- **Límite de tareas En curso por persona (PA-4)** y **qué se ve cuando dos personas chocan (PA-8):** sin decidir. Mientras tanto, gana la última escritura.

## Capabilities

### New Capabilities

- `tasks`: la lista única de tareas del equipo, con su creación, validación del título, estados y responsable, en la API y en la interfaz web.

### Modified Capabilities

- `auth`: el inicio de sesión lleva a `/tasks` y el registro en la web lleva a `/login` sin abrir sesión.

## Impact

- **Backend:** nueva migración y regeneración de `database/schema.ts`, modelo, validadores, transformers y controlador nuevos, tres rutas bajo `/api/v1/tasks`, y código generado en `.adonisjs/`.
- **Frontend:** `lib/api.ts` y `lib/types.ts` ampliados, página y ruta protegida nuevas, enlace en `profile-page.tsx`, y destinos de login y registro en `auth-provider.tsx`, `auth-context.ts`, `public-only-route.tsx` y `register-page.tsx`.
- **API:** tres operaciones nuevas que requieren token. Las existentes no cambian.
- **Dependencias:** ninguna.
- **Datos:** una tabla nueva, `tasks`, sin cambios en las existentes.
