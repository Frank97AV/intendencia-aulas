# Plan F-01 · Autenticación y autorización

## Enfoque
Implementar autenticación simulada de Google con autorización local. La identidad se simula; el acceso se decide por registros locales de usuario.

## Datos / modelo afectado
- Tabla `usuarios`: `correo_google`, `rol`, `id_unidad`, `autorizado`, `activo`.
- Sin cambios de esquema mayores; usa seed demo para cuentas.

## Acciones / endpoints / UI
- `/login` con cuentas demo autorizadas/pendientes.
- Server actions: iniciar sesión demo, salir.
- `session.ts`: cookie httpOnly firmada.
- `auth.ts`: `requireUser`, `requireRole`, guards por rol.

## Validaciones y reglas
- Identidad Google ≠ autorización local (Constitución #3).
- Usuario pendiente/inactivo no accede a módulos operativos.
- Layouts/rutas protegidas por rol y estado.

## Pruebas
- Unitarias: helpers de sesión/autorización donde aplique.
- E2E/manual: login autorizado, bloqueo pendiente, logout, redirección por rol.

## Riesgos y dependencias
- Migración futura a Google OIDC real (ADR-006, PD pendiente).
- Secretos de firma de sesión fuera del repo.

## Evidencia esperada
- Guion E2E de login y bloqueo documentado en `docs/evidencias/`.
