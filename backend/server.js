// // const express = require("express");
// // const dotenv = require("dotenv");
// // const connectDB = require("./config/db");
// // const cors = require("cors");

// // // Load biến môi trường từ file .env
// // dotenv.config();

// // // Kết nối MongoDB
// // connectDB();

// // // Khởi tạo app
// // const app = express();

// // // Middleware
// // app.use(express.json()); // để đọc JSON body
// // app.use(cors()); // cho phép frontend React gọi API

// // // Routes
// // app.use("/api/auth", require("./routes/auth"));
// // app.use("/api/products", require("./routes/products"));
// // app.use("/api/orders", require("./routes/orders")); //

// // // Middleware xử lý lỗi
// // const errorHandler = require("./middleware/errorHandler");
// // app.use(errorHandler);

// // // Khởi động server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`Server chạy tại http://localhost:${PORT}`);
// // });



// const express = require('express');
// const cors = require('cors');
// const app = express();

// // Cho phép truy cập từ frontend
// app.use(cors());

// // Cho phép lấy ảnh trong thư mục imgs
// app.use('/images', express.static(__dirname + '/imgs'));

// // API sản phẩm
// app.get('/api/products', (req, res) => {
//   const products = [
//     // {
//     //   id: 1,
//     //   name: 'iPhone 15 Pro Max',
//     //   price: 33990000,
//     //   brand: 'Apple',
//     //   image: 'http://localhost:5000/images/17air.jpg'
//     // },
//     // {
//     //   id: 2,
//     //   name: 'Samsung Galaxy S24 Ultra',
//     //   price: 29990000,
//     //   brand: 'Samsung',
//     //   image: 'http://localhost:5000/images/17.jpg'
//     // }

     
//   {
//     "id": "1",
//     "name": "iPhone 17 Pro Max 256GB | Chính hãng VNA",
//     "brand": "Apple",
//     "price": 37990000,
//     "stock": 100,
//     "description": "Màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ, khung titanium cao cấp.",
//     "image": "http://127.0.0.1:5500/frontend/img/dienthoai/dienthoai/apple/17pro.jpg",
//     "category": "Smartphone"
//   },
//   {
//     "id": "2",
//     "name": "iPhone 17 Air 256GB | Chính hãng VNA",
//     "brand": "Apple",
//     "price": 31990000,
//     "stock": 100,
//     "description": "Màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ, khung titanium cao cấp.",
//     "image": "http://127.0.0.1:5500/frontend/img/dienthoai/dienthoai/apple/17air.jpg",
//     "category": "Smartphone"
//   },
//   {
//     "id": "3",
//     "name": "iPhone 17 256GB | Chính hãng VNA",
//     "brand": "Apple",
//     "price": 25990000,
//     "stock": 200,
//     "description": "Màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ, khung titanium cao cấp.",
//     "image": "http://127.0.0.1:5500/frontend/img/dienthoai/dienthoai/apple/17.jpg",
//     "category": "Smartphone"
//   },
//   {
//     "id": "4",
//     "name": "iPhone 16 Pro Max 256GB | Chính hãng VNA",
//     "brand": "Apple",
//     "price": 21990000,
//     "stock": 100,
//     "description": "Màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ, khung titanium cao cấp.",
//     "image": "http://127.0.0.1:5500/frontend/img/dienthoai/dienthoai/apple/16promax.jpg",
//     "category": "Smartphone"
//   }









//   ];
//   res.json(products);
// });

// app.listen(5000, () => {
//   console.log('✅ Server đang chạy tại http://localhost:5000');
// });


// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(cors());

// // API trả về danh sách sản phẩm
// app.get('/api/products', (req, res) => {
//   const filePath = path.join(__dirname, 'data', 'products.json');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) return res.status(500).json({ message: 'Lỗi đọc file JSON' });
//     res.json(JSON.parse(data));
//   });
// });

// app.listen(5000, () => console.log('✅ Backend chạy tại http://localhost:5000'));




// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(cors());

// app.get('/api/products', (req, res) => {
//   const filePath = path.join(__dirname, 'data', 'products.json');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) return res.status(500).json({ message: 'Lỗi đọc file JSON' });

//     let products = JSON.parse(data);

//     // Nếu có ?from=1&to=5 thì lọc sản phẩm trong khoảng
//     const from = parseInt(req.query.from);
//     const to = parseInt(req.query.to);
//     if (!isNaN(from) && !isNaN(to)) {
//       products = products.filter(p => p.id >= from && p.id <= to);
//     }

//     res.json(products);
//   });
// });

// app.listen(5000, () => console.log('✅ Backend chạy tại http://localhost:5000'));



const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

app.get('/api/products', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'products.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Lỗi đọc file JSON' });

    let products = JSON.parse(data);

    // Lọc theo id (from, to)
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);
    if (!isNaN(from) && !isNaN(to)) {
      products = products.filter(p => p.id >= from && p.id <= to);
    }

    // Lọc theo hãng (brand)
    const brand = req.query.brand;
    if (brand) {
      products = products.filter(p => 
        p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    res.json(products);
  });
});

app.listen(5000, () => console.log('✅ Backend chạy tại http://localhost:5000'));
