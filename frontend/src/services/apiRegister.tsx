import axios from "axios";
import apiAxios from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiRegister = async (fullname: string, email: string, phone: string, password: string, address: { city: string, district: string, ward: string, fullAddress: string, isDefault: boolean }) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/register`, { fullname: fullname, email: email, phone: phone, password: password, address: address}, {
            withCredentials: true
        });
        const data = response.data;

        if (data.success === true) {
            window.location.href = "/login";
            return data;
        } else {
            return { success: false, message: data.message };
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Đăng ký thất bại";
            alert(message);
            return { success: false, message };
        } else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}