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


Registrados automáticamente por el hook personal `~/.claude/hooks/log-prompt.py`.

---

## Prompt 1

**Modelo:** desconocido
**Herramienta:** Claude Code

```
Ignora el fichero README.md
```

**Respuesta:**

Entendido, no tendré en cuenta `README.md`. ¿En qué quieres que trabaje?

---

## Prompt 2

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Explora el repositirio y genera una spec de lo que ya está escrito y ya funciona. Sólo lee y escribe lo que hace actualmente. Céntrate en el módulo de "cuentas y acceso" de FlowSync que ya funciona de extremo a extremo. Revisa "backend" y "frontend"
```

**Respuesta:**

He escrito la spec en `docs/specs/E1-cuentas-y-acceso.md`. Describe solo lo que el código hace hoy, sin `README.md`. Está sin commitear en la rama `spec-viva-ims`, porque los commits los haces tú.

Contenido:

- **Modelo de datos:** las tablas `users` y `auth_access_tokens`, el hash de contraseñas y la regla con la que se calculan las iniciales del usuario.
- **API:** los 4 endpoints con sus reglas de validación, las respuestas y errores (códigos 200, 400, 401 y 422) y el envoltorio `{ data }`. `logout` es la excepción: devuelve su respuesta sin envoltorio.
- **Frontend:** cómo `api.ts` traduce los errores al castellano, cómo se guarda y se recupera la sesión al recargar (con lo que pasa ante un 401 y ante un fallo de red), cómo se protegen las rutas y qué hace cada pantalla.
- **Flujos de extremo a extremo** y una tabla de 13 escenarios que se pueden comprobar. Ninguno está automatizado.
- **Comportamientos que conviene conocer:**
  - Los tokens no caducan y se acumulan: cada inicio de sesión crea uno nuevo y cerrar sesión solo revoca el que estás usando.
  - El email distingue mayúsculas de minúsculas, así que `Ada@x.com` y `ada@x.com` pueden ser dos cuentas distintas.
  - No hay límite de intentos de inicio de sesión.
  - El token se guarda en `localStorage`, donde cualquier script de la página puede leerlo.
- **Diferencias con el PRD (E1):**
  - El PRD pide el nombre al registrarse; en el código es opcional.
  - El «espacio compartido» al que debería llegar el usuario tras registrarse no existe: la única pantalla protegida es `/profile`.

---

## Prompt 3

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
renombra el fichero de spec a "ims.md" y muévelo al path "docs/spec-viva/"
```

**Respuesta:**

He movido la spec a `docs/spec-viva/ims.md`. Además he borrado la carpeta `docs/specs/`, que se había quedado vacía.

---

## Prompt 4

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Genera los requisitiso siguiendo el patrón WHEN/THEN
```

**Respuesta:**

He reescrito la sección 6 de `docs/spec-viva/ims.md` como 42 requisitos con el patrón WHEN/THEN, todos sobre lo que el código ya cumple hoy. Sustituyen a la antigua tabla de escenarios, que repetía lo mismo.

Están agrupados por bloque:

| Prefijo | Bloque | Nº |
|---|---|---|
| `REG` | Registro | 10 |
| `LOG` | Inicio de sesión | 7 |
| `SES` | Persistencia de sesión | 5 |
| `PRO` | Perfil | 4 |
| `OUT` | Cierre de sesión | 4 |
| `GRD` | Protección de rutas | 5 |
| `ERR` | Errores comunes del frontend | 7 |

- **WHILE:** para los estados que duran un tiempo (botón deshabilitado mientras se envía, loader mientras se valida la sesión) he usado WHILE en lugar de WHEN.
- **Nombre del usuario:** REG-6 recoge que el body tiene que incluir siempre la clave `fullName`, aunque valga `null`. Si falta, el backend responde 422.

Sigue sin haber tests automáticos que comprueben ninguno de estos requisitos, y lo dejo indicado en la propia sección.

---

## Prompt 5

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```


<pasted_content id="fb4a">
Sigue este formato obligatorio:

## Purpose: una o dos frases que expliquen para qué existe esta capability.

