'use client';
import React, { useState } from 'react';
import styles from '@/styles/LoginClient.module.css';
import { apiLogin } from '@/services/apiLogin';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";
import { apiGoogleLogin } from '@/services/apiGoogleLogin';
import { apiValidateEmail, apiVerifyOTP, apiChangePassword } from '@/services/apiForgotPass';
import Toast from './Toast';

interface LoginFormData {
    email: string;
    matkhau: string;
}

const LoginClient: React.FC = () => {
    const [isForgotPassword, setIsForgotPassword] = useState(true);
    const [isOTP, setIsOTP] = useState(false);
    const [otp, setOTP] = useState('');
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailForgotPass, setEmailForgotPass] = useState('');
    const [changePasswordResult, setChangePasswordResult] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

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

    const handleValidateEmail = async () => {
        if (emailForgotPass === '') {
            alert('Vui lòng nhập email');
            return;
        }
        const response = await apiValidateEmail(emailForgotPass);
        if (response.success) {
            setIsOTP(true);
        }
        else {
            alert(response.message);
        }
    }

    const handleVerifyOTP = async () => {
        if (otp === '') {
            alert('Vui lòng nhập mã OTP');
            return;
        }
        const response = await apiVerifyOTP(emailForgotPass, otp);
        if (response.success) {
            setIsOTP(false);
            setIsChangePassword(true);
        } else {
            alert(response.message);
        }
    }

    const handleChangePassword = async () => {
        if (newPassword === '' || confirmPassword === '') {
            alert('Vui lòng nhập mật khẩu mới');
            return;
        } if (newPassword !== confirmPassword) {
            alert('Mật khẩu mới và nhập lại mật khẩu mới không khớp');
            return;
        }
        const response = await apiChangePassword(emailForgotPass, newPassword);
        if (response.success) {
            setIsForgotPassword(true);
            setChangePasswordResult(true);
            setMessage(response.message);
            setType('success');
        }
        else {
            alert(response.message);
            setChangePasswordResult(true);
            setMessage(response.message);
            setType('error');
        }
    }

    return (
        <main className={styles.loginPageContent}>
            {isForgotPassword ? (
                <div className={styles.loginForm}>
                    <h2 className={styles.formTitle}>Đăng nhập</h2>
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
                        <button className={styles.link} onClick={() => setIsForgotPassword(false)}>Quên mật khẩu?</button>
                        <span className={styles.divider}>hoặc</span>
                        <a href="/register" className={styles.link}>Đăng ký</a>
                    </div>
                </div>
            ) :
                isOTP ?
                    (
                        <div className={styles.loginForm}>
                            <h2 className={styles.formTitle}>Nhập mã OTP</h2>
                            <h3 className={styles.formSubtitle}>Vui lòng nhập mã OTP đã được gửi đến email</h3>
                            <form>
                                <div className={styles.formGroup}>
                                    <label htmlFor='otp' className={styles.srOnly}>Mã OTP</label>
                                    <input type='text' id='otp' name='otp' placeholder='Mã OTP' value={otp} onChange={(e) => setOTP(e.target.value)} required></input>
                                </div>
                                <button type='button' className={styles.sendButton} title='Gửi' onClick={handleVerifyOTP}>Gửi</button>
                            </form>
                            <button className={styles.link} onClick={() => setIsOTP(false)}>↩ Quay lại đăng nhập</button>
                        </div>
                    ) :
                    isChangePassword ? (
                        <div className={styles.loginForm}>
                            <h2 className={styles.formTitle}>Đặt lại mật khẩu</h2>
                            <h3 className={styles.formSubtitle}>Vui lòng nhập mật khẩu mới</h3>
                            <form>
                                <div className={styles.formGroup}>
                                    <label htmlFor='newPassword' className={styles.srOnly}>Mật khẩu mới</label>
                                    <input type='password' id='newPassword' name='newPassword' placeholder='Mật khẩu mới' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required></input>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor='confirmPassword' className={styles.srOnly}>Nhập lại mật khẩu mới</label>
                                    <input type='password' id='confirmPassword' name='confirmPassword' placeholder='Nhập lại mật khẩu mới' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required></input> 
                                </div>
                                <button type='button' className={styles.sendButton} title='Gửi' onClick={handleChangePassword}>Gửi</button>
                            </form>
                            <button className={styles.link} onClick={() => setIsChangePassword(false)}>↩ Quay lại nhập mã OTP</button>
                        </div>
                    )
                        :
                        (
                            <div className={styles.loginForm}>
                                <h2 className={styles.formTitle}>Khôi phục mật khẩu</h2>
                                <h3 className={styles.formSubtitle}>Vui lòng nhập email để khôi phục mật khẩu</h3>
                                <form>
                                    <div className={styles.formGroup}>
                                        <label htmlFor='email' className={styles.srOnly}>Email</label>
                                        <input type='email' id='email' name='email' placeholder='Email' value={emailForgotPass} onChange={(e) => setEmailForgotPass(e.target.value)} required></input>
                                    </div>
                                    <button type='button' className={styles.sendButton} title='Gửi' onClick={handleValidateEmail}>Gửi</button>
                                </form>
                                <button className={styles.link} onClick={() => setIsForgotPassword(true)}>↩ Quay lại đăng nhập</button>
                            </div>
                        )
            }
            <div className={styles.cloudEffect}></div>
            {changePasswordResult && <Toast message={message} type={type} onClose={() => setChangePasswordResult(false)} />}
        </main>
    );
};

export default LoginClient;