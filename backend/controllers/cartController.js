const Cart = require('../models/Cart');
const Order = require('../models/Order'); // dùng khi checkout

// Thêm sản phẩm (nếu có tăng quantity)
exports.addToCart = async(req, res) => {
    try {
        const userId = req.user.id;
        const { productId, name, price, image, quantity = 1 } = req.body;
        if (!productId) return res.status(400).json({ message: 'Thiếu productId' });

        let cart = await Cart.findOne({ userId });
        if (!cart) cart = new Cart({ userId, items: [] });

        const idx = cart.items.findIndex(i => String(i.productId) === String(productId));
        if (idx > -1) {
            cart.items[idx].quantity += Number(quantity);
        } else {
            cart.items.push({ productId, name, price, image, quantity });
        }

        await cart.save();
        return res.json({ message: 'Đã thêm vào giỏ hàng', cart });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi khi thêm vào giỏ', error: err.message });
    }
};

// Lấy giỏ hàng của user
exports.getCart = async(req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ items: [] });
        return res.json(cart);
    } catch (err) {
        return res.status(500).json({ message: 'Lỗi khi lấy giỏ', error: err.message });
    }
};

// Update số lượng (nếu quantity <=0 => remove)
exports.updateItem = async(req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity == null) return res.status(400).json({ message: 'Thiếu quantity' });

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Không có giỏ hàng' });

        const idx = cart.items.findIndex(i => String(i.productId) === String(productId));
        if (idx === -1) return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ' });

        if (Number(quantity) <= 0) {
            cart.items.splice(idx, 1);
        } else {
            cart.items[idx].quantity = Number(quantity);
        }

        await cart.save();
        return res.json({ message: 'Cập nhật giỏ hàng thành công', cart });
    } catch (err) {
        return res.status(500).json({ message: 'Lỗi khi cập nhật giỏ', error: err.message });
    }
};

// Xóa 1 product khỏi cart
exports.removeItem = async(req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Không có giỏ hàng' });

        cart.items = cart.items.filter(i => String(i.productId) !== String(productId));
        await cart.save();
        return res.json({ message: 'Đã xóa sản phẩm', cart });
    } catch (err) {
        return res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error: err.message });
    }
};

// Checkout: tạo Order từ cart và xóa cart
exports.checkout = async(req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Giỏ hàng rỗng' });

        // Tạo order data (tùy theo Order schema của bạn)
        const orderData = {
            userId,
            products: cart.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                price: i.price,
                name: i.name
            })),
            totalPrice: cart.items.reduce((s, i) => s + (i.price * i.quantity), 0),
            status: 'pending'
        };

        const order = new Order(orderData);
        await order.save();

        // Xóa cart (hoặc clear items)
        await Cart.findOneAndDelete({ userId });

        return res.json({ message: 'Đặt hàng thành công', order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi khi checkout', error: err.message });
    }
};