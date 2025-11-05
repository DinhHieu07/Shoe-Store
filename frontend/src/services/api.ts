import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

// Ngăn chặn alert/redirect lặp lại khi hết hạn phiên
let isAuthRedirecting = false;

// Đảm bảo chỉ gọi refresh-token một lần tại một thời điểm
let refreshRequest: Promise<any> | null = null;

apiAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;
        const message = error?.response?.data?.message;

        const isAuthError = status === 401 && [
            "Token đã hết hạn, vui lòng đăng nhập lại",
            "Vui lòng đăng nhập để tiếp tục",
            "Token không hợp lệ",
            "Người dùng không tồn tại"
        ].includes(message);

        // Tránh lặp vô hạn và không tự refresh cho chính yêu cầu refresh-token
        const isRefreshCall = originalRequest?.url?.includes('/api/refresh-token');

        // Cho phép thử refresh cho cả get-profile, chỉ bỏ qua chính call refresh-token
        if (isAuthError && !isRefreshCall) {
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    console.log("refreshRequest");
                    if (!refreshRequest) {
                        // Dùng axios gốc để tránh interceptor của chính nó
                        refreshRequest = axios.post(`${API_URL}/api/refresh-token`, {}, { withCredentials: true })
                            .finally(() => { refreshRequest = null; });
                    }
                    await refreshRequest;
                    return apiAxios(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token thất bại:", refreshError);
                    localStorage.removeItem("customer");
                    localStorage.removeItem("fullname");
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("avatar");
                    if (typeof window !== 'undefined') {
                        const currentPath = window.location.pathname;
                        const isPublicPath = currentPath === '/' || currentPath === '/login' || currentPath === '/register' || currentPath.startsWith('/products/');
                        if (!isPublicPath && !isAuthRedirecting) {
                            isAuthRedirecting = true;
                            window.location.replace("/login");
                        }
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiAxios;