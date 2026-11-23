# Estado del proyecto

## Fecha de corte
2026-11-23

## Resumen
Se construyó el MVP funcional en `app/` con Next.js 15 + PGlite + Drizzle + Zod + Tailwind 4. Incluye login simulado, autorización, catálogos, ciclo/ventana, solicitud por unidad+ciclo, editor de programación, versionado inmutable, importación Excel con preview, exportación Excel/CSV, y dashboard básico.

El contrato de gobernanza se actualizó para reflejar la fase actual: el solicitante registra programación; la asignación de aula es administrativa y está diferida; la v1 es la programación de inicio; importación/guardado son transaccionales.

## Verificado
- `npm run test`: 14 pruebas unitarias de reglas de negocio, **PASS** (última verificación registrada).
- `npm run build`: compilación Next.js, **PASS** (última verificación registrada).
- E2E manual previo con Chrome DevTools MCP: login Unidad Sistemas → crear fila → guardar v1 → login Intendencia → asignar A-101 → se crea v2 y solicitud pasa a `ASIGNADA`, **PASS**. **Nota**: este flujo corresponde al comportamiento anterior a ADR-009; debe revalidarse bajo el alcance actual (asignación diferida).
- 2026-11-23: ocultamiento de columna/campo `Aula` asignada al rol SOLICITANTE (ADR-009). `npm run test` 11/11 PASS; `npm run build` PASS. E2E Chrome DevTools MCP: PASS (SOLICITANTE sin columna Aula en editor/detalle/export CSV; ADMIN sí ve Aula y Obs. Intendencia). Evidencia: `docs/evidencias/2026-11-23-ocultar-aula-solicitante.md`.
- 2026-11-23: ajuste contrato de campos (ADR-010, CA-03.3/F-03, CA-04.1-04.6/F-04). Clave curso manual (`clave_curso`/`nombre_curso` en detalle, `id_curso` nullable), horario min 3, vacantes entero>=1, docente/secuencia string, día abreviado {LUN,MAR,MIE,JUE,VIE,SAB}, horas HH:mm 24h, formato {Presencial,Semipresencial}, tipo aula {Normal,Híbrido}, facultad/observaciones string. Plantilla/import/export/editor/detalle actualizados. `npm run test` 13/13 PASS; `npm run build` PASS. E2E Chrome DevTools MCP PASS (guardado manual v3, plantilla, import inválido bloqueado, import válido v4, export SOLICITANTE sin Aula/Obs.Int., ADMIN con Aula/Obs.Int.). Evidencia: `docs/evidencias/2026-11-23-contrato-campos-e2e.md`.
- 2026-11-23: ajuste UX/import días. Normalización de día a 3 letras canónicas (MIE/VIE; acepta MIER/VIER/JUEV/prefijos). Importador: botones Reintentar/Cancelar ante errores y redirección a `/solicitante/solicitud` tras importación exitosa. Corrección mojibake “Mi programación”. Tabla con scroll horizontal y anchos ajustados. `npm run test` 14/14 PASS; `npm run build` PASS.

## Cambios de gobernanza (esta sesión)
- `AGENTS.md`: reglas actualizadas a fase actual (solicitante, asignación diferida, v1 inicial, transacción en importación/guardado).
- `memory/constitution.md`, `memory/contexto.md`, `memory/modelo-datos.md`, `memory/decisiones.md`: alineados con ADR-009.
- `specs/*`, `.opencode/agent/*`, `.opencode/command/*`, `.opencode/skills/*`, `README.md`: propagación del nuevo contrato.
- ADR-001 marcada como diferida; ADR-009 registrada.

## Pendiente / siguiente iteración
- **Alinear código de `app/` al nuevo alcance**: rol SOLICITANTE, flujo sin asignación operativa, estados/transiciones, UI, validaciones y pruebas.
- Revalidar E2E bajo reglas ADR-009.
- E2E automatizado reproducible (script Playwright o guion MCP formal).
- Comparación visual diff entre versiones.
- Validación de conflictos de horario/aula.
- Autenticación Google OIDC real (`AUTH_MODE=google`).
- Integración SIPUC (PD-11).
- Hardening: rate limit, CSRF en actions sensibles, auditoría separada (PD-13).
- Migración de PGlite a PostgreSQL servidor para ambientes compartidos.
