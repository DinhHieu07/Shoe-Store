'use client';
import React , {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import styles from '@/styles/ProductDetail.module.css'
import { FaCheckCircle, FaTruck, FaExchangeAlt, FaBoxOpen } from 'react-icons/fa';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DiscountCard from './DiscountCard';

export interface Variant {
    sku: string;
    size: string;
    color: string;
    price: string;
    stock: string;
}

export interface DetailDescription {
    material: string;
    origin: string;
    status: string;
    commitment: string;
    note: string;
}

export interface Category {
    _id: string;
    name: string;
}

export interface DiscountCode {
    _id: string;
    name: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscount?: number;
    minOrderAmount: number;
    expiryDate?: Date | string;
}

export interface ProductDetailData {
    _id: string;
    name: string;
    brand: string;
    basePrice: string;
    images: string[];
    category: string;
    categoryIds: Category[];
    description: DetailDescription;
    variants: Variant[];
    discountCodes: DiscountCode[];
    policies: {
        iconType: 'box' | 'exchange' | 'truck';
        description: string;
    }[];
}

export interface RelatedProduct {
    _id: string;
    name: string;
    sku: string;
    basePrice: string;
    tag?: string;
    imageUrl: string;
}

// chuyển đổi price thành số
const parsePrice = (priceString: string): number => {
    const cleanString = priceString.replace(/[^0-9]/g, '');
    return parseInt(cleanString, 10) || 0;
};

//chuyển đổi stock thành số
const parseStock = (stockString: string): number => {
    const cleanString = stockString.replace(/[^0-9]/g, '');
    return parseInt(cleanString, 10) || 0;
}

// format tiền
const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'});
};

