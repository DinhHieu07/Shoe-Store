"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetAllOrders, apiUpdateOrderStatus } from "@/services/apiOrder";
import Toast from "./Toast";
import styles from "@/styles/AdminOrderManagement.module.css";

interface AdminOrder {
    _id: string;
    customer: { fullname: string; email: string; phone?: string };
    shippingAddress?: { fullAddress: string; city: string; district: string; ward: string; label?: string };
    totalAmount: number;
    shippingStatus: string;
    originalStatus: string;
    createdAt: string;
}

export default function AdminOrderManagement() {
    const router = useRouter();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [role, setRole] = useState<'admin' | 'customer' | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const customer = localStorage.getItem('customer');
        if (!customer) {
            router.replace('/login');
            return;
        }
        
        try {
            const customerData = JSON.parse(customer);
            const userRole = customerData?.role;
            setRole(userRole);
            
            if (userRole !== 'admin') {
                router.replace('/');
            }
        } catch (error) {
            console.error('Lỗi khi parse customer data:', error);
            router.replace('/login');
        }
    }, [router]);

    // State lưu dữ liệu thống kê
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        shipping: 0,
        delivered: 0,
        returned: 0
    });

    const [toast, setToast] = useState<any>(null);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null); // Modal chi tiết user

    // State cho Modal Xác nhận hành động
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        orderId: string;
        actionType: 'approve' | 'deliver' | 'refund' | 'cancel';
        newStatus: string;
        message: string;
    } | null>(null);

    useEffect(() => {
        fetchData(1); // Load trang 1 lúc đầu
    }, []);

    const fetchData = async (page: number) => {
        const res = await apiGetAllOrders(page, 10);
        if (res.success) {
            setOrders(res.data);
            setPagination({
                page: res.pagination.page,
                totalPages: res.pagination.totalPages
            });
            // Cập nhật thống kê nếu có trả về từ API
            if (res.stats) {
                setStats(res.stats);
            }
        }
    };

    // Hàm mở Modal xác nhận
    const openConfirm = (orderId: string, action: 'approve' | 'deliver' | 'refund' | 'cancel') => {
        let newStatus = '';
        let message = '';

        switch (action) {
            case 'approve':
                newStatus = 'shipped';
                message = 'Bạn có chắc chắn muốn DUYỆT đơn hàng này để đi giao không?';
                break;
            case 'deliver':
                newStatus = 'delivered';
                message = 'Xác nhận đơn hàng đã GIAO THÀNH CÔNG tới khách hàng?';
                break;
            case 'refund':
                newStatus = 'refunded';
                message = 'Xác nhận ĐỒNG Ý HOÀN TIỀN cho khách hàng? Hành động này không thể hoàn tác.';
                break;
            case 'cancel':
                newStatus = 'cancelled';
                message = 'Bạn có chắc chắn muốn HỦY đơn hàng này?';
                break;
        }

        setConfirmModal({ isOpen: true, orderId, actionType: action, newStatus, message });
    };

    // Hàm thực thi khi bấm "Đồng ý" trong Modal
    const handleConfirmAction = async () => {
        if (!confirmModal) return;

        const res = await apiUpdateOrderStatus(confirmModal.orderId, confirmModal.newStatus);
        if (res.success) {
            setToast({ message: "Cập nhật thành công!", type: "success" });
            fetchData(pagination.page); // Reload lại trang hiện tại để cập nhật số liệu
        } else {
            setToast({ message: "Lỗi cập nhật", type: "error" });
        }
        setConfirmModal(null); // Đóng modal
    };

    // Component con hiển thị 1 thẻ thống kê
    const StatCard = ({ title, value, color, icon }: any) => (
        <div className={styles.statCard} style={{ borderLeftColor: color }}>
            <span className={styles.statTitle}>{title}</span>
            <div className={styles.statValueRow}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statIcon}>{icon}</span>
            </div>
        </div>
    );

    const renderActionButtons = (order: AdminOrder) => {
        if (order.shippingStatus === 'PENDING') {
            return (
                <div className={styles.actionButtons}>
                    <button onClick={() => openConfirm(order._id, 'approve')} className={styles.btnApprove}>Duyệt</button>
                    <button onClick={() => openConfirm(order._id, 'cancel')} className={styles.btnCancel}>Hủy</button>
                </div>
            );
        }
        if (order.shippingStatus === 'SHIPPING') {
            return (
                <button onClick={() => openConfirm(order._id, 'deliver')} className={styles.btnDeliver}>
                    Giao xong
                </button>
            );
        }
        if (order.shippingStatus === 'RETURNED') {
            if (order.originalStatus === 'return_requested') {
                return (
                    <button onClick={() => openConfirm(order._id, 'refund')} className={styles.btnRefund}>
                        Hoàn tiền
                    </button>
                );
            }
            return <span className={styles.statusProcessed}>Đã xử lý ({order.originalStatus})</span>;
        }
        return <span className={styles.statusCompleted}>Hoàn tất</span>;
    };

    if (role !== 'admin') {
        return (
            <div className={styles.containerDenied}>
                <p className={styles.accessDeniedText}>Bạn không có quyền truy cập trang này.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <h1 className={styles.pageTitle}>Quản lý đơn hàng</h1>

            {/* KHỐI THỐNG KÊ (DASHBOARD) */}
            <div className={styles.statsContainer}>
                <StatCard title="Tổng đơn" value={stats.total} color="#007bff" icon="📦" />
                <StatCard title="Chờ duyệt" value={stats.pending} color="#ffc107" icon="⏳" />
                <StatCard title="Đang giao" value={stats.shipping} color="#17a2b8" icon="🚚" />
                <StatCard title="Đã giao" value={stats.delivered} color="#28a745" icon="✅" />
                <StatCard title="Hoàn trả / Hủy" value={stats.returned} color="#dc3545" icon="↩️" />
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} className={styles.tableRow}>
                                <td className={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</td>
                                <td>
                                    <div
                                        onClick={() => setSelectedOrder(order)}
                                        className={styles.customerName}
                                        title="Click xem chi tiết"
                                    >
                                        {order.customer?.fullname || "Khách lẻ"}
                                    </div>
                                    <div className={styles.customerEmail}>{order.customer?.email}</div>
                                </td>
                                <td className={styles.totalAmount}>
                                    {order.totalAmount.toLocaleString()}đ
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${order.shippingStatus === 'PENDING' ? styles.statusPending : styles.statusDelivered}`}>
                                        {order.shippingStatus === 'RETURNED' && order.originalStatus === 'return_requested'
                                            ? "Yêu cầu trả"
                                            : order.shippingStatus}
                                    </span>
                                </td>
                                <td>{renderActionButtons(order)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PHÂN TRANG */}
            <div className={styles.pagination}>
                <button
                    disabled={pagination.page === 1}
                    onClick={() => fetchData(pagination.page - 1)}
                    className={styles.paginationButton}
                >
                    Trước
                </button>
                <span className={styles.paginationInfo}>Trang {pagination.page} / {pagination.totalPages}</span>
                <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => fetchData(pagination.page + 1)}
                    className={styles.paginationButton}
                >
                    Sau
                </button>
            </div>

            {/* MODAL CHI TIẾT USER */}
            {selectedOrder && (
                <div className={styles.modalOverlay} onClick={() => setSelectedOrder(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>
                            Thông tin đơn hàng #{selectedOrder._id.slice(-6).toUpperCase()}
                        </h3>

                        <div className={styles.modalSection}>
                            <h4 className={styles.modalSectionTitle}>👤 Người đặt hàng</h4>
                            <p className={styles.modalText}><strong>Tên:</strong> {selectedOrder.customer?.fullname}</p>
                            <p className={styles.modalText}><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                            <p className={styles.modalText}><strong>SĐT:</strong> {selectedOrder.customer?.phone || "Chưa cập nhật"}</p>
                        </div>

                        <div className={styles.modalSection}>
                            <h4 className={styles.modalSectionTitle}>📍 Địa chỉ nhận hàng</h4>
                            {selectedOrder.shippingAddress ? (
                                <>
                                    <p className={styles.modalText}><strong>Người nhận:</strong> {selectedOrder.shippingAddress.label || selectedOrder.customer?.fullname}</p>
                                    <p className={styles.modalText}>
                                        {selectedOrder.shippingAddress.fullAddress}, {selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                                    </p>
                                </>
                            ) : (
                                <p className={styles.modalError}>Không có thông tin địa chỉ</p>
                            )}
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className={styles.btnClose}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÁC NHẬN HÀNH ĐỘNG */}
            {confirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.confirmModal}>
                        <h3 className={styles.modalTitle}>Xác nhận</h3>
                        <p className={styles.confirmMessage}>{confirmModal.message}</p>
                        <div className={styles.confirmActions}>
                            <button
                                onClick={handleConfirmAction}
                                className={styles.btnConfirm}
                            >
                                Đồng ý
                            </button>
                            <button
                                onClick={() => setConfirmModal(null)}
                                className={styles.btnCancelModal}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

