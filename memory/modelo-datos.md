# Modelo de datos (MVP)

Basado en secciones 7, 8 y Anexo A del documento, con ajustes ADR-001..ADR-009.

## Tablas

| Tabla | Propósito | Ajustes MVP |
|---|---|---|
| `unidades_academicas` | Catálogo institucional solicitante | — |
| `usuarios` | Identidad, rol, autorización, unidad | `CHECK rol`, índice único `lower(correo_google)` |
| `ciclos` | Ciclo académico y ventana | `TIMESTAMPTZ`, índice único parcial `activo=true` |
| `cursos` | Catálogo por clave | Índice por `id_unidad` |
| `aulas` | Inventario de aulas (referencia futura) | `CHECK capacidad>=0`, `CHECK tipo_aula` |
| `solicitudes` | Cabecera unidad+ciclo | `CHECK estado`, `UNIQUE(id_unidad,id_ciclo)` |
| `versiones` | Metadatos de fotografía | Inmutable; `UNIQUE(id_solicitud,numero_version)` |
| `detalle_version` | Filas de programación | `CHECK vacantes>=1`, `CHECK horas`, checks formato/tipo; `id_aula` nullable reservado para fase posterior |

## Relaciones
- Unidad 1—N Usuarios, Solicitudes, Cursos.
- Ciclo 1—N Solicitudes.
- Solicitud 1—N Versiones.
- Usuario 1—N Versiones (autor).
- Versión 1—N Detalle.
- Curso 1—N Detalle.
- Aula 1—N Detalle (nullable, reservado para fase posterior).

## Decisiones clave
- **No hay tabla `asignaciones` aparte**: si se implementa asignación futura, debe crear nueva versión (ADR-001, diferida).
- **No hay tabla `historial` redundante**: versiones ya son el historial.
- **`docentes` es texto** en MVP (normalizar en fase posterior si se requiere).
- **`secuencia`**: conservar según modelo/ADR vigente; no eliminar históricos.
- **Capacidad >= vacantes** se valida en servicio + UI cuando aplique asignación futura (no expresable como CHECK cross-table).
- **Asignación diferida (ADR-009)**: `id_aula` y campos administrativos relacionados se conservan, pero no forman parte del flujo operativo actual.

## Estados de solicitud (MVP actual)
`BORRADOR` → `ENVIADA` → `EN_REVISION` → `OBSERVADA` / `CERRADA`.

Notas:
- `ASIGNADA` existe en el modelo histórico/compatibilidad, pero la asignación operativa está diferida en la fase actual.
- La v1 es la programación de inicio creada al guardar/enviar la primera versión.
- Transiciones sensibles deben validarse en servidor y alinearse con PD-03.
