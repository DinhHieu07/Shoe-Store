import { Suspense } from "react";
import ProfileClient from "@/components/ProfileClient";

function ProfileLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Đang tải...</p>
        </div>
    );
}

export default function Profile() {
    return (
        <Suspense fallback={<ProfileLoading />}>
            <ProfileClient />
        </Suspense>
    );
}