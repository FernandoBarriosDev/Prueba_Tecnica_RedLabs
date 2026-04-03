"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { normalizeProduct, type Product } from "@/utils/product";
import styles from "./dashboard.module.css";
import ProductForm from "./ProductForm";
import ProductDetailModal from "./ProductDetailModal";

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState<string>("all");
  const [sortField, setSortField] = useState<"nombre" | "precio" | "estado">(
    "nombre"
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.get("/products");
      const raw = Array.isArray(data) ? data : [];
      setProducts(
        raw.map((item) => normalizeProduct(item as Record<string, unknown>))
      );
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleDownloadPdf = async () => {
    try {
      const blob = await api.getFile("/products/report");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Reporte_Productos.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Error al descargar PDF");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert("Error eliminando producto");
    }
  };

  const openNewForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const closeFormAndRefresh = () => {
    setIsFormOpen(false);
    fetchProducts();
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchesSearch = p.nombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesState =
          filterState === "all"
            ? true
            : filterState === "active"
              ? p.estado
              : !p.estado;
        return matchesSearch && matchesState;
      }),
    [products, searchTerm, filterState]
  );

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      if (sortField === "nombre") {
        return (
          dir *
          a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
        );
      }
      if (sortField === "precio") {
        return dir * (Number(a.precio) - Number(b.precio));
      }
      const va = a.estado ? 1 : 0;
      const vb = b.estado ? 1 : 0;
      return dir * (va - vb);
    });
    return arr;
  }, [filteredProducts, sortField, sortDir]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterState, sortField, sortDir]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.dashWrapper}>
      <nav className={styles.topNav} aria-label="Principal">
        <div className={styles.topNavInner}>
          <div className={styles.topNavLeft}>
            <span className={styles.topNavBrand}>RedLab</span>
            <span className={styles.topNavDivider} aria-hidden="true">
              |
            </span>
            <span className={styles.topNavPage}>Productos</span>
          </div>
          <button
            type="button"
            className={styles.topNavLogout}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className={styles.dashInner}>
        <header className={styles.pageIntro}>
          <h1 className={styles.dashTitle}>Listado</h1>
          <p className={styles.dashSubtitle}>Búsqueda, tabla y acciones</p>
        </header>

        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label className={styles.label} htmlFor="search">
              Buscar
            </label>
            <input
              id="search"
              className={styles.input}
              type="text"
              placeholder="Nombre del producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={`${styles.filterGroup} ${styles.filterGroupNarrow}`}>
            <label className={styles.label} htmlFor="filter">
              Estado
            </label>
            <select
              id="filter"
              className={styles.select}
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
          <div className={`${styles.filterGroup} ${styles.filterGroupNarrow}`}>
            <label className={styles.label} htmlFor="sort-field">
              Ordenar por
            </label>
            <select
              id="sort-field"
              className={styles.select}
              value={sortField}
              onChange={(e) =>
                setSortField(e.target.value as "nombre" | "precio" | "estado")
              }
            >
              <option value="nombre">Nombre</option>
              <option value="precio">Precio</option>
              <option value="estado">Estado</option>
            </select>
          </div>
          <div className={`${styles.filterGroup} ${styles.filterGroupNarrow}`}>
            <label className={styles.label} htmlFor="sort-dir">
              Dirección
            </label>
            <select
              id="sort-dir"
              className={styles.select}
              value={sortDir}
              onChange={(e) =>
                setSortDir(e.target.value as "asc" | "desc")
              }
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className={styles.loadingRow}>
                    Cargando...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyRow}>
                    No hay productos para mostrar.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr
                    key={p.id}
                    className={styles.clickableRow}
                    onClick={() => p.id && setDetailProductId(p.id)}
                  >
                    <td>{p.nombre}</td>
                    <td
                      className={styles.cellDesc}
                      title={p.descripcion || undefined}
                    >
                      {p.descripcion || "—"}
                    </td>
                    <td className={styles.priceCell}>
                      ${Number(p.precio).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${p.estado ? styles.badgeOn : styles.badgeOff}`}
                      >
                        {p.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        type="button"
                        className={`${styles.btnSmall} ${styles.btnEdit}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditForm(p);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={`${styles.btnSmall} ${styles.btnDelete}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id!);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.footerBar}>
          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.btnPdf}
              onClick={handleDownloadPdf}
            >
              Descargar PDF
            </button>
            <button
              type="button"
              className={styles.btnAdd}
              onClick={openNewForm}
            >
              Nuevo producto
            </button>
          </div>
          <div className={styles.paginationRow}>
            <button
              type="button"
              className={styles.btnPager}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((x) => Math.max(1, x - 1))}
            >
              Atrás
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              type="button"
              className={styles.btnPager}
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((x) => Math.min(totalPages, x + 1))
              }
            >
              Adelante
            </button>
          </div>
        </div>

        {isFormOpen && (
          <ProductForm
            product={editingProduct}
            onClose={() => setIsFormOpen(false)}
            onSuccess={closeFormAndRefresh}
          />
        )}

        <ProductDetailModal
          productId={detailProductId}
          onClose={() => setDetailProductId(null)}
        />
      </div>
    </div>
  );
}
