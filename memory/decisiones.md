# Decisiones y pendientes

## ADR (Architecture Decision Records)

| ID | Decisión | Estado | Motivo |
|---|---|---|---|
| ADR-001 | La asignación de Intendencia genera una **nueva versión** | Diferida | Se mantiene el principio de inmutabilidad para cuando se implemente asignación administrativa; en la fase actual la asignación de aula está diferida. |
| ADR-002 | BD MVP = **PGlite** (PostgreSQL WASM) con esquema SQL portable | Aceptada | Cero fricción local; migrable a PostgreSQL servidor. |
| ADR-003 | Solo un ciclo `activo=true` (índice único parcial) | Aceptada | Evita ambigüedad de ventana operativa. |
| ADR-004 | `TIMESTAMPTZ` para ventanas/fechas operativas | Aceptada | Evita desfases en validación de ventana (zona Lima). |
| ADR-005 | Roles y estados con `CHECK` en BD + enums TS/Zod | Aceptada | Evita datos inválidos por bypass de UI. |
| ADR-006 | Login Google simulado con interfaz `AuthProvider` | Aceptada | Demo funcional hoy; listo para OIDC real. |
| ADR-007 | Monolito Next.js App Router + Server Actions | Aceptada | MVP rápido, un despliegue, reglas en servidor. |
| ADR-008 | Contrato de comunicación SDD entre agentes, skills, memoria y specs | Aceptada | Evita deriva: AGENTS.md como índice, specs con spec/plan/tasks, agentes/comandos con gates, skills de proyecto para flujos repetibles. |
| ADR-009 | Asignación de aula diferida; foco actual en registro y versionado del solicitante | Aceptada | Prioriza el registro de programación por unidad/solicitante. El campo `id_aula` se conserva para fase posterior; no hay asignación operativa en MVP actual. |
| ADR-010 | Contrato de campos de programación: clave curso manual, horario min 3, día abreviado, tipo Híbrido | Aceptada | Alinea captura con operación real. `detalle_version` guarda `clave_curso`/`nombre_curso` texto; `id_curso` queda nullable para compatibilidad. Días {LUN,MAR,MIE,JUE,VIE,SAB}, tipo aula {Normal,Híbrido}, horas HH:mm 24h. |

## Supuestos MVP (configurables)
- Unidad académica = catálogo plano facultad/programa.
- Una solicitud por unidad y ciclo (`UNIQUE`).
- Vacantes mínimas = 1.
- Edición del solicitante: ventana abierta + estado editable según flujo vigente.
- Duplicado de fila: misma combinación curso/horario/día/hora inicio.
- v1 es la programación de inicio de la solicitud.

## Pendientes del documento (PD-01..PD-14)

| PD | Tema | Impacto | Responsable sugerido |
|---|---|---|---|
| PD-01 | ¿Unidad = facultad, programa o jerarquía? | Modelo catálogo | Intendencia/usuarios |
| PD-02 | ¿Múltiples solicitudes por unidad+ciclo? | Restricción UNIQUE | Intendencia |
| PD-03 | Estados y transiciones definitivas | Flujo/validaciones | Intendencia/análisis |
| PD-04 | Política de edición tras cierre/asignación | Reglas RN-07 | Intendencia |
| PD-05 | ¿Vacantes 0 permitidas? | Validación | Intendencia |
| PD-06 | Identificación de secciones/horarios duplicados | Importación/dedup | Facultades/SIPUC |
| PD-07 | Fechas y recurrencia de clases/prácticas/evaluaciones | Modelo detalle | Intendencia/facultades |
| PD-08 | Reglas de asignación: disponibilidad, prioridad, desempate | Motor asignación | Intendencia |
| PD-09 | Atributos completos de aula y fuente oficial | Catálogo aulas | Intendencia |
| PD-10 | ¿Curso pertenece a una o varias unidades? | FK curso-unidad | Gestión académica |
| PD-11 | Integración SIPUC: API, permisos, ambiente prueba | Integración | Responsable SIPUC/robot |
| PD-12 | Métricas y estados del dashboard | BI | Analítica/Intendencia |
| PD-13 | Auditoría de eventos separada de versiones | Seguridad | Seguridad/negocio |
| PD-14 | ¿Secuencia se excluye permanentemente? | Modelo | Intendencia/análisis |
