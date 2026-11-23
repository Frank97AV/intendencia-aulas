# F-00 · Fundaciones

## Objetivo
Crear la base técnica del MVP: estructura de proyecto, esquema PostgreSQL portable, seed demo, layout y convenciones.

## Alcance
- Next.js 15 App Router, TS strict, Tailwind 4, Drizzle, Zod, Vitest, xlsx.
- PGlite embebido con migración `0000_init.sql`.
- 8 tablas del documento + ajustes ADR-001..ADR-006.
- Seed demo aislado y reseteable.
- Shell visual con navegación por rol.

## Criterios de aceptación
- CA-00.1: `npm run dev` levanta la app sin configuración externa de BD.
- CA-00.2: La migración crea las 8 tablas y constraints definidos.
- CA-00.3: Seed carga 4 unidades, 20 cursos, 10 aulas, 2 ciclos, 5 usuarios y solicitudes demo.
- CA-00.4: `npm run db:reset` elimina datos locales y permite recrearlos.
- CA-00.5: `npm run test` y `npm run build` pasan.
