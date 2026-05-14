import axios from "axios";

export class Api {
    static fetchProducts = async (category = null, page = 1, limit = 50, sort = "name-asc", search = "") => {
        try {
            const params = new URLSearchParams({ page, limit, sort });
            if (category) params.set("category", category);
            if (search) params.set("search", search);

            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/products?${params}`;
            const response = await axios.get(END_POINT);

            return {
                products: response.data.data,
                productsCount: response.data.total,
                page: response.data.page,
                limit: response.data.limit,
                totalPages: response.data.totalPages
            };
            
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    static fetchCategories = async () => {
        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/categories`;
            const response = await axios.get(END_POINT);
            return response.data;   
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
}