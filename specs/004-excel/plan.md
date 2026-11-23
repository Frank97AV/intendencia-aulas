# Plan F-04 · Importación y exportación Excel

## Enfoque
Usar Excel como canal de intercambio. La importación valida y previsualiza antes de confirmar; la confirmación crea versión completa.

## Datos / modelo afectado
- Lee contexto de `solicitudes/versiones`.
- Escribe `versiones` y `detalle_version` solo al confirmar importación.
- Clave curso se captura como texto manual (no requiere catálogo).

## Acciones / endpoints / UI
- Endpoint `/api/plantilla` para descargar XLSX.
- Importador cliente con SheetJS: parseo, mapeo, preview, errores por fila.
- Endpoint de exportación XLSX/CSV por versión.

## Validaciones y reglas
- Errores bloquean confirmación; no hay versión parcial (CA-04.3, Constitución #8).
- Reusar validaciones de dominio de F-03.
- Exportación para rol SOLICITANTE no incluye campos administrativos internos ni aula asignada; la vista previa de importación no expone aula asignada (CA-04.6, Constitución #1).
- Confirmación transaccional.

## Pruebas
- Unitarias: validación de filas, reglas de exportación por rol.
- E2E/manual: descargar plantilla, importar con error, corregir, confirmar, exportar.

## Riesgos y dependencias
- Plantillas antiguas con día completo/Híbrida pueden requerir normalización.
- Exportación debe respetar aislamiento por unidad.

## Evidencia esperada
- Reporte E2E de importación preview y exportación.