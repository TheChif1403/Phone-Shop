// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/auth/register
router.post("/register", async (req, res) => {
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
      password, // ⚠️ Thực tế nên hash password (dùng bcrypt)
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
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm user trong DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    // Thực tế nên so sánh password bằng bcrypt
    if (user.password !== password) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Thành công
    res.json({
      message: "Đăng nhập thành công",
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

module.exports = router;
