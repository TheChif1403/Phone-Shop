const Product = require("../models/Product");
const StockHistory = require("../models/StockHistory");

exports.getProductsPage = async(req, res) => {
    try {
        const products = await Product.find();
        const stockHistory = await StockHistory.find()
            .populate('productId')
            .sort({ createdAt: -1 });

        // Truyền dữ liệu trực tiếp vào EJS
        res.render('layout', {
            page: 'products',
            pageTitle: 'Quản lý sản phẩm | Admin',
            products,
            stockHistory,
            contentPage: 'products' // tên file content nằm trong views/
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};
// POST /api/products - Thêm sản phẩm mới
exports.createProduct = async(req, res) => {
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
            price: Number(price),
            brand,
            description,
            category,
            image,
            stock: Number(stock),
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
exports.getProducts = async(req, res) => {
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
exports.getProductById = async(req, res) => {
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
exports.updateProduct = async(req, res) => {
    try {
        const { name, price, description, category, image, stock } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        // Chuyển stock sang Number
        const newStock = Number(stock);
        const stockChange = newStock - product.stock;

        // Cập nhật sản phẩm
        product.name = name;
        product.price = Number(price);
        product.description = description;
        product.category = category;
        product.image = image;
        product.stock = newStock;

        await product.save();

        // Lưu lịch sử thay đổi tồn kho
        if (stockChange !== 0) {
            await StockHistory.create({
                productId: product._id,
                change: stockChange,
                reason: stockChange > 0 ? "Nhập hàng" : "Xuất hàng"
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
    }
};

// DELETE /api/products/:id - Xóa sản phẩm
exports.deleteProduct = async(req, res) => {
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
// GET /api/products/history - Lấy lịch sử nhập kho
exports.getStockHistory = async(req, res) => {
    try {
        const { productId } = req.query;
        let query = {};
        if (productId) query.productId = productId;
        const history = await StockHistory.find(query)
            .populate("productId", "name")
            .sort({ createdAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy lịch sử kho", error: error.message });
    }
};