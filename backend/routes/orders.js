const express = require("express");
const router = express.Router();
const { createOrder, getOrders } = require("../controllers/orderController");

// Tạo đơn hàng mới
router.post("/", createOrder);

// Lấy danh sách tất cả đơn hàng
router.get("/", getOrders);

module.exports = router;
