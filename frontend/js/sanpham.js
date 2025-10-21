const products = [
  {
    "id": "1",
    "name": "iPhone 17 Pro Max 256GB | Chính hãng VNA",
    "brand": "Apple",
    "price": 37990000,
    "stock": 100,
    "description": "Màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ, khung titanium cao cấp.",
    "image": "../img/dienthoai/dienthoai/apple/17pro.jpg",
    "category": "Smartphone"
  },
  {
    "id": "2",
    "name": "iPhone 17 Air 256GB | Chính hãng VNA",
    "brand": "Apple",
    "price": 31990000,
    "stock": 100,
    "description": "Màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ, khung titanium cao cấp.",
    "image": "../img/dienthoai/dienthoai/apple/17air.jpg",
    "category": "Smartphone"
  },
  {
    "id": "3",
    "name": "iPhone 17 256GB | Chính hãng VNA",
    "brand": "Apple",
    "price": 25990000,
    "stock": 200,
    "description": "Màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ, khung titanium cao cấp.",
    "image": "../img/dienthoai/dienthoai/apple/17.jpg",
    "category": "Smartphone"
  },
  {
    "id": "4",
    "name": "iPhone 16 Pro Max 256GB | Chính hãng VNA",
    "brand": "Apple",
    "price": 21990000,
    "stock": 100,
    "description": "Màn hình Super Retina XDR 6.7 inch, chip A17 Pro mạnh mẽ, khung titanium cao cấp.",
    "image": "../img/dienthoai/dienthoai/apple/16promax.jpg",
    "category": "Smartphone"
  }
];




document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");

    products.forEach(product => {
        const col = document.createElement("div");
        col.classList.add("col-lg-3", "col-md-6");

        col.innerHTML = `
            <div class="product-card">
                <div class="product-img-container">
                    <img src="${product.image}" class="product-img" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </div>
                    <div>
                        <span class="product-price">${product.price.toLocaleString()}đ</span>
                    </div>
                    <button class="btn btn-outline-primary w-100" onclick="addToCart('${product.name}', '${product.image}', ${product.price})">THÊM VÀO GIỎ</button>
                </div>
            </div>
        `;
        productList.appendChild(col);
    });
});
