import axios from "axios";
import apiAxios from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiValidateEmail = async (email: string) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/validate-email`, { email }, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Xác thực email thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiVerifyOTP = async (email: string, otp: string) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/verify-otp`, { email, otp }, {
            withCredentials: true
        });
        const data = response.data;
        console.log(data);
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Xác thực mã OTP thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}

export const apiChangePassword = async (email: string, newPassword: string) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/change-password`, { email, newPassword }, {
            withCredentials: true
        });
        const data = response.data;
        console.log(data);
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Đặt lại mật khẩu thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}