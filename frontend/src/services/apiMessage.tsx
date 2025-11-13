import axios from "axios";
import apiAxios from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getMessages = async () => {
    try {
        const response = await apiAxios.get(`${API_URL}/api/get-messages`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Lỗi khi lấy tin nhắn";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
};

// API cho admin
export const getConversations = async () => {
    try {
        const response = await apiAxios.get(`${API_URL}/api/get-conversations`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Lỗi khi lấy danh sách cuộc trò chuyện";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
};

export const getMessagesWithUser = async (userId: string) => {
    try {
        const response = await apiAxios.get(`${API_URL}/api/get-messages-with-user/${userId}`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Lỗi khi lấy tin nhắn với người dùng";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
};

export const markConversationAsRead = async (userId: string) => {
    try {
        const response = await apiAxios.post(`${API_URL}/api/mark-conversation-as-read/${userId}`, {
            withCredentials: true
        });
        const data = response.data;
        return data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || "Lỗi khi đánh dấu cuộc trò chuyện đã đọc";
            return { success: false, message };
        }
        else {
            return { success: false, message: "Đã xảy ra lỗi không xác định" };
        }
    }
};