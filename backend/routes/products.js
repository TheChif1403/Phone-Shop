const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET tất cả sản phẩm
router.get("/", async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy sản phẩm" });
    }
});

// GET sản phẩm theo id
router.get("/:id", async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy sản phẩm" });
    }
});

// POST thêm sản phẩm
router.post("/", async(req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Lỗi thêm sản phẩm" });
    }
});

// PUT sửa sản phẩm
router.put("/:id", async(req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Lỗi cập nhật sản phẩm" });
    }
});

// DELETE xóa sản phẩm
router.delete("/:id", async(req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json({ message: "Xóa sản phẩm thành công" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi xóa sản phẩm" });
    }
});

module.exports = router;