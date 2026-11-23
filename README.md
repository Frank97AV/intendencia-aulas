# Intendencia de Aulas — MVP

MVP funcional para digitalizar la solicitud, programación, versionado y asignación de aulas por ciclo académico, basado en `Documentacion_Integral_Intendencia_Aulas.docx` (v1.0).

## Qué incluye

- **Login Google simulado** con autorización local por rol/unidad.
- **Administración**: usuarios, ciclos/ventanas, cursos, aulas.
- **Solicitante**: solicitud por ciclo, editor de programación, guardado versionado.
- **Excel**: plantilla, importación con vista previa/errores, exportación XLSX/CSV.
- **Asignación administrativa**: diferida en la fase actual (ADR-009); el modelo conserva el campo de aula para fase posterior.
- **Dashboard** y **presentación temporal** para stakeholders.
- **Gobernanza SDD**: AGENTS, memoria, specs con plan, agentes, comandos y skills de proyecto.

## Estructura

```text
.
├── app/                    # Aplicación Next.js ejecutable
├── docs/                   # Gestión, manuales, evidencias, presentación HTML
├── memory/                 # Constitución, contexto, modelo, decisiones, estado
├── specs/                  # Features SDD (spec/plan/tasks)
├── .opencode/              # Agentes, comandos y skills del proyecto
├── AGENTS.md               # Índice operativo y contrato de comunicación
├── opencode.json           # Config OpenCode/MCP
└── Documentacion_Integral_Intendencia_Aulas.docx
```

## Arranque rápido

```bash
cd app
npm install
npm run dev
```

Abrir `http://localhost:3000/login`.

## Cuentas demo

| Rol | Correo | Estado |
|---|---|---|
| Admin | `admin@demo.edu.pe` | Autorizado |
| Intendencia | `intendencia@demo.edu.pe` | Autorizado |
| Unidad | `sistemas@demo.edu.pe` | Autorizado |
| Unidad | `negocios@demo.edu.pe` | Autorizado |
| Unidad | `nuevo@demo.edu.pe` | Pendiente |

## Comandos útiles

Desde `app/`:

```bash
npm run test      # Pruebas unitarias de reglas
npm run build     # Build de producción
npm run db:reset  # Borra PGlite local; se recrea al iniciar
```

## Gobernanza y SDD

- Lee `AGENTS.md` antes de actuar: define fuentes de verdad, flujo SDD y matriz de actualización.
- Flujo: `/especificar` → `/planificar` → `/tareas` → `/implementar` → `/revisar` → `/e2e`.
- Skills de proyecto: `sdd-flow`, `constitution-check`, `feature-closeout`.
- La constitución en `memory/constitution.md` prevalece sobre cualquier implementación.

## Base de datos

- Motor MVP: **PGlite** (PostgreSQL embebido, WASM).
- Migración: `app/db/migrations/0000_init.sql`.
- Seed demo: `app/db/seed.ts`.
- Para migrar a PostgreSQL servidor, usar el mismo SQL y configurar capa de conexión (pendiente de hardening).

## MCP / OpenCode

`opencode.json` incluye:
- `chrome-devtools` (local, npx) para E2E.
- `context7` (remoto, deshabilitado por defecto). Activar con `CONTEXT7_API_KEY`.

## Reglas clave

- El solicitante registra programación; la asignación de aula es administrativa y está diferida (ADR-009).
- Toda versión es inmutable; cada guardado crea nueva versión; v1 es la programación de inicio.
- Validación en servidor; aislamiento por `id_unidad` para rol SOLICITANTE.
- Sin borrados físicos de históricos.

## Estado

MVP implementado y verificado en su base técnica: `npm run test` PASS (14), `npm run build` PASS. Existe E2E histórico de asignación anterior a ADR-009; el flujo vigente debe revalidarse bajo el alcance actual (asignación diferida). Ver `memory/estado-proyecto.md`.
