import { useState, useEffect } from "react";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";
import { ProductCard } from "../components/card/ProductCard";

export const Route = createFileRoute("/productos/")({
  component: Producto,
});

function Producto() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/`,
        );
        setProducts(response.data);
      } catch (err) {
        setError("Error al cargar los productos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <div className="p-4 text-gray-600">Cargando productos...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Nuestros Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((producto) => (
          <ProductCard key={producto._id} product={producto} />
        ))}
      </div>
    </div>
  );
}
