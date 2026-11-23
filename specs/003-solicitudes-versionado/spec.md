# F-03 · Solicitudes, programación y versionado

## Objetivo
Permitir al solicitante registrar programación por ciclo y guardar versiones completas inmutables.

## Criterios de aceptación
- CA-03.1: Una solicitud por unidad y ciclo.
- CA-03.2: El solicitante edita solo si ventana abierta y estado editable.
- CA-03.3: Validación de filas: `clave_curso` manual obligatoria; `horario` obligatorio con mínimo 3 caracteres; `vacantes` entero >= 1; `dia` en {LUN,MAR,MIE,JUE,VIE,SAB}; `hora_inicio/hora_fin` en HH:mm 24h y fin > inicio cuando ambas existen; `formato_curso` en {Presencial,Semipresencial}; `tipo_aula_solicitado` en {Normal,Híbrido}; `facultad_programa` obligatoria; sin duplicados por clave/día/inicio/horario/secuencia.
- CA-03.4: Guardar crea versión completa con número secuencial, autor, fecha y observación; la v1 es la programación de inicio.
- CA-03.5: Historial consultable; versiones no editables.
- CA-03.6: El solicitante no puede asignar aula; el campo aula queda reservado para fase administrativa futura y no se muestra en la UI ni en la exportación del rol SOLICITANTE.