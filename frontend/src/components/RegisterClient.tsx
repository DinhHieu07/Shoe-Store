'use client';
import React, { useState } from 'react';
import styles from '@/styles/RegisterClient.module.css';

const RegisterClient: React.FC = () => {
    const [formData, setFormData] = useState({
        ho: '',
        ten: '',
        email: '',
        sodienthoai: '',
        matkhau: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Dữ liệu đăng ký: ', formData);
    };

    return (
        <main className={styles.registrationPageContent}>
            <div className={styles.registrationForm}>
                <h2>Tạo tài khoản</h2>

                <form onSubmit={handleSubmit} method="POST">
                    <div className={styles.formGroup}>
                        <label htmlFor="ho" className={styles.srOnly}>Họ</label>
                        <input type="text" id="ho" name="ho" placeholder="Họ" value={formData.ho} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="ten" className={styles.srOnly}>Tên</label>
                        <input type="text" id="ten" name="ten" placeholder="Tên" value={formData.ten} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.srOnly}>Email</label>
                        <input type="email" id="email" name="email" placeholder="email" value={formData.email} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="sodienthoai" className={styles.srOnly}>Số điện thoại</label>
                        <input type="tel" id="sodienthoai" name="sodienthoai" placeholder="Số điện thoại" value={formData.sodienthoai} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="matkhau" className={styles.srOnly}>Mật khẩu</label>
                        <input type="password" id="matkhau" name="matkhau" placeholder="Mật khẩu" value={formData.matkhau} onChange={handleChange} required></input>
                    </div>

                    <button type="submit" className={styles.registerButton}>Đăng ký</button>

                </form>
                <div className={styles.loginLink}>
                    <a href="/login">↩ Quay lại đăng nhập</a>
                </div>
            </div>

        </main>
    );
};
export default RegisterClient;