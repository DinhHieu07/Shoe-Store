"use client";
import React, { useEffect, useState } from "react";
import { apiGetAllOrders, apiUpdateOrderStatus } from "@/services/apiOrder";
import Toast from "../Toast";

interface AdminOrder {
    _id: string;
    customer: { fullname: string; email: string; phone?: string };
    shippingAddress?: { // Thêm địa chỉ
        fullAddress: string;
        city: string;
        district: string;
        ward: string;
        label?: string;
    };
    totalAmount: number;
    shippingStatus: string;
    createdAt: string;
}

export default function AdminOverview() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [toast, setToast] = useState<any>(null);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const fetchData = async () => {
        const res = await apiGetAllOrders();
        if (res.success) setOrders(res.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleApprove = async (id: string) => {
        // Mapping status frontend -> backend
        const res = await apiUpdateOrderStatus(id, 'shipped');
        if (res.success) {
            setToast({ message: "Đã duyệt đơn hàng!", type: "success" });
            fetchData();
        } else {
            setToast({ message: "Lỗi!", type: "error" });
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div style={{ marginBottom: "20px", padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
                <strong>Tổng đơn hàng toàn hệ thống: {orders.length}</strong>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
                        <th style={{ padding: "10px" }}>Mã đơn</th>
                        <th style={{ padding: "10px" }}>Khách hàng</th>
                        <th style={{ padding: "10px" }}>Tổng tiền</th>
                        <th style={{ padding: "10px" }}>Trạng thái</th>
                        <th style={{ padding: "10px" }}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "10px" }}>#{order._id.slice(-6).toUpperCase()}</td>
                            <td style={{ padding: "10px" }}>
                                <div
                                    onClick={() => setSelectedOrder(order)} // Click để mở modal
                                    style={{
                                        cursor: "pointer",
                                        color: "#007bff",
                                        fontWeight: 500,
                                        display: "flex",
                                        flexDirection: "column"
                                    }}
                                    title="Xem chi tiết khách hàng"
                                >
                                    <span>{order.customer?.fullname || "Khách lẻ"}</span>
                                    <small style={{ color: "#666", fontWeight: "normal" }}>
                                        {order.customer?.email}
                                    </small>
                                </div>
                            </td>
                            <td style={{ padding: "10px", color: "#d70000", fontWeight: "bold" }}>
                                {order.totalAmount.toLocaleString()}đ
                            </td>
                            <td style={{ padding: "10px" }}>
                                <span style={{
                                    padding: "4px 8px", borderRadius: "4px", fontSize: "12px",
                                    background: order.shippingStatus === 'PENDING' ? '#fff3cd' : '#d4edda',
                                    color: order.shippingStatus === 'PENDING' ? '#856404' : '#155724'
                                }}>
                                    {order.shippingStatus}
                                </span>
                            </td>
                            <td style={{ padding: "10px" }}>
                                {order.shippingStatus === 'PENDING' && (
                                    <button
                                        onClick={() => handleApprove(order._id)}
                                        style={{ background: "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                                    >
                                        Duyệt đơn
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedOrder && (
                <div style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
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
                                style={{
                                    padding: "8px 20px", background: "#6c757d", color: "#fff",
                                    border: "none", borderRadius: "4px", cursor: "pointer"
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}