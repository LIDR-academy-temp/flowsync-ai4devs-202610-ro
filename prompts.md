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

Claude localiza todo lo relacionado con cuentas y accessos, en el backend: rutas,controladores,modelo de
  usuarios,validadores y middlewares. En el frontend: pantallas de login y registro, estado de sesion, y rutas
  protegidas, solo lee sin modificar.

  Para generar la spec, redacta la spec con el formato obligatorio  [Pasted text #1 +19 lines] y recuerda las tres
  reglas.

Para verificar, toma los requisitos uno por uno, abre el codigo o prueba la app en el navegador y confirma que es
  cierto, marca cada uno como verificado o pendiente. Algunas ideas para revisar: validaciones de email y contraseñas,
  que pasa si el email ya existe, credenciales incorrectas, mensajes de error, logout, que pasa al entrar a una ruta
  protegida sin sesion y como se edita el perfil.

   El número de la lista 1 sigue siendo tuyo: estos 45 los comprobé yo, no tú. El README pregunta cuántos comprobaste tú, así que no los pongas como propios; puedes indicar que los verificó el agente.
- Sección de verificación: el README dice «ni una más» sobre los archivos del PR, no sobre su contenido, así que puede quedarse. Si la prefieres fuera, se quita sin afectar a la spec.
- prompts.md: aparece modificado y no es cosa mía; supongo que lo estás rellenando tú. Incluye también este prompt.

```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.

