'use client';
import { Suspense } from "react";
import StateOrders from "@/components/StateOrders";
import styles from "@/styles/Orders.module.css";

function OrdersLoading() {
    return (
        <div className={styles.loadingContainer}>
            <p>Đang tải đơn hàng...</p>
        </div>
    );
}

export default function OrdersPage() {
    return (
        <div className={styles.ordersWrap}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Quản lý đơn hàng</h1>
                <Suspense fallback={<OrdersLoading />}>
                    <StateOrders />
                </Suspense>
            </div>
        </div>
    );
}

