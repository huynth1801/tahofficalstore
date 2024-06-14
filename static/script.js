const backToTopBtn = document.querySelector(".scroll-to-top-btn");
//Listens for the scroll event and shows the button when the user scrolls down by more than 20 pixels.
window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

// When the button is clicked, it smoothly scrolls the page back to the top.
backToTopBtn.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

// Gọi hàm để cập nhật số lượng sản phẩm khi trang web được tải
document.addEventListener("DOMContentLoaded", function () {
  updateCartItemCount(); // Cập nhật số lượng sản phẩm trong giỏ hàng khi trang được tải
});

let searchForm = document.querySelector(".search-form");
// let loginForm = document.querySelector('.login-form');
document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  shoppingCart.classList.remove("active");
  // loginForm.classList.remove('active');
  navbar.classList.remove("active");
};

let shoppingCart = document.querySelector(".shopping-cart");

document.querySelector("#cart-btn").onclick = () => {
  shoppingCart.classList.toggle("active");
  searchForm.classList.remove("active");
  // loginForm.classList.remove('active');
  navbar.classList.remove("active");
};

// Activate active
// Tìm tất cả các liên kết trong menu navigation
const navLinks = document.querySelectorAll(".navbar a");

// Thêm sự kiện click cho các liên kết
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết

    // Xóa class 'active' khỏi tất cả các liên kết
    navLinks.forEach((l) => l.classList.remove("active"));

    // Thêm class 'active' cho liên kết được nhấn
    this.classList.add("active");

    // Chuyển đến URL của liên kết được nhấn
    window.location.href = this.getAttribute("href");
  });
});

// Tính tổng số lượng sản phẩm trong giỏ hàng
function getTotalQuantityInCart() {
  // Lấy giỏ hàng từ localStorage
  let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  let totalQuantity = 0;
  shoppingCart.forEach((item) => {
    totalQuantity += item.quantity || 0; // Lấy giá trị quantity của từng sản phẩm và cộng dồn lại
  });
  return totalQuantity;
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartItemCount() {
  const cartItemCountSpan = document.querySelector(".cart-item-count");
  if (cartItemCountSpan) {
    cartItemCountSpan.textContent = getTotalQuantityInCart(); // Cập nhật số lượng sản phẩm trong giỏ hàng
  }
}

document.querySelector("#login-btn").onclick = () => {
  // loginForm.classList.toggle('active');
  searchForm.classList.remove("active");
  shoppingCart.classList.remove("active");
  navbar.classList.remove("active");
};

let navbar = document.querySelector(".navbar");

document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  searchForm.classList.remove("active");
  shoppingCart.classList.remove("active");
  // loginForm.classList.remove('active');
};

window.onscroll = () => {
  searchForm.classList.remove("active");
  shoppingCart.classList.remove("active");
  navbar.classList.remove("active");
};

document.addEventListener("DOMContentLoaded", function () {
  updateShoppingCart();
  const trashIcons = document.querySelectorAll(".box i");
  trashIcons.forEach((trashIcon) => {
    if (trashIcon) {
      trashIcon.addEventListener("click", () => {
        removeItemFromCart(trashIcon);
        updateShoppingCart();
        // showSelectedProducts();
        // checkLoginStatus();
      });
    }
  });
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
    const price = item.price - item.price * item.discount;
    cartItem.innerHTML = `
        <i class="fas fa-trash"></i>
        <img src="${item.image}" alt="${item.name}">
        <div class="content">
            <h3>${item.name}</h3>
            <span class="price">${item.price}VNĐ -</span>
            <span class="quantity">Số lượng: ${item.quantity}</span>
        </div>
        `;
    shoppingCartContainer.appendChild(cartItem);
  });

  // Tính tổng cộng và hiển thị
  const total = shoppingCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalElement = document.createElement("div");
  totalElement.classList.add("total");
  totalElement.innerText = `Tổng cộng: ${total} VNĐ`;
  shoppingCartContainer.appendChild(totalElement);

  // Hiển thị nút thanh toán
  const checkoutButton = document.createElement("a");
  let baseUrl = window.location.hostname === "127.0.0.1" ? "" : "/cosmeticweb";
  checkoutButton.href = `${baseUrl}/order.html`;
  checkoutButton.classList.add("btn");
  checkoutButton.innerText = "Thanh toán";
  shoppingCartContainer.appendChild(checkoutButton);
}

document.addEventListener("DOMContentLoaded", function () {
  fetch("data/products.json")
    .then((response) => response.json())
    .then((data) => {
      displayProductsByCategory("new-arrivals-list", data, "New Arrivals");
      displayProductsByCategory("best-selling-list", data, "Best-Selling");
      displayProductsByCategory("sale-off-list", data, "Sale Off");
    });
});

function displayProductsByCategory(containerId, products, category) {
  const container = document.getElementById(containerId);
  const categoryProducts = products.filter(
    (product) => product.category === category
  );

  if (categoryProducts.length > 0) {
    categoryProducts.forEach((product) => {
      const productElement = createProductElement(product);
      if (container) {
        container.appendChild(productElement);
      }
    });
  } else {
    container.innerHTML = "<p>No products available in this category.</p>";
  }
}

function createProductElement(product) {
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discount
  );
  const productElement = document.createElement("div");
  productElement.classList.add("product");

  productElement.innerHTML = `
        <div class='product-container'>
            <div class='new'>New</div>
            <div class='product-image'>
                <img src="${product.image}" alt="${product.name}">
                <div class="discount-badge" >${product.discount}%</div>
        
            </div>
        </div>
        <h2>${product.name}</h2>
        <div class="price" >${product.price} VNĐ</div>
        <span class="discounted-price">${discountedPrice}VNĐ</span>
    `;

  return productElement;
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  const discountAmount = (originalPrice * discountPercentage) / 100;
  return originalPrice - discountAmount;
}
