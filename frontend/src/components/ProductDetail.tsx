'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/ProductDetail.module.css'
import { FaCheckCircle, FaTruck, FaExchangeAlt, FaBoxOpen } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DiscountCard from './DiscountCard';
import { apiGetVouchers } from '@/services/apiVoucher';
import { apiGetProducts } from '@/services/apiProduct';

import { ProductDetailData } from '@/types/product';
import { VoucherPayload } from '@/types/voucher';
import { CartContextType, CartItem } from '@/types/cart';
import { CartContext } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';

// Chuyển đổi giá trị (string | number) sang number
const toNumber = (value: string | number | undefined | null): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const clean = value.replace(/[^0-9]/g, '');
        return parseInt(clean, 10) || 0;
    }
    return 0;
};

// Chuyển đổi tồn kho (string | number) sang number
const toStockNumber = (value: string | number | undefined | null): number => {
    return toNumber(value);
}

// format tiền
const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

interface ProductDetailProps {
    productData: ProductDetailData;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productData }) => {
    const sizeOptions = Array.from(new Set(productData.variants.map(v => v.size)));
    const images = productData.images || [];

    const [selectedSize, setSelectedSize] = useState('');
    const [currentSku, setCurrentSku] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [discountCode, setDiscountCode] = useState('');
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [footLengthCm, setFootLengthCm] = useState<string>('');
    const [recommendedSize, setRecommendedSize] = useState<string>('');
    const [vouchers, setVouchers] = useState<VoucherPayload[]>([]);
    const { addItemToCart } = useCart();
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    } | null>(null);
    type ProductListItem = {
        _id: string;
        name: string;
        brand: string;
        basePrice: number | string;
        images?: string[];
        variants?: { sku: string }[];
    };
    const [related, setRelated] = useState<ProductListItem[]>([]);
    const selectedVariant = productData.variants.find(v => v.size === selectedSize);
    const basePrice = selectedVariant
        ? toNumber(selectedVariant.price)
        : toNumber(productData.basePrice);
    const discountPrice = productData.discountPrice && productData.discountPrice > 0 
        ? toNumber(productData.discountPrice) 
        : 0;
    const hasDiscount = discountPrice > 0 && discountPrice < basePrice;

    const currentStockNumber = selectedVariant ? toStockNumber(selectedVariant.stock) : 0;
    const isOutOfStock = currentStockNumber === 0;

    const mainImageSrc = images[currentIndex] || '';
    const isFirstImage = currentIndex === 0;
    const isLastImage = currentIndex === images.length - 1;
    //cắt chuỗi sku: chỉ lấy mã gốc
    const firstVariantSku = productData.variants[0]?.sku || '';
    const baseSku = (currentSku || firstVariantSku || productData._id).split('-')[0];
    const scrollAmount = 350;

    useEffect(() => {
        const fetchVouchers = async () => {
            const res = await apiGetVouchers();
            if (res.success) {
                setVouchers(res.vouchers);
                // Gọi tính toán scroll sau khi render vouchers
                setTimeout(() => handleScroll(), 0);
            } else {
                setToast({ message: res.message, type: 'error' });
            }
        };
        fetchVouchers();
    }, []);

    // Lấy sản phẩm liên quan theo brand
    useEffect(() => {
        const fetchRelated = async () => {
            const res = await apiGetProducts();
            if (res.success) {
                const products = (res.products || []) as ProductListItem[];
                const items = products.filter((p) => p.brand === productData.brand && p._id !== productData._id).slice(0, 8);
                setRelated(items);
            }
        };
        fetchRelated();
    }, [productData.brand, productData._id]);

    useEffect(() => {
        if (sizeOptions.length > 0 && !selectedSize) {
            setSelectedSize(sizeOptions[0]);
        }
        setCurrentIndex(0);
    }, [productData._id]);

    useEffect(() => {
        if (selectedVariant) {
            setCurrentSku(selectedVariant.sku);
        }
        setQuantity(1); // Reset số lượng về 1 khi size thay đổi
    }, [selectedSize, selectedVariant]);

    // Bảng quy đổi size EU theo chiều dài bàn chân (cm) tham khảo
    const sizeChartEu: { size: string; min: number; max: number }[] = [
        { size: '35', min: 22.0, max: 22.5 },
        { size: '36', min: 22.6, max: 23.0 },
        { size: '37', min: 23.1, max: 23.5 },
        { size: '38', min: 23.6, max: 24.0 },
        { size: '39', min: 24.1, max: 24.5 },
        { size: '40', min: 24.6, max: 25.0 },
        { size: '41', min: 25.1, max: 25.5 },
        { size: '42', min: 25.6, max: 26.0 },
        { size: '43', min: 26.1, max: 26.5 },
        { size: '44', min: 26.6, max: 27.0 },
        { size: '45', min: 27.1, max: 27.5 }
    ];

    const availableSizes = Array.from(new Set(productData.variants.map(v => v.size)));

    const calculateRecommendation = (value: string) => {
        const cm = parseFloat(value.replace(',', '.'));
        if (!cm || cm <= 0) {
            setRecommendedSize('');
            return;
        }
        const match = sizeChartEu.find(r => cm >= r.min && cm <= r.max);
        setRecommendedSize(match ? match.size : '');
    };

    useEffect(() => {
        calculateRecommendation(footLengthCm);
    }, [footLengthCm]);

    // xử lý số lượng sản phẩm
    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        if (isOutOfStock && selectedSize) return;

        setQuantity(prevQty => {
            let newQty = prevQty;
            if (type === 'increment') {
                // Tăng, giới hạn tối đa là Stock
                newQty = Math.min(prevQty + 1, currentStockNumber);
            } else {
                // Giảm, giới hạn tối thiểu là 1
                newQty = Math.max(prevQty - 1, 1);
            }
            return newQty;
        });
    };

    // Xử lý chuyển ảnh (Sử dụng currentIndex)
    const handlePrevImage = () => {
        if (currentIndex > 0) {
            console.log(`PREV clicked. Từ index ${currentIndex} -> ${currentIndex - 1}`);
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNextImage = () => {
        if (currentIndex < images.length - 1) {
            console.log(`NEXT clicked. Từ index ${currentIndex} -> ${currentIndex + 1}`);
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (isOutOfStock) return;

        if(sizeOptions.length && !selectedSize) {
            setToast({message: "Vui lòng chọn size trước khi thêm vao giỏ hàng.", type: "warning"});
            return;
        }

        const cartItem: CartItem = {
            id: currentSku || productData._id,
            name: productData.name,
            basePrice: priceToDisplay,
            quantity: quantity,
            imageUrl: mainImageSrc || productData.images[0],
            size: selectedSize,
        };
        
        addItemToCart(cartItem, quantity, selectedSize);

        setToast({ message: "✅ Đã thêm sản phẩm vào giỏ hàng!", type: "success"});
    };

    //xử lý cuộn discount
    const handleScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            const scrollable = scrollWidth > clientWidth;
            setIsScrollable(scrollable);
            const atStart = scrollLeft < 10;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 10;
            setIsAtStart(atStart);
            setIsAtEnd(atEnd);
        }
    }

    // xử lý click discount
    const handlePrevClick = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
        setTimeout(handleScroll, 300);
    };

    const handleNextClick = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        setTimeout(handleScroll, 300);
    };

    useEffect(() => {
        const carouselElement = carouselRef.current;
        if (carouselElement) {
            handleScroll();
            carouselElement.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [vouchers]);

    return (
        <div className={styles.productDetailContainer}>
            <div className={styles.breadcrumb}>
                <Link href="/" className={styles.breadcrumbLink}>Trang chủ</Link> /
                <Link href={`/category/${encodeURIComponent(productData.category || productData.categoryIds?.[0]?.name || '')}`} className={styles.breadcrumbLink}>
                    {productData.category || productData.categoryIds?.[0]?.name || ''}
                </Link> /
                <span className={styles.current}>
                    {productData.name}
                </span>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.imageGallery}>
                    <div className={styles.mainImageWrapper}>
                        <img
                            src={mainImageSrc}
                            alt={productData.name}
                            width={500}
                            height={500}
                            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                        />
                        {!isFirstImage && (
                            <button
                                className={`${styles.navButton} ${styles.prevButton}`}
                                onClick={handlePrevImage}
                                aria-label="Ảnh trước"
                                title="Ảnh trước"
                            >
                                <FaChevronLeft />
                            </button>
                        )}

                        {!isLastImage && (
                            <button
                                className={`${styles.navButton} ${styles.nextButton}`}
                                onClick={handleNextImage}
                                aria-label="Ảnh tiếp theo"
                                title="Ảnh tiếp theo"
                            >
                                <FaChevronRight />
                            </button>
                        )}

                    </div>

                    <div className={styles.thumbnailList}>
                        {productData.images.map((image, index) => (
                            <div
                                key={index}
                                className={`${styles.thumbnailItem} ${index === currentIndex ? styles.thumbnailSelected : ''}`}
                                onClick={() => setCurrentIndex(index)} // Click để đổi ảnh chính
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    width={80}
                                    height={80}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            </div>
                        ))}
                    </div>
                </div >

                <div className={styles.rightColumnWrapper}>
                    <div className={styles.productInfo}>
                        <h1 className={styles.productName}>{productData.name}</h1>
                        <div className={styles.productMeta}>
                            <span className={`${styles.status} ${isOutOfStock ? styles.outOfStock : ''}`}>
                                {isOutOfStock ? '⛔ Hết hàng' : '✅ Còn Hàng'}
                            </span>
                            <span className={styles.authenticTag}>Authentic: <strong>100%</strong></span>
                        </div>

                        <div className={styles.productMetaLine}>
                            <span>Thương hiệu: <strong>{productData.brand}</strong></span>
                            <span className={styles.metaSeparator}>|</span>
                            <span className={styles.productType}>Loại: <strong>Hàng có sẵn</strong></span>
                            <span className={styles.metaSeparator}>|</span>
                            <span>MSP: <strong>{currentSku || productData._id}</strong></span>
                        </div>

                        <div className={styles.priceSection}>
                            {hasDiscount ? (
                                <>
                                    <span className={styles.currentPrice}>{formatCurrency(discountPrice)}</span>
                                    <span className={styles.originalPrice}>{formatCurrency(basePrice)}</span>
                                </>
                            ) : (
                                <span className={styles.currentPrice}>{formatCurrency(basePrice)}</span>
                            )}
                        </div>

                        {isOutOfStock && (
                            <button className={styles.outOfStockButton} disabled>HẾT HÀNG</button>
                        )}

                        <div className={styles.sizeSelection}>
                            <p className={styles.sizeTitle}>Kích thước: <button type="button" className={styles.sizeGuideLink} onClick={() => setIsSizeGuideOpen(true)}>Hướng dẫn chọn size</button></p>
                            <div className={styles.sizeOptions}>
                                {productData.variants.map((variant, idx) => {
                                    const stock = toStockNumber(variant.stock);
                                    const isDisabled = stock === 0;

                                    return (
                                        <button
                                            key={`${variant.sku || 'sku'}-${variant.size || 'size'}-${idx}`}
                                            className={`${styles.sizeButton} ${selectedSize === variant.size ? styles.selected : ''}`}
                                            onClick={() => setSelectedSize(variant.size)}
                                            disabled={isDisabled}
                                        >
                                            {variant.size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.quantityControl}>
                            <button
                                className={styles.qtyButton}
                                onClick={() => handleQuantityChange('decrement')}
                                disabled={quantity <= 1 || isOutOfStock} // Disable nếu Qty = 1
                            >-</button>

                            <input
                                type="text"
                                value={quantity}
                                readOnly
                                className={styles.qtyInput}
                                aria-label="Số lượng"
                                title="Số lượng"
                                placeholder="Số lượng"
                            />

                            <button
                                className={styles.qtyButton}
                                onClick={() => handleQuantityChange('increment')}
                                disabled={quantity >= currentStockNumber || isOutOfStock} // Disable nếu Qty >= Stock
                            >+</button>

                            <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={isOutOfStock || quantity === 0}>Thêm vào giỏ</button>
                        </div>
                    </div>

                    <div className={styles.discountPolicyWrapper}>
                        <div className={styles.discountCodeSection}>
                            <h3>Mã giảm giá / Voucher</h3>
                            {vouchers && vouchers.length > 0 ? (
                                <div className={styles.discountCardCarouselContainer}>
                                    <button
                                        className={`${styles.carouselNavButton} ${styles.carouselPrevButton} ${isAtStart ? styles.hidden : ''}`}
                                        onClick={handlePrevClick}
                                        disabled={isAtStart || !isScrollable}
                                        style={{ visibility: vouchers.length > 1 ? 'visible' : 'hidden' }}
                                    >
                                        &#9664;
                                    </button>

                                    <div className={styles.discountCardWrapper} ref={carouselRef}>
                                        {vouchers.map((v) => (
                                            <DiscountCard
                                                key={v.code}
                                                voucher={v}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        className={`${styles.carouselNavButton} ${styles.carouselNextButton} ${isAtEnd ? styles.hidden : ''}`}
                                        onClick={handleNextClick}
                                        disabled={isAtEnd || !isScrollable}
                                        style={{ visibility: vouchers.length > 1 ? 'visible' : 'hidden' }}
                                    >
                                        &#9654;
                                    </button>
                                </div>
                            ) : (
                                <p style={{ fontSize: '14px', color: '#666' }}>Chưa có mã giảm giá áp dụng cho sản phẩm này.</p>
                            )}

                        </div>

                        <div className={styles.deliveryPolicySection}>
                            <h3>Chính sách</h3>
                            <ul className={styles.deliveryPolicyList}>
                                <li className={styles.policyItem}>
                                    <FaBoxOpen />
                                    <span>Miễn phí vận chuyển</span>
                                </li>
                                <li className={styles.policyItem}>
                                    <FaExchangeAlt />
                                    <span>Đổi trả trong 30 ngày</span>
                                </li>
                                <li className={styles.policyItem}>
                                    <FaTruck />
                                    <span>Giao hàng nhanh chóng</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>


            <div className={styles.productSectionsWrapper}>
                <div className={styles.descriptionSection}>
                    <h2 className={styles.sectionTitle}>MÔ TẢ SẢN PHẨM</h2>
                    <ul className={styles.descriptionList}>
                        <li>{productData.description}</li>
                    </ul>

                    {productData.images.map((imgUrl, index) => (
                        <div key={`detail-img-${index}`} className={styles.detailImage}>
                            <img
                                src={imgUrl}
                                alt={`${productData.name} - Chi tiết ${index + 1}`}
                                width={1200}
                                height={800}
                                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                            />
                        </div>
                    ))}
                </div>
                {/* Sản phẩm liên quan */}
                {related && related.length > 0 && (
                    <section className={styles.relatedProductsSection}>
                        <h2 className={styles.sectionTitle}>Sản phẩm liên quan</h2>
                        <div className={styles.relatedProductsList}>
                            {related.map((rp) => {
                                const firstSku = rp.variants?.[0]?.sku || rp._id;
                                const firstImg = rp.images?.[0] || '/placeholder.png';
                                const price = typeof rp.basePrice === 'number' ? rp.basePrice : Number(rp.basePrice || 0);
                                return (
                                    <Link key={rp._id} href={`/product/${encodeURIComponent(firstSku)}`} className={styles.relatedProductCard}>
                                        <div className={styles.productImagePlaceholder}>
                                            <img src={firstImg} alt={rp.name} width={300} height={250} />
                                        </div>
                                        <div className={styles.relatedProductName}>{rp.name}</div>
                                        <div className={styles.relatedPrice}><span className={styles.current}>{price.toLocaleString('vi-VN')}₫</span></div>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}
            </div>

            {isSizeGuideOpen && (
                <div className={styles.sizeGuideOverlay} role="dialog" aria-modal="true" aria-label="Hướng dẫn chọn size">
                    <div className={styles.sizeGuideModal}>
                        <div className={styles.sizeGuideHeader}>
                            <h3 className={styles.sizeGuideTitle}>Hướng dẫn chọn size</h3>
                            <button className={styles.sizeGuideClose} aria-label="Đóng" title="Đóng" onClick={() => setIsSizeGuideOpen(false)}>×</button>
                        </div>
                        <div className={styles.sizeGuideBody}>
                            <div className={styles.sizeGuideInputRow}>
                                <label htmlFor="foot-length" className={styles.sizeGuideLabel}>Chiều dài bàn chân (cm)</label>
                                <input
                                    id="foot-length"
                                    type="number"
                                    inputMode="decimal"
                                    step="0.1"
                                    min="20"
                                    max="30"
                                    value={footLengthCm}
                                    onChange={(e) => setFootLengthCm(e.target.value)}
                                    className={styles.sizeGuideInput}
                                    placeholder="Ví dụ: 24.5 (min: 22.0, max: 22.5)"
                                />
                            </div>

                            <div className={styles.sizeGuideChips}>
                                {sizeChartEu.map((row) => {
                                    const isAvailable = availableSizes.includes(row.size);
                                    const isReco = recommendedSize === row.size;
                                    return (
                                        <div
                                            key={`eu-${row.size}`}
                                            className={`${styles.sizeChip} ${isAvailable ? styles.sizeChipAvailable : ''} ${isReco ? styles.sizeChipRecommended : ''}`}
                                            title={`EU ${row.size} ~ ${row.min.toFixed(1)} - ${row.max.toFixed(1)} cm`}
                                        >
                                            EU {row.size}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.sizeGuideNote}>
                                Gợi ý dựa trên chiều dài bàn chân tham khảo. Nên chọn size gần với gợi ý và ưu tiên size đang còn hàng.
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductDetail;