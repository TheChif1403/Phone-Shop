// routes/product.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Middleware validate dữ liệu
const validateProduct = [
  body("name").notEmpty().withMessage("Tên sản phẩm không được để trống"),
  body("price")
    .isNumeric()
    .withMessage("Giá phải là số")
    .custom((value) => value > 0)
    .withMessage("Giá phải lớn hơn 0"),
];

// POST /api/products - thêm sản phẩm mới
router.post("/", validateProduct, createProduct);

// GET /api/products - lấy danh sách sản phẩm
router.get("/", getProducts);

// GET /api/products/:id - lấy chi tiết 1 sản phẩm
router.get("/:id", getProductById);

// PUT /api/products/:id - cập nhật sản phẩm
router.put("/:id", validateProduct, updateProduct);

// DELETE /api/products/:id - xóa sản phẩm
router.delete("/:id", deleteProduct);

module.exports = router;
