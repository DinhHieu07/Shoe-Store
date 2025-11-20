const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục' });
        }
        const { productId, quantity, price, variantIndex } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }
        
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => 
            item.productId.toString() === productId.toString() && 
            item.variantIndex === variantIndex
        );
        
        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.price = price;
        } else {
            cart.items.push({ productId, quantity, price, variantIndex });
        }
        await cart.save();
        
        // Trả về item đầy đủ để frontend không cần gọi lại getCart
        const cartItem = existingItem || cart.items[cart.items.length - 1];
        const variant = product.variants[variantIndex];
        
        return res.status(200).json({ 
            success: true, 
            message: 'Sản phẩm đã được thêm vào giỏ hàng',
            item: {
                productId: cartItem.productId.toString(),
                quantity: cartItem.quantity,
                price: cartItem.price,
                variant,
                name: product.name,
                image: product.images?.[0] || '',
                discountPercent: product.discountPercent || 0,
                discountPrice: product.discountPrice || 0,
                basePrice: product.basePrice || 0,
            },
            isUpdate: !!existingItem
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi thêm sản phẩm vào giỏ hàng' });
    }
}

const getCart = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục' });
        }
        const cart = await Cart.findOne({ userId });
        if(!cart) {
            return res.status(200).json({ success: true, message: 'Giỏ hàng trống', items: [] });
        }
        const items = [];
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            const variant = product.variants[item.variantIndex];
            items.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                variant: variant,
                variantIndex: item.variantIndex,
                name: product.name,
                image: product.images[0],
                discountPercent: product.discountPercent,
                discountPrice: product.discountPrice,
                basePrice: product.basePrice,
            });
        }
        return res.status(200).json({ success: true, message: 'Lấy giỏ hàng thành công', items: items });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi lấy giỏ hàng' });
    }
}

const updateItemQuantity = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục' });
        }
        const { productId, quantity, size } = req.body;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });
        }
        const product = await Product.findById(productId);
        const item = cart.items.find(item => item.productId.toString() === productId.toString() && product.variants[item.variantIndex].size === size);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }
        item.quantity = quantity;
        await cart.save();
        return res.status(200).json({ success: true, message: 'Số lượng sản phẩm đã được cập nhật' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật số lượng sản phẩm trong giỏ hàng' });
    }
}

const deleteItemFromCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const productId = req.params.productId;
        const size = req.query.size;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục' });
        }
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }
        
        // Tìm item cần xóa: cùng productId và cùng size
        const itemToDelete = cart.items.find(item => {
            if (item.productId.toString() !== productId.toString()) return false;
            const variant = product.variants[item.variantIndex];
            return variant && variant.size === size;
        });
        
        if (!itemToDelete) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong giỏ hàng' });
        }
        
        // Xóa item: giữ lại các item KHÔNG phải item cần xóa
        cart.items = cart.items.filter(item => {
            if (item.productId.toString() !== productId.toString()) return true;
            const variant = product.variants[item.variantIndex];
            return !variant || variant.size !== size;
        });
        
        if (cart.items.length === 0) {
            await Cart.findByIdAndDelete(cart._id);
            return res.status(200).json({ success: true, message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
        }
        
        await cart.save();
        return res.status(200).json({ success: true, message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
    }
}

const deleteAllItemsFromCart = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục' });
        }
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });
        }
        cart.items = [];
        await cart.save();
        return res.status(200).json({ success: true, message: 'Tất cả sản phẩm đã được xóa khỏi giỏ hàng' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng' });
    }
}

module.exports = {
    addToCart,
    getCart,
    deleteItemFromCart,
    deleteAllItemsFromCart,
    updateItemQuantity
}