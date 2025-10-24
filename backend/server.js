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
app.use(express.static(path.join(__dirname, "public")));

// ===== PHỤC VỤ FRONTEND =====
app.use(express.static(path.join(__dirname, "../frontend")));

//import cho routes dashboard
const dashboardRouter = require("./routes/dashboard");
app.use("/admin", dashboardRouter);
app.use("/dashboard", dashboardRouter); // dùng chung dashboardRouter

// ở chỗ import routes
const cartRoutes = require('./routes/cart'); // nếu file ở backend/routes/cart.js

// ... sau đó chỗ register routes:
app.use('/api/cart', cartRoutes);
app.set("view engine", "ejs");

// Routes - render each page (each EJS file includes layout)
app.get('/', (req, res) => res.redirect('/dashboard'));

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
const orderPageRoutes = require("./routes/orderPage");
const orderApiRoutes = require("./routes/orders");

app.use("/orders", orderPageRoutes); // EJS Page
app.use("/api/orders", orderApiRoutes); // API JSON

app.use("/api/orders", orderApiRoutes);
app.get('/customers', (req, res) => res.render('customers'));
app.get('/products', (req, res) => res.render('products'));
app.get('/revenue', (req, res) => res.render('revenue'));
app.get('/performance', (req, res) => res.render('performance'));
app.get('/ads', (req, res) => res.render('ads'));
app.get('/finance', (req, res) => res.render('finance'));
app.get('/settings', (req, res) => res.render('settings'));
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