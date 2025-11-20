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

export const apiGetOrders = async () => {
    try {
        const res = await apiAxios.get(`${API_URL}/api/get-orders`, { withCredentials: true });
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