## Requirements: sección que contiene los requisitos, cada uno encabezado por ### Requirement: y redactado con SHALL para indicar lo que debe hacer el sistema.

#### Scenario:: al menos uno por requisito, con dos viñetas: **WHEN***. Incluye las precondiciones dentro de WHEN, sin utilizar GIVEN.

Idioma: español, excepto las palabras clave de la RFC.

Respeta estas tres reglas:

No utilices ADDED, MODIFIED ni REMOVED. Son secciones propias de una especificación de cambios (delta). En este ejercicio nos centramos en documentar el comportamiento actual del sistema.

Describe solo comportamientos observables desde fuera. No incluyas nombres de clases, archivos ni rutas del código. En la API, describe peticiones y respuestas; en el frontend, lo que el usuario ve y puede hacer.

No modifiques el código. Aunque encuentres errores o inconsistencias, déjalos tal como están.
</pasted_content id="fb4a">

```

**Respuesta:**

He reescrito `docs/spec-viva/ims.md` entero con el formato que pediste. No he tocado nada de código.

- **Estructura:** un título, `## Purpose`, `## Requirements` y 16 bloques `### Requirement:` redactados con SHALL / SHALL NOT. Cada uno tiene uno o más `#### Scenario:` con las viñetas **WHEN** y **THEN**, y las precondiciones van dentro del WHEN.
- **Solo comportamiento visible desde fuera:**
  - La parte de API describe peticiones y respuestas: métodos, rutas HTTP, cuerpos, códigos de estado y campos JSON.
  - La parte de interfaz describe lo que el usuario ve: textos de pantalla, botones, avisos y adónde acaba al navegar.
  - No aparecen clases, ficheros ni rutas del código. Tampoco el detalle de cómo se guarda la sesión: se cuenta como «la sesión se conserva».
- **Inconsistencias que dejo como comportamiento actual:**
  - Se pueden crear dos cuentas con el mismo email si solo cambian mayúsculas.
  - Los tokens no caducan, y un usuario puede tener varias sesiones activas a la vez.
  - Se acepta un nombre vacío o con solo espacios.
  - El login no limita la longitud de la contraseña.
  - El cierre de sesión devuelve su mensaje en inglés y sin el envoltorio `data` que llevan las demás respuestas.
  - Los mensajes de error empiezan en minúscula («la contraseña debe tener…»).
- **Contenido eliminado:** han desaparecido la tabla de alcance, el mapa de ficheros y la comparación con el PRD, porque no encajan en el formato o nombran código.

---

## Prompt 6

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Añádale un identificador a cada requisito y a cada escenario. Distíngueme, si puedes, cuales son de backend y cuales de frontend. Y en el formato, si puedes haz que se vea mejor la separación entre requisitos.
```

**Respuesta:**

He añadido identificadores, capa y separadores a `docs/spec-viva/ims.md`. El texto de los requisitos y escenarios no ha cambiado.

- **Identificadores:**
  - Requisitos: `API-01`…`API-08` para el backend y `UI-01`…`UI-07` para el frontend.
  - Escenarios: llevan el número de su requisito más un sufijo, por ejemplo `API-02.3` o `UI-05.1`.
  - Cada identificador va entre corchetes justo después de `Requirement:` o `Scenario:`, así que la cabecera obligatoria se mantiene.
- **Backend o frontend:** se ve en el prefijo y, además, cada requisito lleva debajo una línea destacada `> **Capa:** Backend (API)` o `> **Capa:** Frontend (interfaz)`. Primero van todos los de backend y después los de frontend.
- **Separación:** hay una línea horizontal `---` entre cada requisito y el siguiente.
- **Títulos:** he quitado el «en la API» del final de los títulos de backend, porque ya lo dice el prefijo `API`. Por ejemplo, «Registro de cuenta en la API» pasa a ser «[API-01] Registro de cuenta».

---

## Prompt 7

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Al final de la spec, añade 3 secciones nuevas que iré rellenando:
1. Requisitos generados y comprobados
2. Incoherencias detectadas
3. Comportamientos que no supiste clasificar como bug o contrato
```

