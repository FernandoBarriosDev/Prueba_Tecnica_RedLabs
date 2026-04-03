import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { Product } from "@/utils/product";
import styles from "./dashboard.module.css";

/** El API C# usa `Description` → JSON `description`; el formulario usa `descripcion`. */
function productToApiBody(p: Product) {
  return {
    nombre: p.nombre,
    description: p.descripcion ?? "",
    precio: p.precio,
    estado: p.estado,
  };
}

export default function ProductForm({
  product,
  onClose,
  onSuccess,
}: {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<Product>({
    nombre: "",
    descripcion: "",
    precio: 0,
    estado: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body = productToApiBody(formData);
      if (product?.id) {
        await api.put(`/products/${product.id}`, body);
      } else {
        await api.post("/products", body);
      }
      onSuccess();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el producto"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>
          {product ? "Editar producto" : "Nuevo producto"}
        </h2>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form className={styles.formStack} onSubmit={handleSubmit}>
          <div className={styles.filterGroup}>
            <label className={styles.label} htmlFor="pf-nombre">
              Nombre
            </label>
            <input
              id="pf-nombre"
              className={styles.input}
              type="text"
              required
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label} htmlFor="pf-desc">
              Descripción
            </label>
            <textarea
              id="pf-desc"
              className={styles.textarea}
              rows={3}
              value={formData.descripcion || ""}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label} htmlFor="pf-precio">
              Precio
            </label>
            <input
              id="pf-precio"
              className={styles.input}
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.precio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  precio: parseFloat(e.target.value) || 0,
                })
              }
            />
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={formData.estado}
              onChange={(e) =>
                setFormData({ ...formData, estado: e.target.checked })
              }
            />
            Producto activo
          </label>

          <div className={styles.modalActions}>
            <button
              type="submit"
              className={styles.btnSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
