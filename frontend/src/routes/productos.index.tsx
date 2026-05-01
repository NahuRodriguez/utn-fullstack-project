import { useState, useEffect } from "react";
import axios from "axios";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductGrid } from "../components/ProductGrid";
import { CategorySidebar } from "../components/CategorySidebar";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import { Pagination } from "../components/Pagination";
import { SortSelect } from "../components/SortSelect";

export const Route = createFileRoute("/productos/")({
  component: Producto,
});

function Producto() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const {
    filteredProducts,
    paginatedProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    categoryCounts,
  } = useFilteredProducts(products, categories);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productos = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/`);
        const categorias = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories/`);

        setProducts(productos.data);
        setCategories(categorias.data);        

      } catch (err) {
        setError("Error al cargar los productos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (product) => {
    navigate({ to: "/productos/$productoID", params: { productoID: product._id } });
  };

  if (loading) return <div className="p-4 text-gray-600">Cargando productos...</div>;

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="main-content">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          totalProducts={products.length}
        />

      <section className="products-section">
            <div className="products-header">
              <div>
                <h1 className="products-title"> 
                  {/* selectedCategoryName || 'Todos los productos'*/}
                </h1>
                <p className="products-count">
                  Mostrando <span>{paginatedProducts.length}</span> de{' '}
                  <span>{filteredProducts.length}</span> productos
                </p>
              </div>

              <SortSelect value={sortBy} onChange={setSortBy} /> 
            </div>

            <ProductGrid
              products={paginatedProducts}
              categories={categories}
              onViewDetails={handleViewDetails}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </section>
    </div>
  );
}
