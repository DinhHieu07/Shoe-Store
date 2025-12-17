import axios from 'axios';
import apiAxios from './api';
import { CreateOrderPayload } from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiCreateOrder = async (payload: CreateOrderPayload) => {
    try {
        const res = await apiAxios.post(`${API_URL}/api/create-order`, payload, { withCredentials: true });
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Tạo đơn hàng thất bại';
            return { success: false, message };
        } else {
            return { success: false, message: 'Đã xảy ra lỗi không xác định' };
        }
    }
};

export const apiCreateZaloPayPaymentUrl = async (orderId: string, amount: number) => {
    try {
        const res = await apiAxios.post(`${API_URL}/api/create-payment-url/zalopay`, { orderId, amount }, { withCredentials: true });
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Tạo URL thanh toán ZALOPAY thất bại';
            return { success: false, message };
        } else {
            return { success: false, message: 'Đã xảy ra lỗi không xác định' };
        }
    }
};

export const apiHandleZaloPayCallback = async (orderId: string, amount: number) => {
    try {
        const res = await apiAxios.post(`${API_URL}/api/payment-callback/zalopay`, { orderId, amount }, { withCredentials: true });
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Xử lý callback thanh toán ZALOPAY thất bại';
            return { success: false, message };
        }
        else {
            return { success: false, message: 'Đã xảy ra lỗi không xác định' };
        }
    }
};

export const apiGetOrders = async (status?: string) => {
    try {
        let url = `${API_URL}/api/get-orders`;
        if (status) {
            url += `?status=${status}`;
        }

        const res = await apiAxios.get(url, { withCredentials: true });
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Lấy danh sách đơn hàng thất bại';
            return { success: false, message };
        } else {
            return { success: false, message: 'Đã xảy ra lỗi không xác định' };
        }
    }
};

export const apiGetOrderDetail = async (orderId: string) => {
    try {
        const res = await apiAxios.get(`${API_URL}/api/get-order-detail/${orderId}`, { withCredentials: true });
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Lấy chi tiết đơn hàng thất bại';
            return { success: false, message };
        } else {
            return { success: false, message: 'Đã xảy ra lỗi không xác định' };
        }
    }
};

// --- THÊM MỚI: API CHO ADMIN ---

// 1. Lấy tất cả đơn hàng (Admin)
export const apiGetAllOrders = async () => {
    try {
        // Giả sử backend bạn có route này. Nếu chưa, hãy tạo route trả về toàn bộ đơn hàng
        const res = await apiAxios.get(`${API_URL}/api/admin/get-all-orders`, { withCredentials: true });
        return res.data;
    } catch (error: unknown) {
        return { success: false, message: 'Không thể lấy danh sách toàn bộ đơn hàng' };
    }
};

// 2. Cập nhật trạng thái đơn hàng (Admin)
export const apiUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
        const res = await apiAxios.put(`${API_URL}/api/admin/update-order-status`, { orderId, status }, { withCredentials: true });
        return res.data;
    } catch (error: unknown) {
        return { success: false, message: 'Cập nhật trạng thái thất bại' };
    }
};
