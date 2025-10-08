// controllers/orderController.js
const Order = require("../models/Order");

// Lấy tất cả đơn hàng
exports.getOrders = async (req, res) => {
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
exports.createOrder = async (req, res) => {
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
