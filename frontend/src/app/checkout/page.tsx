'use client';
import React from 'react';
import {Suspense} from 'react';
import Checkout from '@/components/Checkout';

const CheckoutPage: React.FC = () => {
    return (
        <main>
            <Suspense fallback={<p>Đang tải dữ liệu...</p>}>
                <Checkout />
            </Suspense>
        </main>
    );
};
export default CheckoutPage;