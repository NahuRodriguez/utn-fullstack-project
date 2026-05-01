import { useEffect, useState } from 'react';
import { Search, ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const Header = () => {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const [searchTerm , setSearchTerm] = useState();
  const [cartOpen, setCartOpen] = useState(false);
  
  useEffect(() => {
    // TODO...
    
    console.log(searchTerm)
  }, [searchTerm])

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="flex items-center gap-3" style={{display: "flex", gap: "1rem", alignItems: "center"}}>
            <div className="logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <h1 className="logo-text">PECEI</h1>
              <p className="logo-subtitle">Plataforma E-Commerce para Equipos Informaticos</p>
            </div>
          </div>

          <div className="search-container">
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <button 
            className="cart-btn"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="w-6 h-6" style={{ color: 'var(--text)' }} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-panel" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Carrito de Compras</h2>
              <button className="cart-close" onClick={() => setCartOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingCart className="w-16 h-16" style={{ color: 'var(--muted)' }} />
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item._id} className="cart-item">
                      <img src={item.imgUrl} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p className="cart-item-price">{formatPrice(item.price)}</p>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                            <Minus className="w-4 h-4" />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span className="total-price">{formatPrice(cartTotal)}</span>
                  </div>
                  <button className="checkout-btn">
                    Finalizar Compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
