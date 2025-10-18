const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

// POST /api/products - thêm sản phẩm mới
router.post('/', auth, isAdmin, createProduct); // chỉ admin thêm

// GET /api/products - lấy danh sách sản phẩm
router.get("/", getProducts);

// GET /api/products/:id - lấy chi tiết 1 sản phẩm
router.get("/:id", getProductById);

// PUT /api/products/:id - cập nhật sản phẩm
router.put('/:id', auth, isAdmin, updateProduct);

// DELETE /api/products/:id - xóa sản phẩm
router.delete('/:id', auth, isAdmin, deleteProduct);

module.exports = router;