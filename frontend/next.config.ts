import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/* Evita que Turbopack use otro lockfile (ej. en el home) como raíz del workspace */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const backendBase =
  process.env.BACKEND_URL ?? "http://localhost:5087";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  /* Mismo origen que el front → no hay CORS ni problemas de HTTPS al llamar a la API */
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${backendBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
