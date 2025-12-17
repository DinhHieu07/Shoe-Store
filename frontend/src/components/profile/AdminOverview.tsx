"use client";
import React, { useEffect, useState } from "react";
import { apiGetAllOrders, apiUpdateOrderStatus } from "@/services/apiOrder";
import Toast from "../Toast";

interface AdminOrder {
    _id: string;
    customer: { fullname: string; email: string };
    totalAmount: number;
    shippingStatus: string;
    createdAt: string;
}

export default function AdminOverview() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [toast, setToast] = useState<any>(null);

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
                                {order.customer?.fullname || "Khách lẻ"}
                                <br /><small style={{ color: "#888" }}>{order.customer?.email}</small>
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
        </div>
    );
}