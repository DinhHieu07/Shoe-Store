'use client';
import React, {useState} from 'react';
import styles from '@/styles/LoginClient.module.css';

interface LoginFormData {
    email: string;
    matkhau: string;
}

const LoginClient: React.FC = () => {

    const [formData, setFormData] = React.useState<LoginFormData>({
        email: '',
        matkhau: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Đang đăng nhập...', formData);
    };
    return (
        <main className={styles.loginPageContent}>
            <div className={styles.loginForm}>
                <h2>Đăng nhập</h2>
                <form onSubmit={handleSubmit} method="POST">

                    <div className={styles.formGroup}>
                        <label htmlFor='email' className={styles.srOnly}>Email</label>
                        <input type='email' id='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required></input>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor='password' className={styles.srOnly}>Mật khẩu</label>
                        <input type='password' id='matkhau' name='matkhau' placeholder='Mật khẩu' value={formData.matkhau} onChange={handleChange} required></input>
                    </div>

                    <button type='submit' className={styles.loginButton}>Đăng nhập</button>
                </form>   

                <div className={styles.socialLogin}>
                    <button className={`${styles.socialButton} ${styles.googleButton}`}>Đăng nhập Google</button>
                     <button className={`${styles.socialButton} ${styles.facebookButton}`}>Đăng nhập Facebook</button>
                </div> 

                <div className={styles.otherLinks}>
                    <a href="#" className={styles.link}>Quên mật khẩu?</a>
                    <span className={styles.divider}>hoặc</span>
                    <a href="/register" className={styles.link}>Đăng ký</a>
                </div>
            </div>
            <div className={styles.cloundEffect}></div>
        </main>
    );
};

export default LoginClient;
