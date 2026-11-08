# Alcance MVP de FlowSync

## 1. PROBLEMA

Los equipos remotos pierden tiempo en preguntas constantes de seguimiento y en la ronda de estado de las reuniones de sincronización. La falta de visibilidad puede llevar a que dos compañeros trabajen accidentalmente sobre lo mismo.

La hipótesis de producto es que una lista compartida de tareas, responsables y estados, mantenida al día por quienes realizan el trabajo, reduce las preguntas de seguimiento y los solapamientos. No se promete eliminar todas las reuniones ni resolver los bloqueos.

## 2. USUARIOS

Equipos remotos pequeños de 3 a 10 integrantes. El valor principal es para los compañeros: evitar duplicar esfuerzos y elegir qué hacer después conociendo el trabajo de los demás. El MVP no está orientado a supervisores que necesitan controlar actividad o recibir reportes.

Se asume un único espacio compartido, con acceso y edición iguales para todos sus integrantes. La validez de este supuesto debe comprobarse con el primer equipo que lo utilice.

## 3. PROPUESTA DE VALOR

Consultar qué tareas están pendientes, cuáles están en curso y quién es responsable, sin preguntar constantemente a otras personas. FlowSync será el lugar donde se gestionen estas tareas, evitando mantener una copia en otra herramienta.

El criterio observable de éxito después de una semana de uso es que el equipo elimine la ronda de preguntas de estado de la reunión diaria y no necesite recuperarla. También se observará si persisten las preguntas de seguimiento y los solapamientos: eliminar la ronda por sí solo no demostraría que el problema se ha resuelto.

## 4. ALCANCE

- Crear tareas con título, responsable, estado y fecha de vencimiento opcional.
- Consultar una lista compartida con esos datos, que refleje los cambios de otros integrantes sin refrescar manualmente.
- Actualizar manualmente el estado de una tarea: pendiente, en curso o terminada. La persona responsable mantiene su estado al día.
- Filtrar las tareas por estado.

Se reutiliza la autenticación existente: registro, inicio y cierre de sesión y consulta del perfil. No se amplía en este MVP.

**Decisión explícita:** la fecha de vencimiento será opcional. Esta decisión flexibiliza expresamente la ficha original para reducir la fricción al crear tareas: no será necesario inventar un plazo para registrar trabajo. La fecha se conserva como dato disponible, pero no es necesaria para validar la hipótesis de visibilidad compartida.

El principal riesgo es que las personas dejen de actualizar sus tareas y la información pierda vigencia. La rapidez suficiente de los cambios y la sostenibilidad de la actualización manual deberán validarse durante el uso.

## 5. NO-ALCANCE

- **Notificaciones push:** no ayudan a comprobar si consultar la lista compartida basta para coordinarse; evaluarían la eficacia de avisos que interrumpen.
- **Integración con Slack:** no ayuda a validar el hábito de gestionar y consultar las tareas en FlowSync; introduciría otro canal de coordinación.
- **Comentarios:** no ayudan a validar la visibilidad de responsables y estados; evaluarían conversaciones y resolución de dudas dentro del producto.
- **Analítica:** no ayuda a validar la coordinación cotidiana entre compañeros; evaluaría análisis histórico del trabajo.
- **Reportes:** no ayudan a validar que los compañeros puedan decidir sin preguntar; responderían a necesidades de seguimiento hacia supervisores.
- **Permisos avanzados:** no ayudan a validar la coordinación entre pares en un espacio compartido; evaluarían necesidades de autorización diferenciada.
- **Múltiples equipos:** no ayudan a comprobar el valor para un primer equipo pequeño; evaluarían separación organizativa y pertenencia a varios espacios.
- **Sprints:** no ayudan a validar la visibilidad del trabajo actual; evaluarían planificación por ciclos.
- **Estimaciones:** no ayudan a comprobar si conocer responsables y estados evita solapamientos; evaluarían previsión de esfuerzo y capacidad.
- **Presencia de usuarios:** no ayuda a validar el estado de las tareas; medir quién está conectado no demuestra en qué está trabajando.
- **Gestión compleja de proyectos:** no ayuda a comprobar si una lista compartida basta para coordinarse; añadiría necesidades de planificación y organización ajenas a esta primera hipótesis.

### Reflexión del ejercicio

1. **Funcionalidades consideradas inicialmente: 4. Conservadas: 4.** Se cuentan acciones de usuario: crear tareas, consultar la lista, actualizar estados y filtrar por estado. Los campos de una tarea no se cuentan como funcionalidades separadas; la autenticación ya existente tampoco. No hubo recorte numérico de estas cuatro acciones: el ajuste consistió en hacer opcional la fecha y limitar las capacidades complementarias.
2. **Tres exclusiones concretas:** las notificaciones push no validan que la consulta de la lista baste para coordinarse; los comentarios no validan que responsables y estados reduzcan las preguntas de seguimiento; los reportes no validan que los compañeros puedan elegir su siguiente tarea y evitar solapamientos.
3. **Decisión sobre la que tengo menos certeza:** conservar la fecha de vencimiento, aunque sea opcional. No es central para la hipótesis y podría seguir añadiendo fricción. Reconsideraría excluirla si durante la semana nadie la usa para decidir qué hacer y genera dudas al crear tareas; reconsideraría exigirla solo si se observan fallos de coordinación atribuibles a su ausencia que no se resuelven con responsable y estado.
