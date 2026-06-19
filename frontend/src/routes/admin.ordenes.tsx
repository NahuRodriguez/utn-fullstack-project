import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader, AlertCircle, Package, Clock, ShoppingBag } from "lucide-react";
import { Api } from "../api/api";
import { formatPrice } from "../utils/utils";

export const Route = createFileRoute("/admin/ordenes")({
  component: AdminOrdenes,
});

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" });
};

function AdminOrdenes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await Api.fetchAllOrders();
        let list = Array.isArray(data) ? data : data?.data ?? [];
        list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (active) setOrders(list);
      } catch {
        if (active) setError("Error al cargar las órdenes");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="products-section" style={{ width: "100%" }}>
      <div className="products-header">
        <h2 className="products-title" style={{ fontSize: "1.5rem" }}>
          Órdenes de compra
        </h2>
      </div>

      {error && (
        <div className="auth-alert auth-alert-error" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Loader size={32} className="spin" style={{ color: "var(--muted)" }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <ShoppingBag className="w-12 h-12" style={{ color: "var(--muted)" }} />
          </div>
          <h3 className="empty-title">No hay órdenes registradas</h3>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            const itemCount = (order.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0);
            return (
              <div key={order.id} className="order-card" style={{ cursor: "default" }}>
                <div className="order-card-bar" />
                <div className="order-card-id">
                  <Package size={16} className="order-card-id-icon" />
                  <span className="order-card-id-text">#{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="order-card-meta">
                  <span className="order-card-meta-item">
                    <Clock size={13} /> {formatDate(order.createdAt)}
                  </span>
                  <span className="order-card-meta-item">
                    {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
                  </span>
                  {order.userId && (
                    <span className="order-card-meta-item">Usuario: {String(order.userId).slice(-8)}</span>
                  )}
                </div>
                <div className="order-card-footer">
                  <span className="order-card-footer-label">Total</span>
                  <span className="total-price">{formatPrice(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
