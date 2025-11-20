import axios from 'axios';
import apiAxios from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiAddToCart = async (productId: string, quantity: number, price: number, variantIndex?: number) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/add-to-cart`, { productId: productId, quantity: quantity, price: price, variantIndex: variantIndex }, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Thêm sản phẩm vào giỏ hàng thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiGetCart = async () => {
    try {
        const response = await apiAxios.get(`${API_URL}/api/get-cart`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Lấy giỏ hàng thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiUpdateItemQuantity = async (productId: string, quantity: number, size: string) => {
    try {
        const response = await apiAxios.put(`${API_URL}/api/update-item-quantity`, { productId: productId, quantity: quantity, size: size }, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Cập nhật số lượng sản phẩm trong giỏ hàng thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiDeleteItemFromCart = async (productId: string, size: string) => {
    try {
        const response = await apiAxios.delete(`${API_URL}/api/delete-item-from-cart/${productId}`, {
            params: { size: size },
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Xóa sản phẩm khỏi giỏ hàng thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiDeleteAllItemsFromCart = async () => {
    try {
        const response = await apiAxios.delete(`${API_URL}/api/delete-all-items-from-cart`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Xóa tất cả sản phẩm khỏi giỏ hàng thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}