// backend/server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // đọc JSON từ body

// Kết nối MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(" Kết nối MongoDB thành công"))
    .catch((err) => console.error(" Lỗi kết nối MongoDB:", err));

// Import routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

// Dùng routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

async function seedAdmin() {
    const exist = await User.findOne({ email: 'admin@gmail.com' });
    if (!exist) {
        const hash = await bcrypt.hash('123456', 10);
        await User.create({
            username: 'Admin',
            email: 'admin@gmail.com',
            password: hash,
            role: 'admin',
        });
        console.log('✅ Đã tạo admin mặc định: admin@gmail.com / 123456'); // tài khoản và mk
    } else {
        console.log('ℹ️ Admin đã tồn tại, bỏ qua tạo mới.');
    }
}

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(` Server chạy tại http://localhost:${PORT}`)
);