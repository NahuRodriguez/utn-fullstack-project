import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader, AlertCircle, ShoppingBag } from "lucide-react";
import { Api } from "../api/api";
import { OrderCard } from "../components/card/OrderCard";

export const Route = createFileRoute("/admin/ordenes/")({
  component: AdminOrdenes,
});

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
          {orders.map((order) => (
            <Link
              key={order.id}
              to="/admin/ordenes/$orderId"
              params={{ orderId: order.id }}
              className="order-card"
            >
              <OrderCard
                key={order.id}
                order={order}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
