import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCartStore } from "../store/cartStore";
import { useAuth } from "../store/authStore";
import { Api } from "../api/api";
import {
  ShoppingCart,
  MapPin,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Loader,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/carrito")({
  component: Carrito,
});

const STEPS = [
  { num: 1, label: "Carrito", icon: ShoppingCart },
  { num: 2, label: "Dirección", icon: MapPin },
  { num: 3, label: "Confirmar", icon: CheckCircle },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);

function StepIndicator({ current }) {
  return (
    <div className="checkout-stepper">
      {STEPS.map((s, i) => (
        <div key={s.num} className="step-group">
          <div className={`step-dot ${current === s.num ? "active" : current > s.num ? "completed" : ""}`}>
            {current > s.num ? <CheckCircle size={18} /> : <s.icon size={18} />}
          </div>
          <span className={`step-label ${current === s.num ? "active" : ""}`}>{s.label}</span>
          {i < STEPS.length - 1 && <div className={`step-line ${current > s.num ? "completed" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

function Carrito() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuth();

  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    province: "", city: "", postalCode: "", streetName: "", buildingNumber: "", addressDetails: ""
  });
  const [addressError, setAddressError] = useState(null);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  useEffect(() => {
    if (step === 2 && isAuthenticated) {
      loadAddresses();
    }
  }, [step, isAuthenticated]);

  const loadAddresses = async () => {
    setAddressLoading(true);
    try {
      const addressesData = await Api.fetchUserAddresses(user?.id);
      setAddresses(addressesData);
      if (addressesData.length > 0 && !selectedAddressId) {
        setSelectedAddressId(addressesData[0].id);
      }

    } catch {
      setError("Error al cargar direcciones");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const alphanumericHispanicWithSpaces = /^[a-z0-9ñáéíóú. ]+$/i;

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    const { province, city, postalCode, streetName, buildingNumber } = addressForm;
    if (!province || !city || !postalCode || !streetName || !buildingNumber) {
      setAddressError("Completá todos los campos obligatorios");
      return;
    }
    if (!alphanumericHispanicWithSpaces.test(streetName)) {
      setAddressError("Ingrese un nombre de calle válido (letras, números, espacios, punto y -)");
      return;
    }
    if (!alphanumericHispanicWithSpaces.test(city)) {
      setAddressError("La ciudad solo permite letras y espacios");
      return;
    }
    if (!alphanumericHispanicWithSpaces.test(province)) {
      setAddressError("La provincia solo permite letras y espacios");
      return;
    }
    setAddressSubmitting(true);
    setAddressError(null);
    try {
      const data = await Api.createAddress({
        ...addressForm,
        userId: user.id,
        buildingNumber: Number(buildingNumber),
      });
      const created = data.Address || data;
      setAddresses(prev => [...prev, created]);
      setSelectedAddressId(created.id);
      setShowAddressForm(false);
      setAddressForm({ province: "", city: "", postalCode: "", streetName: "", buildingNumber: "", addressDetails: "" });
    } catch (err) {
      const errorData = err.response?.data;
      const msg = errorData?.error || errorData?.mensaje ||
        (errorData?.errors ? Object.values(errorData.errors).map(e => e.message || e).join(", ") : "Error al crear dirección");
      setAddressError(msg);
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Seleccioná una dirección de envío");
      return;
    }
    setPlacing(true);
    setError(null);
    try {
      const payload = {
        addressId: selectedAddressId,
        items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
      };
      const order = await Api.createOrder(payload);
      setOrderId(order.id);
      clearCart();
      setStep(4);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Error al crear la orden";
      setError(msg);
    } finally {
      setPlacing(false);
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  if (items.length === 0 && step < 4) {
    return (
      <div className="main-content" style={{ display: "block", maxWidth: "48rem" }}>
        <div className="empty-state">
          <div className="empty-icon"><ShoppingCart size={40} /></div>
          <p className="empty-title">Tu carrito está vacío</p>
          <p className="empty-message">Agregá productos desde la sección Productos</p>
          <Link to="/productos" className="auth-btn-primary" style={{ display: "inline-block", width: "auto", marginTop: "1.5rem", padding: "0.75rem 2rem", textDecoration: "none" }}>
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <>
      <div className="checkout-items">
        {items.map(item => (
          <div key={item.id} className="cart-item" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <img src={item.imgUrl || "https://placehold.co/80x80"} alt={item.name} className="cart-item-image" />
            <div className="cart-item-info" style={{ flex: 1 }}>
              <h3>{item.name}</h3>
              <p className="cart-item-price">{formatPrice(item.price)} c/u</p>
            </div>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
            </div>
            <p style={{ width: "6rem", textAlign: "right", fontWeight: 700, color: "var(--cyan)" }}>
              {formatPrice(item.price * item.quantity)}
            </p>
            <button className="remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <div className="checkout-summary">
        <div className="checkout-total-line">
          <span>Subtotal</span>
          <span className="total-price">{formatPrice(getCartTotal())}</span>
        </div>
      </div>

      <div className="checkout-actions" style={{ marginTop: "2rem" }}>
        <Link to="/productos" className="auth-link" style={{ fontSize: "0.9rem" }}>Seguir comprando</Link>
        <button className="auth-btn-primary" style={{ width: "auto", padding: "0.75rem 2rem" }} onClick={() => {
          if (!isAuthenticated) {
            navigate({ to: "/login", search: { redirect: "/carrito" } });
            return;
          }
          setStep(2);
        }}>
          Continuar
        </button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      {error && <div className="auth-alert auth-alert-error">{error}</div>}

      {addressLoading ? (
        <div className="empty-state" style={{ padding: "2rem" }}>
          <Loader className="spin" size={32} style={{ color: "var(--muted)" }} />
          <p className="empty-message">Cargando direcciones...</p>
        </div>
      ) : (
        <>
          {addresses.length > 0 && !showAddressForm && (
            <div className="address-list">
              {addresses.map(addr => (
                <label key={addr.id} className={`address-card ${selectedAddressId === addr.id ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="addressId"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div className="address-card-body">
                    <strong>{addr.streetName} {addr.buildingNumber}</strong>
                    {addr.addressDetails && <p className="address-detail">{addr.addressDetails}</p>}
                    <p className="address-detail">{addr.city}, {addr.province} — CP: {addr.postalCode}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {showAddressForm && (
            <form className="address-form" onSubmit={handleCreateAddress}>
              <h3 style={{ marginBottom: "1rem", fontWeight: 600 }}>Nueva dirección</h3>
              {addressError && <div className="auth-alert auth-alert-error" style={{ marginBottom: "1rem" }}>{addressError}</div>}
              <div className="address-form-grid">
                <div className="auth-field" style={{ gridColumn: "span 2" }}>
                  <label className="auth-label">Calle</label>
                  <input name="streetName" value={addressForm.streetName} onChange={handleAddressChange} className="auth-input" placeholder="Av Siempre Viva" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Número</label>
                  <input name="buildingNumber" type="number" value={addressForm.buildingNumber} onChange={handleAddressChange} className="auth-input" placeholder="123" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Piso / Dpto <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opc)</span></label>
                  <input name="addressDetails" value={addressForm.addressDetails} onChange={handleAddressChange} className="auth-input" placeholder="3° B" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Provincia</label>
                  <input name="province" value={addressForm.province} onChange={handleAddressChange} className="auth-input" placeholder="Buenos Aires" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Ciudad</label>
                  <input name="city" value={addressForm.city} onChange={handleAddressChange} className="auth-input" placeholder="La Plata" />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Código Postal</label>
                  <input name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} className="auth-input" placeholder="1900" />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="submit" disabled={addressSubmitting} className="auth-btn-primary" style={{ flex: 1 }}>
                  {addressSubmitting ? "Guardando..." : "Guardar dirección"}
                </button>
                <button type="button" onClick={() => setShowAddressForm(false)} className="checkout-btn-secondary" style={{ flex: 1 }}>
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {!showAddressForm && (
            <button className="auth-btn-primary" style={{ marginTop: "0.75rem", width: "100%" }} onClick={() => setShowAddressForm(true)}>
              + Agregar nueva dirección
            </button>
          )}

          {addresses.length === 0 && !showAddressForm && (
            <p className="empty-message" style={{ textAlign: "center", margin: "2rem 0" }}>
              No tenés direcciones guardadas. Agregá una para continuar.
            </p>
          )}
        </>
      )}

      <div className="checkout-actions" style={{ marginTop: "2rem" }}>
        <button className="checkout-btn-secondary" onClick={() => setStep(1)}>
          <ChevronLeft size={18} /> Volver
        </button>
        <button
          className="auth-btn-primary"
          style={{ width: "auto", padding: "0.75rem 2rem" }}
          disabled={!selectedAddressId}
          onClick={() => setStep(3)}
        >
          Continuar <ChevronRight size={18} />
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      {error && <div className="auth-alert auth-alert-error">{error}</div>}

      <div className="checkout-summary">
        <h3 style={{ marginBottom: "1rem", fontWeight: 600 }}>Resumen del pedido</h3>

        <div className="checkout-items-summary">
          {items.map(item => (
            <div key={item.id} className="checkout-summary-item">
              <img src={item.imgUrl || "https://placehold.co/48x48"} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</p>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Qty: {item.quantity}</p>
              </div>
              <p style={{ fontWeight: 700, color: "var(--cyan)" }}>{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedAddress && (
        <div className="checkout-summary" style={{ marginTop: "1rem" }}>
          <h3 style={{ marginBottom: "0.75rem", fontWeight: 600, fontSize: "0.95rem" }}>Dirección de envío</h3>
          <div className="address-card selected" style={{ cursor: "default" }}>
            <strong>{selectedAddress.streetName} {selectedAddress.buildingNumber}</strong>
            {selectedAddress.addressDetails && <p className="address-detail">{selectedAddress.addressDetails}</p>}
            <p className="address-detail">{selectedAddress.city}, {selectedAddress.province} — CP: {selectedAddress.postalCode}</p>
          </div>
          <button className="auth-link" style={{ fontSize: "0.85rem", marginTop: "0.5rem", background: "none", border: "none", cursor: "pointer" }} onClick={() => setStep(2)}>
            Cambiar dirección
          </button>
        </div>
      )}

      <div className="checkout-summary" style={{ marginTop: "1rem" }}>
        <div className="checkout-total-line">
          <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>Total</span>
          <span className="total-price" style={{ fontSize: "1.75rem" }}>{formatPrice(getCartTotal())}</span>
        </div>
      </div>

      <div className="checkout-actions" style={{ marginTop: "2rem" }}>
        <button className="checkout-btn-secondary" onClick={() => setStep(2)}>
          <ChevronLeft size={18} /> Volver
        </button>
        <button
          className="auth-btn-primary"
          style={{ width: "auto", padding: "0.75rem 2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          disabled={placing}
          onClick={handlePlaceOrder}
        >
          {placing ? <Loader className="spin" size={18} /> : null}
          {placing ? "Procesando..." : "Confirmar compra"}
        </button>
      </div>
    </>
  );

  const renderStep4 = () => (
    <div className="success-screen">
      <div className="success-icon">
        <CheckCircle size={48} />
      </div>
      <h2 className="success-title">¡Compra realizada!</h2>
      <p className="success-message">Tu pedido fue registrado correctamente.</p>
      {orderId && <p className="success-order-id">N° de orden: <strong>{orderId}</strong></p>}
      <div className="success-actions">
        <Link to="/mis-compras" className="auth-btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.75rem 2rem" }}>
          Ver mis compras
        </Link>
        <Link to="/productos" className="checkout-btn-secondary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.75rem 2rem" }}>
          Seguir comprando
        </Link>
      </div>
    </div>
  );

  return (
    <div className="main-content" style={{ display: "block", maxWidth: "48rem" }}>
      <h2 className="products-title" style={{ marginBottom: "1.5rem" }}>
        {step === 4 ? "Compra confirmada" : "Checkout"}
      </h2>

      {step < 4 && <StepIndicator current={step} />}

      <div className="checkout-content" style={{ marginTop: step < 4 ? "2rem" : 0 }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
}
