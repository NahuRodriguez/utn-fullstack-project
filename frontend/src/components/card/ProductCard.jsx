import { Link } from "@tanstack/react-router";
import { useCartStore } from "../../store/cartStore";

export function ProductCard({ product }) {
  const { addItem, removeItem, isInCart } = useCartStore();
  const inCart = isInCart(product._id);

  return (
    <Link to={`./${product._id}`}>
    <div className="flex flex-col gap-3 h-full border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden bg-white dark:bg-gray-900 transition-shadow hover:shadow-md">
      <img
        src={product.imgUrl || "https://placehold.co/400x200/e9d5ff/7e22ce?text=Producto"}
        alt={product.name}
        className="w-full h-44 object-cover"
      />
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="h-full pb-2"> <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {product.name}
        </h3></div>
        <div className="h-full pb-3">{product.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
            {product.description}
          </p>
        )}</div>
        <p className="text-purple-600 dark:text-purple-400 font-bold text-lg mt-auto">
          ${product.price.toFixed(2)}
        </p>
        <button
          onClick={() => (inCart ? removeItem(product._id) : addItem(product))}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors cursor-pointer ${
            inCart
              ? "bg-red-500 hover:bg-red-600"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {inCart ? "✕ Quitar del carrito" : "+ Agregar al carrito"}
        </button>
      </div>
    </div>
    </Link>
  );
}
