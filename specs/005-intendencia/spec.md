# F-05 · Gestión administrativa de aulas (diferida)

## Estado
Diferida por ADR-009. No forma parte del flujo operativo actual.

## Objetivo
Reservar el diseño para la futura revisión/asignación administrativa de aulas, manteniendo trazabilidad e inmutabilidad.

## Alcance actual (fase vigente)
- No implementar asignación operativa de aulas.
- Conservar `id_aula` y campos administrativos relacionados en el modelo para fase posterior.
- Evitar UI/acciones que permitan asignar aula en el flujo del solicitante.

## Criterios de aceptación futuros (referencia)
- CA-05.1: Bandeja administrativa con solicitudes por ciclo/estado.
- CA-05.2: Solo rol administrativo autorizado asigna aula y observaciones internas.
- CA-05.3: Validar aula activa, capacidad>=vacantes y compatibilidad cuando aplique.
- CA-05.4: Guardar asignación crea nueva versión (ADR-001, diferida).
- CA-05.5: Estado pasa a ASIGNADA solo cuando corresponda al flujo definitivo.
- CA-05.6: Historial muestra versiones de solicitante y administración.

## Riesgos y preguntas abiertas
- PD-03: estados/transiciones definitivas.
- PD-08: reglas de asignación.
- Requiere alinear código legado que aún contiene flujo de asignación.
