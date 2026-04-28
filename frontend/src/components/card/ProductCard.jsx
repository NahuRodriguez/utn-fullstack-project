import { Link } from "@tanstack/react-router";
import { AgregarCarritoButton } from "../button/AgregarCarritoButton";

export function ProductCard({ product }) {

  return (
    <div className="h-full flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden bg-white dark:bg-gray-900 transition-shadow hover:shadow-md">
      <Link className="flex flex-col gap-3 h-full" to={`./${product._id}`}>
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
        </div>
      </Link>
      <AgregarCarritoButton product={ product } />
    </div>
  );
}
