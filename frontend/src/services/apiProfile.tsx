import axios from "axios";
import apiAxios from "./api";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetProfile = async () => {
    try {
        const response = await apiAxios.get(`${API_URL}/api/get-profile`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Lấy thông tin người dùng thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiUpdateAvatar = async (avatar: File | null) => {
    try {
        if (!avatar) return { success: false, message: "Không có file để tải lên" };
        const formData = new FormData();
        formData.append("avatar", avatar);

        const response = await apiAxios.post(`${API_URL}/api/upload-avatar`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        });
        const data = response.data;
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Cập nhật avatar thất bại";
            return { success: false, message };
        } else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiUpdateProfile = async (fullname: string, phone: string, email: string, address: { city: string, district: string, ward: string, fullAddress: string, label: string }) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/update-profile`, { fullname: fullname, phone: phone, email: email, address: address }, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Cập nhật thông tin người dùng thất bại";
            return { success: false, message };
        } else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}
