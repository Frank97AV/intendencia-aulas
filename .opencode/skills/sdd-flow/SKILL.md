---
name: sdd-flow
description: Usar cuando se va a crear, planificar, implementar o cerrar una feature con Spec-Driven Development en este repositorio.
---

# SDD Flow · Intendencia de Aulas

## Cuándo usar
- El usuario pide crear o cambiar una feature.
- Hay que pasar de idea a spec, plan, tareas, implementación, revisión o E2E.

## Flujo
1. **Especificar**: crear/actualizar `specs/<feature>/spec.md` con alcance y CAs trazables.
2. **Planificar**: crear/actualizar `specs/<feature>/plan.md` con impacto técnico, datos, validaciones, pruebas y riesgos.
3. **Tareas**: crear/actualizar `specs/<feature>/tasks.md` con `T-XXX`, CA, dependencia y verificación.
4. **Implementar**: ejecutar tareas, validar con tests/build/E2E, actualizar tasks.
5. **Revisar**: verificar contra constitución y CAs; reportar hallazgos por severidad.
6. **E2E/Cierre**: registrar evidencia y actualizar `memory/estado-proyecto.md`.

## Lectura mínima
- `AGENTS.md`
- `memory/constitution.md`
- `specs/<feature>/spec.md`, `plan.md`, `tasks.md`

## Reglas
- No implementar sin spec y plan vigentes.
- No cerrar sin actualizar `tasks.md`.
- Si cambia comportamiento/estado, actualizar `memory/estado-proyecto.md`.
- Si hay decisión técnica/proceso, registrar en `memory/decisiones.md`.
