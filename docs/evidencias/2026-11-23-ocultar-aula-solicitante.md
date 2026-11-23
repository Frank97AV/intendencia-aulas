# Evidencia E2E · Ocultar campo Aula al rol SOLICITANTE

- **Fecha**: 2026-11-23
- **Alcance**: ADR-009 / CA-03.6 / CA-04.6
- **Entorno**: `npm run dev` local, PGlite demo seed, Chrome DevTools MCP

## Resultado

| Verificación | Rol | Resultado | Evidencia |
|---|---|---|---|
| Editor de programación sin columna "Aula" | SOLICITANTE (sistemas@demo.edu.pe) | PASS | `solicitante-solicitud-sin-aula.png`, snapshot sin header `Aula` |
| Detalle de versión sin columna "Aula" | SOLICITANTE (negocios@demo.edu.pe) | PASS | `solicitante-version-detalle-sin-aula.png`, `/solicitante/versiones/2` |
| Exportación CSV sin columna `Aula` ni `Observaciones de Intendencia` | SOLICITANTE | PASS | `GET /api/exportar/version/2?formato=csv` => headers sin `Aula`, sin `Observaciones de Intendencia` |
| Exportación CSV incluye `Aula` y `Observaciones de Intendencia` | ADMIN | PASS | `GET /api/exportar/version/1?formato=csv` => headers incluyen `Aula`, `Observaciones de Intendencia` |
| Detalle admin mantiene columna "Aula" | ADMIN | PASS | `admin-solicitud-con-aula.png`, `/admin/solicitudes/1` |

## Observaciones

- La UI de solicitante conserva "Tipo aula" (tipo solicitado), que es distinto del aula asignada.
- `id_aula`/`aulaCodigo` permanecen en modelo/servicios; solo se oculta exposición al SOLICITANTE.
- No se ejecutó prueba automatizada Playwright; evidencia manual MCP reproducible.