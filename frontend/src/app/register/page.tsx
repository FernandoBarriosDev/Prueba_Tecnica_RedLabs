"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import Link from "next/link";
import styles from "../login/auth.module.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/register", { username, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al intentar crear el usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Crear cuenta</h2>
        <p className={styles.authSubtitle}>Únete al sistema RedLab</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleRegister} className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="reg-username">
              Usuario
            </label>
            <input
              id="reg-username"
              type="text"
              className={styles.inputField}
              placeholder="Elige un usuario único"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength={100}
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="reg-password">
              Contraseña
            </label>
            <input
              id="reg-password"
              type="password"
              className={styles.inputField}
              placeholder="Mínimo 7 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={7}
              maxLength={128}
              autoComplete="new-password"
            />
            <p className={styles.hint}>Debe tener más de 6 caracteres (mínimo 7).</p>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Creando..." : "Crear nueva cuenta"}
          </button>
        </form>

        <p className={styles.authFooter}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className={styles.authLink}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
