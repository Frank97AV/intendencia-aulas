---
description: Ejecuta guion E2E con Chrome DevTools MCP.
agent: qa
---

Ejecuta el guion E2E de la feature indicada en `http://localhost:3000` usando Chrome DevTools MCP.

## Leer antes
- `AGENTS.md`, `memory/constitution.md`
- `specs/<feature>/spec.md`, `tasks.md`
- Evidencias previas en `docs/evidencias/`

## Ejecución
1. Identificar CAs a verificar.
2. Ejecutar flujo en navegador con Chrome DevTools MCP.
3. Capturar snapshots/screenshots cuando aporten evidencia.
4. Registrar resultado en `docs/evidencias/<feature-o-fecha>.md`.

## Salida
- Tabla PASS/FAIL por CA.
- Pasos ejecutados, evidencia y defectos encontrados.
- Actualización sugerida de `tasks.md` y `memory/estado-proyecto.md`.
