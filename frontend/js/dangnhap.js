document
    .getElementById("loginForm")
    .addEventListener("submit", async function(e) {
        e.preventDefault();

        // Lấy giá trị từ form
        const username = document.getElementById("Username").value.trim();
        const password = document.getElementById("Password").value.trim();

        // Kiểm tra rỗng
        if (!username) {
            document.getElementById("UsernameError").style.display = "block";
        } else {
            document.getElementById("UsernameError").style.display = "none";
        }

        if (!password) {
            document.getElementById("PasswordError").style.display = "block";
        } else {
            document.getElementById("PasswordError").style.display = "none";
        }

        if (!username || !password) return;

        try {
            // Gửi dữ liệu tới backend
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Nếu đăng nhập thành công
                alert(" Đăng nhập thành công!");
                document.querySelector(".success-alert").style.display = "block";

                // Lưu user vào localStorage (nếu cần dùng sau)
                localStorage.setItem("user", JSON.stringify(data.user));
                // lưu sản phẩm được thêm vào giỏ hàng trong mongoDB vào local
                localStorage.setItem("token", data.token);

                // Chuyển hướng sang trang chủ
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 1500);
            } else {
                //  Nếu sai tài khoản hoặc mật khẩu
                alert("Thất bại " + data.message);
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            alert("Không thể kết nối đến server!");
        }
    });