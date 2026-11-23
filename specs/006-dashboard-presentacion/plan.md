# Plan F-06 · Dashboard y presentación

## Enfoque
Entregar visibilidad operativa mínima y una presentación HTML aislada para stakeholders. No introducir lógica de negocio en la capa de presentación.

## Datos / modelo afectado
- Consultas agregadas sobre `solicitudes`, `versiones`, `detalle_version`, `unidades_academicas`.
- Sin cambios de esquema.

## Acciones / endpoints / UI
- Servicio de métricas agregadas.
- Vista de métricas para roles administrativos autorizados según alcance vigente.
- Página `/presentacion` con contenido desde `app/src/demo/presentacion.ts`.

## Validaciones y reglas
- Datos de presentación aislados (Constitución #9).
- Dashboard respeta RBAC; no exponer datos internos a UNIDAD fuera de alcance.
- Separar implementado, simulado y pendiente.

## Pruebas
- Unitarias: agregaciones/métricas si se extraen a servicio.
- E2E/manual: dashboard carga, presentación renderiza, navegación por rol.

## Riesgos y dependencias
- Métricas pueden requerir definición formal (PD futuro).
- Contenido de presentación debe mantenerse alineado con estado real.

## Evidencia esperada
- Captura E2E del dashboard/presentación.
- Documentación en `docs/gestion/` y `docs/manuales/`.
