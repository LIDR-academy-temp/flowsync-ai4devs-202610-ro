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

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
read ticket https://alfonsovizcaino.atlassian.net/jira/software/projects/FLOW/boards/2?filter=&groupBy=none&selectedIssue=FLOW-1
and implement the changes described there in the project located at "~/Documents/AI-Train/courses/L1DR/repo/flowsync-ai4devs-202610-ro/frontend"
```

**Qué salió:** I read FLOW-1, but I can’t reach your project folder,..Why I’m blocked: my file access is limited to...The path ~/Documents/AI-Train/courses/L1DR/repo/flowsync-ai4devs-202610-ro/frontend is outside that, so access was denied.

---

## Prompt 2

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
read ticket https://alfonsovizcaino.atlassian.net/jira/software/projects/FLOW/boards/2?filter=&groupBy=none&selectedIssue=FLOW-1
and implement the changes described there in the project located at "/home/alfonso/Documents/AI-Train/courses/L1DR/repo/flowsync-ai4devs-202610-ro/frontend"
```

**Qué salió:** The repo directory is allowed now, so I’ll look at the project...What the ticket asked for, and what I did....Tests (your AGENTS.md asks for Given/When/Then tests on every TS file)....Before you can run the tests: install the test dependencies. AGENTS.md says new dependencies need justification in the PR.....Left out of scope: the ticket only asks for the text boxes,....

---

## Prompt 3

**Modelo:** Sonnet 5.5 Medium
**Herramienta:** Claude Code

```
read ticket https://alfonsovizcaino.atlassian.net/jira/software/projects/FLOW/boards/2?filter=&groupBy=none&selectedIssue=FLOW-1
and implement the changes described there in the project located at "/home/alfonso/Documents/AI-Train/courses/L1DR/repo/flowsync-ai4devs-202610-ro-sin-harness/frontend"
```

**Qué salió:** FLOW-1 is implemented in the -sin-harness project, but I haven’t run it. I can only read and write files here, so it hasn’t been built, linted or opened in a browser,....Tests: this copy has no AGENTS.md asking for them and no test runner, so I didn’t add any tests or dependencies. The code is the same as in the other project, so those tests would work here too if you want them....As before, the ticket only asks for the text boxes, so there is no submit button or authentication call. I haven’t changed anything in Jira