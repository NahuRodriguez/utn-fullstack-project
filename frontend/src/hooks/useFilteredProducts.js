import { useState, useMemo } from 'react';

export const useFilteredProducts = (products, categories) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      setCurrentPage(1);


      result = result.filter(product => 
        product.categories.find(c => c._id === selectedCategory._id)
      );
    }

    const [sortField, sortOrder] = sortBy.split('-');
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'stock') {
        comparison = a.stock - b.stock;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(product => {
      product.categories.forEach(c => {
        counts[c._id] = (counts[c._id] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  return {
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
  };
};
