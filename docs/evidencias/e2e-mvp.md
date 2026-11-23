# Evidencia E2E MVP (histórica, pre-ADR-009)

Fecha: 2026-11-23  
Entorno: `http://localhost:3000` (Next.js dev, PGlite seed)

> **Histórica**: este flujo incluye asignación de Intendencia (comportamiento anterior a ADR-009). Debe revalidarse con el alcance vigente.

## Flujo verificado

| Paso | Acción | Resultado esperado | Resultado |
|---|---|---|---|
| 1 | Abrir `/login` | Ver cuentas demo y cuenta pendiente | PASS |
| 2 | Entrar como `sistemas@demo.edu.pe` | Redirige a `/unidad` | PASS |
| 3 | Ir a `/unidad/solicitud`, agregar fila y guardar | Crea versión v1 con autor/fecha | PASS |
| 4 | Ir a `/unidad/versiones` | Muestra v1 como vigente | PASS |
| 5 | Salir y entrar como `intendencia@demo.edu.pe` | Redirige a `/intendencia` | PASS |
| 6 | Abrir solicitud de Ingeniería de Sistemas | Muestra v1, 1 fila, 0 asignadas | PASS |
| 7 | Asignar A-101, guardar | Crea v2, estado Asignada, 1/1 asignada | PASS |

## Observación
Se detectó y corrigió un detalle de hidratación/estado en editores cliente tras guardar (sincronización con props del servidor). La validación final confirmó v2 creada correctamente.