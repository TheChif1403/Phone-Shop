// ../js/renderProducts.js

// Function to render products based on filters
async function renderProducts(containerId = 'product-list', brand = null, limit = null, search = '', minPrice = 0, maxPrice = Infinity) {
    try {
        let url = 'http://localhost:5000/api/dbproducts'; // Base API URL

        // --- Fetch ALL products first ---
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        let products = await res.json();

        // --- Apply filters ---
        // 1. Filter by brand (if provided)
        if (brand) {
            // Make sure brand comparison is case-insensitive
            products = products.filter(p => p.brand && p.brand.toLowerCase() === brand.toLowerCase());
        }

        // 2. Filter by search keyword (if provided)
        if (search) {
            const keyword = search.toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(keyword));
        }

        // 3. Filter by price range
        products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

        // 4. Apply limit (if provided) - Do this AFTER filtering
        if (limit) {
            products = products.slice(0, limit);
        }

        // --- Render the filtered products ---
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }

        if (products.length === 0) {
            container.innerHTML = '<p class="text-center text-muted col-12">Không tìm thấy sản phẩm nào.</p>';
            return;
        }

        container.innerHTML = products.map(p => `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card product-card h-100 position-relative">

                    {/* ===== WISHLIST BUTTON ADDED HERE ===== */}
                    <button class="btn-wishlist" title="Thêm vào Wishlist"
                        onclick="addToWishlist('${p._id}', '${p.name}', '${p.image}', ${p.price})">
                        <i class="far fa-heart"></i>
                    </button>
                    {/* ===================================== */}

                    <div class="product-image-container">
                        <img src="${p.image}" class="card-img-top product-img" alt="${p.name}" onclick="showProductModal('${p._id}')">
                    </div>
                    <div class="product-info d-flex flex-column">
                        <h5 class="product-title">${p.name}</h5>
                        <div class="product-rating">
                            {/* (Your star rating) */}
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
        console.error('⚠️ Lỗi khi tải/render dữ liệu sản phẩm:', err);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p class="text-center text-danger col-12">Đã xảy ra lỗi khi tải sản phẩm.</p>';
        }
    }
}

// Function to show product details in a modal
async function showProductModal(productId) {
    try {
        const res = await fetch(`http://localhost:5000/api/dbproducts/${productId}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const product = await res.json();

        const modalBody = document.getElementById('modal-product-body');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.image}" class="img-fluid rounded" alt="${product.name}">
                </div>
                <div class="col-md-6">
                    <h3>${product.name}</h3>
                    <p class="text-muted">Thương hiệu: ${product.brand || 'N/A'}</p>
                    <h4 class="text-danger fw-bold">${product.price.toLocaleString('vi-VN')}₫</h4>
                    <p><strong>Tình trạng:</strong> ${product.stock > 0 ? `<span class="text-success">Còn hàng (${product.stock})</span>` : '<span class="text-danger">Hết hàng</span>'}</p>
                    <p><strong>Mô tả:</strong></p>
                    <p>${product.description || 'Chưa có mô tả.'}</p>
                </div>
            </div>
        `;

        // Update modal add-to-cart button
        const addBtn = document.getElementById('addToCartModalBtn');
        if (addBtn) {
             addBtn.onclick = () => addToCart(product._id, product.name, product.image, product.price);
             addBtn.disabled = product.stock <= 0; // Disable button if out of stock
        }


        // Show the modal
        const productModal = new bootstrap.Modal(document.getElementById('productModal'));
        productModal.show();

    } catch (err) {
        console.error('⚠️ Lỗi tải chi tiết sản phẩm:', err);
        alert('Không thể tải chi tiết sản phẩm. Vui lòng thử lại.');
    }
}

// --- Initialize and set up event listeners when DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
    // Determine brand and limit based on the current page
    const page = window.location.pathname.split('/').pop().toLowerCase(); // Make it lowercase for reliable matching
    let brandToRender = null;
    let limit = null;
    let initialSearch = ''; // No initial search
    let initialMinPrice = 0;
    let initialMaxPrice = Infinity;

    // --- Page-specific rendering logic ---
    if (page.includes('home.html') || page === '') { // Also handle root path
        limit = 20; // Show 20 products on home
    } else if (page.includes('apple.html')) brandToRender = 'Apple';
    else if (page.includes('samsung.html')) brandToRender = 'Samsung';
    else if (page.includes('vivo.html')) brandToRender = 'Vivo';
    else if (page.includes('honor.html')) brandToRender = 'Honor';
    else if (page.includes('oppo.html')) brandToRender = 'OPPO';
    else if (page.includes('xiaomi.html')) brandToRender = 'Xiaomi';
    else if (page.includes('techno.html')) brandToRender = 'Tecno';
    else if (page.includes('phukien.html')) brandToRender = 'Phukien'; // Assuming 'Phukien' is a brand
    // Add more else if for other brand pages

    // --- Initial Render ---
    // Render products based on page, limit, and default filters
    renderProducts('product-list', brandToRender, limit, initialSearch, initialMinPrice, initialMaxPrice);

    // --- Setup Filter/Search Listeners (Only if the filter elements exist on the page) ---
    const searchInput = document.getElementById('searchInput');
    const minInput = document.getElementById('minPrice');
    const maxInput = document.getElementById('maxPrice');
    const filterBtn = document.getElementById('filterBtn'); // Assuming your filter button has id="filterBtn"
    const searchIconInBar = document.querySelector('.search-box i'); // Assuming the search icon triggers search too

    // Function to handle filtering/searching
    const handleFilter = () => {
        const search = searchInput ? searchInput.value.trim() : '';
        const minPrice = minInput ? parseInt(minInput.value) || 0 : 0;
        const maxPrice = maxInput ? parseInt(maxInput.value) || Infinity : Infinity;

        // Re-render products with new filters, KEEPING the current page's brand
        renderProducts('product-list', brandToRender, null, search, minPrice, maxPrice); // Limit is null when filtering
    };

    // Add listeners if elements exist
    if (filterBtn) {
        filterBtn.addEventListener('click', handleFilter);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleFilter();
            }
        });
    }
    
    // Optional: Make the search icon in the main search bar trigger the filter as well
    if (searchIconInBar && searchInput) {
         searchIconInBar.addEventListener('click', handleFilter);
         searchIconInBar.style.cursor = 'pointer'; // Indicate it's clickable
    }

});

// --- Make sure addToCart and addToWishlist are defined ---
// (These might be in global-support.js or another file, ensure they are loaded)
if (typeof addToCart === 'undefined') {
    function addToCart(id, name, image, price) {
        console.warn('addToCart function is not fully defined. Using placeholder.');
        alert(`Đã thêm ${name} vào giỏ hàng (Placeholder)!`);
        // Add your actual cart logic here or ensure the correct file is loaded
    }
}

if (typeof addToWishlist === 'undefined') {
     function addToWishlist(productId, name, image, price) {
        console.warn('addToWishlist function is not fully defined. Using placeholder.');
         // Basic localStorage implementation as a fallback
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingProduct = wishlist.find(item => item.id === productId);
        if (!existingProduct) {
            wishlist.push({ id: productId, name: name, image: image, price: price });
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            alert('Đã thêm "' + name + '" vào danh sách yêu thích!');
        } else {
             alert('Sản phẩm này đã có trong danh sách yêu thích của bạn.');
        }
    }
}