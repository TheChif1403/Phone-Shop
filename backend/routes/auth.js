const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

// POST /api/auth/register
router.post("/register", async(req, res) => {
    try {
        const { lastname, firstname, username, password, email, phone } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
        }

        const newUser = new User({
            lastname,
            firstname,
            username,
            password, // ⚠️ Nên mã hóa bằng bcrypt trong thực tế
            email,
            phone,
        });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công", user: newUser });
    } catch (err) {
        console.error("Lỗi khi đăng ký:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// POST /api/auth/login
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;

        // Tìm user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại" });
        }

        // Kiểm tra mật khẩu (chưa mã hóa)
        if (user.password !== password) {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }

        // ✅ Tạo JWT Token
        const token = jwt.sign({ id: user._id, username: user.username },
            process.env.JWT_SECRET, { expiresIn: "2h" } // thời hạn 2 tiếng
        );

        res.json({
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
            },
        });
    } catch (err) {
        console.error("Lỗi khi đăng nhập:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Lấy thông tin user từ token
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        res.json(user);
    } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;
