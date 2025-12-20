'use client';

import React, {useState, useEffect, useRef} from 'react';
import {FaStar, FaStarHalfAlt} from 'react-icons/fa';
import styles from '@/styles/ReviewSection.module.css';
import {Review, RatingSummary} from '@/types/review';
import { apiGetReviews, apiGetRatingSummary, apiCreateReview } from '@/services/apiReview';
import Toast from './Toast';

interface ReviewSectionProps {
    productId: string;
    onSummaryLoaded: (summary: RatingSummary) => void;
}

const defaultSummary: RatingSummary = {
    totalReviews: 0,
    averageRating: 0,
    ratingCounts: {5: 0, 4: 0, 3: 0, 2: 0, 1: 0},
};

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const starArray = [];
    for(let i=0; i<5; i++){
        starArray.push(
            <FaStar key={i} className={i < fullStars ? styles.starFull : styles.starEmpty} />
        );
    }
    return <div className={styles.starWrapper}>{starArray}</div>
};

// thanh process bar
const RatingBar: React.FC<{star: number, count: number, total: number}> = ({star, count, total}) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className={styles.ratingBarRow}>
            <span className={styles.ratingBarStar}>{star} sao</span>
            <div className={styles.ratingBarContainer}>
                <div className={styles.ratingBarFill} style={{width: `${percentage}%`}}></div>
            </div>
        </div>
    );
} ;

