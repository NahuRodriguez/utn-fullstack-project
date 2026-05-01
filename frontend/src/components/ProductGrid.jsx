import { Search } from 'lucide-react';
import { ProductCard } from "./card/ProductCard"

export const ProductGrid = ({ products, categories, onViewDetails }) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Search className="w-12 h-12" style={{ color: 'var(--muted)' }} />
        </div>
        <h3 className="empty-title">No se encontraron productos</h3>
        <p className="empty-message">
          Intenta ajustar tus filtros o búsqueda para encontrar lo que buscas.
        </p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          categories={categories}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
