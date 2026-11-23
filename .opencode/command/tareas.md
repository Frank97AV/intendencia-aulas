---
description: Descompone una feature en tareas ejecutables.
agent: orquestador
---

Ejecuta la descomposición SDD de la feature indicada.

## Entrada
- Feature con spec y plan.

## Leer antes
- `AGENTS.md`
- `specs/<feature>/spec.md`
- `specs/<feature>/plan.md`
- Plantilla `specs/_template/tasks.md`

## Salida
- Crear/actualizar `specs/<feature>/tasks.md`.

## Formato de tarea
- `T-XXX [ ]/[x] Descripción | Responsable: ... | CA: CA-XX.Y | Dep: ... | Verificación: ...`

## Gates
- Toda tarea debe trazar a un CA o a soporte técnico explícito.
- Incluir tareas de pruebas/verificación cuando el cambio lo requiera.
- Incluir tarea de actualización de memoria/docs si el cambio afecta estado, decisiones o evidencia.
