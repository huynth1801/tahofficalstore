let products = null;
let filteredProducts = null;

// Lấy dữ liệu từ file JSON và thêm vào HTML
fetch("data/products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    addDataToHTML(products);
  });

// Thêm sự kiện khi người dùng thay đổi giá trị trong ô tìm kiếm
document.getElementById("searchInput").addEventListener("input", function () {
  searchProducts(this.value.trim());
});

// Thêm sự kiện khi người dùng nhấn nút lọc
document.getElementById("filterButton").addEventListener("click", function () {
  filterProducts();
});

function addDataToHTML(products) {
  let listProductHTML = document.querySelector(".listProduct");

  // Xóa dữ liệu hiện tại từ HTML
  listProductHTML.innerHTML = "";

  // Thêm dữ liệu mới
  if (products != null) {
    products.forEach((product) => {
      const baseUrl =
        window.location.hostname === "127.0.0.1" ? "" : "/cosmeticweb";
      const discountedPrice = calculateDiscountedPrice(
        product.price,
        product.discount
      );
      let newProduct = document.createElement("a");
      newProduct.href = `${baseUrl}/product_detail.html?id=` + product.id;
      newProduct.classList.add("item");
      if (product.discount > 0) {
        newProduct.innerHTML = `<img src="${product.image}" alt="">
          <div class="discount-badge">${product.discount}%</div>
          <h2>${product.name}</h2>
          <div class="price">
            <span class="original-price">${product.price}</span>
            <span class="discounted-price">${formatCurrency(
              discountedPrice
            )}</span>
          </div>`;
      } else {
        newProduct.innerHTML = `<img src="${product.image}" alt="">
          <div class="discount-badge">${product.discount}%</div>
          <h2>${product.name}</h2>
          <div class="price">${formatCurrency(product.price)}</div>`;
      }
      listProductHTML.appendChild(newProduct);
    });
  }
}

function formatCurrency(value) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  // Calculate the discount amount
  const discountAmount = (originalPrice * discountPercentage) / 100;
  // Calculate the discounted price
  const discountedPrice = originalPrice - discountAmount;
  // Round down to the nearest thousand
  return Math.floor(discountedPrice / 1000) * 1000;
}

function searchProducts(searchTerm) {
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  addDataToHTML(filteredProducts);
}

// Thêm sự kiện khi người dùng thay đổi giá trị trong dropdown loại sản phẩm
document
  .getElementById("productTypeFilter")
  .addEventListener("change", function () {
    filterProducts();
  });

function filterProducts() {
  const criteria = document.getElementById("filterCriteria").value;
  const minValue = parseFloat(document.getElementById("minValue").value);
  const maxValue = parseFloat(document.getElementById("maxValue").value);
  const productTypeFilter = document.getElementById("productTypeFilter").value;

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.price);
    const meetsPriceCriteria =
      isNaN(price) || (price >= minValue && price <= maxValue);

    const meetsTypeCriteria =
      productTypeFilter === "" || product.type === productTypeFilter;

    return meetsPriceCriteria && meetsTypeCriteria;
  });

  addDataToHTML(filteredProducts);
}

fetch("data/products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    filteredProducts = [...products];
    showProducts();
  });

function showProducts() {
  // Hiển thị danh sách sản phẩm sau khi áp dụng bộ lọc
  let listProduct = document.querySelector(".listProduct");
  listProduct.innerHTML = "";

  filteredProducts.forEach((product) => {
    let newProduct = document.createElement("a");
    const discountedPrice = calculateDiscountedPrice(
      product.price,
      product.discount
    );
    newProduct.href = "/product_detail.html?id=" + product.id;
    newProduct.classList.add("item");
    if (product.discount > 0) {
      newProduct.innerHTML = `<img src="${product.image}" alt="">
          <div class="discount-badge">${product.discount}%</div>
          <h2>${product.name}</h2>
          <div class="price">
            <span class="original-price">${formatCurrency(product.price)}</span>
            <span class="discounted-price">${formatCurrency(
              discountedPrice
            )}</span>
          </div>
          <a id="' + ${
            product.id
          } + '" type="submit" class="add-to-cart-button">Thêm vào giỏ hàng</a>`;
    } else {
      newProduct.innerHTML = `<img src="${product.image}" alt="">
          <div class="discount-badge">${product.discount}%</div>
          <h2>${product.name}</h2>
          <div class="price">${formatCurrency(product.price)}</div>
          <a id="' + ${
            product.id
          } + '" type="submit" class="add-to-cart-button">Thêm vào giỏ hàng</a>`;
    }
    listProduct.appendChild(newProduct);
  });
}

function applyFilters() {
  // Lấy giá trị của các ô lọc
  const searchKeyword = document.getElementById("search").value.toLowerCase();
  const selectedCategory = document.getElementById("category").value;
  const sortBy = document.getElementById("sort").value;
  const filterBy = document.getElementById("filter").value;

  // Áp dụng bộ lọc
  filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchKeyword);
    const matchesCategory =
      selectedCategory === "all" || product.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sắp xếp danh sách sản phẩm
  if (sortBy === "az") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "za") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "dsc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Lọc theo thuộc tính được chọn (đây là ví dụ cho thuộc tính "discount")
  if (filterBy === "discount") {
    filteredProducts = filteredProducts.filter(
      (product) => product.discount >= 0
    );
  } else {
    filteredProducts = filteredProducts.filter(
      (product) => product.discount == filterBy
    );
  }

  // Hiển thị danh sách sản phẩm sau khi áp dụng bộ lọc và sắp xếp
  showProducts();
}

document.addEventListener("DOMContentLoaded", function () {
  const trashIcons = document.querySelectorAll(".box i");
  trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", () => {
      removeItemFromCart(trashIcon);
      updateShoppingCart();
      // showSelectedProducts();
      checkLoginStatus();
    });
  }); // Nếu có thông tin đăng nhập, cập nhật trạng thái đăng nhập
});

function updateShoppingCart() {
  // Lấy giỏ hàng từ Local Storage
  const shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  // Hiển thị giỏ hàng trong header
  const shoppingCartContainer = document.querySelector(".shopping-cart");
  shoppingCartContainer.innerHTML = "";

  shoppingCart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("box");
    const discountedPrice = calculateDiscountedPrice(item.price, item.discount);
    const price = item.discount > 0 ? discountedPrice : item.price;
    cartItem.innerHTML = `
      <i class="fas fa-trash"></i>
      <img src="${item.image}" alt="${item.name}">
      <div class="content">
          <h3>${item.name}</h3>
          <span class="price">${formatCurrency(price)} -</span>
          <span class="quantity">Số lượng: ${item.quantity}</span>
      </div>
      `;
    shoppingCartContainer.appendChild(cartItem);
  });

  // Tính tổng cộng và hiển thị
  const total = shoppingCart.reduce(
    (acc, item) =>
      acc + calculateDiscountedPrice(item.price, item.discount) * item.quantity,
    0
  );
  const totalElement = document.createElement("div");
  totalElement.classList.add("total");
  totalElement.innerText = `Tổng cộng: ${formatCurrency(total)}`;
  shoppingCartContainer.appendChild(totalElement);

  // Hiển thị nút thanh toán
  const checkoutButton = document.createElement("a");
  let baseUrl = window.location.hostname === "127.0.0.1" ? "" : "/cosmeticweb";
  checkoutButton.href = `${baseUrl}/order.html`;
  checkoutButton.classList.add("btn");
  checkoutButton.innerText = "Thanh toán";
  shoppingCartContainer.appendChild(checkoutButton);
}
