import { useCartStore } from "../../store/cartStore";

export function AgregarCarritoButton({ product }) {
    const { addItem, removeItem, isInCart } = useCartStore();
    const inCart = isInCart(product._id);

    return (
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
    )
}