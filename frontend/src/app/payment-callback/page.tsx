'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/PaymentCallback.module.css';

const PaymentCallback: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('Đang xử lý...');
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const paymentStatus = searchParams.get('status');

        console.log(paymentStatus);
        
        if (paymentStatus === '1') {
            setStatus('success');
            setMessage('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
        } else if (paymentStatus !== '1') {
            setStatus('failed');
            setMessage('Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.');
        }
    }, [searchParams]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {status === 'loading' && (
                    <>
                        <div className={styles.spinner}></div>
                        <h2 className={styles.title}>Đang xử lý thanh toán...</h2>
                        <p className={styles.message}>{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className={styles.successIcon}>✓</div>
                        <h2 className={styles.title}>Thanh toán thành công!</h2>
                        <p className={styles.message}>{message}</p>
                        {orderId && (
                            <p className={styles.orderId}>Mã đơn hàng: <strong>{orderId}</strong></p>
                        )}
                        <div className={styles.actions}>
                            <Link href="/orders" className={styles.primaryButton}>
                                Xem đơn hàng
                            </Link>
                            <Link href="/" className={styles.secondaryButton}>
                                Về trang chủ
                            </Link>
                        </div>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className={styles.failedIcon}>✗</div>
                        <h2 className={styles.title}>Thanh toán thất bại</h2>
                        <p className={styles.message}>{message}</p>
                        {orderId && (
                            <p className={styles.orderId}>Mã đơn hàng: <strong>{orderId}</strong></p>
                        )}
                        <div className={styles.actions}>
                            <Link href="/orders" className={styles.primaryButton}>
                                Xem đơn hàng
                            </Link>
                            <Link href="/" className={styles.secondaryButton}>
                                Về trang chủ
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentCallback;


