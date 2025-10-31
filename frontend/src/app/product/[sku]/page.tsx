import React from 'react';
import Image from 'next/image';
import ProductDetail from '@/components/ProductDetail';
import { 
    ProductDetailData, 
    RelatedProduct, 
    DiscountCode, 
    Variant, 
    DetailDescription, 
    Category 
} from '@/types/product';

//dl tĩnh
const STATIC_PRODUCT_DATA: ProductDetailData = {
    _id: 'prod12345',
    name: 'Giày New Balance 530 White Natural Indigo (GS) GR530B1',
    brand: 'New Balance',
    basePrice: '2.090.000', 
    images: ['/images/nb530_main.jpg', '/images/nb530_thumb1.jpg', '/images/nb530_thumb2.jpg', '/images/nb530_thumb3.jpg', '/images/nb530_thumb4.jpg', '/images/nb530_thumb5.jpg'],
    category: 'Giày Khác',
    categoryIds: [{ _id: 'cat1', name: 'Giày Khác' }],
    description: {
        material: 'Da tổng hợp và lưới thoáng khí',
        origin: 'Mỹ',
        status: 'Hàng Fullbox - New 100%',
        commitment: 'Sản phẩm cam kết chính hãng 100%. Bảo hành 6 tháng.',
        note: 'Đối với các sản phẩm hết hàng sẵn hoặc hết size bạn cần, Quý khách có thể liên hệ với ShoeStore để sử dụng dịch vụ ORDER sản phẩm của chúng tôi',
    },
    variants: [
        { sku: 'GR530SB1-35.5', size: '35.5', color: 'White', stock: '2', price: '2.090.000' },
        { sku: 'GR530SB1-36', size: '36', color: 'White', stock: '5', price: '2.090.000' }, 
        { sku: 'GR530SB1-37', size: '37', color: 'White', stock: '0', price: '2.090.000' },
        { sku: 'GR530SB1-37.5', size: '37.5', color: 'White', stock: '12', price: '2.090.000' },
        { sku: 'GR530SB1-38', size: '38', color: 'White', stock: '12', price: '2.190.000' }, 
        { sku: 'GR530SB1-38.5', size: '38.5', color: 'White', stock: '7', price: '2.090.000' }, 
        { sku: 'GR530SB1-39', size: '39', color: 'White', stock: '3', price: '2.090.000' },
        { sku: 'GR530SB1-40', size: '40', color: 'White', stock: '1', price: '2.090.000' },
    ],

    discountCodes: [
        {
            _id: 'disc1', 
            name: 'Giảm 50K cho đơn hàng',
            code: 'MGG50K', 
            description: 'Giảm 50K khi mua trên 1 triệu',
            discountType: 'fixed', 
            discountValue: 50000, 
            minOrderAmount: 1000000, 
            expiryDate: new Date(Date.now() + 86400000 * 7),
        },
        {
            _id: 'disc2',
            name: 'Miễn phí vận chuyển',
            code: 'FSHIP', 
            description: 'Miễn phí vận chuyển cho đơn trên 2 triệu',
            discountType: 'fixed',
            discountValue: 30000,
            maxDiscount: 30000,
            minOrderAmount: 2000000, 
            expiryDate: '2025-12-31',
        },
    ],
    policies: [
        { iconType: 'box', description: 'Đóng gói cẩn thận double box' },
        { iconType: 'exchange', description: 'Miễn phí đổi hàng trong 07 ngày' },
        { iconType: 'truck', description: 'Giao hàng nhanh toàn quốc' },
    ],
};

// Dữ liệu sản phẩm liên quan
const RELATED_PRODUCTS_DATA: RelatedProduct[] = [
    { _id: 'rel1', name: 'Giày New Balance 997H', sku: 'CM997H', basePrice: '1.950.000', tag: 'NEW', imageUrl: '/images/anh1.jpg' },
    { _id: 'rel2', name: 'Giày Nike Air Force 1 Low', sku: 'AF1-001', basePrice: '2.800.000', imageUrl: '/images/anh2.jpeg'},
    { _id: 'rel3', name: 'Giày Adidas Samba OG', sku: 'SAMBA-02', basePrice: '2.200.000', tag: '-10%', imageUrl: '/images/anh3.png'},
    { _id: 'rel4', name: 'Giày MLB Big Ball Chunky', sku: 'MLB-05', basePrice: '3.500.000', imageUrl: '/images/anh4.jpg'},
];

interface ProductPageProps {
    params: { sku: string };
}


async function getProductData(sku: string): Promise<ProductDetailData | null> {
    if (sku === 'GR530SB1') {
        return STATIC_PRODUCT_DATA;
    }
    return null;
}

export async function generateStaticParams() {
    const skus = ['GR530SB1']; 

    return skus.map((sku) => ({
        sku: sku,
    }));
}


export default async function ProductDetailPage({ params }: ProductPageProps) {
    const skuFromUrl = params?.sku?.toString() || ''; 
    
    if (!skuFromUrl) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Thiếu mã sản phẩm (SKU).</div>;
    }

    const productSlug = skuFromUrl.split('-')[0];
    const product = await getProductData(productSlug); 
    const related = RELATED_PRODUCTS_DATA;

    if (!product) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy sản phẩm này.</div>;
    }

    return (
        <ProductDetail productData={product} relatedProducts={related} />
    );
}

