'use client';
import React, { useState } from 'react';
import styles from '@/styles/RegisterClient.module.css';
import { apiRegister } from '@/services/apiRegister';
import Link from 'next/link';

interface AddressData {
    city: string;
    district: string;
    ward: string;
    fullAddress: string;
}

const RegisterClient: React.FC = () => {
    const [formData, setFormData] = useState({
        hoten: '',
        email: '',
        sodienthoai: '',
        matkhau: '',
        city: '',
        district: '',
        ward: '',
        fullAddress: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const phoneRegex = new RegExp('^0[0-9]{9}$');
        const emailRegex = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");

        if (formData.hoten === '' || formData.email === '' || formData.sodienthoai === '' || formData.matkhau === '' || formData.confirmPassword === '' || formData.city === '' || formData.district === '' || formData.ward === '' || formData.fullAddress === '') {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        } else if (!phoneRegex.test(formData.sodienthoai)) {
            alert('Vui lòng nhập đúng định dạng số điện thoại (10 chữ số, bắt đầu bằng 0)');
            return;
        } else if (!emailRegex.test(formData.email)) {
            alert('Vui lòng nhập đúng định dạng email (ví dụ: abc@gmail.com)');
            return;
        } else if (formData.matkhau !== formData.confirmPassword) {
            alert('Mật khẩu và nhập lại mật khẩu không khớp');
            return;
        }

        try {
            const response = await apiRegister(formData.hoten, formData.email, formData.sodienthoai, formData.matkhau, { city: formData.city, district: formData.district, ward: formData.ward, fullAddress: formData.fullAddress, isDefault: true });
            if (response.success) {
                console.log('Đăng ký thành công', response);
            } else {
            }
        } catch (error) {
            console.error('Đăng ký thất bại', error);
        }
    };

    return (
        <main className={styles.registrationPageContent}>
            <div className={styles.registrationForm}>
                <h2>Tạo tài khoản</h2>

                <form onSubmit={handleSubmit} method="POST">
                    <div className={styles.formGroup}>
                        <label htmlFor="hoten" className={styles.srOnly}>Họ và tên</label>
                        <input type="text" id="hoten" name="hoten" placeholder="Họ và tên" value={formData.hoten} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.srOnly}>Email</label>
                        <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="sodienthoai" className={styles.srOnly}>Số điện thoại</label>
                        <input type="tel" id="sodienthoai" name="sodienthoai" placeholder="Số điện thoại" value={formData.sodienthoai} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="matkhau" className={styles.srOnly}>Mật khẩu</label>
                        <input type="password" id="matkhau" name="matkhau" placeholder="Mật khẩu" value={formData.matkhau} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.srOnly}>Nhập lại mật khẩu</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.addressSection}>
                        <h3 className={styles.addressTitle}>Thông tin địa chỉ</h3>

                        <div className={styles.formGroup}>
                            <label htmlFor="city" className={styles.srOnly}>Tỉnh/Thành phố</label>
                            <input type="text" id="city" name="city" placeholder="Tỉnh/Thành phố" value={formData.city} onChange={handleChange} required></input>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="district" className={styles.srOnly}>Quận/Huyện</label>
                            <input type="text" id="district" name="district" placeholder="Quận/Huyện" value={formData.district} onChange={handleChange} required></input>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="ward" className={styles.srOnly}>Phường/Xã</label>
                            <input type="text" id="ward" name="ward" placeholder="Phường/Xã" value={formData.ward} onChange={handleChange} required></input>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="fullAddress" className={styles.srOnly}>Địa chỉ chi tiết</label>
                            <input type="text" id="fullAddress" name="fullAddress" placeholder="Địa chỉ chi tiết (Số nhà, tên đường)" value={formData.fullAddress} onChange={handleChange} required></input>
                        </div>
                    </div>

                    <button type="submit" className={styles.registerButton}>Đăng ký</button>

                </form>
                <div className={styles.loginLink}>
                    <Link href="/login">↩ Quay lại đăng nhập</Link>
                </div>
            </div>

        </main>
    );
};
export default RegisterClient;