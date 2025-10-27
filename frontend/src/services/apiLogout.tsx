import axios from "axios";
import apiAxios from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiLogout = async () => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/logout`, {}, {
            withCredentials: true
        });
        const data = response.data;
        if (data.success === true) {
            localStorage.removeItem("customer");
            localStorage.removeItem("fullname");
            localStorage.removeItem("user_id");
            localStorage.removeItem("avatar");
            window.location.href = "/";
            return { success: true, message: data.message };
        } else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Đăng xuất thất bại";
            alert(message);
            return { success: false, message };
        } else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
};