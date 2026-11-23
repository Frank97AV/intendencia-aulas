# F-04 · Importación y exportación Excel

## Objetivo
Cargar programación masiva con vista previa y exportar versiones vigentes/históricas.

## Criterios de aceptación
- CA-04.1: Descargar plantilla XLSX con instrucciones y encabezados del contrato vigente.
- CA-04.2: Importación lee Excel, mapea columnas, valida filas y muestra preview.
- CA-04.3: Errores bloquean confirmación; no se crea versión parcial.
- CA-04.4: Confirmación crea versión completa.
- CA-04.5: Exportación XLSX/CSV incluye metadatos de solicitud/ciclo/versión/fecha.
- CA-04.6: Exportación para rol SOLICITANTE no incluye campos administrativos internos ni el aula asignada, reservados para fase administrativa futura.