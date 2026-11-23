# Plan F-00 · Fundaciones

## Enfoque
Establecer la base del MVP como monolito Next.js App Router en `app/`, con PostgreSQL embebido (PGlite) para desarrollo local, Drizzle ORM, Zod, Vitest y Tailwind 4.

## Datos / modelo afectado
- Migración base `app/db/migrations/0000_init.sql` con las 8 tablas del documento v1.0.
- Ajustes ADR-001..ADR-006: checks, timestamps, índices, unicidad de ciclo activo, correo en minúsculas.
- Seed idempotente en `app/db/seed.ts`.

## Acciones / endpoints / UI
- Bootstrap de BD y aplicación de migraciones al iniciar.
- Layout base, navegación por rol y componentes UI compartidos.
- Scripts: `dev`, `build`, `test`, `db:reset`.

## Validaciones y reglas
- Integridad en BD: FKs, CHECKs, UNIQUE, índices.
- Esquema portable a PostgreSQL servidor; evitar dependencias exclusivas de PGlite salvo justificación.

## Pruebas
- Unitarias: reglas base de dominio donde aplique.
- Verificación: `npm run test`, `npm run build`, `npm run dev`, `npm run db:reset`.

## Riesgos y dependencias
- Diferencias PGlite/PostgreSQL servidor en ambientes compartidos (PD/ADR-002).
- Seed demo debe permanecer aislado de reglas de negocio.

## Evidencia esperada
- Build y tests en verde.
- BD local recreable con seed demo.
