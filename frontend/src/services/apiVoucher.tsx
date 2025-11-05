import axios from 'axios';
import apiAxios from './api';
import { VoucherPayload } from '@/types/voucher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiGetVouchers = async () => {
  try {
    const res = await apiAxios.get(`${API_URL}/api/get-vouchers`, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Lấy voucher thất bại';
      return { success: false, message };
    }
    else {
      return { success: false, message: 'Đã xảy ra lỗi không xác định' };
    }
  }
};

export const apiAddVoucher = async (payload: VoucherPayload) => {
  try {
    console.log(payload);
    const res = await apiAxios.post(`${API_URL}/api/add-voucher`, payload, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Tạo voucher thất bại';
      return { success: false, message };
    }
    else {
      return { success: false, message: 'Đã xảy ra lỗi không xác định' };
    }
  }
};

export const apiEditVoucher = async (id: string, payload: VoucherPayload) => {
  try {
    const res = await apiAxios.put(`${API_URL}/api/edit-voucher/${id}`, payload, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Cập nhật voucher thất bại';
      return { success: false, message };
    }
    else {
      return { success: false, message: 'Đã xảy ra lỗi không xác định' };
    }
  }
};

export const apiDeleteVoucher = async (id: string) => {
  try {
    const res = await apiAxios.delete(`${API_URL}/api/delete-voucher/${id}`, { withCredentials: true });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Xóa voucher thất bại';
      return { success: false, message };
    }
    else {
      return { success: false, message: 'Đã xảy ra lỗi không xác định' };
    }
  }
};

export const apiValidateVoucher = async (code: string, orderAmount: number) => {
  try {
    const res = await apiAxios.post(`${API_URL}/api/validate-voucher`, { code, orderAmount });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Kiểm tra voucher thất bại';
      return { success: false, message };
    }
    else {
      return { success: false, message: 'Đã xảy ra lỗi không xác định' };
    }
  }
};


