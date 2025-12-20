"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGetDashboardData, apiGetAllOrders } from "@/services/apiOrder";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Link from "next/link";
import styles from "@/styles/AdminOrderManagement.module.css";

interface DashboardData {
    revenueByDate: { date: string; revenue: number }[];
    orderStatusStats: { status: string; count: number }[];
    topProducts: {
        productId: string;
        name: string;
        image: string;
        totalQuantity: number;
        totalRevenue: number;
    }[];
    lowStockProducts: {
        productId: string;
        name: string;
        image: string;
        sku: string;
        size: string;
        stock: number;
        variantIndex: number;
    }[];
    recentOrders: {
        _id: string;
        customerName: string;
        customerEmail: string;
        totalAmount: number;
        status: string;
        originalStatus: string;
        createdAt: string;
    }[];
    totalRevenue: number;
}

const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1'];

export default function AdminDashboard() {
    const router = useRouter();
    const [role, setRole] = useState<'admin' | 'customer' | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        shipping: 0,
        delivered: 0,
        returned: 0
    });

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

    useEffect(() => {
        if (role === 'admin') {
            fetchDashboardData();
            fetchStats();
        }
    }, [role, period]);

    const fetchDashboardData = async () => {
        setLoading(true);
        const res = await apiGetDashboardData(period);
        if (res.success && res.data) {
            setDashboardData(res.data);
        }
        setLoading(false);
    };

    const fetchStats = async () => {
        const res = await apiGetAllOrders(1, 1);
        if (res.success && res.stats) {
            setStats(res.stats);
        }
    };

    const StatCard = ({ title, value, color, icon, isCurrency = false }: { 
        title: string; 
        value: number; 
        color: string; 
        icon: string;
        isCurrency?: boolean;
    }) => (
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
                <span style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
                    {isCurrency ? `${value.toLocaleString('vi-VN')}đ` : value}
                </span>
                <span style={{ fontSize: "20px" }}>{icon}</span>
            </div>
        </div>
    );

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#ffc107';
            case 'SHIPPING': return '#17a2b8';
            case 'DELIVERED': return '#28a745';
            case 'RETURNED': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Chờ duyệt';
            case 'SHIPPING': return 'Đang giao';
            case 'DELIVERED': return 'Đã giao';
            case 'RETURNED': return 'Hoàn trả';
            default: return status;
        }
    };

    const formatOrderStatusForPie = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'pending': 'Chờ duyệt',
            'paid': 'Chờ duyệt',
            'shipped': 'Đang giao',
            'delivered': 'Đã giao',
            'cancelled': 'Hủy',
            'refunded': 'Hoàn tiền',
            'return_requested': 'Yêu cầu trả'
        };
        return statusMap[status] || status;
    };

    if (role !== 'admin') {
        return (
            <div className={styles.containerDenied}>
                <p className={styles.accessDeniedText}>Bạn không có quyền truy cập trang này.</p>
            </div>
        );
    }

    if (loading || !dashboardData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    // Format dữ liệu cho biểu đồ pie
    const pieData = dashboardData.orderStatusStats.map(item => ({
        name: formatOrderStatusForPie(item.status),
        value: item.count
    }));

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', marginTop: '100px', color: '#000' }}>
            {/* Header với bộ lọc thời gian */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Dashboard Quản Trị</h1>
                <select 
                    value={period} 
                    onChange={(e) => setPeriod(e.target.value as any)}
                    title="Chọn khoảng thời gian"
                    style={{
                        padding: '8px 15px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }}
                >
                    <option value="today">Hôm nay</option>
                    <option value="week">7 ngày qua</option>
                    <option value="month">Tháng này</option>
                    <option value="year">Năm nay</option>
                </select>
            </div>

            {/* Thẻ thống kê */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
                <StatCard title="Tổng đơn" value={stats.total} color="#007bff" icon="📦" />
                <StatCard title="Chờ duyệt" value={stats.pending} color="#ffc107" icon="⏳" />
                <StatCard title="Đang giao" value={stats.shipping} color="#17a2b8" icon="🚚" />
                <StatCard title="Đã giao" value={stats.delivered} color="#28a745" icon="✅" />
                <StatCard title="Hoàn trả / Hủy" value={stats.returned} color="#dc3545" icon="↩️" />
                <StatCard title="Tổng doanh thu" value={dashboardData.totalRevenue || 0} color="#6f42c1" icon="💰" isCurrency={true} />
            </div>

            {/*Biểu đồ */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
                {/* Biểu đồ doanh thu (70%) */}
                <div style={{ 
                    flex: '1 1 65%', 
                    minWidth: '300px',
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
                }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
                        Doanh thu theo thời gian
                    </h3>
                    <ResponsiveContainer width="100%" height={300} >
                        <LineChart data={dashboardData.revenueByDate} margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis 
                                width={90}
                                tickFormatter={(value) => {
                                    if (value === undefined || value === null) return '';
                                    return value.toLocaleString('vi-VN');
                                }}
                            />
                            <Tooltip formatter={(value) => value ? `${Number(value).toLocaleString('vi-VN')}đ` : '0đ'} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#6f42c1" strokeWidth={2} name="Doanh thu" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/*Top sản phẩm và Cảnh báo tồn kho */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
                {/* Top sản phẩm bán chạy */}
                <div style={{ 
                    flex: '1 1 48%', 
                    minWidth: '300px',
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
                }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>
                        Top sản phẩm bán chạy
                    </h3>
                    {dashboardData.topProducts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {dashboardData.topProducts.map((product, index) => (
                                <div key={product.productId} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '15px',
                                    padding: '10px',
                                    borderBottom: '1px solid #eee'
                                }}>
                                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666', minWidth: '30px' }}>
                                        #{index + 1}
                                    </span>
                                    {product.image && (
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{product.name}</p>
                                        <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#666' }}>
                                            Đã bán: {product.totalQuantity} | Doanh thu: {product.totalRevenue.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#666', textAlign: 'center' }}>Chưa có dữ liệu</p>
                    )}
                </div>

                {/* Cảnh báo tồn kho */}
                <div style={{ 
                    flex: '1 1 48%', 
                    minWidth: '300px',
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
                }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>
                        ⚠️ Cảnh báo tồn kho thấp
                    </h3>
                    {dashboardData.lowStockProducts.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                            {dashboardData.lowStockProducts.map((product, index) => (
                                <div key={`${product.productId}-${index}`} style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '15px',
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    background: product.stock <= 5 ? '#fff3cd' : '#f8f9fa'
                                }}>
                                    {product.image && (
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{product.name}</p>
                                        <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#666' }}>
                                            SKU: {product.sku} | Size: {product.size} | Tồn kho: <strong style={{ color: product.stock <= 5 ? '#dc3545' : '#000000' }}>{product.stock}</strong>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#28a745', textAlign: 'center' }}>✅ Tất cả sản phẩm đều đủ hàng</p>
                    )}
                </div>
            </div>

            {/*Danh sách đơn hàng gần đây */}
            <div style={{ 
                background: '#fff', 
                padding: '20px', 
                borderRadius: '8px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Đơn hàng gần đây</h3>
                    <Link href="/admin/orders" style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
                        Xem tất cả →
                    </Link>
                </div>
                {dashboardData.recentOrders.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr className={styles.tableHeader}>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData.recentOrders.map(order => (
                                    <tr key={order._id} className={styles.tableRow}>
                                        <td className={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</td>
                                        <td>
                                            <div className={styles.customerName}>{order.customerName}</div>
                                            <div className={styles.customerEmail}>{order.customerEmail}</div>
                                        </td>
                                        <td className={styles.totalAmount}>
                                            {order.totalAmount.toLocaleString('vi-VN')}đ
                                        </td>
                                        <td>
                                            <span 
                                                style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    background: getStatusBadgeColor(order.status) + '20',
                                                    color: getStatusBadgeColor(order.status)
                                                }}
                                            >
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '12px', color: '#666' }}>
                                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: '#666', textAlign: 'center' }}>Chưa có đơn hàng nào</p>
                )}
            </div>
        </div>
    );
}

