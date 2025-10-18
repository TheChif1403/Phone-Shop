document
  .getElementById("registrationForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const userData = {
      lastname: document.getElementById("Lastname").value.trim(),
      firstname: document.getElementById("Firstname").value.trim(),
      username: document.getElementById("Username").value.trim(),
      password: document.getElementById("Password").value.trim(),
      email: document.getElementById("Email").value.trim(),
      phone: document.getElementById("Phone").value.trim(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(" Đăng ký thành công!");
        document.querySelector(".success-alert").style.display = "block";
        this.reset();
      } else {
        alert("⚠️ Lỗi: " + data.message);
      }
    } catch (err) {
      console.error(" Lỗi:", err);
      alert("Không thể kết nối đến server!");
    }
  });
