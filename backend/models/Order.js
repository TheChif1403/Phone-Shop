const mongoose = require('mongoose');

// 🧱 Định nghĩa cấu trúc từng sản phẩm trong đơn hàng
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
});

// 🧾 Cấu trúc đơn hàng
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, default: 'Đang xử lý' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);