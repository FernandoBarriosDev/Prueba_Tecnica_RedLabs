# Prueba técnica RedLab

API .NET 8 + SQL Server + JWT y frontend Next.js 15 (login, registro, CRUD productos, PDF).

## Requisitos

Docker (para la base), .NET 8 SDK y Node.js 20+.

## Cómo correrlo

Todo desde la **carpeta raíz del repo** (donde está `docker-compose.yml`).

1. Base de datos

```bash
docker compose up -d
```

Espera unos segundos antes del siguiente paso (SQL tarda en arrancar la primera vez).

2. Backend — en una terminal

```bash
cd Prueba_Tecnica_RedLab/Prueba_Tecnica_RedLab
dotnet run --launch-profile http
```

API: http://localhost:5087 — Swagger: http://localhost:5087/swagger

3. Frontend — en otra terminal

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env` ya trae la URL del API en `5087`. Si cambias el puerto del backend, crea `frontend/.env.local` (o edita `.env` solo en tu máquina) y ajusta `BACKEND_URL`. Ver también `frontend/.env.example`.

App: http://localhost:3000

Registra un usuario, inicia sesión y usa el dashboard. La contraseña de SQL en Docker y en `appsettings.json` es la misma (`sa` / ver `docker-compose.yml`).

## Si no usas Docker

Ten SQL Server en `localhost:1433` y ajusta `ConnectionStrings:DefaultConnection` en `Prueba_Tecnica_RedLab/Prueba_Tecnica_RedLab/appsettings.json`. Si el API no va en el puerto 5087, ajusta `BACKEND_URL` en `frontend/.env` o en `frontend/.env.local`.
