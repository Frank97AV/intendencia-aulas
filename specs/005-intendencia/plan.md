# Plan F-05 · Gestión administrativa de aulas (diferida)

## Enfoque
Mantener esta feature como diseño reservado. En la fase actual no se ejecuta asignación operativa; cualquier implementación futura debe respetar inmutabilidad y transacciones.

## Datos / modelo afectado
- `detalle_version.id_aula` nullable se conserva.
- `observaciones_intendencia`/campos administrativos: conservar solo si el modelo vigente los requiere; no exponer en flujo solicitante.
- Estados como `ASIGNADA` permanecen solo por compatibilidad/modelo hasta definir PD-03.

## Acciones / endpoints / UI
- Ninguna acción operativa de asignación en fase actual.
- Fase futura: bandeja administrativa, asignador, cambio de estado, nueva versión por asignación.

## Validaciones y reglas
- Solicitante nunca asigna aula (Constitución #1).
- Asignación futura: crear nueva versión (ADR-001 diferida) y ejecutar en transacción.
- RBAC estricto y aislamiento por unidad donde aplique.

## Pruebas
- Fase actual: verificar que no existan rutas/acciones operativas de asignación para solicitante.
- Fase futura: unitarias de capacidad/compatibilidad y E2E de asignación versionada.

## Riesgos y dependencias
- Código legado en `app/` aún contiene flujo de asignación; debe alinearse o aislarse explícitamente.
- PD-03, PD-08, PD-09.

## Evidencia esperada
- Registro de decisión ADR-009 y actualización de specs/gobernanza.
- Cuando se reactive: evidencia E2E por CA.