const ReviewSection: React.FC<ReviewSectionProps> = ({productId, onSummaryLoaded}) => {
    const [summary, setSummary] = useState<RatingSummary>(defaultSummary);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({rating: 0, comment: '', images: [] as string[]});
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    } | null>(null);
    const isInitialLoad = useRef(true); // Track lần đầu load

    // Load reviews và summary khi component mount hoặc productId thay đổi
    useEffect(() => {
        const loadData = async () => {
            if (!productId) return;
            
            setIsLoading(true);
            isInitialLoad.current = true;
            try {
                // Load summary và reviews song song
                const [summaryRes, reviewsRes] = await Promise.all([
                    apiGetRatingSummary(productId),
                    apiGetReviews(productId)
                ]);

                if (summaryRes.success && summaryRes.summary) {
                    setSummary(summaryRes.summary);
                    onSummaryLoaded(summaryRes.summary);
                } else {
                    setSummary(defaultSummary);
                    onSummaryLoaded(defaultSummary);
                }

                if (reviewsRes.success && Array.isArray(reviewsRes.reviews)) {
                    setReviews(reviewsRes.reviews);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                console.error('Lỗi khi tải đánh giá:', error);
                setToast({ message: 'Không thể tải đánh giá', type: 'error' });
            } finally {
                setIsLoading(false);
                // Đánh dấu đã load xong sau một chút để useEffect filter không chạy ngay
                setTimeout(() => {
                    isInitialLoad.current = false;
                }, 100);
            }
        };

        loadData();
        // Reset filter về 'all' khi productId thay đổi
        setFilterRating('all');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]); // Chỉ phụ thuộc vào productId, onSummaryLoaded là callback từ parent

    // Load reviews khi filter thay đổi (chỉ khi không phải lần đầu load)
    useEffect(() => {
        // Bỏ qua nếu đang loading lần đầu hoặc chưa có productId hoặc đang initial load
        if (isLoading || !productId || isInitialLoad.current) return;
        
        // Nếu filter là 'all', không cần load lại vì đã có sẵn từ lần đầu
        if (filterRating === 'all') {
            return; // Không làm gì cả, giữ nguyên reviews hiện tại
        }
        
        const loadFilteredReviews = async () => {
            setIsFiltering(true);
            try {
                const reviewsRes = await apiGetReviews(productId, filterRating);
                
                if (reviewsRes.success && Array.isArray(reviewsRes.reviews)) {
                    setReviews(reviewsRes.reviews);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                console.error('Lỗi khi lọc đánh giá:', error);
            } finally {
                setIsFiltering(false);
            }
        };

        loadFilteredReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterRating]); // Chỉ phụ thuộc vào filterRating

    // lọc đánh giá (đã được xử lý ở backend, nhưng giữ lại để đảm bảo)
    const filteredReviews = filterRating === 'all' ? reviews : reviews.filter(r => r.rating === filterRating); 

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newReview.rating === 0 || !newReview.comment.trim()) {
            setToast({ message: "Vui lòng chọn sao và nhập nội dung đánh giá.", type: "warning" });
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await apiCreateReview(
                productId,
                newReview.rating,
                newReview.comment,
                newReview.images
            );

            if (result.success) {
                setToast({ message: "Đánh giá của bạn đã được gửi thành công!", type: "success" });
                setNewReview({ rating: 0, comment: '', images: [] });
                setSelectedRating(0);
                
                // Reload reviews và summary sau khi tạo thành công
                const [summaryRes, reviewsRes] = await Promise.all([
                    apiGetRatingSummary(productId),
                    apiGetReviews(productId, filterRating === 'all' ? undefined : filterRating)
                ]);

                if (summaryRes.success && summaryRes.summary) {
                    setSummary(summaryRes.summary);
                    onSummaryLoaded(summaryRes.summary);
                }

                if (reviewsRes.success && Array.isArray(reviewsRes.reviews)) {
                    setReviews(reviewsRes.reviews);
                }
            } else {
                setToast({ message: result.message || "Gửi đánh giá thất bại", type: "error" });
            }
        } catch (error) {
            console.error('Lỗi khi gửi đánh giá:', error);
            setToast({ message: "Đã xảy ra lỗi khi gửi đánh giá", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.reviewSectionContainer}>
            <h2 className={styles.sectionTitle}>ĐÁNH GIÁ SẢN PHẨM</h2>
            
            {/*  Phần Tóm tắt Đánh giá */}
            <div className={styles.ratingSummaryBox}>
                <div className={styles.ratingAverage}>
                    <span className={styles.averageScore}>{summary.averageRating.toFixed(1)}</span>
                    <span className={styles.averageOutOf}>trên 5</span>
                    <div className={styles.averageStars}>
                        {renderStars(summary.averageRating)}
                    </div>
                </div>
                
                <div className={styles.ratingBreakdown}>
                    {[5, 4, 3, 2, 1].map(star => (
                        <RatingBar 
                            key={star} 
                            star={star} 
                            count={summary.ratingCounts[star as keyof typeof summary.ratingCounts]} 
                            total={summary.totalReviews} 
                        />
                    ))}
                </div>
            </div>
            
            {/*  Bộ lọc Đánh giá */}
            <div className={styles.reviewFilter}>
                <button 
                    className={`${styles.filterButton} ${filterRating === 'all' ? styles.filterActive : ''}`}
                    onClick={() => setFilterRating('all')}
                >
                    Tất cả ({summary.totalReviews})
                </button>
                {[5, 4, 3, 2, 1].map(star => (
                    <button 
                        key={`filter-${star}`}
                        className={`${styles.filterButton} ${filterRating === star ? styles.filterActive : ''}`}
                        onClick={() => setFilterRating(star)}
                    >
                        {star} sao ({summary.ratingCounts[star as keyof typeof summary.ratingCounts]})
                    </button>
                ))}
            </div>

            {/*  Danh sách Đánh giá */}
            <div className={styles.reviewList}>
                {(isLoading || isFiltering) ? (
                    <p className={styles.noReviews}>Đang tải đánh giá...</p>
                ) : filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review._id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewerInfo}>
                                    <div className={styles.avatarPlaceholder}>
                                        {review.userId.fullName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className={styles.reviewerName}>{review.userId.fullName}</span>
                                </div>
                                <span className={styles.reviewDate}>
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            {renderStars(review.rating)}
                            <p className={styles.reviewComment}>{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.noReviews}> 
                        {filterRating === 'all' 
                            ? "Chưa có đánh giá nào cho sản phẩm này."
                            : "Chưa có đánh giá nào phù hợp với bộ lọc này."
                        }
                    </p>
                )}
            </div>
            
            {/*  Form thêm đánh giá mới */}
            <div className={styles.addReviewForm}>
                <h3 className={styles.formTitle}>Đánh giá của bạn *</h3>
                <div className={styles.ratingInput}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <FaStar 
                            key={`input-star-${star}`}
                            className={star <= selectedRating ? styles.starInputSelected : styles.starInputEmpty}
                            onClick={() => {
                                setNewReview(prev => ({ ...prev, rating: star }));
                                setSelectedRating(star);
                            }}
                        />
                    ))}
                </div>
                
                <form onSubmit={handleSubmitReview}>
                    <label htmlFor="comment" className={styles.commentLabel}>Nội dung đánh giá *</label>
                    <textarea
                        id="comment"
                        className={styles.commentTextarea}
                        placeholder="Nhập nội dung đánh giá"
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        rows={3}
                        required
                    />
                                        
                    <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                    </button>
                </form>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ReviewSection;
