# AGENTS.md · Intendencia de Aulas

Guía operativa para agentes IA y humanos en este repositorio. Este archivo es el **índice de comunicación** del proyecto: define dónde está la verdad, en qué orden leer y qué actualizar al cerrar trabajo.

## Fuentes de verdad

| Qué | Dónde | Rol |
|---|---|---|
| Reglas no negociables | `memory/constitution.md` | Constitución. Prevalece sobre cualquier implementación. |
| Dominio y actores | `memory/contexto.md` | Contexto funcional. |
| Modelo de datos | `memory/modelo-datos.md` | Tablas, relaciones, ajustes. |
| Decisiones técnicas | `memory/decisiones.md` | ADRs y pendientes PD. |
| Estado actual | `memory/estado-proyecto.md` | Qué está implementado, verificado y pendiente. |
| Contrato por feature | `specs/<feature>/spec.md` | Objetivo, alcance, CAs. |
| Plan técnico por feature | `specs/<feature>/plan.md` | Cómo se implementa, impacto, pruebas, riesgos. |
| Ejecución por feature | `specs/<feature>/tasks.md` | Tareas trazables a CAs. |
| Evidencia | `docs/evidencias/` | Pruebas, capturas, reportes E2E. |
| Código MVP | `app/` | Implementación ejecutable. |

## Orden de lectura antes de actuar

1. `AGENTS.md`
2. `memory/constitution.md`
3. `memory/contexto.md` y `memory/modelo-datos.md` (si aplica)
4. `memory/decisiones.md` (si hay impacto técnico/dominio)
5. `specs/<feature>/spec.md`, `plan.md`, `tasks.md`
6. Código y pruebas relacionadas en `app/`

## Flujo SDD

```text
/especificar -> spec.md
/planificar  -> plan.md
/tareas      -> tasks.md
/implementar -> código + tests + actualización de tasks/estado
/revisar     -> hallazgos por severidad
/e2e         -> evidencia PASS/FAIL por CA
```

- No implementar sin `spec.md` y `plan.md` vigentes.
- No cerrar una feature sin actualizar `tasks.md`.
- Si cambia comportamiento, reglas, flujo o deuda: actualizar `memory/estado-proyecto.md`.
- Si se toma una decisión de arquitectura/proceso: registrar en `memory/decisiones.md`.
- Si se verifica un CA: dejar evidencia en `docs/evidencias/` o referencia clara en estado/tareas.

## Reglas no negociables

1. El solicitante registra programación; la asignación de aula es función administrativa y **por ahora está diferida** (el campo aula se conserva para fase posterior).
2. Las versiones son **inmutables**; cada envío/guardado crea una nueva versión. La v1 es la programación de inicio.
3. Identidad Google ≠ autorización local.
4. Filtrar siempre por `id_unidad` para rol SOLICITANTE.
5. Validar en servidor (Zod + dominio), no confiar en UI.
6. No borrar históricos; desactivar catálogos.
7. Importación/guardado en transacción.
8. Datos demo aislados (`app/db/seed.ts`, `app/src/demo/`).

## Convenciones

- UI/docs en español; código en inglés cuando sea natural.
- Tipos estrictos TS; evitar `any`.
- No mezclar idiomas en el mismo identificador.
- Archivos Markdown en UTF-8.
- Antes de cambiar reglas de negocio, revisar `memory/constitution.md`.
- Antes de cerrar una feature, actualizar `specs/*/tasks.md` y `memory/estado-proyecto.md`.

## Matriz de actualización

| Si cambias... | Actualiza también... |
|---|---|
| Regla de negocio | `memory/constitution.md` o `memory/decisiones.md`, spec/plan/tasks afectadas, tests |
| Modelo de datos | `memory/modelo-datos.md`, migración, spec/plan, tests |
| Flujo o alcance de feature | `specs/<feature>/{spec,plan,tasks}.md` |
| Estado de implementación | `specs/<feature>/tasks.md`, `memory/estado-proyecto.md` |
| Verificación/E2E | `docs/evidencias/`, `memory/estado-proyecto.md` |
| Proceso de agentes/comandos | `AGENTS.md`, `.opencode/**`, skill relevante |

## Comandos clave (desde `app/`)

```bash
npm install
npm run dev        # http://localhost:3000
npm run test       # Vitest reglas de dominio
npm run build      # build de producción
npm run db:reset   # borra PGlite local; se recrea al iniciar
```

## Agentes y comandos

- Agentes del proyecto: `.opencode/agent/`.
- Comandos SDD: `.opencode/command/`.
- Skills del proyecto: `.opencode/skills/`.
- Config OpenCode: `opencode.json`.

Todos los agentes deben reportar: objetivo, cambios, archivos, verificación, tareas/estado actualizados y riesgos pendientes.
