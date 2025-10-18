const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra có header Authorization hay không
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Không có token, truy cập bị từ chối!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Giải mã token bằng JWT secret trong .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng vào req để dùng ở các route khác
    next(); // Cho phép đi tiếp
  } catch (error) {
    console.error("❌ Lỗi xác thực token:", error);
    res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

module.exports = authMiddleware;
