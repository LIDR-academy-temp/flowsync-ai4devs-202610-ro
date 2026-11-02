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

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
    Objetivo: escribir la spec de lo que el sistema hace hoy, en docs/spec-viva/grr.md.
    Alcance: solo cuentas y acceso, con sus dos capas, backend y frontend.
    Formato: ## Purpose, ## Requirements, ### Requirement: con SHALL y #### Scenario: con WHEN y THEN, todo en castellano salvo las mayúsculas de la RFC.
    Reglas duras: nada de ADDED, MODIFIED ni REMOVED; solo comportamiento observable, sin nombres de archivos ni de clases; y no tocar el código.
```

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Encontré estos requerimientos adicionales entre "" revisando el código, por favor actualiza el archivo grr.md 

""
### Requirement: El email se guarda y se compara tal cual

El sistema SHALL guardar el email exactamente como se envía y SHALL compararlo distinguiendo mayúsculas de minúsculas, tanto al comprobar si ya está registrado como al iniciar sesión.

#### Scenario: Mismo email con otras mayúsculas en el registro

- **WHEN** ya existe una cuenta con `ada@flowsync.dev` y se registra `Ada@FlowSync.dev` con el resto de campos válidos
- **THEN** la respuesta es 200 y se crea una segunda cuenta, independiente de la primera

#### Scenario: Inicio de sesión con otras mayúsculas

- **WHEN** la cuenta se registró como `ada@flowsync.dev` y se inicia sesión con `ADA@flowsync.dev` y la contraseña correcta
- **THEN** la respuesta es 400, igual que con unas credenciales incorrectas

#### Scenario: Email con espacios alrededor enviado a la API

- **WHEN** se envía a la API un `email` con espacios al principio o al final
- **THEN** la respuesta es 422 con un error de formato sobre `email`, porque los espacios no se recortan

### Requirement: La sesión solo se comprueba al cargar la aplicación

La aplicación SHALL comprobar la sesión contra el servidor únicamente al cargarse cada pestaña, y SHALL seguir mostrando el perfil con los datos de ese momento mientras la persona no recargue, aunque la sesión deje de ser válida entretanto.

#### Scenario: Sesión revocada desde otro lugar

- **WHEN** el token de la persona deja de ser válido en el servidor mientras está viendo su perfil
- **THEN** sigue viendo su perfil sin aviso hasta que recarga, y entonces llega al inicio de sesión con "Tu sesión ha caducado. Vuelve a iniciar sesión."

#### Scenario: Pestaña nueva con sesión iniciada

- **WHEN** la persona tiene sesión iniciada en una pestaña y abre la aplicación en otra
- **THEN** la nueva pestaña entra directamente en su perfil, sin pedir credenciales

#### Scenario: Cierre de sesión en otra pestaña

- **WHEN** la persona cierra sesión en una pestaña y otra pestaña seguía mostrando el perfil
- **THEN** la otra pestaña sigue mostrando el perfil hasta que se recarga, y entonces llega al inicio de sesión sin aviso
""
```

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ajusta los puntos 2 y 3 con mi texto entre "", por favor valida lo que indico.

""
Incoherencias

Al repasar las omisiones aparecieron varias contradicciones entre la API y la pantalla. La más visible es el nombre: la pantalla recorta los espacios y lo envía como nulo si queda vacío, mientras que la API guarda "   " tal cual y entonces las iniciales salen vacías. Con el email pasa algo parecido: el navegador quita los espacios de los extremos y la API no, y además el mensaje "Ese email ya está registrado" no encaja con que el sistema acepte el mismo email con otras mayúsculas. Dentro de la propia spec hay dos choques: cualquier 401 se presenta como "sesión caducada" aunque los tokens no caducan nunca, y el perfil sigue visible después de que la sesión deje de ser válida. La regla de las iniciales tampoco se cumple con espacios dobles o con un espacio al principio. Por último quedan detalles menores: el logout responde sin envoltorio data, un mensaje de error empieza en minúscula y el texto "Cerrando sesión…" no llega a verse nunca.

Bug o contrato

En el fichero escribí estos comportamientos como contrato, pero en varios no supe decidir si son un bug. Los tres más importantes son que el email distinga mayúsculas, que no haya límite de intentos de login y que el perfil no se revalide ni se sincronice entre pestañas. Los dos primeros afectan a la seguridad del acceso y el tercero contradice el propósito de la spec. Los demás casos, como la contraseña del login sin límite de longitud o el token que sigue válido en el servidor si se cierra sesión con el servidor caído, tienen un argumento razonable a favor de cada lectura. Los tres primeros necesitan que alguien decida antes de pasar a la spec como contrato.
""
```
