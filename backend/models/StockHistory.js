const mongoose = require("mongoose");

const StockHistorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    change: { type: Number, required: true },
    reason: { type: String, required: true }, // Nhập hàng / Xuất hàng
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StockHistory", StockHistorySchema);