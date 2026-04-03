# Prueba técnica — RedLabs

API REST en **.NET 8** (JWT, SQL Server, Swagger) y **frontend Next.js** (login, registro, dashboard de productos con PDF).

## Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) (npm)
- **SQL Server** local o en Docker (la cadena de conexión por defecto usa `localhost,1433` y usuario `sa`)

## 1. Base de datos

1. Ajusta la cadena en `Prueba_Tecnica_RedLab/Prueba_Tecnica_RedLab/appsettings.json` (`ConnectionStrings:DefaultConnection`) si tu instancia no usa `sa` / ese puerto o contraseña.
2. Al levantar la API, las migraciones de **EF Core** se aplican solas (`Program.cs`).

## 2. Backend (API)

```bash
cd Prueba_Tecnica_RedLab/Prueba_Tecnica_RedLab
dotnet run --launch-profile http
```

- API HTTP: **http://localhost:5087**
- Swagger: **http://localhost:5087/swagger**

Mantén este proceso en marcha antes de abrir el frontend.

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: **http://localhost:3000** (redirige a `/login`).

El frontend llama al API por un **proxy interno** (`/api-proxy` → `http://localhost:5087`) para evitar problemas de CORS en local. Si el API corre en otro host o puerto, crea `frontend/.env.local` (ver `frontend/.env.example`).

## 4. Flujo sugerido para revisar

1. Registrar usuario en `/register` o usar Swagger `POST /api/auth/register`.
2. Iniciar sesión en `/login`.
3. En el dashboard: listar, crear/editar/eliminar productos, filtrar, ordenar, paginar y descargar PDF.

## Estructura

| Carpeta | Contenido |
|--------|------------|
| `Prueba_Tecnica_RedLab/` | Solución .NET (Domain, Application, Infrastructure, API) |
| `frontend/` | Next.js 15 (App Router) |

---

*Prueba técnica enviada para RedLabs.*
