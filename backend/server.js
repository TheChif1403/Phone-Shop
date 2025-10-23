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
const cartRoutes = require("./routes/cart");

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

// ===== CHẠY SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
