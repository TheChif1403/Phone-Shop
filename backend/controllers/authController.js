const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Đăng ký (cho phép chọn role)
exports.register = async(req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Thiếu thông tin" });
        }

        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ msg: "Email đã tồn tại" });
        }

        const hash = await bcrypt.hash(password, 10);
        // Nếu không gửi role → mặc định là user
        const newUser = new User({ username, email, password: hash, role: role || "user" });
        await newUser.save();

        // Tạo token chứa role
        const token = jwt.sign({ id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        res.json({
            msg: "Đăng ký thành công",
            token,
            user: { id: newUser._id, username, email, role: newUser.role },
        });
    } catch (err) {
        console.error("Lỗi register:", err);
        res.status(500).json({ msg: "Lỗi server" });
    }
};

// Đăng nhập
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ msg: "Thiếu thông tin" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Email không tồn tại" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Sai mật khẩu" });

        // Token chứa cả role (để backend biết có quyền admin không)
        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        res.json({
            msg: "Đăng nhập thành công",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role, // thêm role vào để frontend biết quyền
            },
        });
    } catch (err) {
        console.error("Lỗi login:", err);
        res.status(500).json({ msg: "Lỗi server" });
    }
};