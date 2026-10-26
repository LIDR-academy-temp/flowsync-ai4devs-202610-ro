# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Prompt 1

**Modelo:** Opus 1M xHigh
**Herramienta:** Claude Code

```
 Ahora mismo el proyecto solo cubre la autenticación y la cuenta del usuario. Todavía no hay nada de la gestión de
  tareas.

  Qué ya funciona
  - Registro: el usuario se da de alta con nombre (opcional), email único y contraseña con confirmación (POST
    /auth/signup).
  - Login: devuelve un token opaco de acceso (POST /auth/login).
  - Logout: invalida el token actual (POST /account/logout).
  - Perfil: devuelve los datos del usuario autenticado, incluidas sus iniciales (GET /account/profile).
  - Frontend: tiene tres pantallas (login, registro y perfil), protege las rutas privadas y aparta de login/registro a
    quien ya ha entrado. Guarda el token en el navegador y al arrancar comprueba que sigue siendo válido.

  Modelo de datos
  Hay dos tablas:
  - Usuario: nombre completo (opcional), email único, contraseña cifrada y fechas de creación y modificación.
  - Token de acceso: cada uno pertenece a un usuario y guarda su huella cifrada, permisos, último uso y caducidad.

  La única relación es que un usuario tiene muchos tokens. Si se borra el usuario, se borran sus tokens. No existen
  entidades de equipos, proyectos ni tareas.
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.
