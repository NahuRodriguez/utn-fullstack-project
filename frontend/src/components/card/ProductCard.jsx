import { ShoppingCart, Eye, Package, AlertTriangle } from 'lucide-react';
// import { useCart } from '../context/CartContext';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const ProductCard = ({ product, categories, onViewDetails }) => {
  // const { addToCart } = useCart();
  const addToCart = {};
  
  /*
  const categoryName = product.categories[0] 
    ? categories.find(c => c._id === product.categories[0])?.name || 'Sin categoría'
    : 'Sin categoría';
  */ 

  const hasStock = product.stock > 0;
  const isLowStock = product.stock <= 10 && product.stock > 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // addToCart(product);
  };

  return (
    <div className="product-card" onClick={() => onViewDetails(product)}>
      <div className="product-image-container">
        <img
          src={product.imgUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        
        <div className="product-badges">
          {!hasStock && (
            <span className="badge badge-none flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Sin stock
            </span>
          )}
          {isLowStock && (
            <span className="badge badge-low flex items-center gap-1">
              <Package className="w-3 h-3" />
              ¡Últimas {product.stock}!
            </span>
          )}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="product-view-btn"
        >
          <Eye className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="product-info">
        {
          /*
            <span className="product-category">{categoryName}</span>
          */
        }
        
        <h3 className="product-name">{product.name}</h3>
        
        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div>
            <p className="product-price">{formatPrice(product.price)}</p>
            <p className="product-stock">{product.stock} unidades</p>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={!hasStock}
            className="add-cart-btn"
            title={hasStock ? 'Agregar al carrito' : 'Sin stock'}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};