import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductGrid } from "../components/ProductGrid";
import { CategorySidebar } from "../components/CategorySidebar";
import { Pagination } from "../components/Pagination";
import { SortSelect } from "../components/SortSelect";
import { useProducts } from "../hooks/useProducts";

interface ProductSearch {
  page?: number;
  category?: string;
  sort?: string;
  search?: string;
}

export const Route = createFileRoute("/productos/")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    page: Number(search.page) || 1,
    category: search.category ? String(search.category) : undefined,
    sort: String(search.sort || "name-asc"),
    search: search.search ? String(search.search) : undefined,
  }),
  component: Producto,
});

function Producto() {
  const navigate = useNavigate();
  const { page = 1, category: categoryId, sort = "name-asc", search: searchTerm } = Route.useSearch();

  const {
    products, categories, totalProducts, loading, error,
    currentPage, totalPages
  } = useProducts(categoryId || null, page, 12, sort, searchTerm || "");

  const setSelectedCategory = (newCategoryId) => {
    navigate({ to: "/productos", search: { page: 1, category: newCategoryId || undefined, sort, search: searchTerm } });
  };

  const setCurrentPage = (newPage) => {
    navigate({ to: "/productos", search: { page: newPage, category: categoryId, sort, search: searchTerm } });
  };

  const setSortBy = (newSort) => {
    navigate({ to: "/productos", search: { page: 1, category: categoryId, sort: newSort, search: searchTerm } });
  };

  const selectedCategoryName = categoryId
    ? categories.find((c) => c.id === categoryId)?.name
    : null;

  const handleViewDetails = (product) => {
    navigate({ to: "/productos/$productoID", params: { productoID: product.id } });
  };

  return (
    <div className="main-content">
      <CategorySidebar
        categories={categories}
        selectedCategory={categoryId || null}
        setSelectedCategory={setSelectedCategory}
        categoryCounts={totalProducts}
        totalProducts={totalProducts}
      />

      {loading ? (
        <div className="p-4 text-gray-600">Cargando productos...</div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <section className="products-section">
          <div className="products-header">
            <div>
              <h1 className="products-title">
                {searchTerm
                  ? `Resultados para "${searchTerm}"`
                  : selectedCategoryName || 'Todos los productos'}
              </h1>
              <p className="products-count">
                Mostrando <span>{products.length}</span> de <span>{totalProducts}</span> productos
              </p>
            </div>

            <SortSelect value={sort} onChange={setSortBy} />
          </div>

          <ProductGrid
            products={products}
            categories={categories}
            onViewDetails={handleViewDetails}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      )}
    </div>
  );
}
