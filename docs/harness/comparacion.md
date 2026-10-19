
# Comparación con y sin harness

Modelo y herramienta en ambas pruebas:
Ticket: FLOW-1
Tiempo real empleado: 3 horas

| Aspecto | Con harness | Sin harness |
|---|---|---|
| Archivos propuestos | 18 archivos nombrados individualmente, más componentes y assets sin enumerar completamente. | 15 archivos nombrados individualmente, más componentes y assets sin enumerar completamente. |
| Organización de autenticación | Separa `AuthContext.tsx` y `RequireAuth.tsx` en `src/auth/`. | Concentra el contexto y la protección en `src/lib/auth.tsx`. |
| Convenciones de proceso | Incluye rama nueva, `/commit`, creación del PR y revisión adversarial. | No menciona ese proceso de cierre. |
| Cierre de sesión | Propone llamar al backend y borrar la sesión local. | Propone borrar solamente la sesión local. |
| Ajustes antes de presentarlo | Precisar todos los archivos y comprobar la base del PR: propone `main` como supuesto. | Precisar todos los archivos e incluir el cambio previsto de `package-lock.json`, que no aparece en su lista. |




## Parte B: tres líneas

1. Llegué hasta la pieza 8. La que más me costó fue todo porque es la primera vez que trabajo con estas herramientas y no tengo suficiente background técnico, fui guiada por IA en todo momento intenté ir comprendidendo lo que se iba haciendo.
2. La primera diferencia concreta que identifiqué fue el proceso de trabajo: el plan con harness incluyó crear una rama, usar /commit, abrir un PR y ejecutar el revisor adversarial; el plan sin harness no mencionó esos pasos. La noté al comparar las secciones de enfoque y cierre
3. Dejé escrita la regla “no crees archivos antes de la aprobación”, pero el agente creó el archivo del plan antes de aprobarlo. La regla quedó demasiado amplia y entró en conflicto con la instrucción de usar plan mode.

## Condiciones de la comparación

La copia sin harness tenía disponible un conector de Atlassian de la cuenta. Recibió como mensaje el cuerpo completo de la skill, incluida la instrucción de leer los validadores del backend. Ambos planes quedaron sin implementar. El ejercicio se extendió más allá de los 45 minutos indicados en el README.

