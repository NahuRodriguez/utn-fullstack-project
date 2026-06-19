import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Loader, AlertCircle, CheckCircle, Package } from "lucide-react";
import { Api } from "../api/api";
import { AdminModal } from "../components/admin/AdminModal";
import { AdminProductCard } from "../components/admin/AdminProductCard";
import { ProductForm } from "../components/admin/ProductForm";
import { Pagination } from "../components/Pagination";

export const Route = createFileRoute("/admin/productos")({
  component: AdminProductos,
});

function AdminProductos() {
  const [view, setView] = useState("active"); // "active" | "deleted"
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null => creando

  const limit = 12;

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetcher = view === "deleted" ? Api.fetchDeletedProducts : Api.fetchProducts;
      const data = await fetcher(null, page, limit, "name-asc", "");
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, page]);

  useEffect(() => {
    Api.fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data?.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const switchView = (next) => {
    if (next === view) return;
    setView(next);
    setPage(1);
  };

  const openCreate = () => {
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setModalOpen(true);
  };

  const handleDeactivate = async (product) => {
    if (!window.confirm(`¿Dar de baja "${product.name}"?`)) return;
    try {
      await Api.deactivateProduct(product.id);
      showSuccess("Producto dado de baja");
      loadProducts();
    } catch {
      setError("No se pudo dar de baja el producto");
    }
  };

  const handleRestore = async (product) => {
    try {
      await Api.restoreProduct(product.id);
      showSuccess("Producto reactivado");
      loadProducts();
    } catch {
      setError("No se pudo reactivar el producto");
    }
  };

  const handleSaved = (msg) => {
    setModalOpen(false);
    showSuccess(msg);
    loadProducts();
  };

  const editingProduct = editingId ? products.find((p) => p.id === editingId) : null;

  return (
    <section className="products-section" style={{ width: "100%" }}>
      <div className="products-header">
        <h2 className="products-title" style={{ fontSize: "1.5rem" }}>
          Productos {view === "deleted" ? "dados de baja" : "activos"}
        </h2>
        {view === "active" && (
          <button
            className="auth-btn-primary"
            onClick={openCreate}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", width: "auto", padding: "0.65rem 1.1rem" }}
          >
            <Plus size={16} /> Nuevo producto
          </button>
        )}
      </div>

      {success && (
        <div className="auth-alert auth-alert-success" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <CheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="auth-alert auth-alert-error" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Loader size={32} className="spin" style={{ color: "var(--muted)" }} />
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Package className="w-12 h-12" style={{ color: "var(--muted)" }} />
          </div>
          <h3 className="empty-title">No hay productos para mostrar</h3>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              deleted={view === "deleted"}
              onEdit={openEdit}
              onDeactivate={handleDeactivate}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar producto" : "Nuevo producto"}
      >
        <ProductForm
          key={editingId || "new"}
          product={editingProduct}
          categories={categories}
          onSaved={handleSaved}
        />
      </AdminModal>
    </section>
  );
}
