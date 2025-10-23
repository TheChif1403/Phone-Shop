document.addEventListener("DOMContentLoaded", async() => {
    const token = localStorage.getItem("token");
    const cartContainer = document.getElementById("cartContainer");
    const cartSummary = document.getElementById("cartSummary");

    if (!token) {
        cartContainer.innerHTML = `<p class="cart-empty">Vui lòng đăng nhập để xem giỏ hàng.</p>`;
        return;
    }

    try {
        // ✅ 1. Lấy thông tin người dùng
        const userRes = await fetch("/api/auth/me", {
            headers: { "Authorization": "Bearer " + token }
        });
        const user = await userRes.json();

        // ✅ 2. Lấy giỏ hàng
        const res = await fetch("/api/cart", {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) {
            cartContainer.innerHTML = `<p class="cart-empty">Không thể tải giỏ hàng.</p>`;
            return;
        }

        const cart = await res.json();
        const items = cart.items || [];

        if (items.length === 0) {
            cartContainer.innerHTML = `<p class="cart-empty">Giỏ hàng của bạn đang trống.</p>`;
            cartSummary.innerHTML = "";
            return;
        }

        // ✅ 3. Render danh sách sản phẩm
        cartContainer.innerHTML = items.map(item => `
            <div class="product-row d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" width="70" class="me-3">
                    <div>
                        <h6>${item.name}</h6>
                        <p class="mb-0 text-muted">${item.price.toLocaleString()}₫</p>
                    </div>
                </div>
                <div>
                    <span>Số lượng: ${item.quantity}</span>
                </div>
            </div>
        `).join("");

        // ✅ 4. Render tổng tiền + thông tin người dùng + địa chỉ + thanh toán
        const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

        cartSummary.innerHTML = `
            <h5>Tổng tiền</h5>
            <p><strong>${total.toLocaleString()}₫</strong></p>

            <div class="checkout-info">
                <h6>Thông tin giao hàng</h6>
                <p><strong>Họ và tên:</strong> ${user.lastname || ""} ${user.firstname || ""}</p>
                <p><strong>Số điện thoại:</strong> ${user.phone || ""}</p>

                <label>Địa chỉ giao hàng:</label>
                <input type="text" id="addressInput" class="form-control mb-2" placeholder="Nhập địa chỉ của bạn" required>

                <label>Phương thức thanh toán:</label>
                <select id="paymentMethod" class="form-control mb-3">
                    <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                    <option value="bank">Chuyển khoản ngân hàng</option>
                    <option value="momo">Ví MoMo</option>
                </select>

                <button id="checkoutBtn" class="btn btn-primary w-100">Thanh toán</button>
            </div>
        `;

        // ✅ 5. Xử lý khi nhấn nút Thanh toán
        document.getElementById("checkoutBtn").addEventListener("click", async() => {
            const address = document.getElementById("addressInput").value.trim();
            const paymentMethod = document.getElementById("paymentMethod").value;

            if (!address) {
                alert("Vui lòng nhập địa chỉ giao hàng!");
                return;
            }

            alert(`Đặt hàng thành công!\nPhương thức: ${paymentMethod}\nTổng tiền: ${total.toLocaleString()}₫`);

            // ✅ TODO: Gửi dữ liệu lên backend để lưu đơn hàng, sau đó xóa giỏ hàng nếu cần.
        });

    } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        cartContainer.innerHTML = `<p class="cart-empty">Lỗi tải dữ liệu.</p>`;
    }
});