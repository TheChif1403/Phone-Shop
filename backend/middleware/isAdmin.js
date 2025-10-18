// 🧩 Middleware kiểm tra quyền admin
module.exports = function(req, res, next) {
    try {
        // Nếu user chưa đăng nhập
        if (!req.user) {
            return res.status(401).json({ msg: 'Chưa xác thực người dùng' });
        }

        // Nếu user không có quyền admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Bạn không có quyền truy cập (admin only)' });
        }

        // Cho phép tiếp tục nếu là admin
        next();
    } catch (err) {
        console.error('Lỗi kiểm tra quyền admin:', err);
        res.status(500).json({ msg: 'Lỗi kiểm tra quyền truy cập' });
    }
};