**Respuesta:**

He añadido al final de `docs/spec-viva/ims.md`, tras una línea separadora, las tres secciones vacías:

1. Requisitos generados y comprobados
2. Incoherencias detectadas
3. Comportamientos que no supiste clasificar como bug o contrato

Cada una lleva un comentario `<!-- Pendiente de rellenar -->`, que no se ve al mostrar el Markdown.

---

## Prompt 8

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Rellena la sección de incoherencias detectadas
```

**Respuesta:**

He rellenado la sección «Incoherencias detectadas» en `docs/spec-viva/ims.md`. Es una tabla con 11 entradas, `INC-01` a `INC-11`, y cada una indica los requisitos a los que afecta (`API-xx`, `UI-xx`). No he tocado el código.

1. **Email:** distingue mayúsculas, así que el mismo email escrito distinto puede abrir dos cuentas.
2. **Contraseña:** el registro exige de 8 a 32 caracteres; el login acepta cualquier longitud.
3. **Respuesta de logout:** es la única que no va envuelta en `data` y la única con el mensaje en inglés.
4. **Nombre vacío:** la API lo guarda tal cual, y entonces el perfil sale con el título en blanco en vez de «Sin nombre». Un nombre de solo espacios deja el avatar sin iniciales.
5. **Nombre «opcional»:** la interfaz lo presenta así, pero la API exige que la clave `fullName` venga en la petición.
6. **«Tu sesión ha caducado»:** es el aviso que aparece, aunque los tokens nunca caducan.
7. **Cerrar sesión:** solo cierra la del dispositivo actual; las demás siguen abiertas indefinidamente.
8. **Validación en el navegador:** comprueba que las dos contraseñas coinciden, pero no la longitud que la propia pantalla anuncia.
9. **Mensajes de longitud:** son los únicos que empiezan en minúscula.
10. **Servidor caído al abrir:** se manda al usuario a iniciar sesión aunque su sesión guardada siga siendo válida, y el aviso usa lenguaje técnico.
11. **Diferencias con el PRD:** el nombre es opcional, y el «espacio compartido» al que se debería llegar tras registrarse no existe.

Tres de ellas podrían ser decisiones de diseño más que fallos: la `7` (varias sesiones abiertas), la `3` (respuesta de logout) y la `10` (servidor caído al abrir). Si lo prefieres, las paso a la sección 3, la de comportamientos sin clasificar.

---

## Prompt 9

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
¿has encontrado algún comportamiento que no tengas claro si es un error o si el sistema está diseñado para funcionar así?
```

**Respuesta:**

Sí, hay varios comportamientos que no puedo clasificar solo con el código. Ordenados de más a menos dudoso:

1. **Varias sesiones a la vez, y cerrar sesión solo cierra la actual** (`INC-07`). Cada login crea un token nuevo y el logout borra solo el que estás usando.
   - **Diseño:** permite estar conectado en el portátil y en el móvil a la vez. Además, es lo que hace por defecto el sistema de tokens de AdonisJS.
   - **Error:** no hay forma de cerrar todas las sesiones, y los tokens no caducan. Un token olvidado o robado vale para siempre.

2. **Los tokens no caducan nunca.** No se configura ninguna caducidad.
   - **Diseño:** en un MVP puede ser deliberado, para no obligar a volver a iniciar sesión.
   - **Error:** la interfaz dice «Tu sesión ha caducado», lo que sugiere que alguien esperaba que caducaran.

3. **El cierre de sesión se hace primero en el navegador e ignora si el servidor falla** (`UI-04.3`). El código lo comenta como intencionado: el objetivo es dejar de estar logueado.
   - **Error:** si la llamada al servidor falla, el token sigue siendo válido allí para siempre, y el usuario cree que ha cerrado sesión.

4. **El login no dice si el email existe, pero el registro sí.**
   - **Diseño:** en el login, credenciales incorrectas devuelven un 400 genérico sin decir qué falló, que es la práctica estándar para no revelar qué cuentas existen.
   - **Error:** el registro responde «Ese email ya está registrado», así que cualquiera puede averiguar si un email tiene cuenta. O la discreción del login es casual, o el registro tiene un agujero.

