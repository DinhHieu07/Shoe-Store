"use client";
import React, { useEffect, useState } from "react";
import { apiGetAllOrders } from "@/services/apiOrder";
import Link from "next/link";
import styles from "@/styles/ProfileClient.module.css";

export default function AdminOverview() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        shipping: 0,
        delivered: 0,
        returned: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const res = await apiGetAllOrders(1, 1); // Chỉ lấy trang 1 với 1 item để lấy stats
        if (res.success && res.stats) {
            setStats(res.stats);
        }
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

    return (
        <div>
            {/* KHỐI THỐNG KÊ (DASHBOARD) */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
                <StatCard title="Tổng đơn" value={stats.total} color="#007bff" icon="📦" />
                <StatCard title="Chờ duyệt" value={stats.pending} color="#ffc107" icon="⏳" />
                <StatCard title="Đang giao" value={stats.shipping} color="#17a2b8" icon="🚚" />
                <StatCard title="Đã giao" value={stats.delivered} color="#28a745" icon="✅" />
                <StatCard title="Hoàn trả / Hủy" value={stats.returned} color="#dc3545" icon="↩️" />
            </div>

            {/* LINK ĐẾN TRANG QUẢN LÝ ĐƠN HÀNG */}
            <div style={{ 
                background: "#fff", 
                borderRadius: "8px", 
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)", 
                padding: "20px",
                textAlign: "center"
            }}>
                <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "18px", fontWeight: "600" }}>
                    Quản lý đơn hàng
                </h3>
                <p style={{ marginBottom: "20px", color: "#666", fontSize: "14px" }}>
                    Xem chi tiết và quản lý tất cả đơn hàng của hệ thống
                </p>
                <Link href="/admin/orders" className={styles.primaryBtn} style={{ display: "inline-block" }}>
                    Đi đến trang quản lý đơn hàng
                </Link>
            </div>
        </div>
    );
}
