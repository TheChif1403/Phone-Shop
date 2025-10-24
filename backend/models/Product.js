const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    brand: String,
    category: String,
    description: String,
    price: { type: Number, required: true },
    image: String,
    stock: Number
});

module.exports = mongoose.model('Product', ProductSchema);