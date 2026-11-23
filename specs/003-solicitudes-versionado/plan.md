# Plan F-03 · Solicitudes, programación y versionado

## Enfoque
Modelar la solicitud como cabecera por unidad+ciclo y cada guardado confirmado como versión completa inmutable con detalle.

## Datos / modelo afectado
- `solicitudes`, `versiones`, `detalle_version`.
- `detalle_version` guarda clave/nombre de curso como texto manual (`clave_curso` obligatoria, `nombre_curso` opcional); `id_curso` queda nullable para compatibilidad.
- `UNIQUE(id_unidad,id_ciclo)`, `UNIQUE(id_solicitud,numero_version)`.

## Acciones / endpoints / UI
- Servicio de creación/obtención de solicitud por unidad+ciclo.
- Editor de programación: agregar/quitar filas, guardar versión.
- Historial y vista de detalle de versión.
- Validación de ventana y estados editables.

## Validaciones y reglas
- Una solicitud por unidad y ciclo (CA-03.1).
- Edición solo con ventana abierta y estado editable (CA-03.2, Constitución).
- Filas válidas: clave curso manual, horario min 3, vacantes>=1, día {LUN,MAR,MIE,JUE,VIE,SAB}, formato {Presencial,Semipresencial}, tipo aula {Normal,Híbrido}, HH:mm 24h, fin>inicio, facultad obligatoria, sin duplicados (CA-03.3).
- Guardar crea versión completa secuencial e inmutable; v1 es programación de inicio (CA-03.4, Constitución #2).
- El solicitante no puede asignar aula; el campo aula queda reservado para fase futura y no se expone en UI/exportación del SOLICITANTE (CA-03.6, Constitución #1).
- Operación transaccional (Constitución #8).

## Pruebas
- Unitarias: validación de filas, ventana, estados editables, duplicados.
- E2E/manual: crear fila, guardar v1, consultar historial.

## Riesgos y dependencias
- D1: clave manual reduce integridad referencial con catálogo de cursos; se conserva catálogo para admin.
- D2: horas en HH:mm 24h asumidas como “1 a 24”.
- PD-04, PD-12.

## Evidencia esperada
- Tests unitarios de reglas de negocio.
- Evidencia E2E de guardado versionado.