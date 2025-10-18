const express = require("express");
const router = express.Router();
const { createOrder, getOrders } = require("../controllers/orderController");
const auth = require('../middleware/authMiddleware'); //token của người dùng để mua hàng 
// Tạo đơn hàng mới
router.post('/', auth, createOrder);

// Lấy danh sách tất cả đơn hàng
router.get('/', auth, getOrders); // nếu admin list tất cả
module.exports = router;