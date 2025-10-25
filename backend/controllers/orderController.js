// controllers/orderController.js
const Order = require("../models/Order");

// ======================= API =======================

// Lấy tất cả đơn hàng (API JSON)
exports.getOrders = async(req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "firstname lastname email") // lấy firstname + lastname
            .populate("products.productId", "name price");

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: error.message,
        });
    }
};

// Tạo đơn hàng mới (API JSON)
exports.createOrder = async(req, res) => {
    try {
        const { userId, products, totalPrice, address, paymentMethod } = req.body;

        if (!userId || !products || products.length === 0 || !address) {
            return res.status(400).json({ message: "Thiếu thông tin đơn hàng" });
        }

        const order = new Order({
            userId,
            products,
            totalPrice,
            address,
            paymentMethod,
            status: "pending",
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
    }
};

// Cập nhật trạng thái đơn hàng (API JSON)
exports.updateOrderStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Thiếu trạng thái mới" });
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

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

// ======================= Render EJS =======================

// Render trang Orders (Admin Dashboard style)
exports.renderOrdersPage = async(req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "firstname lastname email") // lấy firstname + lastname
            .populate("products.productId", "name price");

        // Thống kê
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const totalOrders = orders.length;

        const totalCustomers = new Set(
            orders
            .map((o) => (o.userId && o.userId._id ? o.userId._id.toString() : null))
            .filter((id) => id !== null)
        ).size;

        res.render("orders", {
            pageTitle: "Danh sách đơn hàng",
            page: "orders",
            orders,
            totalRevenue,
            totalOrders,
            totalCustomers,
            contentPage: 'ordersBody' // đây là file chứa HTML chính
        });
    } catch (error) {
        res.status(500).send("Lỗi khi load trang Orders: " + error.message);
    }
};