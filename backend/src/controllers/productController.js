const Product = require('../models/Product');
const mongoose = require('mongoose');
const Category = require('../models/Category');

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'categoryIds', select: 'name' })
            .lean();

        products.forEach(p => {
            p.category = Array.isArray(p.categoryIds) && p.categoryIds.length > 0
                ? (p.categoryIds[0]?.name || '')
                : '';
        });

        res.status(200).json({
            success: true,
            products,
            message: 'Lấy danh sách sản phẩm thành công'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách sản phẩm'
        });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, brand, basePrice, discountPrice, discountPercent, description, images, variants, categoryIds } = req.body;

        variants.forEach(variant => {
            variant.price = Number(variant.price);
            variant.stock = Number(variant.stock);
        });

        if (!name || !brand || !basePrice || !categoryIds) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }

        const slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const newProduct = new Product({
            name,
            slug: `${slug}-${Date.now()}`,
            brand,
            basePrice: Number(basePrice),
            discountPrice: Number(discountPrice),
            discountPercent: Number(discountPercent),
            description,
            images: images || [],
            variants: variants || [],
            categoryIds: categoryIds || []
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: 'Thêm sản phẩm thành công',
            product: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm sản phẩm',
            error: error.message
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, basePrice, discountPrice, discountPercent, description, images, variants } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const updateData = {
            brand,
            basePrice: Number(basePrice),
            discountPrice: Number(discountPrice),
            discountPercent: Number(discountPercent),
            description,
            images: images || [],
            updatedAt: Date.now()
        };

        if (name) {
            updateData.name = name;
            updateData.slug = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '') + '-' + Date.now();
        }

        if (variants) {
            updateData.variants = variants;
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID không hợp lệ'
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sản phẩm',
            error: error.message
        });
    }
};

const getProductDetail = async (req, res) => {
    try {
        const { sku } = req.params;

        const product = await Product.findOne({ 'variants.sku': sku })
            .populate({ path: 'categoryIds', select: 'name' })
            .lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }
        return res.status(200).json({
            success: true,
            product,
            message: 'Lấy thông tin sản phẩm thành công'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin sản phẩm',
            error: error.message
        });
    }
}

const autoUpdateProduct = async (req, res) => {
    try {
        const products = await Product.find();
        for (const product of products) {
            const variants = product.variants;
            for (const variant of variants) {
                variant.stock = 10;
                await product.save();
            }
        }
        return res.status(200).json({
            success: true,
            message: 'Tự động cập nhật sản phẩm thành công'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tự động cập nhật sản phẩm',
            error: error.message
        });
    }
}

module.exports = {
    getAllProducts,
    addProduct,
    editProduct,
    deleteProduct,
    getProductDetail,
    autoUpdateProduct
};


