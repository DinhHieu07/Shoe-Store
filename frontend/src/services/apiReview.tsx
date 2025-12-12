import axios from 'axios';
import apiAxios from './api';
import { Review, RatingSummary } from '@/types/review';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Lấy danh sách đánh giá của sản phẩm
export const apiGetReviews = async (productId: string, rating?: number) => {
    try {
        let url = `${API_URL}/api/get-reviews/${productId}`;
        if (rating && rating >= 1 && rating <= 5) {
            url += `?rating=${rating}`;
        }

        const res = await apiAxios.get(url);
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Lấy danh sách đánh giá thất bại';
            return { success: false, message, reviews: [] };
        } else {
            return { success: false, message: 'Đã xảy ra lỗi không xác định', reviews: [] };
        }
    }
};

// Lấy tóm tắt đánh giá (rating summary)
export const apiGetRatingSummary = async (productId: string) => {
    try {
        const res = await apiAxios.get(`${API_URL}/api/get-rating-summary/${productId}`);
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Lấy tóm tắt đánh giá thất bại';
            return { 
                success: false, 
                message,
                summary: {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                }
            };
        } else {
            return { 
                success: false, 
                message: 'Đã xảy ra lỗi không xác định',
                summary: {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                }
            };
        }
    }
};

// Tạo đánh giá mới
export const apiCreateReview = async (productId: string, rating: number, comment: string, images?: string[]) => {
    try {
        const res = await apiAxios.post(
            `${API_URL}/api/create-review`,
            { productId, rating, comment, images: images || [] },
            { withCredentials: true }
        );
        return res.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message || 'Tạo đánh giá thất bại';
            return { success: false, message };
        } else {
            return { success: false, message: 'Đã xảy ra lỗi không xác định' };
        }
    }
};

