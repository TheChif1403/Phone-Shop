const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); // model Product đã tạo

dotenv.config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Kết nối MongoDB thành công'))
.catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

const filePath = path.join(__dirname, 'data', 'products.json');

fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) return console.error('❌ Lỗi đọc file JSON:', err);

    try {
        const products = JSON.parse(data);

        // Xóa hết dữ liệu cũ nếu muốn
        await Product.deleteMany({});
        console.log('🗑️  Xóa dữ liệu cũ thành công');

        // Thêm dữ liệu mới
        await Product.insertMany(products);
        console.log('✅ Thêm dữ liệu JSON vào MongoDB thành công');

        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Lỗi khi thêm dữ liệu:', error);
    }
});