5. **El login no limita la longitud de la contraseña** (`INC-02`).
   - **Diseño:** es habitual no repetir en el login las reglas del registro, para no desvelar la política y no bloquear cuentas creadas con reglas anteriores.
   - **Error:** es simplemente una regla que se olvidó.

6. **Con el servidor caído al abrir, se muestra la pantalla de login pero se conserva la sesión** (`INC-10`). Conservar el token está comentado como deliberado.
   - **Duda:** no sé si mandar al usuario a la pantalla de login es intencionado o un efecto secundario. Una alternativa habría sido mostrar «sin conexión» y reintentar.

7. **La respuesta del logout no va envuelta en `{ data }` y viene en inglés** (`INC-03`).
   - **Diseño:** un mensaje informativo podría quedar fuera del envoltorio a propósito.
   - **Error:** parece un descuido, porque la convención del proyecto dice que toda respuesta pasa por el envoltorio. Ningún cliente lee ese mensaje, así que hoy no tiene efecto visible.

8. **Cualquier dirección desconocida lleva al perfil.**
   - **Diseño:** razonable mientras el perfil sea la única pantalla.
   - **Error:** si se espera una página de «no encontrado», no la hay.

Los que veo más claramente como errores ya están en «Incoherencias detectadas»: el email que distingue mayúsculas, el nombre vacío que acepta la API y las minúsculas en los mensajes.

Si quieres, paso estos ocho a la sección 3 («Comportamientos que no supiste clasificar como bug o contrato») con el argumento a favor de cada lectura. También quitaría de la sección 2 los que se repetirían (`INC-02`, `INC-03`, `INC-07`, `INC-10`).

---

## Prompt 10

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
La INC-2 lo considero un comportamiento correcto, para evitar dar información del tipo de algoritmo utilizado.
```

**Respuesta:**

He quitado `INC-02` de «Incoherencias detectadas» y he dejado el comportamiento recogido como parte del contrato.

- **Requisito `API-03`:** su descripción añade ahora que el login SHALL NOT aplicar a la contraseña las reglas de longitud del registro, para no dar pistas sobre la política de contraseñas ni sobre cómo se procesan.
- **Escenario `API-03.5`:** se queda igual. Ahora describe el comportamiento esperado, no una anomalía.
- **Numeración:** no he renumerado las demás incoherencias, así que siguen siendo `INC-01` e `INC-03`…`INC-11`. Así las referencias que ya tengas a ellas siguen siendo válidas.

---

## Prompt 11

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
La INC-7 también la considero un comportamiento correcto. Cuando se solicita cerrar la sesión, solo debe hacerse sobre la sesión en cuestión.
```

**Respuesta:**

He quitado `INC-07` de «Incoherencias detectadas» y he dejado el comportamiento como parte del contrato.

- **Requisito `API-06` (cierre de sesión):** añade ahora que las demás sesiones abiertas del mismo usuario SHALL seguir activas, porque cerrar sesión afecta solo a la sesión desde la que se pide.
- **Escenario `API-06.2` («Otros tokens siguen activos»):** se queda igual. Ahora describe el comportamiento esperado.
- **Numeración:** no he renumerado; las incoherencias que quedan son `INC-01`, `INC-03`…`INC-06` e `INC-08`…`INC-11`.

Que los tokens no caduquen sigue apareciendo en `INC-06`, el aviso «Tu sesión ha caducado» con tokens que no caducan. Ese es otro tema y lo he dejado como estaba.

---

