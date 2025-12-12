const Review = require('../models/Review');
const Product = require('../models/Product');

// Lấy danh sách đánh giá của sản phẩm
const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating } = req.query; // Filter theo rating (1-5)

        if (!productId) {
            return res.status(400).json({ success: false, message: 'Thiếu productId' });
        }

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        // Xây dựng query
        const query = { productId };
        if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
            query.rating = parseInt(rating);
        }

        // Lấy reviews với populate userId để lấy thông tin user
        const reviews = await Review.find(query)
            .populate('userId', 'fullname avatar')
            .sort({ createdAt: -1 })
            .lean();

        // Format lại dữ liệu để khớp với frontend
        const formattedReviews = reviews.map(review => ({
            _id: review._id,
            productId: review.productId.toString(),
            rating: review.rating,
            comment: review.comment || '',
            images: review.images || [],
            createdAt: review.createdAt.toISOString(),
            userId: {
                _id: review.userId._id.toString(),
                fullName: review.userId.fullname || 'Người dùng',
                avatarUrl: review.userId.avatar
            }
        }));

        return res.status(200).json({
            success: true,
            reviews: formattedReviews
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đánh giá:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách đánh giá: ' + error.message });
    }
};

// Lấy tóm tắt đánh giá (rating summary)
const getRatingSummary = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ success: false, message: 'Thiếu productId' });
        }

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        // Lấy tất cả reviews của sản phẩm
        const reviews = await Review.find({ productId }).lean();

        // Tính toán summary
        const totalReviews = reviews.length;
        let averageRating = 0;
        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

        if (totalReviews > 0) {
            let totalRating = 0;
            reviews.forEach(review => {
                const rating = review.rating;
                totalRating += rating;
                if (rating >= 1 && rating <= 5) {
                    ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
                }
            });
            averageRating = totalRating / totalReviews;
        }

        return res.status(200).json({
            success: true,
            summary: {
                totalReviews,
                averageRating: Math.round(averageRating * 10) / 10, // Làm tròn 1 chữ số thập phân
                ratingCounts
            }
        });
    } catch (error) {
        console.error('Lỗi khi lấy tóm tắt đánh giá:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy tóm tắt đánh giá: ' + error.message });
    }
};

// Tạo đánh giá mới
const createReview = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
        }

        const { productId, rating, comment, images } = req.body;

        // Validation
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Thiếu productId' });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating phải từ 1 đến 5' });
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({ success: false, message: 'Vui lòng nhập nội dung đánh giá' });
        }

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        // Kiểm tra user đã review sản phẩm này chưa (unique constraint)
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        // Tạo review mới
        const review = new Review({
            productId,
            userId,
            rating: parseInt(rating),
            comment: comment.trim(),
            images: images || []
        });

        await review.save();

        // Populate để trả về đầy đủ thông tin
        const populatedReview = await Review.findById(review._id)
            .populate('userId', 'fullname avatar')
            .lean();

        // Format lại dữ liệu
        const formattedReview = {
            _id: populatedReview._id,
            productId: populatedReview.productId.toString(),
            rating: populatedReview.rating,
            comment: populatedReview.comment,
            images: populatedReview.images || [],
            createdAt: populatedReview.createdAt.toISOString(),
            userId: {
                _id: populatedReview.userId._id.toString(),
                fullName: populatedReview.userId.fullname || 'Người dùng',
                avatarUrl: populatedReview.userId.avatar
            }
        };

        return res.status(201).json({
            success: true,
            message: 'Đánh giá đã được gửi thành công',
            review: formattedReview
        });
    } catch (error) {
        console.error('Lỗi khi tạo đánh giá:', error);
        
        // Xử lý lỗi unique constraint
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }

        return res.status(500).json({ success: false, message: 'Lỗi khi tạo đánh giá: ' + error.message });
    }
};

module.exports = {
    getReviews,
    getRatingSummary,
    createReview
};

