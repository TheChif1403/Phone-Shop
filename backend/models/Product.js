// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   brand: String,
//   price: Number,
//   stock: Number,
//   description: String,
//   image: String,
//   category: String
// }, { timestamps: true });

// module.exports = mongoose.model("Product", productSchema);


const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  price: Number,
  stock: Number,
  description: String,
  image: String,
  category: String
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
