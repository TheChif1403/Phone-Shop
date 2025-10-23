// frontend/js/giohang.js
document.addEventListener("DOMContentLoaded", function() {
    (async function() {
        const token = localStorage.getItem("token");
        const cartContainer = document.getElementById("cartContainer");
        const cartSummary = document.getElementById("cartSummary");

        if (!token) {
            cartContainer.innerHTML = `<p class="cart-empty">Vui lòng đăng nhập để xem giỏ hàng.</p>`;
            return;
        }

        let items = [];
        let user = {};

        // 1️⃣ Lấy thông tin người dùng
        try {
            const userRes = await fetch("/api/auth/me", {
                headers: { Authorization: "Bearer " + token }
            });
            if (userRes.ok) {
                user = await userRes.json();
            }
        } catch (err) {
            console.error("Lỗi lấy user:", err);
        }

        // 2️⃣ Lấy giỏ hàng từ backend
        async function fetchCart() {
            try {
                const res = await fetch("/api/cart", {
                    headers: { Authorization: "Bearer " + token }
                });
                if (!res.ok) throw new Error("Không thể tải giỏ hàng.");
                const cart = await res.json();
                items = cart.items || [];
                renderCart();
            } catch (err) {
                console.error(err);
                cartContainer.innerHTML = `<p class="cart-empty">Lỗi tải giỏ hàng.</p>`;
            }
        }

        // 3️⃣ Render giỏ hàng
        function renderCart() {
            if (items.length === 0) {
                cartContainer.innerHTML = `<p class="cart-empty">Giỏ hàng của bạn đang trống.</p>`;
                cartSummary.innerHTML = "";
                return;
            }

            cartContainer.innerHTML = items.map(function(item) {
                return `
                    <div class="product-row d-flex align-items-center justify-content-between mb-3" data-id="${item.productId}">
                        <div class="d-flex align-items-center">
                            <img src="${item.image}" alt="${item.name}" width="70" class="me-3">
                            <div>
                                <h6>${item.name}</h6>
                                <p class="mb-0 text-muted">${item.price.toLocaleString()}₫</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-secondary decrease-btn me-1">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="btn btn-sm btn-secondary increase-btn ms-1">+</button>
                            <button class="btn btn-sm btn-danger ms-2 delete-btn">Xóa</button>
                        </div>
                    </div>
                `;
            }).join("");

            const total = items.reduce(function(sum, i) {
                return sum + i.price * i.quantity;
            }, 0);

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
        }

        // 4️⃣ Cập nhật backend (cập nhật số lượng hoặc xóa sản phẩm)
        async function updateBackend(productId, quantity) {
            try {
                if (quantity <= 0) {
                    // Xóa sản phẩm
                    await fetch("/api/cart/remove/" + productId, {
                        method: "DELETE",
                        headers: { Authorization: "Bearer " + token }
                    });
                } else {
                    // Cập nhật số lượng
                    await fetch("/api/cart/update/" + productId, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token
                        },
                        body: JSON.stringify({ quantity: quantity })
                    });
                }
            } catch (err) {
                console.error("Lỗi cập nhật giỏ hàng:", err);
            }
        }

        // 5️⃣ Event delegation cho + / - / Xóa
        cartContainer.addEventListener("click", async function(e) {
            const row = e.target.closest(".product-row");
            if (!row) return;
            const productId = row.dataset.id;
            const index = items.findIndex(function(i) { return i.productId === productId; });
            if (index === -1) return;

            if (e.target.classList.contains("increase-btn")) {
                items[index].quantity++;
                await updateBackend(productId, items[index].quantity);
            }

            if (e.target.classList.contains("decrease-btn")) {
                items[index].quantity--;
                let qty = 0;
                if (items[index].quantity > 0) {
                    qty = items[index].quantity;
                } else {
                    items.splice(index, 1);
                }
                await updateBackend(productId, qty);
            }

            if (e.target.classList.contains("delete-btn")) {
                items.splice(index, 1);
                await updateBackend(productId, 0);
            }

            renderCart();
        });

        // 6️⃣ Thanh toán
        cartSummary.addEventListener("click", async function(e) {
            if (e.target.id === "checkoutBtn") {
                const total = items.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
                const address = document.getElementById("addressInput").value.trim();
                const paymentMethod = document.getElementById("paymentMethod").value;

                if (!address) {
                    alert("Vui lòng nhập địa chỉ giao hàng!");
                    return;
                }

                alert("Đặt hàng thành công!\nPhương thức: " + paymentMethod + "\nTổng tiền: " + total.toLocaleString() + "₫");

                // TODO: gửi backend lưu đơn hàng, sau đó xóa giỏ hàng nếu muốn
            }
        });

        // 7️⃣ Fetch giỏ hàng lần đầu
        fetchCart();
    })();
});