## Prompt 12

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
El pertimir registrar un usuario sin rellenar el nombre no sé si es un bug o es parte del contrato. Añade esto en la seción 3 de comportamientos que no supe clasificar
```

**Respuesta:**

He añadido la sección 3 a `docs/spec-viva/ims.md` con una primera entrada, `NC-01` («Se puede crear una cuenta sin nombre»). La tabla recoge el comportamiento, el argumento si es contrato, el argumento si es bug y los requisitos afectados.

- **Si es contrato:** registrarse cuesta un campo menos. Pero hoy no hay ninguna forma de completar el nombre después.
- **Si es bug:** el PRD (RF-1) pide el nombre al registrarse. Además, en un producto de equipo los compañeros solo verían el email de esa persona.

Este caso sigue apareciendo también como incoherencia en `INC-11` (diferencias con el PRD): el nombre opcional queda clasificado a la vez como incoherencia y como dudoso. Propongo quitar esa frase de `INC-11` y dejar ahí solo lo del «espacio compartido». ¿Lo hago?

---

## Prompt 13

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Tras revisar bien los requisitos, el permitir registrar una cuentra sin rellenar el nombre es un bug, según la INC-5.
```

**Respuesta:**

He clasificado como bug que se pueda crear una cuenta sin nombre, dentro de `INC-05`, y he quitado esa entrada de la sección 3.

- **`INC-05`** pasa a llamarse «Se puede crear una cuenta sin nombre (bug)». Dice que el nombre debería ser obligatorio, pero que la API acepta `null` y la pantalla lo presenta como «(opcional)». Mantiene la incoherencia que ya tenía: la API exige la clave `fullName` pero acepta que venga vacía. Ahora apunta también a `API-01`, `UI-01.5` y `UI-03`.
- **Sección 3:** como `NC-01` era su única entrada, ha vuelto a quedar vacía con el comentario `<!-- Pendiente de rellenar -->`.
- **`INC-11`** (diferencias con el PRD) sigue diciendo que el nombre es opcional. Ahora concuerda con `INC-05`, así que no hay que tocarla.

Los requisitos `API-01`, `API-01.2`, `UI-01` y `UI-01.5` siguen describiendo que el nombre es opcional, porque es lo que hace el código hoy. Si prefieres que digan cómo debería funcionar (nombre obligatorio), habría que reescribirlos. Eso cambiaría la spec de «lo que hace» a «lo que debería hacer».

---

## Prompt 14

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Llevas razón, no puedo concluir del código que tenga que ser obligatorio el rellenar el nombre. Mueve esa duda a la sección 3, y reajusta lo necesario de la sescción 2.
```

**Respuesta:**

He devuelto a la sección 3 la duda sobre registrarse sin nombre y he ajustado la sección 2 para que no la dé por bug.

**Sección 2, incoherencias:**
- **`INC-05`** vuelve a recoger solo la contradicción técnica: la API acepta `fullName: null`, pero rechaza con un 422 la petición si falta la clave `fullName`. Esto es incoherente tanto si el nombre acaba siendo opcional como si no. He añadido que, si se decide que es opcional, omitir la clave debería tratarse igual que enviar `null`, y la entrada remite a `NC-01`.
- **`INC-11`** se queda solo con lo del «espacio compartido» que no existe. Lo del nombre opcional remite a `NC-01`, para no clasificarlo dos veces.

**Sección 3, comportamientos sin clasificar:**
- **`NC-01`** vuelve con el argumento de cada lado. He añadido por qué no se puede deducir del código que el nombre deba ser obligatorio: tanto la API como la pantalla lo tratan como opcional a propósito y de forma coherente.

---

## Prompt 15

**Modelo:** claude-opus-5-5
**Herramienta:** Claude Code

```
Escribe en la sección 1 el número de requisitos que has escrito.
```

**Respuesta:**

La spec tiene **15 requisitos y 49 escenarios**, y ya lo he anotado en una tabla en la sección 1 de `docs/spec-viva/ims.md`:

| Capa | Requisitos | Escenarios |
|---|---|---|
| Backend (API) | 8 (`API-01`…`API-08`) | 24 |
| Frontend (interfaz) | 7 (`UI-01`…`UI-07`) | 25 |
| **Total** | **15** | **49** |

Como la sección se titula «generados y comprobados», he añadido una nota. Los requisitos se han comprobado leyendo el código, no ejecutándolo: ninguno está cubierto por tests automáticos, porque no hay tests en el backend ni herramienta de tests en el frontend.
