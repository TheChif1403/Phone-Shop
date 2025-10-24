const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

exports.renderDashboard = async(req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "firstname lastname")
            .populate("products.productId", "name price");

        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const totalOrders = orders.length;
        const totalCustomers = new Set(
            orders.map(o => o.userId && o.userId._id ? o.userId._id.toString() : null)
        ).size;

        const recentOrders = orders
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5);

        const products = await Product.find();
        const topProducts = products
            .map(p => ({
                name: p.name,
                quantity: p.sold || 0,
                revenue: (p.sold || 0) * (p.price || 0),
                stock: p.stock || 0
            }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        // Truyền dữ liệu vào EJS
        res.render("dashboard", {
            page: 'dashboard',
            pageTitle: 'Dashboard | Admin',
            totalRevenue,
            totalOrders,
            totalCustomers,
            recentOrders,
            topProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi load dashboard: " + error.message);
    }
};