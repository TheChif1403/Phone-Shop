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
                // Chuẩn bị object user để lưu localStorage
                const userData = {
                    _id: data.user.id, // ID thực từ backend
                    firstname: data.user.firstname,
                    lastname: data.user.lastname,
                    username: data.user.username,
                    phone: data.user.phone || "" // nếu không có, để trống
                };

                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", data.token);

                alert("Đăng nhập thành công!");
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 1500);
            } else {
                alert("Thất bại " + data.message);
            }

        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            alert("Không thể kết nối đến server!");
        }
    });