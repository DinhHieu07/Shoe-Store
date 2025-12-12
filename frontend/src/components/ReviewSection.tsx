'use client';

import React, {useState, useEffect} from 'react';
import {FaStar, FaStarHalfAlt} from 'react-icons/fa';
import styles from '@/styles/ReviewSection.module.css';
import {Review, RatingSummary} from '@/types/review';

interface ReviewSectionProps {
    productId: string;
    onSummaryLoaded: (summary: RatingSummary) => void;
}

 const mockReviews: Review[] = [
    {
        _id: 'r1', productId: 'p1', rating: 5, comment: 'Sản phẩm tốt, dùng bền, chất liệu ổn, đi êm chân, nên chọn đúng size', 
        userId: {_id: 'u1', fullName: 'Hà Nguyễn'}, images: [], createdAt: '2025-11-21'
    },
    {
        _id: 'r2', productId: 'p1', rating: 5, comment: 'Sản phẩm chất lượng, phù hợp giá tiền, đi bền',
        userId: { _id: 'u2', fullName: 'Linh Trần' }, images: [], createdAt: '2024-04-10'
    }
];

const mockSummary: RatingSummary = {
    totalReviews: 2,
    averageRating: 5.0,
    ratingCounts: {5: 2, 4: 0, 3: 0, 2: 0, 1: 0},
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
    const [summary, setSummary] = useState<RatingSummary>(mockSummary);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({rating: 0, comment: '', images: [] as string[]});
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');

    useEffect(() => {
        setReviews(mockReviews);
        setSummary(mockSummary);
        onSummaryLoaded(mockSummary);
    }, [productId, onSummaryLoaded]);

    // lọc đánh giá
    const filteredReviews = filterRating === 'all' ? reviews : reviews.filter(r => r.rating === filterRating); 

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReview.rating === 0 || !newReview.comment.trim()) {
            alert("Vui lòng chọn sao và nhập nội dung đánh giá.");
            return;
        }
        console.log("Gửi đánh giá:", { ...newReview, productId });
        setNewReview({ rating: 0, comment: '', images: [] });
        setSelectedRating(0);
        alert("Đánh giá của bạn đã được gửi!");
    };

    return (
        <div className={styles.reviewSectionContainer}>
            <h2 className={styles.sectionTitle}>ĐÁNH GIÁ SẢN PHẨM</h2>
            
            {/* 1. Phần Tóm tắt Đánh giá */}
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
            
            {/* 2. Bộ lọc Đánh giá */}
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

            {/* 3. Danh sách Đánh giá */}
            <div className={styles.reviewList}>
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review._id} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.reviewerInfo}>
                                    <div className={styles.avatarPlaceholder}>{review.userId.fullName[0]}</div>
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
            
            {/* 4. Form thêm đánh giá mới */}
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
                                        
                    <button type="submit" className={styles.submitButton}>Gửi</button>
                </form>
            </div>
        </div>
    );
};

export default ReviewSection;
