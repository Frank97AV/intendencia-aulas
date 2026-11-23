---
description: Implementa tareas de una feature siguiendo SDD.
agent: orquestador
---

Implementa las tareas pendientes de la feature indicada.

## Entrada
- Feature y, si aplica, IDs de tarea.

## Leer antes
- `AGENTS.md`, `memory/constitution.md`, `memory/contexto.md`, `memory/modelo-datos.md`, `memory/decisiones.md`
- `specs/<feature>/spec.md`, `plan.md`, `tasks.md`
- Skill `.opencode/skills/constitution-check/SKILL.md` antes de cerrar

## Ejecución
1. Confirmar tareas objetivo y dependencias.
2. Implementar con el agente especializado adecuado.
3. Ejecutar verificación relevante (`npm run test`, `npm run build`, E2E/manual).
4. Actualizar `tasks.md` y `memory/estado-proyecto.md`; registrar ADR si hubo decisión.

## Gates
- No implementar sin spec/plan vigentes.
- No violar reglas no negociables.
- No cerrar tareas sin verificación o justificación explícita del gap.
