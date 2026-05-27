import { createFileRoute } from "@tanstack/react-router";
import { useCartStore } from "../store/cartStore";

export const Route = createFileRoute("/carrito")({
  component: Carrito,
});

function Carrito() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <span style={{ fontSize: "3rem" }}>🛒</span>
        </div>
        <p className="empty-title">Tu carrito está vacío</p>
        <p className="empty-message">Agregá productos desde la sección Productos</p>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ maxWidth: "48rem", display: "block" }}>
      <h2 className="products-title" style={{ marginBottom: "1.5rem" }}>Mi Carrito</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map((item) => (
          <div key={item._id} className="cart-item" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <img
              src={item.imgUrl || "https://placehold.co/80x80"}
              alt={item.name}
              className="cart-item-image"
            />

            <div className="cart-item-info" style={{ flex: 1 }}>
              <h3>{item.name}</h3>
              <p className="cart-item-price">{formatPrice(item.price)} c/u</p>
            </div>

            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
            </div>

            <p style={{ width: "6rem", textAlign: "right", fontWeight: 700, color: "var(--cyan)" }}>
              {formatPrice(item.price * item.quantity)}
            </p>

            <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>Total</span>
        <span className="total-price">{formatPrice(getCartTotal())}</span>
      </div>
    </div>
  );
}
