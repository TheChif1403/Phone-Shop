// ../js/global-support.js (Đã cập nhật)

document.addEventListener("DOMContentLoaded", function() {

    // ==========================================================
    // ===== BẮT ĐẦU: CODE KIỂM TRA ĐĂNG NHẬP (ĐÃ SỬA) =====
    // ==========================================================

    // 1. Lấy chuỗi JSON của user từ localStorage
    const userJson = localStorage.getItem('user');

    // 2. Tìm đến khu vực chứa nút "Đăng nhập/Đăng ký"
    const authButtonsDiv = document.querySelector('.top-bar .auth-buttons');

    if (userJson && authButtonsDiv) {
        try {
            // 3. Nếu ĐÃ đăng nhập:

            // 3.1. Chuyển chuỗi JSON thành object
            const userObject = JSON.parse(userJson);

            // 3.2. Lấy username từ object đó
            // (Quan trọng: Đảm bảo server trả về key là 'username' (chữ thường))
            const username = userObject.username;

            if (username) {
                // 3.3. Tạo HTML cho icon tài khoản mới
                const accountIconHTML = `
                    <a href="taikhoan.html" class="btn btn-account" title="Tài khoản của tôi">
                        <i class="fas fa-user-circle me-1"></i>
                        Chào, ${username}
                    </a>
                `;

                // 3.4. Thay thế nút "Đăng nhập/Đăng ký"
                authButtonsDiv.innerHTML = accountIconHTML;
            } else {
                console.error("Không tìm thấy 'username' trong user object đã lưu.");
            }

        } catch (e) {
            console.error("Lỗi khi parse user JSON từ localStorage:", e);
            // Nếu JSON lỗi, xóa nó đi để tránh lỗi lặp lại
            localStorage.removeItem('user');
        }
    }
    // (Nếu 'userJson' không tồn tại, thì không làm gì, nút Đăng nhập/Đký giữ nguyên)

    // ========================================================
    // ===== KẾT THÚC: CODE KIỂM TRA ĐĂNG NHẬP =====
    // ========================================================


    // --- (Code cũ của bạn cho nút hỗ trợ) ---
    const supportButtonHTML = `
        <a href="lienhe.html" class="support-floating-button">
            <i class="fas fa-headset"></i>
            <span>Bạn cần<br>hỗ trợ?</span>
        </a>
    `;
    document.body.insertAdjacentHTML('beforeend', supportButtonHTML);

});


// ../js/global-support.js

// ===============================================
// ===== BẮT ĐẦU: HÀM XỬ LÝ WISHLIST (MỚI) =====
// ===============================================
function addToWishlist(productId, name, image, price) {
    // 1. Lấy danh sách cũ từ localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // 2. Kiểm tra xem sản phẩm đã tồn tại chưa
    const existingProduct = wishlist.find(item => item.id === productId);

    if (existingProduct) {
        alert('Sản phẩm này đã có trong danh sách yêu thích của bạn.');
    } else {
        // 3. Thêm sản phẩm mới vào danh sách
        wishlist.push({
            id: productId,
            name: name,
            image: image,
            price: price
        });

        // 4. Lưu danh sách mới lại vào localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Đã thêm "' + name + '" vào danh sách yêu thích!');

        // (Tùy chọn: Bạn có thể đổi icon trái tim thành màu đỏ tại đây)
        // Ví dụ: event.target.querySelector('i').classList.replace('far', 'fas');
    }
}
// ===============================================
// ===== KẾT THÚC: HÀM XỬ LÝ WISHLIST =====
// ===============================================


// Code cũ của bạn
document.addEventListener("DOMContentLoaded", function() {

    // (Code kiểm tra đăng nhập của bạn...)
    const userJson = localStorage.getItem('user');
    // ... (v.v.) ...


    // (Code nút hỗ trợ của bạn...)
    const supportButtonHTML = `...`;
    document.body.insertAdjacentHTML('beforeend', supportButtonHTML);
});