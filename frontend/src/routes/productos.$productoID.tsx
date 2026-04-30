import { useState, useEffect } from "react";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";
import { AgregarCarritoButton } from "../components/button/AgregarCarritoButton";

export const Route = createFileRoute("/productos/$productoID")({
  component: DetalleProducto,
});

function DetalleProducto() {
  const { productoID } = Route.useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${productoID}`,
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

  if (loading)
    return <div className="p-4">Cargando detalles del producto...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!product) return <div className="p-4">Producto no encontrado.</div>;

  let categoriesString = ">> ";

  for (const category of product.categories) {
    categoriesString += category.name + " - "
  }
  categoriesString = categoriesString.slice(0, -4);

  return (
    <div className="p-6 flex flex-row gap-7">
      <img
        src={product.imgUrl || "https://placehold.co/400x200/e9d5ff/7e22ce?text=Producto"}
        alt={product.name}
        className="w-7x1 h-7x1 object-cover"
      />
      <div className="flex flex-col grow justify-between">
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
        <p className="text-0.5 mb-2 self-start"><u>{categoriesString}</u></p>
        <p className="text-xl text-blue-600 mb-4">Precio: ${product.price}</p>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold">Descripción del producto:</h4>
          <p>{product.description || "Sin descripción disponible."}</p>
        </div>
        <AgregarCarritoButton product={ product } />
      </div>
    </div>
  );
}
