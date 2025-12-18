"use client";
import React, { useEffect, useState } from "react";
import { apiGetAllOrders, apiUpdateOrderStatus } from "@/services/apiOrder";
import Toast from "../Toast";
import styles from "@/styles/ProfileClient.module.css";

interface AdminOrder {
    _id: string;
    customer: { fullname: string; email: string; phone?: string };
    shippingAddress?: { fullAddress: string; city: string; district: string; ward: string; label?: string };
    totalAmount: number;
    shippingStatus: string;
    originalStatus: string;
    createdAt: string;
}

export default function AdminOverview() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

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
        <div style={{
            flex: 1,
            minWidth: '150px',
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            borderLeft: `4px solid ${color}`,
            display: "flex",
            flexDirection: "column",
            gap: "5px"
        }}>
            <span style={{ fontSize: "13px", color: "#666", textTransform: "uppercase", fontWeight: "600" }}>{title}</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>{value}</span>
                <span style={{ fontSize: "20px" }}>{icon}</span>
            </div>
        </div>
    );

    const renderActionButtons = (order: AdminOrder) => {
        if (order.shippingStatus === 'PENDING') {
            return (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => openConfirm(order._id, 'approve')} className={styles.primaryBtn} style={{ fontSize: '12px', padding: '5px 10px' }}>Duyệt</button>
                    <button onClick={() => openConfirm(order._id, 'cancel')} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Hủy</button>
                </div>
            );
        }
        if (order.shippingStatus === 'SHIPPING') {
            return (
                <button onClick={() => openConfirm(order._id, 'deliver')} style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                    Giao xong
                </button>
            );
        }
        if (order.shippingStatus === 'RETURNED') {
            if (order.originalStatus === 'return_requested') {
                return (
                    <button onClick={() => openConfirm(order._id, 'refund')} style={{ background: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                        Hoàn tiền
                    </button>
                );
            }
            return <span style={{ color: '#888', fontSize: '13px' }}>Đã xử lý ({order.originalStatus})</span>;
        }
        return <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '13px' }}>Hoàn tất</span>;
    };

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* KHỐI THỐNG KÊ (DASHBOARD) */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
                <StatCard title="Tổng đơn" value={stats.total} color="#007bff" icon="📦" />
                <StatCard title="Chờ duyệt" value={stats.pending} color="#ffc107" icon="⏳" />
                <StatCard title="Đang giao" value={stats.shipping} color="#17a2b8" icon="🚚" />
                <StatCard title="Đã giao" value={stats.delivered} color="#28a745" icon="✅" />
                <StatCard title="Hoàn trả / Hủy" value={stats.returned} color="#dc3545" icon="↩️" />
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#f8f9fa", textAlign: "left", borderBottom: "2px solid #eee" }}>
                            <th style={{ padding: "15px", fontWeight: "600", color: "#444", fontSize: "14px" }}>Mã đơn</th>
                            <th style={{ padding: "15px", fontWeight: "600", color: "#444", fontSize: "14px" }}>Khách hàng</th>
                            <th style={{ padding: "15px", fontWeight: "600", color: "#444", fontSize: "14px" }}>Tổng tiền</th>
                            <th style={{ padding: "15px", fontWeight: "600", color: "#444", fontSize: "14px" }}>Trạng thái</th>
                            <th style={{ padding: "15px", fontWeight: "600", color: "#444", fontSize: "14px" }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                                <td style={{ padding: "15px", fontSize: "14px" }}>#{order._id.slice(-6).toUpperCase()}</td>
                                <td style={{ padding: "15px" }}>
                                    <div
                                        onClick={() => setSelectedOrder(order)}
                                        style={{ cursor: "pointer", color: "#007bff", fontWeight: 500, fontSize: "14px" }}
                                        title="Click xem chi tiết"
                                    >
                                        {order.customer?.fullname || "Khách lẻ"}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#888" }}>{order.customer?.email}</div>
                                </td>
                                <td style={{ padding: "15px", color: "#d70000", fontWeight: "bold", fontSize: "14px" }}>
                                    {order.totalAmount.toLocaleString()}đ
                                </td>
                                <td style={{ padding: "15px" }}>
                                    <span className={order.shippingStatus === 'PENDING' ? styles.statusPending : styles.statusDelivered} style={{ fontSize: "12px" }}>
                                        {order.shippingStatus === 'RETURNED' && order.originalStatus === 'return_requested'
                                            ? "Yêu cầu trả"
                                            : order.shippingStatus}
                                    </span>
                                </td>
                                <td style={{ padding: "15px" }}>{renderActionButtons(order)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PHÂN TRANG */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button
                    disabled={pagination.page === 1}
                    onClick={() => fetchData(pagination.page - 1)}
                    style={{ padding: '8px 16px', cursor: 'pointer', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', opacity: pagination.page === 1 ? 0.5 : 1 }}
                > Trước </button>
                <span style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>Trang {pagination.page} / {pagination.totalPages}</span>
                <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => fetchData(pagination.page + 1)}
                    style={{ padding: '8px 16px', cursor: 'pointer', border: '1px solid #ddd', background: '#fff', borderRadius: '4px', opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}
                > Sau </button>
            </div>

            {/* MODAL CHI TIẾT USER */}
            {selectedOrder && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1200,
                    display: "flex", justifyContent: "center", alignItems: "center"
                }} onClick={() => setSelectedOrder(null)}>
                    <div style={{
                        background: "#fff", padding: "25px", borderRadius: "8px",
                        width: "90%", maxWidth: "500px", position: "relative",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                    }} onClick={(e) => e.stopPropagation()}>

                        <h3 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                            Thông tin đơn hàng #{selectedOrder._id.slice(-6).toUpperCase()}
                        </h3>

                        <div style={{ marginBottom: "15px" }}>
                            <h4 style={{ marginBottom: "5px", color: "#555" }}>👤 Người đặt hàng</h4>
                            <p style={{ margin: "5px 0" }}><strong>Tên:</strong> {selectedOrder.customer?.fullname}</p>
                            <p style={{ margin: "5px 0" }}><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                            <p style={{ margin: "5px 0" }}><strong>SĐT:</strong> {selectedOrder.customer?.phone || "Chưa cập nhật"}</p>
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <h4 style={{ marginBottom: "5px", color: "#555" }}>📍 Địa chỉ nhận hàng</h4>
                            {selectedOrder.shippingAddress ? (
                                <>
                                    <p style={{ margin: "5px 0" }}><strong>Người nhận:</strong> {selectedOrder.shippingAddress.label || selectedOrder.customer?.fullname}</p>
                                    <p style={{ margin: "5px 0" }}>
                                        {selectedOrder.shippingAddress.fullAddress}, {selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                                    </p>
                                </>
                            ) : (
                                <p style={{ color: "red" }}>Không có thông tin địa chỉ</p>
                            )}
                        </div>

                        <div style={{ textAlign: "right", marginTop: "20px" }}>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                style={{ padding: "8px 20px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÁC NHẬN HÀNH ĐỘNG */}
            {confirmModal && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1200,
                    display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                    <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "400px", textAlign: "center" }}>
                        <h3 style={{ marginTop: 0 }}>Xác nhận</h3>
                        <p>{confirmModal.message}</p>
                        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                            <button
                                onClick={handleConfirmAction}
                                style={{ background: "#007bff", color: "white", border: "none", padding: "8px 20px", borderRadius: "4px", cursor: "pointer" }}
                            >
                                Đồng ý
                            </button>
                            <button
                                onClick={() => setConfirmModal(null)}
                                style={{ background: "#ccc", color: "black", border: "none", padding: "8px 20px", borderRadius: "4px", cursor: "pointer" }}
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