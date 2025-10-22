// const express = require("express");
// const router = express.Router();
// const {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productController");

// // POST /api/products - thêm sản phẩm mới
// router.post("/", createProduct);

// // GET /api/products - lấy danh sách sản phẩm
// router.get("/", getProducts);

// // GET /api/products/:id - lấy chi tiết 1 sản phẩm
// router.get("/:id", getProductById);

// // PUT /api/products/:id - cập nhật sản phẩm
// router.put("/:id", updateProduct);

// // DELETE /api/products/:id - xóa sản phẩm
// router.delete("/:id", deleteProduct);

// module.exports = router;


const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET tất cả sản phẩm, có thể filter theo brand hoặc category
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.category) filter.category = req.query.category;

    const products = await Product.find(filter);
    res.json(products); // trả về JSON cho client
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm từ MongoDB" });
  }
});

// GET sản phẩm theo id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm" });
  }
});

// Lấy chi tiết 1 sản phẩm theo id
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json(product);
    } catch (err) {
        next(err);
    }
});


module.exports = router;
