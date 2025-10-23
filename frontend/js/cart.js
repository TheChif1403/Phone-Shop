// frontend/js/cart.js
function getToken() { return localStorage.getItem('token'); }
async function requireLogin() {
    if (!getToken()) {
        alert('Vui lòng đăng nhập để xem giỏ hàng');
        window.location.href = '/html/dangnhap.html';
        return false;
    }
    return true;
}

async function loadCart() {
    if (!await requireLogin()) return;
    const res = await fetch('/api/cart', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    if (!res.ok) {
        alert('Lỗi khi lấy giỏ hàng');
        return;
    }
    const cart = await res.json();
    renderCart(cart);
}

function renderCart(cart) {
    const container = document.getElementById('cartContainer');
    const summaryEl = document.getElementById('cartSummary');
    const items = cart.items || [];

    if (items.length === 0) {
        container.innerHTML = `<div class="cart-empty"><p>Giỏ hàng trống</p><a href="/html/home.html" class="btn btn-primary">Tiếp tục mua</a></div>`;
        summaryEl.innerHTML = '';
        return;
    }

    container.innerHTML = items.map(i => `
    <div class="row product-row mb-3">
      <div class="col-2"><img src="${i.image || ''}" style="max-width:100%; height:70px; object-fit:cover"></div>
      <div class="col-4"><strong>${i.name || ''}</strong></div>
      <div class="col-2">${Number(i.price).toLocaleString('vi-VN')}₫</div>
      <div class="col-2 d-flex align-items-center">
        <button class="btn btn-sm btn-outline-secondary qty-btn" onclick="changeQty('${i.productId}', ${i.quantity - 1})">-</button>
        <div class="px-2">${i.quantity}</div>
        <button class="btn btn-sm btn-outline-secondary qty-btn" onclick="changeQty('${i.productId}', ${i.quantity + 1})">+</button>
      </div>
      <div class="col-2">${(i.price * i.quantity).toLocaleString('vi-VN')}₫</div>
    </div>
  `).join('');

    const total = items.reduce((s, it) => s + (it.price * it.quantity), 0);
    summaryEl.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <h4>Tổng: ${total.toLocaleString('vi-VN')}₫</h4>
      <div>
        <button class="btn btn-secondary me-2" onclick="window.location.href='/html/home.html'">Tiếp tục mua</button>
        <button class="btn btn-primary" onclick="checkout()">Thanh toán</button>
      </div>
    </div>
  `;
}

async function changeQty(productId, newQty) {
    if (!await requireLogin()) return;
    const res = await fetch(`/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({ quantity: newQty })
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({ message: 'Lỗi' }));
        alert(data.message || 'Lỗi khi cập nhật');
        return;
    }
    await loadCart();
    // update header badge if present
    if (window.updateCartBadge) updateCartBadge();
}

async function checkout() {
    if (!await requireLogin()) return;
    const res = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await res.json();
    if (res.ok) {
        alert('Đặt hàng thành công!');
        // reload cart (sẽ trống)
        await loadCart();
        if (window.updateCartBadge) updateCartBadge();
        // redirect to orders page or home
        window.location.href = '/html/home.html';
    } else {
        alert(data.message || 'Lỗi khi đặt hàng');
    }
}

// gọi load khi page ready
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});