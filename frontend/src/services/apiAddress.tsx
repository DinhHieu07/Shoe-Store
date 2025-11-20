import axios from "axios";
import apiAxios from "./api";
import { AddressPayload } from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiUpdateAddress = async (address: AddressPayload) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/update-address`, { address: address }, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Cập nhật địa chỉ thất bại";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
}