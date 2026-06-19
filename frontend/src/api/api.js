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

    static fetchUserAddresses = async (userId) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/addresses/user/${userId}`;
            const response = await axios.get(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            return response.data;   
        } catch (error) {
            console.error('Error fetching addresses:', error);
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

    static fetchUserProfile = async (userId) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`;
            const response = await axios.get(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    }

    static updateUserProfile = async (userId, data) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`;
            const response = await axios.put(END_POINT, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    static fetchDeletedProducts = async (category = null, page = 1, limit = 50, sort = "name-asc", search = "") => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const params = new URLSearchParams({ page, limit, sort });
            if (category) params.set("category", category);
            if (search) params.set("search", search);

            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/products/deleted?${params}`;
            const response = await axios.get(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });

            return {
                products: response.data.data,
                productsCount: response.data.total,
                page: response.data.page,
                limit: response.data.limit,
                totalPages: response.data.totalPages
            };
        } catch (error) {
            console.error('Error fetching deleted products:', error);
            throw error;
        }
    }

    static createProduct = async (formData) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/products`;
            const response = await axios.post(END_POINT, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    static updateProduct = async (productId, data) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`;
            const response = await axios.put(END_POINT, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    static deactivateProduct = async (productId) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`;
            const response = await axios.delete(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error deactivating product:', error);
            throw error;
        }
    }

    static restoreProduct = async (productId) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/products/restore/${productId}`;
            const response = await axios.patch(END_POINT, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error restoring product:', error);
            throw error;
        }
    }

    static fetchAllUsers = async () => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/users`;
            const response = await axios.get(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    static fetchDeletedUsers = async () => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/users/deleted`;
            const response = await axios.get(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching deleted users:', error);
            throw error;
        }
    }

    static createUser = async (data) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/users`;
            const response = await axios.post(END_POINT, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static updateUser = async (userId, data) => {
        return Api.updateUserProfile(userId, data);
    }

    static deactivateUser = async (userId) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`;
            const response = await axios.delete(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error deactivating user:', error);
            throw error;
        }
    }

    static restoreUser = async (userId) => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/users/restore/${userId}`;
            const response = await axios.patch(END_POINT, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error restoring user:', error);
            throw error;
        }
    }

    static fetchAllOrders = async () => {
        const token = getToken();
        if (!token) throw new Error("Not authenticated");

        try {
            const END_POINT = `${import.meta.env.VITE_API_BASE_URL}/api/orders`;
            const response = await axios.get(END_POINT, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }
}