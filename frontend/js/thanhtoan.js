document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("checkoutItems");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("totalAmount");

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-muted">Giỏ hàng của bạn trống.</p>`;
        subtotalEl.textContent = "0₫";
        totalEl.textContent = "0₫";
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        return `
      <div class="d-flex align-items-center justify-content-between border-bottom py-3">
        <div class="d-flex align-items-center">
          <img src="${item.image}" alt="${item.name}" width="60" class="me-3 rounded">
          <div>
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">Số lượng: ${item.quantity}</small>
          </div>
        </div>
        <div class="fw-semibold text-danger">${total.toLocaleString()}₫</div>
      </div>
    `;
    }).join("");

    const shipping = 30000;
    subtotalEl.textContent = subtotal.toLocaleString() + "₫";
    totalEl.textContent = (subtotal + shipping).toLocaleString() + "₫";
});