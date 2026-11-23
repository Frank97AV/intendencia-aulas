# Plan F-02 · Catálogos y administración

## Enfoque
CRUD administrativo con Server Actions para usuarios, ciclos, cursos y aulas. Catálogos históricos se desactivan, no se eliminan.

## Datos / modelo afectado
- `usuarios`, `ciclos`, `cursos`, `aulas`, `unidades_academicas`.
- Constraints: rol/estado CHECK, correo único lower, ciclo activo único parcial, clave de curso única, capacidad/tipo de aula.

## Acciones / endpoints / UI
- Vistas admin: usuarios, ciclos, cursos, aulas.
- Vista Intendencia: inventario de aulas.
- Acciones: autorizar usuario, asignar rol/unidad, activar/desactivar ciclo, CRUD curso/aula con soft-disable.

## Validaciones y reglas
- Solo ADMIN gestiona catálogos administrativos.
- Solo un ciclo `activo=true` (ADR-003).
- No borrado físico de catálogos referenciables (Constitución #6/#7).
- Validación server-side con Zod.

## Pruebas
- Unitarias: validaciones de catálogo/ciclo.
- E2E/manual: crear ciclo, activar único, desactivar curso/aula, autorizar usuario.

## Riesgos y dependencias
- Definición de jerarquía de unidad académica (PD-01).
- Cambios de estado/rol deben alinearse con ADR-005.

## Evidencia esperada
- Capturas o reporte E2E de administración de catálogos.
