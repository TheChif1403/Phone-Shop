const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Trang danh sách sản phẩm
router.get('/products', productController.getProductsPage);

// Thêm sản phẩm
router.post('/products/add', productController.addProduct);

// Cập nhật sản phẩm
router.put('/products/:id', productController.updateProduct);

// Xóa sản phẩm
router.delete('/products/:id', productController.deleteProduct);

// Lịch sử nhập stock
router.get('/products/history/:id', productController.getStockHistory);

module.exports = router