interface ProductDetailProps {
    productData: ProductDetailData;
    relatedProducts: RelatedProduct[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({productData, relatedProducts}) => {
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

    const selectedVariant = productData.variants.find(v => v.size === selectedSize);
    const priceToDisplay = selectedVariant 
        ? parsePrice(selectedVariant.price) // Lấy giá của biến thể nếu có
        : parsePrice(productData.basePrice);

    const currentStockNumber = selectedVariant ? parseStock(selectedVariant.stock) : 0;
    const isOutOfStock = currentStockNumber === 0;

    const mainImageSrc = images[currentIndex] || ''; 
    const isFirstImage = currentIndex === 0;
    const isLastImage = currentIndex === images.length - 1;
    //cắt chuỗi sku: chỉ lấy mã gốc
    const baseSku = currentSku ? currentSku.split('-')[0] : productData._id;
    const scrollAmount = 350;
    
    useEffect(() => {
        if(sizeOptions.length>0 && !selectedSize){
            setSelectedSize(sizeOptions[0]);
        }
        setCurrentIndex(0);
    }, [productData._id]);

    useEffect(() => {
        if(selectedVariant){
            setCurrentSku(selectedVariant.sku);
        }
        setQuantity(1); // Reset số lượng về 1 khi size thay đổi
    }, [selectedSize, selectedVariant]);

    // xử lý số lượng sản phẩm
    const handleQuantityChange = (type: 'increment' | 'decrement') => {
        if (isOutOfStock) return;

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
        if(isOutOfStock) return;
        console.log(`Thêm sản phẩm SKU: ${currentSku} x ${quantity} vào giỏ hàng.`);

    };
    
    // Mua ngay
    const handleBuyNow = () => {
        if(isOutOfStock) return;
        console.log(`Mua ngay sản phẩm SKU: ${currentSku} x ${quantity}.`);

    };
    
    //xử lý cuộn discount
    const handleScroll = () => {
        if(carouselRef.current){
            const{ scrollLeft, scrollWidth, clientWidth} = carouselRef.current;
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

    useEffect (() => {
        const carouselElement = carouselRef.current;
        if(carouselElement){
            handleScroll();
            carouselElement.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [productData.discountCodes]);

    return (
        <div className={styles.productDetailContainer}>
             <div className={styles.breadcrumb}>
                    <a href="/" className={styles.breadcrumbLink}>Trang chủ</a> / 
                    <a href={`/category/${productData.category}`} className={styles.breadcrumbLink}>
                        {productData.category}
                    </a> / 
                    <span className={styles.current}> 
                         {productData.name}
                    </span>
             </div>

                <div className={styles.mainContent}>
                    <div className={styles.imageGallery}>
                        <div className={styles.mainImageWrapper}>
                            <Image src={mainImageSrc} alt={productData.name} layout="responsive" width={500} height={500} objectFit="contain"></Image>
                            {!isFirstImage && (
                                <button 
                                    className={`${styles.navButton} ${styles.prevButton}`} 
                                    onClick={handlePrevImage}
                                >
                                    <FaChevronLeft />
                                </button>
                            )}
                            
                            {!isLastImage && (
                                 <button 
                                    className={`${styles.navButton} ${styles.nextButton}`} 
                                    onClick={handleNextImage}
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
                                    <Image
                                        src={image}
                                        alt={`Thumbnail ${index + 1}`}
                                        layout="responsive"
                                        width={80} 
                                        height={80}
                                        style={{ objectFit: 'cover' }}
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
                                <span className={styles.currentPrice}>{formatCurrency(priceToDisplay)}</span> 
                            </div>

                            {isOutOfStock && (
                                <button className={styles.outOfStockButton} disabled>HẾT HÀNG</button>
                            )}

                            <div className={styles.sizeSelection}>
                                <p className={styles.sizeTitle}>Kích thước: <a href="#" className={styles.sizeGuideLink}>Hướng dẫn chọn size</a></p>
                                <div className={styles.sizeOptions}>
                                    {productData.variants.map(variant => {
                                        const stock = parseStock(variant.stock);
                                        const isDisabled = stock === 0;
                                        
                                        return (
                                            <button
                                                key={variant.sku}
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

                                <input type="text" value={quantity} readOnly className={styles.qtyInput} />

                                <button 
                                className={styles.qtyButton} 
                                onClick={() => handleQuantityChange('increment')}
                                disabled={quantity >= currentStockNumber || isOutOfStock} // Disable nếu Qty >= Stock
                                >+</button>

                                <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={isOutOfStock || quantity === 0}>Thêm vào giỏ</button>
                                <button className={styles.buyNowButton} onClick={handleBuyNow} disabled={isOutOfStock || quantity === 0}>Mua ngay</button>
                            </div>
                        </div>

                        <div className={styles.discountPolicyWrapper}>
                            <div className={styles.discountCodeSection}>
                                <h3>Mã giảm giá / Voucher</h3>
                                {productData.discountCodes && productData.discountCodes.length > 0 ? (
                                    <div className={styles.discountCardCarouselContainer}>
                                        <button 
                                            className={`${styles.carouselNavButton} ${styles.carouselPrevButton} ${isAtStart ? styles.hidden : ''}`}
                                            onClick={handlePrevClick}
                                            style={{ display: (isAtStart || !isScrollable) ? 'none' : 'flex' }}
                                        >
                                            &#9664;
                                        </button>

                                        <div className={styles.discountCardWrapper} ref={carouselRef}>
                                            {productData.discountCodes.map((d) => (
                                                <DiscountCard
                                                    key={d.code} 
                                                    discount={d} 
                                                />
                                            ))}
                                        </div>

                                        <button 
                                            className={`${styles.carouselNavButton} ${styles.carouselNextButton} ${isAtEnd ? styles.hidden : ''}`}
                                            onClick={handleNextClick}
                                            style={{ display: (isAtEnd || !isScrollable) ? 'none' : 'flex' }}
                                        >
                                            &#9654;
                                        </button>
                                    </div>
                                ) : (
                                    <p style={{fontSize: '14px', color: '#666'}}>Chưa có mã giảm giá áp dụng cho sản phẩm này.</p>
                                )}
                                
                            </div>

                            <div className={styles.deliveryPolicySection}>
                                <h3>Chính sách</h3>
                                <ul className={styles.deliveryPolicyList}>
                                    {productData.policies.map((p, i) => (
                                        <li key={i} className={styles.policyItem}>
                                            {p.iconType === 'box' && <FaBoxOpen />}
                                            {p.iconType === 'exchange' && <FaExchangeAlt />}
                                            {p.iconType === 'truck' && <FaTruck />}
                                            <span>{p.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                
                <div className={styles.productSectionsWrapper}>
                    <div className={styles.descriptionSection}>
                        <h2 className={styles.sectionTitle}>MÔ TẢ SẢN PHẨM</h2>
                        <ul className={styles.descriptionList}>
                            <li><strong>Thương hiệu: </strong>{productData.brand}</li>
                            <li><strong>Mã sản phẩm: </strong>{currentSku}</li>
                            <li><strong>Chất liệu: </strong>{productData.description.material}</li>
                            <li><strong>Xuất xứ: </strong>{productData.description.origin}</li>
                            <li><strong>Tình trạng: </strong>{productData.description.status}</li>
                            <li><strong>Cam kết: </strong>{productData.description.commitment}</li>
                            <p className={styles.note}><strong>Lưu ý: </strong>{productData.description.note}</p>
                        </ul>
                        
                        {productData.images.map((imgUrl, index) => (
                            <div key={`detail-img-${index}`} className={styles.detailImage}>
                                <Image 
                                    src={imgUrl} 
                                    alt={`${productData.name} - Chi tiết ${index + 1}`}
                                    width={1200} 
                                    height={800} 
                                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                />
                            </div>
                        ))}  
                    </div>

                    <div className={styles.relatedProductsSection}>
                        <h2 className={styles.sectionTitle}>SẢN PHẨM LIÊN QUAN</h2>
                        <div className={styles.relatedProductsList}>
                            {relatedProducts.map(product => (
                                <div key={product._id} className={styles.relatedProductCard}>
                                    {product.tag && <span className={styles.saleTag}>{product.tag}</span>}
                                    <div className={styles.productImagePlaceholder}>
                                        {product.imageUrl && (
                                            <Image 
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill={true}
                                                sizes="(max-width: 768px) 100vw, 25vw"
                                                style={{ objectFit: 'cover', objectPosition: 'center', }}
                                            />
                                        )}
                                    </div>
                                    <p className={styles.relatedProductName}>{product.name}</p>
                                    <div className={styles.relatedPrice}>
                                        <span className={styles.current}>{formatCurrency(parsePrice(product.basePrice))}</span> 
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default ProductDetail;