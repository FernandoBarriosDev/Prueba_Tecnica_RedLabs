"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import {
  normalizeProductDetail,
  type ProductDetail,
} from "@/utils/product";
import styles from "./dashboard.module.css";

export default function ProductDetailModal({
  productId,
  onClose,
}: {
  productId: string | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setDetail(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const raw = (await api.get(`/products/${productId}`)) as Record<
          string,
          unknown
        >;
        if (!cancelled) setDetail(normalizeProductDetail(raw));
      } catch (e: unknown) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "No se pudo cargar el producto"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (!productId) return null;

  const fmtDate = (iso: string | null | undefined) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? String(iso)
      : d.toLocaleString("es", {
          dateStyle: "short",
          timeStyle: "short",
        });
  };

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`${styles.modalContent} ${styles.modalContentDetail}`}>
        <h2 id="detail-title" className={styles.modalTitle}>
          Detalle del producto
        </h2>

        {loading && <p className={styles.detailMuted}>Cargando...</p>}
        {error && <div className={styles.errorBox}>{error}</div>}

        {!loading && !error && detail && (
          <dl className={styles.detailList}>
            <div className={styles.detailItem}>
              <dt>Nombre</dt>
              <dd>{detail.nombre}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Descripción</dt>
              <dd>{detail.descripcion || "—"}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Precio</dt>
              <dd>${Number(detail.precio).toFixed(2)}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Estado</dt>
              <dd>
                <span
                  className={`${styles.badge} ${detail.estado ? styles.badgeOn : styles.badgeOff}`}
                >
                  {detail.estado ? "Activo" : "Inactivo"}
                </span>
              </dd>
            </div>
            <div className={styles.detailItem}>
              <dt>ID</dt>
              <dd className={styles.detailMono}>{detail.id}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Creado por</dt>
              <dd>{detail.usuarioCreacion || "—"}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Fecha creación</dt>
              <dd>{fmtDate(detail.fechaCreacion)}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Modificado por</dt>
              <dd>{detail.usuarioModificacion || "—"}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Fecha modificación</dt>
              <dd>{fmtDate(detail.fechaModificacion)}</dd>
            </div>
          </dl>
        )}

        <div className={styles.modalActions}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
