import { useState, useEffect } from "react";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";
import { AgregarCarritoButton } from "../components/button/AgregarCarritoButton";

export const Route = createFileRoute("/productos/$productoID")({
  component: DetalleProducto,
});

import { X, ShoppingCart, Package, Shield, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatPrice = (price: any) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

function DetalleProducto() {
  const { productoID } = Route.useParams();

  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasStock = product.stock > 0;
  const isLowStock = product.stock <= 10 && product.stock > 0;

  /*
  const productCategories = product.categories.map(catId => 
    categories.find(c => c._id === catId)
  ).filter(Boolean);
  
  */


  const { addToCart } = useCart();


  const handleAddToCart = () => {
    addToCart(product);
  };

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

  /*
  for (const category of product.categories) {
    categoriesString += category.name + " - "
  }*/

  categoriesString = categoriesString.slice(0, -4);

  return (

<div className="modal-overlay">
        <div className="modal-grid">
          <div className="modal-image-section">
            <img
              src={product.imgUrl}
              alt={product.name}
              className="modal-image"
            />
          </div>

          <div className="modal-details">
            {/** 
            <div className="modal-categories">
              {productCategories.map((cat) => (
                <span key={cat._id} className="product-category">
                  {cat.name}
                </span>
              ))}
            </div>
          */}
            <h2 className="modal-title">{product.name}</h2>

            <p className="modal-description">{product.description}</p>

            <div className="modal-info-list">
              <div className="modal-info-item">
                <Package className="w-5 h-5" style={{ color: 'var(--cyan)' }} />
                <span>
                  Disponibilidad:{' '}
                  <span style={{ 
                    color: hasStock ? (isLowStock ? 'var(--warning)' : 'var(--success)') : 'var(--error)'
                  }}>
                    {hasStock 
                      ? (isLowStock ? `¡Últimas ${product.stock} unidades!` : `${product.stock} en stock`)
                      : 'Sin stock'}
                  </span>
                </span>
              </div>
              
              <div className="modal-info-item">
                <Truck className="w-5 h-5" style={{ color: 'var(--success)' }} />
                <span>Envío disponible a todo el país</span>
              </div>

              <div className="modal-info-item">
                <Shield className="w-5 h-5" style={{ color: 'var(--purple)' }} />
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
              className={`modal-add-btn ${hasStock ? 'available' : 'unavailable'}`}
              onClick={handleAddToCart}
              disabled={!hasStock}
            >
              <ShoppingCart className="w-6 h-6" />
              {hasStock ? 'Agregar al carrito' : 'Sin stock'}
            </button>
          </div>
      </div>
    </div>
  );

    {/**
      
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
      */}
}
