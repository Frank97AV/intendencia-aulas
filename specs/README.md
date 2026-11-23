# Specs (SDD) · Intendencia de Aulas

Índice de especificaciones del MVP. Cada feature sigue Spec-Driven Development: primero contrato, luego plan, luego tareas, luego implementación y evidencia.

## Contrato SDD

Cada carpeta `specs/<feature>/` debe contener:

| Archivo | Propósito | Obligatorio |
|---|---|---|
| `spec.md` | Qué se construye: objetivo, alcance, CAs trazables | Sí |
| `plan.md` | Cómo se construye: impacto técnico, datos, validaciones, pruebas, riesgos | Sí |
| `tasks.md` | Ejecución: tareas pequeñas trazables a CAs | Sí |

Plantilla base: `specs/_template/`.

## Flujo

1. `/especificar` crea/actualiza `spec.md`.
2. `/planificar` crea/actualiza `plan.md`.
3. `/tareas` crea/actualiza `tasks.md`.
4. `/implementar` ejecuta tareas, corre tests/build y actualiza estado.
5. `/revisar` verifica contra constitución y CAs.
6. `/e2e` genera evidencia PASS/FAIL por CA.

## Índice de features

| ID | Carpeta | Alcance | Estado |
|---|---|---|---|
| F-00 | `000-fundaciones` | Repo, stack, BD, esquema, seed, layout | Implementado |
| F-01 | `001-auth` | Login Google simulado, sesión, autorización | Implementado |
| F-02 | `002-catalogos` | Usuarios, ciclos, cursos, aulas | Implementado |
| F-03 | `003-solicitudes-versionado` | Solicitud, programación, versiones, historial | Implementado |
| F-04 | `004-excel` | Plantilla, importación preview, exportación | Implementado |
| F-05 | `005-intendencia` | Asignación administrativa de aulas | Diferida (ADR-009) |
| F-06 | `006-dashboard-presentacion` | Métricas, presentación HTML, docs | Implementado |

## Convenciones

- Criterios de aceptación trazables al documento v1.0 cuando aplique.
- Tareas con formato `T-XXX [ ]/[x]`, responsable sugerido, CA asociado y verificación.
- `plan.md` puede ser retrospectivo para features ya implementadas, pero debe existir.
- Cambios que afecten reglas deben actualizar `memory/constitution.md` o `memory/decisiones.md`.
- Cierre de feature: `tasks.md` + `memory/estado-proyecto.md` + evidencia si aplica.
