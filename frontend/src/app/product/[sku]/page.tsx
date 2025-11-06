import React from 'react';
import ProductDetail from '@/components/ProductDetail';
import { ProductDetailData } from '@/types/product';
import { apiGetProductDetail } from '@/services/apiProductDetail';

interface ProductPageProps {
    params: Promise<{ sku: string }>;
}

async function getProductData(sku: string): Promise<ProductDetailData | null> {
    const response = await apiGetProductDetail(sku);
    if (response.success) {
        return response.product;
    } else {
        return null;
    }
}

export default async function ProductDetailPage(props: ProductPageProps) {
    const params = await props.params;
    const skuFromUrl = params?.sku?.toString() || '';
    
    if (!skuFromUrl) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>Thiếu mã sản phẩm (SKU).</div>;
    }

    const product = await getProductData(skuFromUrl);

    if (!product) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy sản phẩm này.</div>;
    }

    return <ProductDetail productData={product} />;
}

