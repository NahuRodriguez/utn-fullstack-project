import axios from "axios";
import { useAuthStore } from "../store/authStore";

function getToken() {
  const stored = useAuthStore.getState().token;
  if (stored) return stored;
  return localStorage.getItem("token");
}

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

    static fetchAddresses = async () => {
        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/addresses`;
            const response = await axios.get(END_POINT);
            return response.data;   
        } catch (error) {
            console.error('Error fetching addresses:', error);
            throw error;
        }
    }

    static createOrder = async (payload) => {
        const token = getToken();
        if (!token) throw new Error("User is not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;
            const response = await axios.post(END_POINT, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;   
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    static fetchUserOrders = async (userId) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/orders/user/${userId}`;
            const response = await axios.get(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    }

    static fetchOrderById = async (orderId) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`;
            const response = await axios.get(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    }

    static createAddress = async (addressData) => {
        const token = getToken();

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/addresses`;
            const response = await axios.post(END_POINT, addressData, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating address:', error);
            throw error;
        }
    }
}