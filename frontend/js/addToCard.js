
function addToCart(name, image, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Kiểm tra nếu sản phẩm đã tồn tại thì tăng số lượng
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, image, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelector('.cart-count').innerText = cart.reduce((total, item) => total + item.quantity, 0);
}
function updateCartCount() {
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let count = cart.reduce((sum, item) => sum + item.quantity, 0);
let cartCount = document.querySelector('.cart-count');
if (cartCount) cartCount.innerText = count;
}

window.onload = function() {
updateCartCount(); // Gọi khi trang load xong
}