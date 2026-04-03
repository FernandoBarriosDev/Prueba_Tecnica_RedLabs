"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import Link from "next/link";
import styles from "./auth.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { username, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Usuario o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Iniciar Sesión</h2>
        <p className={styles.authSubtitle}>Bienvenido al sistema RedLab</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              className={styles.inputField}
              placeholder="Ej: admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className={styles.inputField}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Entrando..." : "Entrar a mi cuenta"}
          </button>
        </form>

        <p className={styles.authFooter}>
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className={styles.authLink}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
