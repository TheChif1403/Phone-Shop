const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { createOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");
const auth = require('../middleware/authMiddleware'); // token của người dùng để mua hàng 

// 🟢 Tạo đơn hàng mới
router.post('/', auth, createOrder);

// 🟡 Lấy danh sách tất cả đơn hàng
router.get('/', auth, getOrders); // nếu admin list tất cả

// 🔵 Cập nhật trạng thái đơn hàng (dùng cho admin/giao hàng)
router.put('/:id', auth, updateOrderStatus);

// ✅ Đặt export ở CUỐI CÙNG
module.exports = router;
=======
const { createOrder, getOrders } = require("../controllers/orderController");

// Tạo đơn hàng mới
router.post("/", createOrder);

// Lấy danh sách tất cả đơn hàng
router.get("/", getOrders);

module.exports = router;
>>>>>>> origin/themtaikhoan-lienhe-chinhsach1
