# Tareas F-04 · Importación y exportación Excel

- [x] T-040 Endpoint `/api/plantilla`. | CA: CA-04.1 | Verificación: descarga XLSX
- [x] T-041 Importador cliente con parseo SheetJS y preview. | CA: CA-04.2 | Verificación: UI preview
- [x] T-042 Validación por fila y reporte de errores. | CA: CA-04.2, CA-04.3 | Verificación: errores bloquean
- [x] T-043 Confirmación transaccional => nueva versión. | CA: CA-04.3, CA-04.4 | Verificación: sin versión parcial
- [x] T-044 Endpoint exportación XLSX/CSV por versión. | CA: CA-04.5 | Verificación: archivo exportado
- [x] T-045 Ocultar campos administrativos internos y aula asignada al rol SOLICITANTE en exportación; vista previa de importación sin columna de aula asignada. | CA: CA-04.6 | Verificación: exportación por rol + revisión UI
- [x] T-046 Actualizar plantilla/import/export al contrato de campos manuales (clave manual, horario min 3, día abreviado, Híbrido). | CA: CA-04.1, CA-04.2, CA-04.5 | Verificación: test/build/revisión de plantilla