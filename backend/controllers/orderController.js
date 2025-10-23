// controllers/orderController.js
const Order = require("../models/Order");

// Lấy tất cả đơn hàng
exports.getOrders = async(req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: error.message,
        });
    }
};

// Tạo đơn hàng mới
exports.createOrder = async(req, res) => {
    try {
        const { userId, products, totalPrice, status } = req.body;

        if (!userId || !products || products.length === 0) {
            return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
        }

        const order = new Order({
            userId,
            products,
            totalPrice,
            status: status || "pending",
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
    }
};
// 🧾 Cập nhật trạng thái đơn hàng (dùng cho Admin / Giao hàng)
exports.updateOrderStatus = async(req, res) => {
    try {
        const { status } = req.body;

        // Kiểm tra xem có status không
        if (!status) {
            return res.status(400).json({ message: "Thiếu trạng thái mới để cập nhật" });
        }

        // Cập nhật theo ID đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, { status }, { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json({
            message: "✅ Cập nhật trạng thái đơn hàng thành công",
            order: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi server khi cập nhật trạng thái đơn hàng",
            error: error.message,
        });
    }
};
// ✅ Cập nhật trạng thái đơn hàng (cho admin hoặc người giao hàng)
exports.updateOrderStatus = async(req, res) => {
    try {
        const { id } = req.params; // lấy id đơn hàng từ URL
        const { status } = req.body; // lấy trạng thái mới từ request

        // kiểm tra hợp lệ
        if (!status) {
            return res.status(400).json({ message: "Thiếu trạng thái mới" });
        }

        // tìm và cập nhật đơn hàng
        const order = await Order.findByIdAndUpdate(
            id, { status }, { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.json({
            message: "✅ Cập nhật trạng thái đơn hàng thành công",
            order,
        });
    } catch (error) {
        res.status(500).json({
            message: "❌ Lỗi khi cập nhật đơn hàng",
            error: error.message,
        });
    }
};
