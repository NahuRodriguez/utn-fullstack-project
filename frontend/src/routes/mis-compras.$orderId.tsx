import { useState, useEffect } from "react";
import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useAuth } from "../store/authStore";
import { Api } from "../api/api";
import { Package, Calendar, MapPin, ChevronLeft, Loader } from "lucide-react";

export const Route = createFileRoute("/mis-compras/$orderId")({
  component: OrderDetail,
});

const formatPrice = (price) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);

function OrderDetail() {
  const { orderId } = useParams({ from: "/mis-compras/$orderId" });
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadOrder();
  }, [orderId, isAuthenticated]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Api.fetchOrderById(orderId);
      setOrder(data);
    } catch {
      setError("Error al cargar la orden");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <Loader className="spin" size={32} style={{ color: "var(--muted)" }} />
        <p className="empty-message">Cargando detalle...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="empty-state">
        <div className="auth-alert auth-alert-error">{error || "Orden no encontrada"}</div>
        <Link to="/mis-compras" className="auth-btn-primary" style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.75rem 2rem", textDecoration: "none" }}>
          Volver a mis compras
        </Link>
      </div>
    );
  }

  const address = order.addressId;

  return (
    <>
      <Link to="/mis-compras" className="auth-link" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
        <ChevronLeft size={16} /> Volver a mis compras
      </Link>

      <div className="order-detail-card">
        <div className="order-detail-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Package size={20} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              Orden #{order._id?.slice(-8).toUpperCase()}
            </h2>
          </div>
          <div className="order-card-date">
            <Calendar size={14} />
            <span>{new Date(order.createdAt).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        <div className="checkout-summary" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginBottom: "1rem", fontWeight: 600, fontSize: "0.95rem" }}>Productos</h3>
          <div className="checkout-items-summary">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="checkout-summary-item">
                <img
                  src={item.productId?.imgUrl || "https://placehold.co/48x48"}
                  alt={item.productId?.name || "Producto"}
                  style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.productId?.name || "Producto"}</p>
                  <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Qty: {item.quantity} x {formatPrice(item.priceAtPurchase)}</p>
                </div>
                <p style={{ fontWeight: 700, color: "var(--cyan)" }}>{formatPrice(item.priceAtPurchase * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {address && (
          <div className="checkout-summary" style={{ marginTop: "1rem" }}>
            <h3 style={{ marginBottom: "0.75rem", fontWeight: 600, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <MapPin size={16} /> Dirección de envío
            </h3>
            <div className="address-card selected" style={{ cursor: "default" }}>
              <strong>{address.streetName} {address.buildingNumber}</strong>
              {address.addressDetails && <p className="address-detail">{address.addressDetails}</p>}
              <p className="address-detail">{address.city}, {address.province} — CP: {address.postalCode}</p>
            </div>
          </div>
        )}

        <div className="checkout-summary" style={{ marginTop: "1rem" }}>
          <div className="checkout-total-line">
            <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>Total</span>
            <span className="total-price" style={{ fontSize: "1.75rem" }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </>
    );
}
