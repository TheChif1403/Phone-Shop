const express = require("express");
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require("../controllers/orderController");
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.put('/:id', auth, updateOrderStatus);

module.exports = router;