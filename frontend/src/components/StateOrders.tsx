'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/ProfileClient.module.css';
import { apiGetOrders } from '@/services/apiOrder';

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
/*
const mockOrders: Order[] = [
    {
        _id: '1', shippingStatus: 'PENDING', totalAmount: 1910000, createdAt: '2025-05-25T10:00:00Z',
        items: [{
            productId: 'nb530', variantIndex: 0, name: 'Giày New Balance 530 GS Steel Grey GR530KA',
            sku: 'NB530K A37', finalPrice: 1910000, quantity: 1, image: '/images/mock-nb530.jpg', size: '37'
        }],
    },

    {
        _id: '2', shippingStatus: 'SHIPPING', totalAmount: 2565000, createdAt: '2025-05-20T12:30:00Z',
        items: [{
            productId: 'nikeaf1', variantIndex: 1, name: 'Giày Nike Air Force 1 Pixel All White CK6649-100', 
            sku: 'NKAF1W A41', finalPrice: 2565000, quantity: 1, image: '/images/mock-af1.jpg', size: '41'
        }],
    },

    {
        _id: '3', shippingStatus: 'DELIVERED', totalAmount: 3000000, createdAt: '2025-05-15T08:00:00Z',
        items: [
            { productId: 'nb530-2', variantIndex: 0, name: 'Giày New Balance 530 Đen', sku: 'NB530B B38', finalPrice: 1500000, quantity: 1, image: '/images/mock-nb530-black.jpg', size: '38' },
            { productId: 'adidas-b', variantIndex: 0, name: 'Giày Adidas Alphabounce', sku: 'ADABC B40', finalPrice: 1500000, quantity: 1, image: '/images/mock-adidas.jpg', size: '40' }
        ],
    },

    {
        _id: '4', shippingStatus: 'RETURNED', totalAmount: 1200000, createdAt: '2025-05-10T14:00:00Z',
        items: [{
            productId: 'puma-r', variantIndex: 0, name: 'Giày Puma R-System', 
            sku: 'PUMAR R39', finalPrice: 1200000, quantity: 1, image: '/images/mock-puma.jpg', size: '39'
        }],
    },
];
*/

const formatCurrency = (amount: number): string => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0₫';
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const getStatusStyle = (status: OrderStatus): string => {
    switch (status){
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
    switch (status){
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

/*const fetchOrdersByStatus = (status: OrderTab): Promise<Order[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if(status === 'RETURNED'){
                resolve([]);
                return;
            }
            const filtered = mockOrders.filter(order => order.shippingStatus === status);
            resolve(filtered);
        }, 300);
    });
};
*/


export default function StateOrders() {
    const [activeOrderTab, setActiveOrderTab] = useState<OrderTab>('PENDING');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // tai don hang khi tab thay doi
    useEffect(() => {
        const loadOrders = async () => {
            setIsLoading(true);
            setOrders([]);
            try{
                const result = await apiGetOrders(activeOrderTab);
                console.log(result);
                if(result.success && Array.isArray(result.data)){
                    setOrders(result.data as Order[]);
                } else{
                    console.error("API trả về lỗi hoặc dữ liệu không hợp lệ:", result.message);
                    setOrders([]);
                }
            } catch(error){
                console.error("Không tải được đơn hàng:", error);
                setOrders([]);
            } finally{
                setIsLoading(false);
            }
        };
        loadOrders();
    }, [activeOrderTab]);

    const tabs: { key: OrderTab; label: string}[] = [
        { key: 'PENDING', label: 'Chờ xác nhận' },
        { key: 'SHIPPING', label: 'Chờ giao hàng' },
        { key: 'DELIVERED', label: 'Đã giao' },
        { key: 'RETURNED', label: 'Trả hàng/Hoàn tiền' },
    ];

    const renderOrderContent = () => {
        if(isLoading){
            return (
                <div className={styles.emptyOrderState}>
                    <p className={styles.muted}>Đang tải đơn hàng...</p>
                </div>
            );
        }

        if(orders.length === 0){
            const statusLabel = renderOrderStatus(activeOrderTab);
            return (
                <div className={styles.emptyOrderState}>
                    <img src='/file.svg' alt='No Orders' className={styles.emptyIcon}/>
                    <p className={styles.muted}>Bạn chưa có đơn hàng nào</p>
                    <Link href='/' className={styles.secondaryBtn}>Tiếp tục mua sắm</Link>
                </div>
            );
        }

        return (
            <div className={styles.orderList}>
                {orders.map((order) => (
                    <div key={order._id} className={styles.orderCard}>
                        <div className={styles.orderSummaryHeader}>
                            <span className={styles.orderId}>Mã đơn hàng: #{order._id}</span>
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


