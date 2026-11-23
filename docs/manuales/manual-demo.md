# Manual rápido de demo

## 1. Levantar el sistema
```bash
cd app
npm install
npm run dev
```
Abrir `http://localhost:3000/login`.

## 2. Guion de demostración

### A. Unidad académica
1. Entrar como `sistemas@demo.edu.pe`.
2. Ir a **Mi programación**.
3. Agregar fila(s) o importar plantilla Excel.
4. Guardar versión. Verificar mensaje de versión creada.

### B. Revisión administrativa (fase actual)
1. Cerrar sesión y entrar como usuario administrativo autorizado.
2. Abrir la bandeja/consulta de solicitudes según el rol disponible.
3. Revisar la solicitud y su historial de versiones.
4. Verificar que la programación se conserva como versión inmutable.
5. **Nota ADR-009**: la asignación operativa de aula está diferida en la fase actual.

### C. Administrador
1. Entrar como `admin@demo.edu.pe`.
2. Revisar **Usuarios y autorización**.
3. Autorizar `nuevo@demo.edu.pe` y asignar unidad/rol.
4. Revisar ciclos, cursos, aulas y métricas.

## 3. Exportación
- En historial de versiones: Excel/CSV por versión.
- Para el rol SOLICITANTE, la exportación no incluye campos administrativos internos reservados para fase futura.

## 4. Reset
```bash
npm run db:reset
```
Reinicia la BD local; al volver a abrir la app se carga el seed demo.