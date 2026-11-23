# Evidencia E2E · Contrato de campos programación (ADR-010)

- **Fecha**: 2026-11-23
- **Alcance**: CA-03.3, CA-03.4, CA-03.6, CA-04.1–CA-04.6
- **Entorno**: `npm run dev` local, PGlite demo seed (reiniciado), Chrome DevTools MCP

## Resultado

| Verificación | Rol | Resultado | Evidencia |
|---|---|---|---|
| Editor muestra campos nuevos: clave/nombre manual, horario G01, vacantes, docente, secuencia, día LUN/MAR/MIER/JUE/VIER/SAB, HH:mm, formato, tipo Normal/Híbrido, facultad, observaciones; sin columna Aula | SOLICITANTE | PASS | `2026-11-23-editor-contrato-campos.png` |
| Guardado manual crea nueva versión inmutable | SOLICITANTE | PASS | `Versión 3 guardada correctamente (3 filas)` |
| Plantilla XLSX descargable con contrato vigente | SOLICITANTE | PASS | `GET /api/plantilla` 200, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `plantilla-programacion-aulas.xlsx` |
| Importación inválida muestra errores y bloquea confirmación | SOLICITANTE | PASS | Errores: clave vacía, horario < 3, vacantes < 1, fin <= inicio, formato inválido, facultad obligatoria; botón confirmar deshabilitado |
| Importación válida crea versión completa | SOLICITANTE | PASS | `Versión 4 guardada correctamente (1 filas)` desde `import-valido.xlsx` |
| Export CSV SOLICITANTE sin `Aula` ni `Observaciones de Intendencia`, con campos nuevos | SOLICITANTE | PASS | `GET /api/exportar/version/5?formato=csv` header sin Aula/Obs. Intendencia; incluye LUN, G01, HH:mm, Normal/Híbrido |
| Export CSV ADMIN incluye `Aula` y `Observaciones de Intendencia` | ADMIN | PASS | `GET /api/exportar/version/5?formato=csv` header incluye `Aula` y `Observaciones de Intendencia` |

## Archivos de evidencia

- `docs/evidencias/2026-11-23-contrato-campos-e2e.md`
- `docs/evidencias/2026-11-23-editor-contrato-campos.png`
- `docs/evidencias/2026-11-23-contrato-campos-solicitante.png`