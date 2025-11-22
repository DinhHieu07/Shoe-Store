export interface Review {
    _id: string;
    productId: string;
    userId: {
        _id: string;
        fullName: string;
        avatarUrl?: string;
    };
    rating: number;
    comment: string;
    images: string[];
    createdAt: string;
}

export interface RatingSummary {
    totalReviews: number;
    averageRating: number;
    ratingCounts: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}