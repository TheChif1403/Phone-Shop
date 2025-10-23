// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ===== PHỤC VỤ FRONTEND =====
app.use(express.static(path.join(__dirname, "../frontend")));

// ở chỗ import routes
const cartRoutes = require('./routes/cart'); // nếu file ở backend/routes/cart.js

// ... sau đó chỗ register routes:
app.use('/api/cart', cartRoutes);
// admin
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/admin', (req, res) => {
    res.render('admin'); // file admin.ejs
});
//delivery
app.get('/delivery', (req, res) => {
    res.render('delivery'); // file delivery.ejs
});
//dashboard
app.get('/dashboard', (req, res) => {
    res.render('dashboard'); // file dashboard.ejs
});
// ===== KẾT NỐI MONGODB =====
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Kết nối MongoDB thành công"))
    .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ===== IMPORT ROUTES =====
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

// ===== SỬ DỤNG ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/dbproducts", productRoutes); // RESTful API sản phẩm
app.use("/api/cart", cartRoutes); // Giỏ hàng

// ===== MIDDLEWARE XỬ LÝ LỖI =====
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// ===== NẾU KHÔNG TRÙNG ROUTE API NÀO, TRẢ VỀ FRONTEND =====
app.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
        const filePath = path.join(__dirname, "../frontend", req.path);
        res.sendFile(filePath, (err) => {
            if (err) res.status(404).send("❌ Không tìm thấy file yêu cầu");
        });
    } else {
        next();
    }
});
// ===== RUN SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);