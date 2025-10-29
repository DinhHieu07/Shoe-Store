import axios from "axios";
import apiAxios from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiLogin = async (email: string, password: string) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/login`, { email: email, password: password}, {
            withCredentials: true
        });
        const data = response.data;

        const userData = {
            _id: data.user._id,
            fullname: data.user.fullname,
            email: data.user.email || email,
            role: data.user.role || 'customer',
            avatar: data.user.avatar
        };
        localStorage.setItem("customer", JSON.stringify(userData));
        localStorage.setItem("fullname", data.user.fullname);
        localStorage.setItem("user_id", data.user._id);
        localStorage.setItem("avatar", data.user.avatar || '');

        if (data.success === true) {
            window.location.href = "/";
            return data;
        } else {
            return { success: false, message: data.message };
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Đăng nhập thất bại";
            alert(message);
            return { success: false, message };
        } else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}