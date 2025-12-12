"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/ProfileClient.module.css";
import Toast from "./Toast";
import { apiChangePassword } from "@/services/apiForgotPass";
import { apiGetProfile, apiUpdateProfile } from "@/services/apiProfile";
import { apiUpdateAvatar } from "@/services/apiProfile";
import StateOrders from '@/components/StateOrders';

type TabKey = "overview" | "info" | "password" | "orders";

interface CustomerData {
    _id: string;
    fullname: string;
    email: string;
    role?: string;
    avatar?: string;
}

interface AddressData {
    label: string;
    fullAddress: string;
    city: string;
    district: string;
    ward: string;
}

export default function ProfileClient() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [customer, setCustomer] = useState<CustomerData | null>(null);

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState<AddressData>();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error" | "warning" | "info";
    } | null>(null);

    // Đọc tab từ query parameter khi component mount
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['overview', 'info', 'password', 'orders'].includes(tabParam)) {
            setActiveTab(tabParam as TabKey);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const response = await apiGetProfile();
        if (response?.success) {
            setCustomer(response.user);
            setFullname(response.user.fullname);
            setEmail(response.user.email);
            setAvatar(response.user.avatar);
            setPhone(response.user.phone);
            setAddress(response.user.address[0]);
        } else {
            setToast({ message: response?.message || "Lấy thông tin người dùng thất bại", type: "error" });
        }
    }

    const handleSaveInfo = async () => {
        const response = await apiUpdateProfile(fullname, phone, email, { city: address?.city ?? "", district: address?.district ?? "", ward: address?.ward ?? "", fullAddress: address?.fullAddress ?? "", label: address?.label ?? "" });
        if (response.success) {
            setToast({ message: response.message || "Cập nhật thông tin người dùng thành công", type: "success" });
        } else {
            setToast({ message: response.message || "Cập nhật thông tin người dùng thất bại", type: "error" });
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setToast({ message: "Không xác định được email người dùng", type: "error" });
            return;
        }
        if (newPassword.length < 6) {
            setToast({ message: "Mật khẩu phải có ít nhất 6 ký tự", type: "warning" });
            return;
        }
        if (newPassword !== confirmPassword) {
            setToast({ message: "Mật khẩu xác nhận không khớp", type: "error" });
            return;
        }
        try {
            setIsSubmitting(true);
            const response = await apiChangePassword(email, newPassword);
            const data = response;
            if (data?.success) {
                setToast({ message: data.message || "Đổi mật khẩu thành công", type: "success" });
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setToast({ message: data?.message || "Đổi mật khẩu thất bại", type: "error" });
            }
        } catch (error: unknown) {
            setToast({ message: "Không thể đổi mật khẩu. Vui lòng thử lại.", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const response = await apiUpdateAvatar(file);
            if (response.success) {
                setAvatar(response.avatar);
                setToast({ message: response.message || "Cập nhật avatar thành công", type: "success" });
            } else {
                setToast({ message: response.message || "Cập nhật avatar thất bại", type: "error" });
            }
        }
    }

    const handleChangeAvatarClick = () => {
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        fileInput.click();
    }

    return (
        <div className={styles.profileWrap}>
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}

            <div className={styles.container}>
                <aside className={styles.sidebar} aria-label="Menu hồ sơ">
                    <div className={styles.userCard}>
                        <div className={styles.avatarWrap}>
                            <img src={avatar || "https://ui-avatars.com/api/?name=N/A&background=FFFFFF&color=000000&size=128"} alt="Avatar" className={styles.avatarImg} />
                            <div className={styles.editAvatarBtn} onClick={handleChangeAvatarClick}>📷</div>
                            <input type="file" id="fileInput" onChange={handleChangeAvatar} title="Chọn ảnh" style={{ display: "none" }} />
                        </div>
                        <div className={styles.userMeta}>
                            <div className={styles.userName}>{fullname || customer?.fullname}</div>
                            <div className={styles.userEmail}>{email || customer?.email}</div>
                        </div>
                    </div>

                    <nav className={styles.nav}>
                        <button className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`} onClick={() => setActiveTab("overview")}>Tổng quan</button>
                        <button className={`${styles.navItem} ${activeTab === "info" ? styles.active : ""}`} onClick={() => setActiveTab("info")}>Thông tin cá nhân</button>
                        <button className={`${styles.navItem} ${activeTab === "password" ? styles.active : ""}`} onClick={() => setActiveTab("password")}>Đổi mật khẩu</button>
                        <button className={`${styles.navItem} ${activeTab === "orders" ? styles.active : ""}`} onClick={() => setActiveTab("orders")}>Đơn mua</button>
                    </nav>
                </aside>

                <main className={styles.content}>
                    {activeTab === "overview" && (
                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>Chào {fullname || customer?.fullname}</h2>
                            <p className={styles.muted}>Quản lý thông tin tài khoản, đổi mật khẩu và theo dõi đơn mua của bạn.</p>
                            <div className={styles.grid2}>
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}>Đơn hàng</div>
                                    <div className={styles.statValue}>0</div>
                                </div>
                                <div className={styles.statBox}>
                                    <div className={styles.statLabel}>Đánh giá</div>
                                    <div className={styles.statValue}>0</div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === "info" && (
                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>Thông tin cá nhân</h2>
                            <div className={styles.formRow}>
                                <label className={styles.label}>Họ và tên</label>
                                <input className={styles.input} value={fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Nhập họ và tên" />
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.label}>Email</label>
                                <input className={styles.input} value={email} disabled title="Email" placeholder="Email" />
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.label}>Số điện thoại</label>
                                <input className={styles.input} value={phone || ""} onChange={(e) => setPhone(e.target.value)} title={`Số điện thoại: ${phone}`} placeholder="Số điện thoại" />
                            </div>
                            <h2 className={styles.cardTitle}>Địa chỉ nhận hàng</h2>
                            <div className={styles.formRow}>
                                <label className={styles.label}>Tên địa chỉ</label>
                                <input className={styles.input} value={address?.label || ""} onChange={(e) => setAddress(prev => ({
                                    label: e.target.value,
                                    fullAddress: prev?.fullAddress ?? "",
                                    city: prev?.city ?? "",
                                    district: prev?.district ?? "",
                                    ward: prev?.ward ?? "",
                                }))} placeholder="Tên địa chỉ" />
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.label}>Tỉnh/Thành phố</label>
                                <input className={styles.input} value={address?.city || ""} onChange={(e) => setAddress(prev => ({
                                    label: prev?.label ?? "",
                                    fullAddress: prev?.fullAddress ?? "",
                                    city: e.target.value,
                                    district: prev?.district ?? "",
                                    ward: prev?.ward ?? "",
                                }))} placeholder="Nhập tỉnh/thành phố" />
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.label}>Quận/Huyện</label>
                                <input className={styles.input} value={address?.district || ""} onChange={(e) => setAddress(prev => ({
                                    label: prev?.label ?? "",
                                    fullAddress: prev?.fullAddress ?? "",
                                    city: prev?.city ?? "",
                                    district: e.target.value,
                                    ward: prev?.ward ?? "",
                                }))} placeholder="Nhập quận/huyện" />
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.label}>Phường/Xã</label>
                                <input className={styles.input} value={address?.ward || ""} onChange={(e) => setAddress(prev => ({
                                    label: prev?.label ?? "",
                                    fullAddress: prev?.fullAddress ?? "",
                                    city: prev?.city ?? "",
                                    district: prev?.district ?? "",
                                    ward: e.target.value,
                                }))} placeholder="Nhập phường/xã" />
                            </div>
                            <div className={styles.formRow}>
                                <label className={styles.label}>Địa chỉ chi tiết</label>
                                <input className={styles.input} value={address?.fullAddress || ""} onChange={(e) => setAddress(prev => ({
                                    label: prev?.label ?? "",
                                    fullAddress: e.target.value,
                                    city: prev?.city ?? "",
                                    district: prev?.district ?? "",
                                    ward: prev?.ward ?? "",
                                }))} placeholder="Nhập địa chỉ chi tiết" />
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.primaryBtn} onClick={handleSaveInfo}>Lưu thay đổi</button>
                            </div>
                            <p className={styles.smallNote}>Lưu ý: Hiện tại thay đổi chỉ lưu trên trình duyệt. Tính năng đồng bộ máy chủ sẽ được bổ sung sau.</p>
                        </section>
                    )}

                    {activeTab === "password" && (
                        <section className={styles.card}>
                            <h2 className={styles.cardTitle}>Đổi mật khẩu</h2>
                            <form onSubmit={handleChangePassword}>
                                <div className={styles.formRow}>
                                    <label className={styles.label}>Email</label>
                                    <input className={styles.input} value={email} disabled title="Email" placeholder="Email" />
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.label}>Mật khẩu mới</label>
                                    <input className={styles.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" />
                                </div>
                                <div className={styles.formRow}>
                                    <label className={styles.label}>Xác nhận mật khẩu</label>
                                    <input className={styles.input} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu" />
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.primaryBtn} type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                                    </button>
                                </div>
                            </form>
                            <p className={styles.smallNote}>Mẹo: Bạn có thể đặt lại mật khẩu thông qua email nếu quên mật khẩu ở trang Quên mật khẩu.</p>
                        </section>
                    )}

                    {activeTab === "orders" && (
                        <StateOrders />
                    )}
                </main>
            </div>
        </div>
    );
}