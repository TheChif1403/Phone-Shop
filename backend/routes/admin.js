import express from "express";
import Order from "../models/Order.js";
const router = express.Router();

// 🧾 Lấy tất cả đơn hàng
router.get("/orders", async(req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render("admin_orders", { orders });
});

// 🔍 Xem chi tiết đơn hàng
router.get("/orders/:id", async(req, res) => {
    const order = await Order.findById(req.params.id);
    res.render("admin_order_detail", { order });
});

// 🔄 Cập nhật trạng thái đơn hàng
router.post("/orders/:id/status", async(req, res) => {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.redirect("/admin/orders");
});

export default router;