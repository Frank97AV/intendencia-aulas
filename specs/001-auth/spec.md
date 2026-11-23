# F-01 · Autenticación y autorización

## Objetivo
Permitir ingreso por identidad Google simulada, con autorización local por rol y unidad.

## Criterios de aceptación
- CA-01.1: `/login` muestra cuentas demo y permite entrar con cuentas autorizadas.
- CA-01.2: Cuenta pendiente o inactiva no accede a módulos operativos.
- CA-01.3: Sesión httpOnly firmada; logout limpia sesión.
- CA-01.4: Rutas protegidas redirigen por rol/estado.
- CA-01.5: Diseño permite reemplazar mock por Google OIDC (ADR-006).
