# Variables de entorno

## n8n / Docker

| Variable | Ejemplo | Uso |
|---|---|---|
| `N8N_HOST` | `localhost` | Host de n8n |
| `N8N_PORT` | `5678` | Puerto |
| `N8N_PROTOCOL` | `http` | Protocolo |
| `WEBHOOK_URL` | `http://localhost:5678/` | URL base para webhooks |
| `N8N_ENCRYPTION_KEY` | clave larga | Cifrado credenciales n8n |
| `N8N_BASIC_AUTH_ACTIVE` | `true` | Auth básica UI n8n |
| `N8N_BASIC_AUTH_USER` | `admin` | Usuario UI |
| `N8N_BASIC_AUTH_PASSWORD` | secreto | Password UI |
| `TZ` | `America/Lima` | Zona horaria |

## PostgreSQL

| Variable | Ejemplo | Uso |
|---|---|---|
| `POSTGRES_DB` | `intendencia_aulas` | BD |
| `POSTGRES_USER` | `intendencia` | Usuario |
| `POSTGRES_PASSWORD` | secreto | Password |
| `POSTGRES_PORT` | `5432` | Puerto |

## Credencial en n8n

Crear credencial **Postgres** con:
- Host: `postgres` (desde docker compose) o `localhost`
- Database/User/Password según `.env`
- SSL: deshabilitado en local; habilitar en producción.