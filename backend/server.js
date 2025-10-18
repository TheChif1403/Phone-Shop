// ✅ Đọc biến môi trường từ file .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const Order = require('./models/Order');
const connectDB = require('./config/dashboard');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// 🧩 Kết nối MongoDB
connectDB();

//  Tạo admin sau khi khởi động
const bcrypt = require('bcryptjs');
const User = require('./models/User');

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

// Gọi hàm này ngay sau khi kết nối DB
connectDB().then(seedAdmin);


// ⚙️ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚙️ Cấu hình view engine EJS (dùng cho dashboard)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ⚙️ Kết nối Spring Boot nếu có
const SPRING_URL = process.env.SPRING_URL || 'http://localhost:8082/api';

// ======================= 🟢 CÁC API CHÍNH ========================

// Tài khoản (đăng ký, đăng nhập)
app.use('/api/auth', authRoutes);

// Quản lý sản phẩm
app.use('/api/products', productRoutes);

// Đơn hàng
app.use('/api/orders', orderRoutes);

// ======================= ADMIN ============================

app.get('/admin', (req, res) => {
    res.render('admin'); // sẽ tự load views/admin.ejs
});


// ======================= 📊 DASHBOARD ============================

// Dashboard tổng quan (hiển thị bằng EJS)
app.get('/dashboard', async(req, res) => {
    try {
        // Gọi API Spring Boot nếu có
        let summary = {};
        try {
            const response = await axios.get(`${SPRING_URL}/dashboard/summary`);
            summary = response.data;
        } catch (err) {
            console.warn('⚠️ Không kết nối được Spring Boot, dùng dữ liệu MongoDB local.');
        }

        // Dữ liệu nội bộ từ MongoDB
        const totalOrders = await Order.countDocuments();
        const totalRevenueAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalRevenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        res.render('dashboard', {
            data: { totalOrders, totalRevenue, recentOrders, summary }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi khi lấy dữ liệu dashboard!");
    }
});

// ======================= 🧪 TẠO DỮ LIỆU MẪU =====================

app.get('/seed', async(req, res) => {
    await Order.deleteMany({});
    await Order.insertMany([
        { customerName: 'Nguyễn Văn A', total: 2500000, status: 'Đã giao' },
        { customerName: 'Trần Thị B', total: 1200000, status: 'Đang xử lý' },
        { customerName: 'Lê Văn C', total: 3000000, status: 'Hủy' },
        { customerName: 'Ngô Thị D', total: 1800000, status: 'Đã giao' },
    ]);
    res.send('✅ Đã tạo dữ liệu mẫu!');
});

// ======================= ⚙️ KHỞI ĐỘNG SERVER =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));