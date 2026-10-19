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

**Modelo:** Opus 5.5 medium
**Herramienta:** Claude Code

```
ayudame a revisar el ticket su descripcion
https://joseasilvaponce.atlassian.net/browse/FLOW-1?atlOrigin=eyJpIjoiYjM1NWU1NTRlODQ3NDkyZDg4MGY3ZWUwZjg4YTJkMTciLCJwIjoiaiJ9
```

**Qué salió:** Para verificarlo hace falta el backend levantado: ahora mismo :3333 no responde. El frontend sí está en :5173.

¿Lo implemento? ¿Y relleno antes el ticket en Jira? Recuerda que el ejercicio del README pide comparar planes sin aplicarlos.


## Prompt 2
**Modelo:** Opus 5.5 medium
**Herramienta:** Claude Code

si ayudame a implementarlos

**Qué salió:**  26 archivos modificados
Lo que el ticket no decía y saqué del validador del backend

El signup exige passwordConfirmation y fullName. Añadí el campo "Confirmar contraseña" y un "Nombre (opcional)" que se envía como null si queda vacío.
La contraseña debe tener entre 8 y 32 caracteres. Lo comprueba también el propio formulario.
Al registrarse, el backend ya devuelve un token, así que el usuario entra directamente al perfil.
Si el token caduca, el perfil hace logout y vuelve al login.
Decisiones a revisar

react-router es la única librería añadida por decisión propia. Hacía falta para la redirección y la ruta protegida. Los formularios usan estado controlado de React, sin librería de formularios.
El CLI de shadcn falló. Reescribió los imports a from "cn" e instaló un paquete npm desconocido con ese nombre. Lo desinstalé, apunté los imports a @/lib/utils y escribí cn con clsx y tailwind-merge, que es lo estándar de shadcn.
Borré la plantilla de Vite (App.css y los logos de assets/).
Queda un aviso de lint en button.tsx, que es código generado por shadcn. No lo toqué.
Otras cosas que debes saber

No toqué el backend. Los cambios que aparecen en backend/ ya estaban antes de empezar.
Las pruebas crearon un usuario de prueba (qa…@test.com) en tu db.sqlite3.
Dejé el backend corriendo en segundo plano en :3333.
No he hecho commit ni he cambiado nada en Jira. Puedo hacer el commit y comentar o mover FLOW-1 si quieres.
Recuerda que el ejercicio del README pedía comparar planes sin implementarlos. Esta rama ya contiene la implementación.