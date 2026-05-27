import { useState, useEffect } from "react";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, Package, Shield, Truck } from "lucide-react";
import { useCartStore } from "../store/cartStore";

export const Route = createFileRoute("/productos/$productoID")({
  component: DetalleProducto,
});

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

function DetalleProducto() {
  const { productoID } = Route.useParams();
  const { addToCart, removeFromCart, isInCart } = useCartStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${productoID}`
        );
        setProduct(response.data);
      } catch (err) {
        setError("No se pudo encontrar el producto solicitado");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [productoID]);

  if (loading) return <div className="p-4">Cargando detalles del producto...</div>;
  if (error)   return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">Producto no encontrado.</div>;

  const hasStock  = product.stock > 0;
  const isLowStock = product.stock <= 10 && product.stock > 0;
  const inCart    = isInCart(product._id);

  const handleCartClick = () => {
    inCart ? removeFromCart(product._id) : addToCart(product);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-grid">

        <div className="modal-image-section">
          <img src={product.imgUrl} alt={product.name} className="modal-image" />
        </div>

        <div className="modal-details">
          <h2 className="modal-title">{product.name}</h2>

          <p className="modal-description">{product.description}</p>

          <div className="modal-info-list">
            <div className="modal-info-item">
              <Package className="w-5 h-5" style={{ color: "var(--cyan)" }} />
              <span>
                Disponibilidad:{" "}
                <span style={{
                  color: hasStock
                    ? isLowStock ? "var(--warning)" : "var(--success)"
                    : "var(--error)",
                }}>
                  {hasStock
                    ? isLowStock ? `¡Últimas ${product.stock} unidades!` : `${product.stock} en stock`
                    : "Sin stock"}
                </span>
              </span>
            </div>

            <div className="modal-info-item">
              <Truck className="w-5 h-5" style={{ color: "var(--success)" }} />
              <span>Envío disponible a todo el país</span>
            </div>

            <div className="modal-info-item">
              <Shield className="w-5 h-5" style={{ color: "var(--purple)" }} />
              <span>Garantía de 12 meses</span>
            </div>
          </div>

          <div className="modal-price-section">
            <p className="modal-price-label">Precio</p>
            <p className="modal-price">{formatPrice(product.price)}</p>
            <p className="modal-price-installments">
              o 12x {formatPrice(product.price / 12)} sin interés
            </p>
          </div>

          <button
            className={`modal-add-btn ${hasStock ? (inCart ? "in-cart" : "available") : "unavailable"}`}
            onClick={handleCartClick}
            disabled={!hasStock}
          >
            <ShoppingCart className="w-6 h-6" />
            {!hasStock ? "Sin stock" : inCart ? "Quitar del carrito" : "Agregar al carrito"}
          </button>
        </div>

      </div>
    </div>
  );
}
