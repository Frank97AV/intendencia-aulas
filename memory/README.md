# Memoria del proyecto

La carpeta `memory/` contiene el contexto estable que los agentes y humanos deben leer antes de cambiar comportamiento.

## Mapa

| Archivo | Propósito | Actualizar cuando... | No usar para... |
|---|---|---|---|
| `constitution.md` | Principios no negociables | Hay decisión explícita que cambia una regla base | Notas temporales o estado de sprint |
| `contexto.md` | Problema, objetivo, actores, glosario | Cambia el dominio, alcance o actores | Decisiones técnicas detalladas |
| `modelo-datos.md` | Modelo de datos y ajustes | Cambia esquema, relaciones o constraints | Estado de implementación |
| `decisiones.md` | ADRs y pendientes PD | Se toma/revierte decisión técnica o surge pendiente | Bitácora diaria |
| `estado-proyecto.md` | Estado actual, verificado, pendiente | Se implementa, verifica o detecta deuda relevante | Reglas permanentes |

## Protocolo

1. **Leer primero** `constitution.md` antes de cualquier cambio funcional.
2. **Consultar** `decisiones.md` antes de proponer cambios de arquitectura o modelo.
3. **Actualizar** `estado-proyecto.md` al cerrar una feature, prueba relevante o detectar deuda.
4. **Registrar ADR** cuando una decisión afecte estructura, seguridad, datos, flujo o proceso.
5. **No duplicar** la spec en memoria: la memoria resume lo estable; el detalle de feature vive en `specs/`.

## Formato recomendado

- ADR: `ADR-XXX`, estado, fecha/contexto, decisión, motivo, consecuencia.
- Estado: fecha de corte, resumen, verificado, pendiente, riesgos/deuda.
- Cambios en memoria deben ser cortos, trazables y en UTF-8.
