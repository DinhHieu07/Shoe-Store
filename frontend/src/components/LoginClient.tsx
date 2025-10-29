'use client';
import React, { useState } from 'react';
import styles from '@/styles/LoginClient.module.css';
import { apiLogin } from '@/services/apiLogin';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { apiGoogleLogin } from '@/services/apiGoogleLogin';

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

    const checkInfo = () => {
        if (formData.email === '' || formData.matkhau === '') {
            alert('Vui lòng điền đầy đủ thông tin');
            return false;
        }

        const emailRegex = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");
        if (!emailRegex.test(formData.email)) {
            alert('Vui lòng nhập đúng định dạng email (ví dụ: abc@gmail.com)');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkInfo()) {
            return;
        }

        try {
            const response = await apiLogin(formData.email, formData.matkhau);
            if (response.success) {
                console.log('Đăng nhập thành công', response);
            } else {
                console.error('Đăng nhập thất bại', response.message);
            }
        } catch (error) {
            console.error('Đăng nhập thất bại', error);
        }
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
                    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
                        <div className={styles.loginGoogleContainer}>
                            <GoogleLogin
                                onSuccess={async (credentialResponse: CredentialResponse) => {
                                    try {
                                        const id_token = credentialResponse.credential as string;
                                        await apiGoogleLogin(id_token);
                                    } catch (err) {
                                        alert("Đăng nhập Google thất bại");
                                    }
                                }}
                                onError={() => {
                                    alert("Đăng nhập Google thất bại");
                                }}
                                useOneTap
                                size="large"
                                shape="pill"
                                text="signin_with"
                            />
                        </div>
                    </GoogleOAuthProvider>
                </div>

                <div className={styles.otherLinks}>
                    <a href="#" className={styles.link}>Quên mật khẩu?</a>
                    <span className={styles.divider}>hoặc</span>
                    <a href="/register" className={styles.link}>Đăng ký</a>
                </div>
            </div>
            <div className={styles.cloudEffect}></div>
        </main>
    );
};

export default LoginClient;
