# Constitución del proyecto · Intendencia de Aulas

Este documento define los principios no negociables del MVP y de su evolución. Toda feature, tarea o cambio debe cumplirlos. Si un cambio entra en conflicto, el cambio se adapta; la constitución solo se modifica por decisión explícita documentada en `memory/decisiones.md`.

## Principios

### 1. Separación de registro y asignación
- El solicitante registra cursos, horarios, vacantes, docentes, secuencia y requerimientos.
- La asignación de aula es función administrativa. **Fase actual**: la asignación está diferida; el campo `id_aula` se conserva en el modelo para la fase posterior, pero no se asigna en el flujo operativo actual.
- La UI, las acciones de servidor y las validaciones deben impedir que el solicitante asigne aulas o escriba campos administrativos reservados.

### 2. Toda versión es inmutable
- Cada guardado confirmado crea una fotografía completa en `versiones` + `detalle_version`.
- No se edita ni se borra contenido histórico. Corregir = nueva versión.
- La v1 es la programación de inicio de la solicitud.

### 3. Identidad no es autorización
- Google (simulado en el MVP) solo acredita identidad.
- El acceso depende de `usuarios.autorizado`, `usuarios.activo`, `usuarios.rol` e `id_unidad`.
- Usuarios no autorizados no acceden a módulos operativos.

### 4. Aislamiento por unidad académica
- Toda consulta y mutación del rol SOLICITANTE se filtra por `id_unidad` del usuario autenticado.
- No existen rutas, acciones o exportaciones que permitan lectura/escritura cruzada entre unidades.

### 5. PostgreSQL es la fuente oficial de datos
- El MVP usa PGlite (PostgreSQL embebido) por portabilidad; el esquema es PostgreSQL estándar.
- Drive/Excel son canales de intercambio, nunca la fuente de verdad.
- Migraciones SQL versionadas en `app/db/migrations`.

### 6. Validación en servidor, siempre
- Zod + reglas de dominio validan toda entrada antes de persistir.
- La UI replica validaciones solo para UX; no es barrera de seguridad.
- Reglas críticas: vacantes >= 1, hora fin > inicio, curso activo y de la unidad, ventana abierta, estados editables permitidos.

### 7. Sin borrados físicos de históricos
- Cursos, aulas y ciclos se desactivan; no se eliminan si tienen o pueden tener referencias.
- Solicitudes, versiones y detalles históricos se conservan indefinidamente.

### 8. Transacciones para operaciones compuestas
- Guardar versión, importar y crear solicitud+versión son operaciones transaccionales.
- Una importación con errores no crea versión parcial.
- Cuando se implemente la asignación administrativa futura, también deberá ser transaccional y crear nueva versión.

### 9. Datos de demo aislados y eliminables
- El seed vive en `app/db/seed.ts`; el contenido de presentación en `app/src/demo/`.
- Ninguna regla de negocio depende de datos demo. `npm run db:reset` elimina la BD local.

### 10. Idioma y nomenclatura
- UI, documentación, mensajes y specs en español.
- Código, nombres técnicos y commits en inglés cuando sea natural; no mezclar en el mismo identificador.
- Términos del dominio conservan el nombre del documento (solicitud, versión, detalle, unidad académica).

### 11. Criterio de aceptación verificable
- Cada feature tiene criterios medibles en `specs/*/spec.md`.
- Cambios funcionales relevantes requieren prueba unitaria o guion E2E reproducible.

### 12. Secretos fuera del repositorio
- Credenciales, API keys y secretos solo en `.env.local` / gestor de secretos.
- `.env.example` documenta variables sin valores sensibles.
- `opencode.json` usa `{env:...}` para claves MCP.
