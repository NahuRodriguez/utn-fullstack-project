import { createFileRoute } from "@tanstack/react-router";
import { useCartStore } from "../store/cartStore";

export const Route = createFileRoute("/carrito")({
  component: Carrito,
});

function Carrito() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center gap-4 text-gray-500">
        <span className="text-6xl">🛒</span>
        <p className="text-xl font-medium">Tu carrito está vacío</p>
        <p className="text-sm">Agregá productos desde la sección Productos</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Mi Carrito</h2>

      <div className="flex flex-col gap-4">
        {items.map(({ product, quantity }) => (
          <div
            key={product._id}
            className="flex gap-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm items-center"
          >
            <img
              src={
                product.imgUrl ||
                "https://placehold.co/80x80/e9d5ff/7e22ce?text=P"
              }
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{product.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${product.price.toFixed(2)} c/u
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product._id, quantity - 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold transition-colors cursor-pointer"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(product._id, quantity + 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold transition-colors cursor-pointer"
              >
                +
              </button>
            </div>

            <p className="w-24 text-right font-bold text-purple-600 dark:text-purple-400">
              ${(product.price * quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeItem(product._id)}
              className="text-red-400 hover:text-red-600 transition-colors cursor-pointer ml-2"
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
