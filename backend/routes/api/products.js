// routes/api/product.js
import express from "express";
import Product from "../../models/Product.js"; // MongoDB model
const router = express.Router();

// GET /api/products - Lấy tất cả sản phẩm
router.get("/", async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
    }
});

// GET /api/products/:id - Lấy 1 sản phẩm theo id
router.get("/:id", async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm" });
    }
});

// POST /api/products - Thêm sản phẩm mới
router.post("/", async(req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error: error.message });
    }
});

// PUT /api/products/:id - Cập nhật sản phẩm
router.put("/:id", async(req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
    }
});

// DELETE /api/products/:id - Xóa sản phẩm
router.delete("/:id", async(req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
    }
});

export default router;