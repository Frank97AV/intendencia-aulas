---
name: feature-closeout
description: Usar al cerrar una feature para asegurar que tasks, memoria, evidencia y docs queden sincronizados.
---

# Feature Closeout · Intendencia de Aulas

## Cuándo usar
- Una feature o tarea significativa está implementada o verificada.

## Checklist de cierre
1. **Tasks**: actualizar `specs/<feature>/tasks.md` con estado real `[x]/[ ]`.
2. **Verificación**: registrar test/build/E2E ejecutado; si falta, justificar gap.
3. **Estado**: actualizar `memory/estado-proyecto.md` con fecha, resumen, verificado y pendiente.
4. **Decisiones**: agregar ADR en `memory/decisiones.md` si hubo decisión técnica/proceso.
5. **Evidencia**: guardar reporte/captura en `docs/evidencias/` cuando haya E2E o validación relevante.
6. **Docs**: actualizar README/manuales/gestión si el cambio lo amerita.

## Matriz rápida
- Regla negocio -> constitución/decisiones + tests
- Modelo datos -> modelo-datos + migración + tests
- Flujo feature -> spec/plan/tasks
- Verificación -> evidencia + estado
