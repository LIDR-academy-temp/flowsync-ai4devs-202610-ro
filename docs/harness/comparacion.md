###############
### PARTE A ###
###############

1. **Qué archivos propone tocar**
Claude con Harness: 7 modificaciones, 14 archivos nuevos y 4 borrados
Claude sin harness: 8 modificaciones, 12 archivos nuevos y 4 borrados

2. **Qué convenciones del proyecto respetó y cuáles no**
--------------------- CLAUDE CON HARNESS ---------------------
En el plan respeté convenciones de tres fuentes. Otras decisiones las tomé yo sin que nada del proyecto las fijara, y te las separo al final porque cuentan distinto en la comparación.

Escritas en CLAUDE.md
1. El backend no se toca: todos los cambios están en frontend/.
2. El contrato del validador: passwordConfirmation, contraseña de 8 a 32 caracteres y fullName opcional, aunque el ticket solo dice «email+password».
3. La forma de las respuestas: { data: ... }, el array errors, el token Bearer oat_… y los campos que expone UserTransformer.
4. Reglas de proceso: rama feat/FLOW-1-login-frontend antes de editar, /commit, PR contra la rama de partida y adversarial-reviewer sobre el PR. Están planificadas; no se han ejecutado.
5. Verificación con los comandos del frontend: npm run lint y npm run build.

De la skill /priority-ticket
6. Contrastar el ticket con el código antes de proponer nada: leí rutas, controladores, validador, transformer y las clases de error en node_modules.
7. Cada criterio de aceptación referenciado por su número, con su tabla de cobertura.

Del README y del propio frontend
8. shadcn/ui para los componentes, como pide el ticket y prevé el README.
9. El estilo de Prettier del harness (sin punto y coma, comillas simples). Lo aplicaría el hook al editar; el plan no lo menciona.
10. Las opciones de tsconfig.app.json (noUnusedLocals, verbatimModuleSyntax): las respetaría npm run build. El plan tampoco lo menciona.

Decisiones mías, sin convención que las fijara
- react-router, token en localStorage, proxy de Vite y alias @/. El alias lo pide la instalación de shadcn, pero en el proyecto no existe.
- La estructura de carpetas src/pages/, src/auth/ y src/lib/.
- Los textos de la interfaz en español.
- Borrar App.css y los assets de la plantilla.

--------------------- CLAUDE SIN HARNESS ---------------------
Tomado del proyecto

Contrato del backend:
- Respuestas envueltas en { data: ... }, como hace ApiSerializer en backend/providers/api_provider.ts.
- Errores con la forma { errors: [{ field, rule, message }] }: 422 de VineJS, 400 por credenciales inválidas y 401 sin token.
- Autenticación con Authorization: Bearer oat_..., que es el guard api por defecto en config/auth.ts.
- Las reglas del formulario de registro siguen validators/user.ts: passwordConfirmation, contraseña de 8 a 32 caracteres y fullName que acepta null.
- Rutas bajo el prefijo /api/v1, tal como están en start/routes.ts.

TypeScript y lint del frontend:
- verbatimModuleSyntax: obliga a usar import type para importar tipos.
- erasableSyntaxOnly: no permite enum ni parameter properties. Por eso ApiError se escribe con campos normales.
- allowImportingTsExtensions: los imports llevan la extensión .tsx, como main.tsx cuando importa ./App.tsx.
- noUnusedLocals y noUnusedParameters.
- oxlint con react/rules-of-hooks y react/only-export-components.

Estilo de código de la plantilla: comillas simples, sin punto y coma e indentación de 2 espacios.

Decidido por mí, sin respaldo en el proyecto
- Usar react-router y la estructura de carpetas src/lib/ y src/pages/, con nombres de página en PascalCase.
- Usar un proxy de Vite en lugar de una variable VITE_API_URL.
- Guardar el token en localStorage con la clave flowsync.token.
- Escribir los textos de la interfaz en español.
- Iniciar sesión automáticamente después del registro y añadir el botón de cerrar sesión. Ninguna de las dos cosas la pide el ticket.

Un ajuste que sale de esta revisión: en el plan, auth.tsx exporta a la vez componentes (AuthProvider y RequireAuth) y un hook (useAuth). Con la regla only-export-components de oxlint eso da un aviso. Lo correcto es separar useAuth y el contexto en otro fichero, por ejemplo src/lib/auth-context.ts. Eso añade un fichero nuevo a la lista.

Si quieres, cambio alguna de mis decisiones antes de volver a presentar el plan. FLOW-1 sigue en Selected for Development.

3. **Cuántas veces tuviste que intervenir**:
En mi caso, ninguna vez.


4. **Qué te tocaría arreglar a mano** 
No acabo de entender este punto.


###############
### PARTE B ###
###############
1. **Hasta qué pieza llegaste, y cuál te costó más de lo que esperabas.** 
Hasta el punto 6.
En la creación de la skill no queda claro si lo tenemos que definir nosotros creando un fichero nuevo o dejar a la IA que lo haga. En mi caso decidí que fuese claude.
Hay ciertas incongruencias en el ejercicio que me confundieron bastante, ya que por ejemplo, en la línea del readme 119 indica que no apliquemos el plan y por lo tanto, no podemos verificar si los cambios son OK o no.

2. **La primera diferencia que viste entre las dos salidas, y en qué te fijaste para verla.** 
No abrí ningun archivo. No he visto ninguna diferencia. Tambien hay que reconocer que la cantidad de información que ofrece y el 
desconocimiento de la tecnología ahora no ayuda.

3. **Algo que dejaste escrito en el harness y que el agente no cumplió igualmente**.
Cotejado con Claude, en el harness se indicó que el frontend no tiene formateador pero el hook de pretier lo instaló después.
