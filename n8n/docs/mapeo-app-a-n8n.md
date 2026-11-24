# Mapeo App actual -> n8n

## Principios

- La **app actual** (Next.js) es la fuente de lógica probada; n8n la orquesta.
- **PostgreSQL** reemplaza PGlite como fuente de verdad.
- La **validación** se ejecuta en subworkflow `SW-VALIDAR-FILAS` antes de persistir.
- **Versiones inmutables**: nunca UPDATE de `detalle_version`; siempre INSERT versión + detalle.

## Mapeo

| Componente actual | Archivo/ubicación | n8n equivalente |
|---|---|---|
| `validarFilas` | `app/src/lib/rules.ts` | `subworkflows/SW-VALIDAR-FILAS.json` (Code node) |
| `guardarVersion` | `app/src/services/solicitudes.ts` | `subworkflows/SW-CREAR-VERSION-INMUTABLE.json` (Postgres transaction) |
| Auth/RBAC | `app/src/lib/auth.ts` | `subworkflows/SW-VALIDAR-USUARIO.json` |
| Import preview | `app/src/components/ImportadorExcel.tsx` | `workflows/05-importar-excel-preview.json` |
| Import confirm | `app/src/app/actions.ts` | `workflows/06-importar-excel-confirmar.json` |
| Export versión | `app/src/app/api/exportar/version/[id]/route.ts` | `workflows/07-exportar-version.json` |
| Guardar programación | `app/src/app/actions.ts` | `workflows/04-solicitud-guardar-version.json` |
| Catálogos/ciclos | `app/src/services/catalogos.ts` | `workflows/02-catalogos-crud.json`, `03-ciclos-ventana.json` |
| Notificaciones | (no implementado) | `workflows/09-notificaciones.json` |

## Contrato de campos (ADR-010)

- `clave_curso`: string, obligatorio.
- `nombre_curso`: string opcional.
- `horario`: string, min 3.
- `vacantes`: entero >= 1.
- `docentes`, `secuencia`: string opcional.
- `dia`: `LUN,MAR,MIE,JUE,VIE,SAB`; normalizar prefijos/variantes.
- `hora_inicio`, `hora_fin`: `HH:mm` 24h; fin > inicio.
- `formato_curso`: `Presencial` | `Semipresencial`.
- `tipo_aula_solicitado`: `Normal` | `Híbrido`.
- `facultad_programa`: string obligatoria.
- `observaciones_facultad`: string opcional.
- `id_aula`: no exponer/asignar en flujo solicitante (ADR-009).

## Endpoints sugeridos (Webhooks n8n)

| Método | Path | Workflow | Auth |
|---|---|---|---|
| POST | `/webhook/auth/validar` | 01 | público/token |
| POST | `/webhook/solicitudes/guardar` | 04 | usuario |
| POST | `/webhook/import/preview` | 05 | solicitante |
| POST | `/webhook/import/confirmar` | 06 | solicitante |
| GET | `/webhook/export/version/:id` | 07 | usuario/rol |
| POST | `/webhook/admin/accion` | 08 | admin |