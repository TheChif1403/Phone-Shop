document.addEventListener("DOMContentLoaded", async() => {
    const productTableBody = document.querySelector("#productTable tbody");
    const stockHistoryTableBody = document.querySelector("#stockHistoryTable tbody");
    const addForm = document.getElementById("addProductForm");

    // --- Fetch danh sách sản phẩm ---
    async function loadProducts() {
        const res = await fetch("/api/products");
        const products = await res.json();

        productTableBody.innerHTML = products.map(p => `
            <tr data-id="${p._id}">
                <td contenteditable="true" class="editable" data-field="name">${p.name}</td>
                <td contenteditable="true" class="editable" data-field="price">${p.price}</td>
                <td contenteditable="true" class="editable" data-field="brand">${p.brand || ''}</td>
                <td contenteditable="true" class="editable" data-field="category">${p.category || ''}</td>
                <td contenteditable="true" class="editable" data-field="stock">${p.stock}</td>
                <td>
                    <button class="btn btn-sm btn-primary saveBtn">Lưu</button>
                    <button class="btn btn-sm btn-danger deleteBtn">Xóa</button>
                </td>
            </tr>
        `).join("");
    }

    // --- Fetch lịch sử tồn kho ---
    async function loadStockHistory() {
        const res = await fetch("/api/products/history");
        const history = await res.json();

        stockHistoryTableBody.innerHTML = history.map(h => `
            <tr>
                <td>${h.productId?.name || 'N/A'}</td>
                <td>${h.change}</td>
                <td>${h.reason}</td>
                <td>${new Date(h.createdAt).toLocaleString()}</td>
            </tr>
        `).join("");
    }

    // --- Thêm sản phẩm mới ---
    addForm.addEventListener("submit", async e => {
        e.preventDefault();
        const data = {
            name: document.getElementById("name").value,
            price: Number(document.getElementById("price").value),
            brand: document.getElementById("brand").value,
            category: document.getElementById("category").value,
            stock: Number(document.getElementById("stock").value),
            description: document.getElementById("description").value,
            image: document.getElementById("image").value
        };
        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            addForm.reset();
            loadProducts();
            loadStockHistory();
        }
    });

    // --- Lưu và xóa sản phẩm ---
    productTableBody.addEventListener("click", async e => {
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;

        if (e.target.classList.contains("saveBtn")) {
            const updatedData = {};
            tr.querySelectorAll(".editable").forEach(td => {
                updatedData[td.dataset.field] = td.dataset.field === "price" || td.dataset.field === "stock" ? Number(td.innerText) : td.innerText;
            });
            await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData)
            });
            loadStockHistory();
        }

        if (e.target.classList.contains("deleteBtn")) {
            await fetch(`/api/products/${id}`, { method: "DELETE" });
            loadProducts();
            loadStockHistory();
        }
    });

    // --- Load lần đầu ---
    loadProducts();
    loadStockHistory();
});