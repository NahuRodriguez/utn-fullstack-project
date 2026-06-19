import { useState, useEffect } from "react";
import axios from "axios";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingCart,
  Package,
  Shield,
  Truck,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CreditCard,
} from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { formatPrice } from "../utils/utils";

export const Route = createFileRoute("/productos/$productoID")({
  component: DetalleProducto,
});

function DetalleProducto() {
  const { productoID } = Route.useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, isInCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${productoID}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("No se pudo encontrar el producto solicitado");
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [productoID]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-loading">
          <div className="detail-spinner" />
          <p className="detail-loading-text">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-page">
        <div className="detail-empty">
          <XCircle size={48} />
          <h2 className="detail-empty-title">Producto no encontrado</h2>
          <p className="detail-empty-text">{error}</p>
          <Link to="/productos" className="detail-empty-btn">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-page">
        <div className="detail-empty">
          <AlertTriangle size={48} />
          <h2 className="detail-empty-title">Producto no encontrado</h2>
          <p className="detail-empty-text">
            El producto que buscás no existe o fue eliminado.
          </p>
          <Link to="/productos" className="detail-empty-btn">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const hasStock = product.stock > 0;
  const isLowStock = product.stock <= 10 && product.stock > 0;
  const inCart = isInCart(product.id);

  const handleCartClick = () => {
    inCart ? removeFromCart(product.id) : addToCart(product);
  };

  return (
    <div className="detail-page">
      <div className="detail-container">
        <button className="detail-back" onClick={() => navigate({ to: "/productos" })}>
          <ArrowLeft size={18} />
          Volver a productos
        </button>

        <div className="detail-grid">
          <div className="detail-image-section">
            <div className="detail-image-wrapper">
              <img
                src={product.imgUrl}
                alt={product.name}
                className="detail-image"
              />
            </div>
          </div>

          <div className="detail-info">
            <span className="detail-category">
              {product.categories?.[0]?.name ?? "Sin categoría"}
            </span>

            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-price-section">
              <span className="detail-price-label">Precio</span>
              <span className="detail-price">{formatPrice(product.price)}</span>
              <span className="detail-installments">
                <CreditCard size={14} />
                12 cuotas sin interés de {formatPrice(product.price / 12)}
              </span>
            </div>

            <p className="detail-description">{product.description}</p>

            <div className="detail-stock">
              {!hasStock ? (
                <span className="detail-stock-badge detail-stock-none">
                  <XCircle size={16} />
                  Sin stock
                </span>
              ) : isLowStock ? (
                <span className="detail-stock-badge detail-stock-low">
                  <AlertTriangle size={16} />
                  ¡Últimas {product.stock} unidades!
                </span>
              ) : (
                <span className="detail-stock-badge detail-stock-ok">
                  <CheckCircle size={16} />
                  {product.stock} en stock
                </span>
              )}
            </div>

            <div className="detail-features">
              <div className="detail-feature">
                <Truck size={18} />
                <div>
                  <span className="detail-feature-title">Envío rápido</span>
                  <span className="detail-feature-text">
                    A todo el país en 24/48hs
                  </span>
                </div>
              </div>
              <div className="detail-feature">
                <Shield size={18} />
                <div>
                  <span className="detail-feature-title">Garantía</span>
                  <span className="detail-feature-text">
                    12 meses de garantía oficial
                  </span>
                </div>
              </div>
              <div className="detail-feature">
                <Package size={18} />
                <div>
                  <span className="detail-feature-title">Compra segura</span>
                  <span className="detail-feature-text">
                    Datos protegidos y pago cifrado
                  </span>
                </div>
              </div>
            </div>

            <button
              className={`detail-add-btn ${hasStock ? (inCart ? "in-cart" : "available") : "unavailable"}`}
              onClick={handleCartClick}
              disabled={!hasStock}
            >
              <ShoppingCart size={20} />
              {!hasStock
                ? "Sin stock"
                : inCart
                  ? "Quitar del carrito"
                  : "Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
