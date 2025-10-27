import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Ngăn chặn alert/redirect lặp lại khi hết hạn phiên
let isAuthRedirecting = false;

apiAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        const isAuthError = status === 401 && [
            "Token đã hết hạn, vui lòng đăng nhập lại",
            "Vui lòng đăng nhập để tiếp tục",
            "Token không hợp lệ"
        ].includes(message);

        // Tránh lặp vô hạn và không tự refresh cho chính yêu cầu refresh-token
        const isRefreshCall = originalRequest?.url?.includes('/api/refresh-token');

        // Cho phép thử refresh cho cả get-profile, chỉ bỏ qua chính call refresh-token
        if (isAuthError && !isRefreshCall) {
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Dùng axios gốc để tránh interceptor của chính nó
                    await axios.post(`${API_URL}/api/refresh-token`, {}, { withCredentials: true });
                    return apiAxios(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token thất bại:", refreshError);
                }
            }

            // Nếu tới đây tức là không refresh được hoặc đã thử rồi
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;
                const isPublicPath = currentPath === '/' || currentPath === '/login' || currentPath === '/register' || currentPath.startsWith('/products/');
                if (!isPublicPath && !isAuthRedirecting) {
                    isAuthRedirecting = true;
                    alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
                    window.location.replace("/login");
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiAxios;