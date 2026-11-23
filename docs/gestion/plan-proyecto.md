# Plan de proyecto · MVP Intendencia de Aulas

## Objetivo
Entregar un MVP demostrable que cubra el flujo principal vigente: login simulado → solicitud por unidad/ciclo → programación → versión inmutable → exportación/historial → métricas. La asignación administrativa de aula está diferida (ADR-009).

## Alcance MVP (entregado)
F-00 Fundaciones, F-01 Auth, F-02 Catálogos, F-03 Solicitudes/versionado, F-04 Excel, F-05 Intendencia, F-06 Dashboard/presentación.

## Fuera de alcance
OAuth Google real, SIPUC/robot, asignación administrativa operativa (reactivación F-05), asignación automática, auditoría avanzada separada, multi-tenant productivo.

## Cronograma sugerido (post-MVP)

| Fase | Duración | Entregable |
|---|---:|---|
| 1. Validación funcional | 1 semana | Ajustes con Intendencia/facultades, cerrar PD-01/03/04/06 |
| 2. Hardening | 1 semana | Auth real, CSRF/rate limit, logs, PostgreSQL servidor |
| 3. Integraciones | 2 semanas | Contrato SIPUC, pruebas en ambiente controlado |
| 4. Piloto | 1 ciclo | Operación con 1-2 unidades, soporte y métricas |

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Reglas de asignación no definidas | Mantener asignación administrativa diferida (ADR-009); registrar criterios PD-08 antes de reactivar F-05 |
| Datos reales inconsistentes en Excel | Vista previa + errores por fila + plantilla oficial |
| Confusión identidad/autorización | Mensajes claros, autorización local, admin explícito |
| Pérdida de trazabilidad | Versiones inmutables, autor/fecha, sin sobrescritura |
| Migración PGlite→Postgres | SQL estándar, migraciones versionadas, pruebas de smoke |

## Criterio de salida del MVP
- Flujo E2E demo ejecutable.
- Criterios de aceptación principales PASS.
- Documentación SDD y de gestión disponible.