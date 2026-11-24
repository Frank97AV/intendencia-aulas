# Pruebas / Checklist

## Smoke

1. Levantar `docker compose up -d`.
2. Abrir n8n `http://localhost:5678`.
3. Configurar credencial Postgres.
4. Ejecutar SQL `001_init.sql`.
5. Importar subworkflows y workflows.

## Casos mínimos

| Caso | Esperado |
|---|---|
| Fila válida (LUN, G01, HH:mm, Normal/Híbrido) | `ok=true`, normalizada |
| Día `MIER`/`JUEV`/`Lunes` | Normaliza a `MIE`/`JUE`/`LUN` |
| Horario `< 3` | Error |
| Vacantes `< 1` | Error |
| Hora fin <= inicio | Error |
| Formato/tipo inválido | Error |
| Facultad vacía | Error |
| Import con errores | No crea versión |
| Import válido | Crea versión inmutable nueva |
| Export solicitante | Sin `Aula` ni `Observaciones de Intendencia` |
| Export admin | Incluye campos internos |

## Evidencia

Guardar capturas/export JSON de ejecuciones en `docs/evidencias-n8n/` (crear si se usa).