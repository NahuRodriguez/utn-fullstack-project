import { useState, useEffect } from "react";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/productos/$productoID")({
  component: DetalleProducto,
});

function DetalleProducto() {
  const { productId } = Route.useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`,
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
  }, [productId]);

  if (loading)
    return <div className="p-4">Cargando detalles del producto...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">Producto no encontrado.</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
      <p className="text-xl text-blue-600 mb-4">Precio: ${product.price}</p>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold">Descripción del producto:</h4>
        <p>{product.description || "Sin descripción disponible."}</p>
      </div>
    </div>
  );
}
