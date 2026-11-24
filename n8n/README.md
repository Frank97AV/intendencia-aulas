# Intendencia de Aulas · Adaptación a n8n

Esta carpeta contiene una **adaptación por flujos** del MVP actual (Next.js + PGlite) hacia **n8n + PostgreSQL**.

## Enfoque

- **n8n orquesta**: recepción, validación, normalización, import/export, notificaciones.
- **PostgreSQL es fuente de verdad**: solicitudes, versiones, detalle, catálogos, usuarios.
- **Reglas de negocio críticas** se centralizan en subworkflows reutilizables (validar filas, crear versión inmutable, validar acceso).
- **UI**: para MVP, se puede usar n8n Form/Webhook + front ligero; la grilla editable compleja se recomienda mantener fuera de n8n o simplificar a carga Excel.

## Estructura

```text
n8n/
  README.md
  docker-compose.yml
  .env.example
  sql/
    001_init.sql
  workflows/
    01-auth-validar-acceso.json
    02-catalogos-crud.json
    03-ciclos-ventana.json
    04-solicitud-guardar-version.json
    05-importar-excel-preview.json
    06-importar-excel-confirmar.json
    07-exportar-version.json
    08-admin-mantenimiento.json
    09-notificaciones.json
  subworkflows/
    SW-VALIDAR-USUARIO.json
    SW-VALIDAR-FILAS.json
    SW-CREAR-VERSION-INMUTABLE.json
  docs/
    mapeo-app-a-n8n.md
    variables-entorno.md
    pruebas.md
  samples/
    plantilla-programacion.csv
    import-valido.csv
    import-invalido.csv
```

## Arranque rápido

1. Copiar `.env.example` a `.env` y ajustar secretos.
2. Levantar servicios:

```bash
cd n8n
docker compose up -d
```

3. Abrir n8n: `http://localhost:5678`.
4. Crear credencial PostgreSQL en n8n apuntando al servicio `postgres`.
5. Importar subworkflows y luego workflows.
6. Ejecutar `sql/001_init.sql` en Postgres (n8n puede hacerlo con nodo Postgres o psql).

## Reglas clave portadas

- Solicitante no asigna aula; `Aula` no se expone a SOLICITANTE en export.
- Versiones inmutables: cada guardado crea versión nueva; v1 = programación de inicio.
- Validación servidor: clave curso obligatoria, horario min 3, vacantes >=1, día {LUN,MAR,MIE,JUE,VIE,SAB} (normaliza prefijos), HH:mm 24h, formato {Presencial,Semipresencial}, tipo {Normal,Híbrido}, facultad obligatoria.
- Sin borrado físico de históricos.
- Importación transaccional: si hay errores, no crea versión parcial.
- Aislamiento por `id_unidad` para SOLICITANTE.

## Notas importantes

- Los JSON son **plantillas base**. Después de importar, configura la credencial `Postgres Intendencia` y selecciona los subworkflows reales en nodos **Execute Workflow**.
- `SW-CREAR-VERSION-INMUTABLE` usa SQL transaccional simplificado; para producción robusta, valida errores intermedios y maneja `ROLLBACK`.
- La UI completa (grilla editable tipo app) no se replica 1:1 en n8n; se recomienda n8n + Postgres como backend de flujos y una UI ligera o la app actual.
- Mantener reglas de negocio alineadas con `memory/constitution.md` y ADRs.