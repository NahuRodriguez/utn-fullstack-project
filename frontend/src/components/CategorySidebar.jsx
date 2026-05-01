export const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  categoryCounts,
  totalProducts
}) => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Categorías</h2>
      
      <button
        onClick={() => setSelectedCategory(null)}
        className={`sidebar-item ${selectedCategory === null ? 'active' : ''}`}
      >
        <div className="flex items-center gap-2">
          <span>Todos los productos</span>
        </div>
        <span className="sidebar-count">{totalProducts}</span>
      </button>

      <div className="mt-4 space-y-1">
        {categories.map((category) => {
          const isSelected = selectedCategory === category._id;
          const count = categoryCounts[category._id] || 0;
          
          return (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`sidebar-item ${isSelected ? 'active' : ''}`}
            >
              <span className="truncate pr-2">{category.name}</span>
              <span className="sidebar-count">{count}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
