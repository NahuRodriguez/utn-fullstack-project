import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../store/authStore";
import { Api } from "../api/api";
import {
  ShoppingBag,
  Loader
} from "lucide-react";
import { OrderCard } from "../components/card/OrderCard";

export const Route = createFileRoute("/mis-compras/")({
  component: MisCompras,
});

function MisCompras() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Api.fetchUserOrders(user.id);
      let list = Array.isArray(data) ? data : data?.data ?? [];
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(list);
    } catch {
      setError("Error al cargar tus compras");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <Loader className="spin" size={32} style={{ color: "var(--muted)" }} />
        <p className="empty-message">Cargando tus compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="auth-alert auth-alert-error" style={{ marginBottom: "1rem" }}>{error}</div>
        <button className="auth-btn-primary" style={{ width: "auto", padding: "0.75rem 2rem" }} onClick={loadOrders}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <h2 className="products-title" style={{ marginBottom: "0.25rem" }}>Mis compras</h2>
        <p className="products-count">
          {orders.length} orden{orders.length !== 1 ? "es" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><ShoppingBag size={40} /></div>
          <p className="empty-title">No tenés compras aún</p>
          <p className="empty-message">Tus pedidos aparecerán acá después de realizar una compra.</p>
          <Link to="/productos" className="auth-btn-primary" style={{ display: "inline-block", width: "auto", marginTop: "1.5rem", padding: "0.75rem 2rem", textDecoration: "none" }}>
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="order-list" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {orders.map((order) => (
            <Link
              key={order.id}
              to="/mis-compras/$orderId"
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
    </>
  );
}
