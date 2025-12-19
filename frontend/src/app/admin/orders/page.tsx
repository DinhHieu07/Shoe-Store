import { Suspense } from "react";
import AdminOrderManagement from "@/components/AdminOrderManagement";

function OrdersLoading() {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '400px',
            fontSize: '16px',
            color: '#666'
        }}>
            <p>Đang tải đơn hàng...</p>
        </div>
    );
}

export default function AdminOrdersPage() {
    return (
        <Suspense fallback={<OrdersLoading />}>
            <AdminOrderManagement />
        </Suspense>
    );
}

