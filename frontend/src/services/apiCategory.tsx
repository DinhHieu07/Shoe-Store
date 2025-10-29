import axios from "axios";
import apiAxios from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiAddCategory = async (name: string) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/add-category`, { name }, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Thêm danh mục thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiGetCategories = async () => {
    try {
        const response = await apiAxios.get(`${API_URL}/api/get-categories`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Lấy danh mục thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}