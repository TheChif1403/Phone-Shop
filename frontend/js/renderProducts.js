
async function renderProducts(containerId = 'product-list', brand = null, limit = null) {
    try {
        let url = 'http://localhost:5000/api/dbproducts';
        if (brand) url += `?brand=${encodeURIComponent(brand)}`;

        const res = await fetch(url);
        let products = await res.json();

        // Lấy limit sản phẩm nếu có
        if (limit) {
            products = products.slice(0, limit);
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = products.map(p => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4"> 
                <div class="card product-card h-100 position-relative">
                    <div class="product-image-container">
                       
                        <img src="${p.image}" class="card-img-top product-img" alt="${p.name}" onclick="showProductModal('${p._id}')">

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
                                onclick="addToCart('${p._id}', '${p.name}', '${p.image}', ${p.price})">
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

// Khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split('/').pop();
    let brandToRender = null;
    let limit = null;

    // Home hiển thị 10 sản phẩm đầu tiên
    if (page.includes('home.html')) {
        limit = 20;
    } else if (page.includes('apple.html')) brandToRender = 'Apple';
    else if (page.includes('samsung.html')) brandToRender = 'Samsung';
    else if (page.includes('vivo.html')) brandToRender = 'Vivo';
    else if (page.includes('honor.html')) brandToRender = 'Honor';
    else if (page.includes('oppo.html')) brandToRender = 'OPPO';
    else if (page.includes('xiaomi.html')) brandToRender = 'Xiaomi';
    else if (page.includes('techno.html')) brandToRender = 'Tecno';
    else if (page.includes('phukien.html')) brandToRender = 'Phukien';

    renderProducts('product-list', brandToRender, limit);
});

// Hiển thị popup chi tiết sản phẩm
async function showProductModal(productId) {
    try {
        const res = await fetch(`http://localhost:5000/api/dbproducts/${productId}`);
        const product = await res.json();

        const modalBody = document.getElementById('modal-product-body');
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.image}" class="img-fluid" alt="${product.name}">
                </div>
                <div class="col-md-6">
                    <h3>${product.name}</h3>
                    <p>Thương hiệu: ${product.brand}</p>
                    <p>Giá: ${product.price.toLocaleString('vi-VN')}₫</p>
                    <p>Số lượng còn: ${product.stock}</p>
                    <p>Mô tả: ${product.description}</p>
                </div>
            </div>
        `;

        // Nút thêm vào giỏ hàng trong modal
        const addBtn = document.getElementById('addToCartModalBtn');
        addBtn.onclick = () => addToCart(product._id, product.name, product.image, product.price);

        // Hiển thị modal
        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();

    } catch (err) {
        console.error('⚠️ Lỗi tải chi tiết sản phẩm:', err);
    }
}

// tim

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    searchBtn.addEventListener('click', async () => {
        const keyword = searchInput.value.trim().toLowerCase();

        try {
            // Lấy tất cả sản phẩm từ API
            const res = await fetch('http://localhost:5000/api/dbproducts');
            let products = await res.json();

            // Lọc theo tên sản phẩm
            if (keyword) {
                products = products.filter(p => p.name.toLowerCase().includes(keyword));
            }

            // Render lại
            const container = document.getElementById('product-list');
            if (!container) return;

            container.innerHTML = products.map(p => `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4"> 
                    <div class="card product-card h-100 position-relative">
                        <div class="product-image-container">
                            <img src="${p.image}" class="card-img-top product-img" alt="${p.name}" onclick="showProductModal('${p._id}')">
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
                                <button class="btn btn-product mt-2" onclick="addToCart('${p._id}', '${p.name}', '${p.image}', ${p.price})">
                                    <i class="fas fa-shopping-cart me-1"></i> THÊM VÀO GIỎ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (err) {
            console.error('⚠️ Lỗi khi tìm kiếm sản phẩm:', err);
        }
    });
});
