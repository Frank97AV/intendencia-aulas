---
description: Revisa cambios contra constitución y criterios de aceptación.
agent: revisor
---

Revisa el diff o la feature indicada.

## Leer antes
- `AGENTS.md`, `memory/constitution.md`, `memory/decisiones.md`
- `specs/<feature>/spec.md`, `plan.md`, `tasks.md`
- Skill `.opencode/skills/constitution-check/SKILL.md`

## Salida
- Reporte de hallazgos por severidad con archivo/línea, riesgo y corrección sugerida.
- Si no hay hallazgos, indicar riesgos residuales y gaps de verificación.

## Verificar
- RBAC y aislamiento por `id_unidad`.
- Inmutabilidad de versiones.
- Validación en servidor y transacciones.
- No exposición de secretos/datos internos.
- Actualización de specs/memory/evidencia según corresponda.
