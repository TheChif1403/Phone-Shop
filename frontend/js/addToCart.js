// frontend/js/addToCart.js

// Lấy token từ localStorage (bạn lưu token khi login)
function getToken() {
    return localStorage.getItem('token'); // đảm bảo login lưu token ở key 'token'
}

async function addToCart(productId, name, image, price) {
    const token = getToken();
    if (!token) {
        // chưa login => chuyển tới trang login
        alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
        window.location.href = '/html/dangnhap.html'; // hoặc đúng đường dẫn login của bạn
        return;
    }

    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ productId, name, image, price, quantity: 1 })
        });

        const data = await res.json();
        if (res.ok) {
            updateCartBadge(); // cập nhật badge
            // thông báo nhỏ
            const msg = data.message || 'Đã thêm vào giỏ hàng';
            // bạn có thể dùng toast; tạm alert:
            alert(msg);
        } else {
            alert(data.message || 'Lỗi khi thêm giỏ');
            if (res.status === 401) {
                window.location.href = '/html/dangnhap.html';
            }
        }
    } catch (err) {
        console.error(err);
        alert('Lỗi kết nối server');
    }
}

// Cập nhật badge hiển thị số lượng (gọi API)
async function updateCartBadge() {
    const token = getToken();
    const badgeEls = document.querySelectorAll('.cart-count, .cart-count-badge');
    if (!token) {
        badgeEls.forEach(el => el.innerText = '0');
        return;
    }

    try {
        const res = await fetch('/api/cart', { headers: { 'Authorization': 'Bearer ' + token } });
        if (!res.ok) {
            badgeEls.forEach(el => el.innerText = '0');
            return;
        }
        const cart = await res.json();
        const count = (cart.items || []).reduce((s, i) => s + i.quantity, 0);
        badgeEls.forEach(el => el.innerText = count);
    } catch (err) {
        console.error(err);
    }
}

// gọi lúc load trang
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});