# Contexto del proyecto

## Fuente
- Documento: `Documentacion_Integral_Intendencia_Aulas.docx` (v1.0, 23-nov-2026).
- Workspace: `C:\Users\Frank\Documents\Tranformacion Digitla\Intendencia VS`

## Problema
La programación de aulas llega en múltiples archivos Excel por unidad académica. Se consolida manualmente, no hay trazabilidad clara de cambios y se mezcla lo solicitado por la facultad con lo decidido por Intendencia.

## Objetivo del MVP
Digitalizar la recepción de solicitudes por ciclo, estructurar cursos/horarios/vacantes, permitir registro y versionado por el solicitante, y conservar versiones completas e inmutables. La asignación administrativa de aula queda diferida para una fase posterior.

## Principio funcional central
Los solicitantes registran cursos, horarios, vacantes y requerimientos. **La asignación de aula es administrativa y está diferida en la fase actual**. El campo de aula se conserva en el modelo para uso futuro.

## Actores

| Actor | Responsabilidad |
|---|---|
| Administrador | Autoriza usuarios, asigna unidad/rol, gestiona ciclos, ventanas y catálogos. |
| Solicitante (unidad académica) | Crea/edita su solicitud mientras la ventana esté abierta y el estado lo permita; registra programación y versiones. |
| Intendencia | Rol previsto para revisión/asignación futura; en la fase actual la asignación de aula está diferida. |
| SIPUC/Robot (futuro) | Integración validada; no implementada en MVP. |
| Dashboard (futuro) | Consume datos estructurados; MVP incluye métricas internas. |

## Glosario mínimo
- **Unidad académica**: facultad/programa solicitante (catálogo plano en MVP).
- **Ciclo**: periodo académico con ventana de solicitudes.
- **Solicitud**: cabecera por unidad + ciclo.
- **Versión**: fotografía completa e inmutable de la solicitud.
- **Detalle de versión**: fila de programación dentro de una versión.
- **Ventana**: intervalo en que el solicitante puede editar.
- **Asignación**: aula definida administrativamente; diferida en la fase actual. El campo se conserva para fase posterior.
