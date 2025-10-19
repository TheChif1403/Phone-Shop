// // backend/server.js
// const express = require("express");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json()); // đọc JSON từ body

// // Kết nối MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log(" Kết nối MongoDB thành công"))
//   .catch((err) => console.error(" Lỗi kết nối MongoDB:", err));

// // Import routes
// const authRoutes = require("./routes/auth");
// const productRoutes = require("./routes/products");

// // Dùng routes
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);

// // Middleware xử lý lỗi
// const errorHandler = require("./middleware/errorHandler");
// app.use(errorHandler);

// // Chạy server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(` Server chạy tại http://localhost:${PORT}`)
// );

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

// ===== KẾT NỐI MONGODB =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// ===== API ĐỌC FILE JSON (nếu chưa có dữ liệu trong MongoDB) =====
app.get("/api/products", (req, res) => {
  const filePath = path.join(__dirname, "data", "products.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Lỗi đọc file JSON" });

    let products = JSON.parse(data);

    // Lọc theo id (from, to)
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);
    if (!isNaN(from) && !isNaN(to)) {
      products = products.filter((p) => p.id >= from && p.id <= to);
    }

    // Lọc theo hãng (brand)
    const brand = req.query.brand;
    if (brand) {
      products = products.filter(
        (p) => p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    res.json(products);
  });
});

// ===== IMPORT VÀ DÙNG ROUTES KHÁC (AUTH, PRODUCT) =====
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

app.use("/api/auth", authRoutes);
app.use("/api/dbproducts", productRoutes); // tránh trùng /api/products ở trên

// ===== MIDDLEWARE XỬ LÝ LỖI =====
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// ===== CHẠY SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
