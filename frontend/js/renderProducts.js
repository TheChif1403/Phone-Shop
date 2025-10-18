/**
 * File: ../js/renderProducts.js
 * Chức năng: Tải và hiển thị danh sách sản phẩm (Đã loại bỏ Brand Tag trên ảnh).
 */

// Hàm chính để tải và render sản phẩm
async function renderProducts(containerId = 'product-list', from, to, brand) {
    try {
        let url = 'http://localhost:5000/api/products';
        const params = [];

        // Thêm tham số lọc (nếu có)
        if (from && to) params.push(`from=${from}&to=${to}`);
        if (brand) params.push(`brand=${encodeURIComponent(brand)}`);

        if (params.length > 0) url += `?${params.join('&')}`;

        const res = await fetch(url);
        const products = await res.json();

        const container = document.getElementById(containerId);
        if (!container) return;

        // Xóa nội dung cũ trước khi render sản phẩm mới
        container.innerHTML = '';

        // Render từng sản phẩm
        container.innerHTML = products.map(p => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4"> 
                <div class="card product-card h-100 position-relative">
                    
                    <div class="product-image-container">
                        <img src="${p.image}" class="card-img-top product-img" alt="${p.name}">
                    </div>
                    <div class="product-info d-flex flex-column">
                        <h5 class="product-title">${p.name}</h5>
                        <div class="product-rating">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i>
                            <i class="fas fa-star"></i><i class="fas fa-star"></i>
                            <i class="far fa-star"></i>
                        </div>
                        
                        <div class="mt-auto"> 
                            <span class="product-price">${p.price.toLocaleString('vi-VN')}₫</span>
                            <button class="btn btn-product mt-2"
                                onclick="addToCart('${p.id}', '${p.name}', '${p.image}', ${p.price})">
                                <i class="fas fa-shopping-cart me-1"></i> THÊM VÀO GIỎ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('⚠️ Lỗi khi tải dữ liệu sản phẩm:', err);
    }
}

// Hàm khởi tạo và xử lý điều hướng
document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop();
    let brandToRender = null;
    let fromIndex = null;
    let toIndex = null;

    // Ánh xạ file HTML sang tên Brand hoặc Lọc Index
    if (page.includes('home.html')) {
        fromIndex = 1;
        toIndex = 8;
    } else if (page.includes('apple.html')) {
        brandToRender = 'Apple';
    } else if (page.includes('samsung.html')) {
        brandToRender = 'Samsung';
    } else if (page.includes('vivo.html')) {
        brandToRender = 'Vivo';
    } else if (page.includes('honor.html')) {
        brandToRender = 'Honor';
    } else if (page.includes('oppo.html')) {
        brandToRender = 'OPPO';
    } else if (page.includes('xiaomi.html')) {
        brandToRender = 'Xiaomi';
    } else if (page.includes('techno.html')) {
        brandToRender = 'Tecno';
    } else if (page.includes('phukien.html')) {
        brandToRender = 'Phukien';
    }

    // Gọi hàm render với tham số tương ứng
    renderProducts('product-list', fromIndex, toIndex, brandToRender);
});