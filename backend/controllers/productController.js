const Product = require("../models/Product");

// POST /api/products - Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { id, brand, name, price, description, category, image, stock } = req.body;

    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Tên và giá sản phẩm là bắt buộc" });
    }

    const product = new Product({
      id,
      name,
      price,
      brand,
      description,
      category,
      image,
      stock,
    });
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi thêm sản phẩm", error: error.message });
  }
};

// GET /api/products - Lấy tất cả sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách sản phẩm",
        error: error.message,
      });
  }
};

// GET /api/products/:id - Lấy chi tiết 1 sản phẩm
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
  }
};

// PUT /api/products/:id - Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category, image, stock },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
  }
};

// DELETE /api/products/:id - Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
  }
};
