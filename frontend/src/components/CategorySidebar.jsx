import { scrollToTop } from "../utils/utils";
import React, { useState } from 'react';

export const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  categoryCounts,
  totalProducts
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (category) => {
    const selectedCategoryId = category ? category.id : null;
    setSelectedCategory(selectedCategoryId);
    scrollToTop();
  
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mobile-sidebar-toggle"
        aria-label="Abrir menú de categorías"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
        <span>Categorías</span>
      </button>

      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel del Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-between mb-3 md:block">
          <h2 className="sidebar-title" style={{ margin: 0 }}>Categorías</h2>
        </div>
        
        <button
          onClick={() => handleCategoryClick(null)}
          className={`sidebar-item ${selectedCategory === null ? 'active' : ''}`}
        >
          <div className="flex items-center gap-2">
            <span>Todos los productos</span>
          </div>
          {selectedCategory === null && <span className="sidebar-count">{totalProducts}</span>}
        </button>

        <div className="mt-4 space-y-1">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            // Manejo seguro por si categoryCounts viene como objeto diccionario o como valor simple
            const count = typeof categoryCounts === 'object' && categoryCounts !== null
              ? categoryCounts[category.id] || 0
              : categoryCounts;
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`sidebar-item ${isSelected ? 'active' : ''}`}
              >
                <span className="truncate pr-2">{category.name}</span>
                {isSelected && <span className="sidebar-count">{count}</span>}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};