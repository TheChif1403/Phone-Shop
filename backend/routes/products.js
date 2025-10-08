const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// POST /api/products - thêm sản phẩm mới
router.post("/", createProduct);

// GET /api/products - lấy danh sách sản phẩm
router.get("/", getProducts);

// GET /api/products/:id - lấy chi tiết 1 sản phẩm
router.get("/:id", getProductById);

// PUT /api/products/:id - cập nhật sản phẩm
router.put("/:id", updateProduct);

// DELETE /api/products/:id - xóa sản phẩm
router.delete("/:id", deleteProduct);

module.exports = router;
