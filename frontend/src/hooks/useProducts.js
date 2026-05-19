import { useState, useEffect } from 'react';
import { Api } from '../api/api.js';

export const useProducts = (category = null, page = 1, limit = 12, sort = "name-asc", search = "") => {
    const [products, setProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadProductsAndCategories = async () => {
            setLoading(true);
            setError(null);

            try {
                const productsData = await Api.fetchProducts(category, page, limit, sort, search);

                setProducts(productsData.products);
                setTotalProducts(productsData.productsCount);
                setTotalPages(productsData.totalPages);

                const categoriesData = await Api.fetchCategories();
                setCategories(categoriesData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadProductsAndCategories();
    }, [category, page, limit, sort, search]);

    return {
        products, categories, totalProducts, loading, error,
        currentPage: page, totalPages
    };
};
