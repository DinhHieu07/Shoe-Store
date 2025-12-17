"use client";
import React, { useEffect, useState } from "react";
import { apiGetOrders } from "@/services/apiOrder";

export default function UserOverview() {
    const [stats, setStats] = useState({ orders: 0, reviews: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const res = await apiGetOrders();
            if (res.success && Array.isArray(res.data)) {
                setStats({
                    orders: res.data.length,
                    reviews: 0 // Tạm thời để 0 vì chưa có API đếm review
                });
            }
        };
        fetchData();
    }, []);

    // Style inline nhanh hoặc bạn dùng class từ CSS module
    const boxStyle = {
        background: "#fff", padding: "20px", borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", flex: 1, textAlign: "center" as const
    };

    return (
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={boxStyle}>
                <h3 style={{ margin: 0, color: "#555" }}>Đơn hàng</h3>
                <p style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0 0" }}>{stats.orders}</p>
            </div>
            <div style={boxStyle}>
                <h3 style={{ margin: 0, color: "#555" }}>Đánh giá</h3>
                <p style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0 0" }}>{stats.reviews}</p>
            </div>
        </div>
    );
}