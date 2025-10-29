import axios from "axios";
import apiAxios from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGoogleLogin = async (id_token: string) => {
    try {
    const response = await apiAxios.post(`${API_URL}/api/google-login`, { id_token }, {
        withCredentials: true
    });
    const data = response.data;
    if (data.success) {
        const userData = {
            _id: data.user._id,
            fullname: data.user.fullname,
            email: data.user.email,
            role: data.user.role || 'customer',
            avatar: data.user.avatar || ''
        };
        localStorage.setItem("customer", JSON.stringify(userData));
        localStorage.setItem("fullname", data.user.fullname);
        localStorage.setItem("user_id", data.user._id);
        localStorage.setItem("avatar", data.user.avatar || '');
        window.location.href = "/";
        } else {
            throw new Error(data.message || "Đăng nhập Google thất bại");
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message || "Đăng nhập Google thất bại";
            alert(message);
            return { success: false, message };
        } else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}
