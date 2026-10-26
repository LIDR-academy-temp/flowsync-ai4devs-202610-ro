# Comparación con y sin harness

## Parte A: dos copias, un solo encargo

### 1. Qué archivos propone tocar

- **Con harness:** 16 entradas explícitas o grupos en el plan: configuración de Vite y TypeScript, CSS, archivos demo, componentes de shadcn/ui, cliente API, autenticación, ruta protegida, tres páginas, `App.tsx`, `index.html` y `prompts.md`.
- **Sin harness:** 20 entradas explícitas o grupos en el plan: configuración de Tailwind/shadcn/ui, configuración de Vite y TypeScript, `components.json`, CSS, utilidades, dependencias, archivos demo, componentes UI, cliente API, errores, contexto de autenticación, ruta protegida, tres páginas, `main.tsx`, `App.tsx`, `index.html` y `.env.example`.

Los grupos `src/assets/*`, `src/components/ui/*` y los componentes generados por shadcn/ui no permiten conocer todavía el número exacto de archivos individuales.

### 2. Qué convenciones del proyecto respetó y cuáles no

- **Con harness:** respetó que el trabajo fuera únicamente en `frontend/`, que el backend se leyera como contrato, la rama `harness-ra`, el uso de las rutas reales de la API, `passwordConfirmation`, la envoltura `{ data: ... }`, los errores `400/422`, el token Bearer y las reglas de TypeScript.
- **Sin harness:** respetó que el backend no se tocara, leyó los validadores y controladores reales, detectó `passwordConfirmation`, `fullName`, las longitudes y formatos de error, el token `oat_`, CORS y las rutas reales. No tenía convenciones del proyecto escritas explícitamente para seguir.

### 3. Cuántas veces tuve que intervenir

- **Con harness:** 0.
- **Sin harness:** 0.

### 4. Qué me tocaría arreglar a mano antes de enseñarlo al equipo

Revisaría con más detalle el plan sin harness, porque lo veo menos exacto que el plan con harness y deja algunas decisiones abiertas. También confirmaría las dependencias, el manejo de errores y la estructura final de archivos antes de implementarlo.

## Parte B: las tres líneas

1. **Hasta qué pieza llegué:** pieza 8, `AGENTS.md` enlazado a `CLAUDE.md`; la parte que más tiempo me llevó fue configurar y verificar el harness y la conexión con Jira.

2. **Primera diferencia que vi:** el plan con harness presentó desde el principio las restricciones del proyecto y las ambigüedades del contrato, especialmente `passwordConfirmation` y las respuestas `{ data: ... }`; lo vi al comparar el resumen inicial y la sección de archivos propuestos de los dos planes.

3. **Algo que el harness no cumplió igualmente:** `CLAUDE.md` indicaba registrar todos los prompts en `prompts.md`, pero el agente no actualizó ese archivo después de ejecutar `/priority-ticket`; tuve que registrarlo manualmente.
