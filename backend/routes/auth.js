// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// test
router.get("/test", (req, res) => {
  res.json({ msg: "Auth route OK" });
});

// đăng ký
router.post("/register", register);

// đăng nhập
router.post("/login", login);

module.exports = router;
