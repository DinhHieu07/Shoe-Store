import { Suspense } from "react";
import AdminDashboard from "@/components/AdminDashboard";

function DashboardLoading() {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '400px',
            fontSize: '16px',
            color: '#666'
        }}>
            <p>Đang tải dashboard...</p>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <Suspense fallback={<DashboardLoading />}>
            <AdminDashboard />
        </Suspense>
    );
}

