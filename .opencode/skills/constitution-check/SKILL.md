---
name: constitution-check
description: Usar antes de implementar o aprobar cambios para verificar cumplimiento de la constitución del proyecto.
---

# Constitution Check · Intendencia de Aulas

## Cuándo usar
- Antes de implementar una tarea de dominio, backend, UI o datos.
- Antes de aprobar una revisión, E2E o cierre de feature.

## Checklist
- [ ] **Solicitante no asigna aula**: la asignación administrativa está diferida (ADR-009); UI, actions y validaciones lo impiden.
- [ ] **Versiones inmutables**: no se editan/borran versiones/detalles históricos; cada guardado crea nueva versión; v1 es programación de inicio.
- [ ] **Identidad != autorización**: acceso depende de usuario local autorizado/activo/rol/unidad.
- [ ] **Aislamiento por unidad**: consultas/mutaciones de SOLICITANTE filtran por `id_unidad`.
- [ ] **Validación en servidor**: Zod + dominio; cliente solo UX.
- [ ] **Sin borrado físico histórico**: catálogos se desactivan.
- [ ] **Transacciones**: guardado/importación/creación solicitud+versión son atómicos.
- [ ] **Demo aislada**: seed/demo no contiene reglas de negocio.

## Salida esperada
- PASS/FAIL por ítem aplicable.
- Hallazgos con archivo/línea y corrección.
- Riesgo residual si no se pudo verificar algo.
