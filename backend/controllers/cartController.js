const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product'); // dùng để check tồn kho

// Thêm sản phẩm vào giỏ (tăng quantity nếu đã có)
exports.addToCart = async(req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) return res.status(400).json({ message: 'Thiếu productId' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

        let cart = await Cart.findOne({ userId });
        if (!cart) cart = new Cart({ userId, items: [] });

        const idx = cart.items.findIndex(i => i.productId.toString() === productId);
        const newQuantity = idx > -1 ? cart.items[idx].quantity + Number(quantity) : Number(quantity);

        if (newQuantity > product.stock)
            return res.status(400).json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });

        if (idx > -1) {
            cart.items[idx].quantity = newQuantity;
        } else {
            cart.items.push({
                productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: newQuantity
            });
        }

        await cart.save();
        res.json({ message: 'Đã thêm vào giỏ hàng', cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi thêm vào giỏ', error: err.message });
    }
};

// Lấy giỏ hàng
exports.getCart = async(req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy giỏ', error: err.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ
exports.updateItem = async(req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity == null) return res.status(400).json({ message: 'Thiếu quantity' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        if (quantity > product.stock)
            return res.status(400).json({ message: `Chỉ còn ${product.stock} sản phẩm trong kho` });

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Không có giỏ hàng' });

        const idx = cart.items.findIndex(i => i.productId.toString() === productId);
        if (idx === -1) return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ' });

        if (quantity <= 0) {
            cart.items.splice(idx, 1);
        } else {
            cart.items[idx].quantity = quantity;
        }

        await cart.save();
        res.json({ message: 'Cập nhật giỏ hàng thành công', cart });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật giỏ', error: err.message });
    }
};

// Xóa sản phẩm khỏi giỏ
exports.removeItem = async(req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Không có giỏ hàng' });

        cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        await cart.save();

        res.json({ message: 'Đã xóa sản phẩm', cart });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: err.message });
    }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async(req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Không có giỏ hàng' });

        cart.items = []; // xóa hết sản phẩm
        await cart.save();

        return res.json({ message: 'Giỏ hàng đã được xóa', cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng', error: err.message });
    }
};

// Checkout: tạo Order và xóa giỏ hàng
exports.checkout = async(req, res) => {
    try {
        const userId = req.user.id;
        const { address, paymentMethod } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Giỏ hàng rỗng' });

        // Kiểm tra tồn kho trước khi đặt
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `${item.name} không tồn tại` });
            if (item.quantity > product.stock)
                return res.status(400).json({ message: `Sản phẩm ${item.name} chỉ còn ${product.stock} trong kho` });
        }

        // Tạo order
        const order = new Order({
            userId,
            products: cart.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
                name: i.name
            })),
            totalPrice: cart.items.reduce((s, i) => s + i.price * i.quantity, 0),
            status: 'pending',
            address,
            paymentMethod
        });
        await order.save();

        // Giảm tồn kho sản phẩm
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }

        // Xóa giỏ hàng
        await Cart.findOneAndDelete({ userId });

        res.json({ message: 'Đặt hàng thành công', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi khi checkout', error: err.message });
    }
};