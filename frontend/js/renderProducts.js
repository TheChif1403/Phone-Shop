// 📦 File: renderProducts.js
// async function renderProducts(containerId = 'product-list') {
//   try {
//     const res = await fetch('http://localhost:5000/api/products');
//     const products = await res.json();

//     const container = document.getElementById(containerId);
//     if (!container) {
//       console.error(`Không tìm thấy phần tử có id="${containerId}"`);
//       return;
//     }

//     container.innerHTML = products.map(p => `
//       <div class="col-lg-3 col-md-6">
//         <div class="product-card">
//           <div class="product-img-container">
//             <img src="${p.image}" class="product-img" alt="${p.name}">
//           </div>
//           <div class="product-info">
//             <h5 class="product-title">${p.name}</h5>
//             <div class="product-rating">
//               <i class="fas fa-star"></i>
//               <i class="fas fa-star"></i>
//               <i class="fas fa-star"></i>
//               <i class="fas fa-star"></i>
//               <i class="far fa-star"></i>
//             </div>
//             <div>
//               <span class="product-price">${p.price.toLocaleString()}₫</span>
//             </div>
//             <button class="btn btn-outline-primary w-100" 
//               onclick="addToCart('${p.name}', '${p.image}', ${p.price})">
//               THÊM VÀO GIỎ
//             </button>
//           </div>
//         </div>
//       </div>
//     `).join('');
//   } catch (err) {
//     console.error('⚠️ Lỗi khi tải dữ liệu sản phẩm:', err);
//   }
// }

// // Tự động chạy khi HTML tải xong
// document.addEventListener('DOMContentLoaded', () => {
//   renderProducts('product-list');
// });



// async function renderProducts(containerId = 'product-list', from, to) {
//   try {
//     let url = 'http://localhost:5000/api/products';
//     if (from && to) url += `?from=${from}&to=${to}`;

//     const res = await fetch(url);
//     const products = await res.json();

//     const container = document.getElementById(containerId);
//     if (!container) return;

//     container.innerHTML = products.map(p => `
//       <div class="col-lg-3 col-md-6">
//         <div class="product-card">
//           <div class="product-img-container">
//             <img src="${p.image}" class="product-img" alt="${p.name}">
//           </div>
//           <div class="product-info">
//             <h5 class="product-title">${p.name}</h5>
//             <div class="product-rating">
//               <i class="fas fa-star"></i><i class="fas fa-star"></i>
//               <i class="fas fa-star"></i><i class="fas fa-star"></i>
//               <i class="far fa-star"></i>
//             </div>
//             <div>
//               <span class="product-price">${p.price.toLocaleString()}₫</span>
//             </div>
//             <button class="btn btn-outline-primary w-100"
//               onclick="addToCart('${p.name}', '${p.image}', ${p.price})">
//               THÊM VÀO GIỎ
//             </button>
//           </div>
//         </div>
//       </div>
//     `).join('');
//   } catch (err) {
//     console.error('⚠️ Lỗi khi tải dữ liệu sản phẩm:', err);
//   }
// }

// // Tự động tải sản phẩm cho từng trang
// document.addEventListener('DOMContentLoaded', () => {
//   const page = window.location.pathname.split('/').pop();

//   if (page.includes('home.html')) {
//     renderProducts('product-list', 1, 5);
//   } else if (page.includes('apple.html')) {
//     renderProducts('product-list', 10, 15);
//   } else {
//     renderProducts('product-list');
//   }
// });



async function renderProducts(containerId = 'product-list', from, to, brand) {
  try {
    let url = 'http://localhost:5000/api/products';
    const params = [];

    if (from && to) params.push(`from=${from}&to=${to}`);
    if (brand) params.push(`brand=${encodeURIComponent(brand)}`);

    if (params.length > 0) url += `?${params.join('&')}`;

    const res = await fetch(url);
    const products = await res.json();

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(p => `
      <div class="col-lg-3 col-md-6">
        <div class="product-card">
          <div class="product-img-container">
            <img src="${p.image}" class="product-img" alt="${p.name}">
          </div>
          <div class="product-info">
            <h5 class="product-title">${p.name}</h5>
            <div class="product-rating">
              <i class="fas fa-star"></i><i class="fas fa-star"></i>
              <i class="fas fa-star"></i><i class="fas fa-star"></i>
              <i class="far fa-star"></i>
            </div>
            <div>
              <span class="product-price">${p.price.toLocaleString()}₫</span>
            </div>
            <button class="btn btn-outline-primary w-100"
              onclick="addToCart('${p.name}', '${p.image}', ${p.price})">
              THÊM VÀO GIỎ
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('⚠️ Lỗi khi tải dữ liệu sản phẩm:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop();

  if (page.includes('home.html')) {
    renderProducts('product-list', 1, 4);
  } else if (page.includes('apple.html')) {
    renderProducts('product-list', null, null, 'Apple');
  } else if (page.includes('samsung.html')) {
    renderProducts('product-list', null, null, 'Samsung');
    
  }  else if (page.includes('vivo.html')) {
    renderProducts('product-list', null, null, 'Vivo');
    
  } 
  else {
    renderProducts('product-list');
  }
});
