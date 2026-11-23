---
description: Genera el plan técnico de una feature.
agent: orquestador
---

Ejecuta el flujo de planificación SDD para la feature indicada.

## Entrada
- Feature/spec objetivo.

## Leer antes
- `AGENTS.md`, `memory/constitution.md`, `memory/modelo-datos.md`, `memory/decisiones.md`
- `specs/<feature>/spec.md`
- Plantilla `specs/_template/plan.md`

## Salida
- Crear/actualizar `specs/<feature>/plan.md`.

## Debe incluir
- Enfoque técnico.
- Datos/modelo afectado y migraciones.
- Acciones/endpoints/UI afectados.
- Validaciones de servidor y reglas de dominio.
- Pruebas unitarias/E2E y evidencia esperada.
- Riesgos, dependencias y PD/ADRs relevantes.

## Gates
- Respetar `memory/constitution.md`.
- No dejar operaciones compuestas fuera de transacción.
- Identificar impactos en RBAC, aislamiento por unidad e inmutabilidad.
