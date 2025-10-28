import axios from "axios";
import apiAxios from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Variant {
    sku: string;
    size: string;
    color: string;
    price: string;
    stock: string;
}

export const apiAddProduct = async (name: string, description: string, brand: string, categoryIds: string, basePrice: string, variants: Variant[], images: string[]) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/add-product`, { name: name, description: description, brand: brand, categoryIds: categoryIds, basePrice: basePrice, variants: variants, images: images }, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Thêm sản phẩm thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiGetProducts = async () => {
    try {
        const response = await apiAxios.get(`${API_URL}/api/get-products`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Lấy danh sách sản phẩm thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiDeleteProduct = async (id: string) => {
    try {
        const response = await apiAxios.delete(`${API_URL}/api/delete-product/${id}`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Xóa sản phẩm thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiEditProduct = async (id: string, name: string, description: string, brand: string, basePrice: string, variants: Variant[], images: string[]) => {
    try {
        const response = await apiAxios.put(`${API_URL}/api/edit-product/${id}`, { name: name, description: description, brand: brand, basePrice: basePrice, variants: variants, images: images }, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Sửa sản phẩm thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}