'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/ProfileClient.module.css';
import { apiGetOrders, apiRequestReturn } from '@/services/apiOrder';

interface OrderItem {
    productId: string;
    variantIndex: number;
    name: string;
    sku: string;
    finalPrice: number;
    quantity: number;
    image?: string;
    size: string;
}

type OrderStatus = 'PENDING' | 'SHIPPING' | 'DELIVERED' | 'RETURNED';

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    shippingStatus: OrderStatus;
    createdAt: string;
}

type OrderTab = OrderStatus;

const formatCurrency = (amount: number): string => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0₫';
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const getStatusStyle = (status: OrderStatus): string => {
    switch (status) {
        case 'PENDING':
            return styles.statusPending;
        case 'SHIPPING':
            return styles.statusShipping;
        case 'DELIVERED':
            return styles.statusDelivered;
        case 'RETURNED':
            return styles.statusReturned;
        default:
            return '';
    }
}

const renderOrderStatus = (status: OrderStatus) => {
    switch (status) {
        case 'PENDING':
            return 'Chờ xác nhận';
        case 'SHIPPING':
            return 'Đang giao';
        case 'DELIVERED':
            return 'Đã giao';
        case 'RETURNED':
            return 'Trả hàng/Hoàn tiền';
        default:
            return 'Không xác định';
    }
}

export default function StateOrders() {
    const [activeOrderTab, setActiveOrderTab] = useState<OrderTab>('PENDING');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Tải đơn hàng khi tab thay đổi
    useEffect(() => {
        const loadOrders = async () => {
            setIsLoading(true);
            setOrders([]);
            try {
                const result = await apiGetOrders(activeOrderTab);
                if (result.success && Array.isArray(result.data)) {
                    setOrders(result.data as Order[]);
                } else {
                    console.error("API trả về lỗi hoặc dữ liệu không hợp lệ:", result.message);
                    setOrders([]);
                }
            } catch (error) {
                console.error("Không tải được đơn hàng:", error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };
        loadOrders();
    }, [activeOrderTab]);

    // Xử lý yêu cầu hoàn trả hàng
    const handleRequestReturn = async (orderId: string) => {
        if (confirm("Bạn có chắc chắn muốn yêu cầu hoàn trả đơn hàng này?")) {
            try {
                const res = await apiRequestReturn(orderId);
                if (res.success) {
                    alert(res.message);
                    // Sau khi gửi yêu cầu thành công, chuyển sang tab "Trả hàng/Hoàn tiền" để user thấy đơn của mình
                    setActiveOrderTab('RETURNED');
                } else {
                    alert(res.message || "Có lỗi xảy ra khi gửi yêu cầu.");
                }
            } catch (error) {
                console.error("Lỗi hoàn trả:", error);
                alert("Lỗi kết nối đến máy chủ.");
            }
        }
    };

    const tabs: { key: OrderTab; label: string }[] = [
        { key: 'PENDING', label: 'Chờ xác nhận' },
        { key: 'SHIPPING', label: 'Chờ giao hàng' },
        { key: 'DELIVERED', label: 'Đã giao' },
        { key: 'RETURNED', label: 'Trả hàng/Hoàn tiền' },
    ];

    const renderOrderContent = () => {
        if (isLoading) {
            return (
                <div className={styles.emptyOrderState}>
                    <p className={styles.muted}>Đang tải đơn hàng...</p>
                </div>
            );
        }

        if (orders.length === 0) {
            return (
                <div className={styles.emptyOrderState}>
                    {/* Bạn có thể thay bằng icon SVG nếu muốn */}
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
                    <p className={styles.muted}>Bạn chưa có đơn hàng nào ở mục này</p>
                    <Link href='/' className={styles.secondaryBtn} style={{ marginTop: '10px', display: 'inline-block' }}>
                        Tiếp tục mua sắm
                    </Link>
                </div>
            );
        }

        return (
            <div className={styles.orderList}>
                {orders.map((order) => (
                    <div key={order._id} className={styles.orderCard}>
                        <div className={styles.orderSummaryHeader}>
                            <span className={styles.orderId}>Mã đơn hàng: #{order._id.slice(-6).toUpperCase()}</span>
                            <span className={`${styles.orderStatusBadge} ${getStatusStyle(order.shippingStatus)}`}>
                                {renderOrderStatus(order.shippingStatus)}
                                {order.shippingStatus === 'SHIPPING' && <span> 🚚</span>}
                            </span>
                        </div>

                        {order.items.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <img
                                    src={item.image || '/placeholder.png'}
                                    alt={item.name}
                                    className={styles.orderItemImage}
                                />
                                <div className={styles.orderItemDetails}>
                                    <div className={styles.orderItemName}>{item.name}</div>
                                    <div className={styles.orderItemSize}>Size: {item.size} | SL: {item.quantity}</div>
                                </div>
                                <div className={styles.orderItemPrice}>
                                    {formatCurrency(item.finalPrice)}
                                </div>
                            </div>
                        ))}

                        <div className={styles.orderTotal}>
                            <span className={styles.orderTotalLabel}>Tổng tiền:</span>
                            <span className={styles.orderTotalValue}>{formatCurrency(order.totalAmount)}</span>
                        </div>

                        {/* Footer chứa các nút hành động */}
                        <div className={styles.orderFooter} style={{ borderTop: '1px solid #eee', marginTop: '15px', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            {activeOrderTab === 'DELIVERED' && (
                                <button
                                    onClick={() => handleRequestReturn(order._id)}
                                    style={{
                                        padding: '8px 15px',
                                        background: '#fff',
                                        border: '1px solid #d70000',
                                        color: '#d70000',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        fontSize: '14px'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#fff5f5'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                                >
                                    Hoàn trả hàng
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section className={styles.card}>
            <div className={styles.orderTabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.orderTabItem} ${activeOrderTab === tab.key ? styles.orderTabActive : ''}`}
                        onClick={() => setActiveOrderTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {renderOrderContent()}
        </section>
    );
}