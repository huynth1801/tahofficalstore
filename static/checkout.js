document.addEventListener('DOMContentLoaded', function() {
    let shoppingCart = JSON.parse(localStorage.getItem('orderProduct')) || [];
    if (shoppingCart.length > 0) {
        // Lấy phần tử cuối cùng trong mảng
        var shoppingCartItem = shoppingCart[shoppingCart.length - 1];
    }
    const productsDiv = document.querySelector('.products');
    displayProducts(shoppingCart, productsDiv);

    const buyerForm = document.getElementById('buyer-form');
    buyerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;

        console.log("Buyer's Name:", fullname);
        console.log("Buyer's Email:", email);
    });
});

function displayProducts(shoppingCart, productsDiv) {
    if (shoppingCart.length === 0) {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'Không có sản phẩm trong giỏ hàng';
        productsDiv.appendChild(emptyCartMessage);
    }
    else {

        const latestItemIndex = shoppingCart.length - 1; // Chỉ số của phần tử vừa thêm vào
        const latestItem = shoppingCart[latestItemIndex]; // Phần tử vừa thêm vào
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        let qty = latestItem.quantity;
    
        const table = document.createElement('table');
        table.classList.add('table');
    
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th scope="col">Tên Sản phẩm</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Giá</th>
                <th scope="col">Hình mẫu</th>
                <th scope="col">Xóa</th>
            </tr>
        `;
        table.appendChild(thead);
    
        const tbody = document.createElement('tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${latestItem.name}</td>
            <td>
                <button onclick="decreaseQuantity(${latestItem.id})">-</button>
                <span id="product-quantity-${latestItem.id}">${qty}</span>
                <button onclick="increaseQuantity(${latestItem.id})">+</button>
            </td>
            <td>${latestItem.price}</td>
            <td>
                <img src="${latestItem.image}" alt="${latestItem.name}">
            </td>
            <td><button class='btn btn-danger btn-sm' onclick="deleteProduct(${latestItem.id})">Xóa</button></td>
        `;
        tbody.appendChild(tr);
    
        const tfoot = document.createElement('tfoot');
        const tfootTr = document.createElement('tr');
        tfootTr.innerHTML = `
            <td colspan="2" class="total">Tổng cộng:</td>
            <td colspan="2" id="total-price-${latestItem.id}">${latestItem.price * qty} VNĐ</td>
        `;
        tfoot.appendChild(tfootTr);
    
        table.appendChild(tbody);
        table.appendChild(tfoot);
    
        productItem.appendChild(table);
        productsDiv.appendChild(productItem);
    }
}


function decreaseQuantity(productId) {
    const quantitySpan = document.getElementById(`product-quantity-${productId}`);
    let qty = parseInt(quantitySpan.textContent);

    if (qty > 1) {
        qty--;
        updateQuantityDisplay(productId, qty);
        updateTotalPrice(productId, qty);
        // Cập nhật Local Storage hoặc logic xử lý cần thiết ở đây
    }
}

function increaseQuantity(productId) {
    const quantitySpan = document.getElementById(`product-quantity-${productId}`);
    let qty = parseInt(quantitySpan.textContent);

    qty++;
    updateQuantityDisplay(productId, qty);
    updateTotalPrice(productId, qty);
    // Cập nhật Local Storage hoặc logic xử lý cần thiết ở đây
}

function updateQuantityDisplay(productId, qty) {
    const quantitySpan = document.getElementById(`product-quantity-${productId}`);
    quantitySpan.textContent = qty;
}

function updateTotalPrice(productId, qty) {
    const totalPriceElem = document.getElementById(`total-price-${productId}`);
    const shoppingCart = JSON.parse(localStorage.getItem('orderProduct')) || [];
    
    const product = shoppingCart.find(item => item.id === productId);
    if (product) {
        const productPrice = product.price;
        if (totalPriceElem && productPrice) {
            totalPriceElem.textContent = `${productPrice * qty} VNĐ`;
        }
    }
}


function deleteProduct(productId) {
    let shoppingCart = JSON.parse(localStorage.getItem('orderProduct')) || [];

    const index = shoppingCart.findIndex(product => product.id === productId);

    if (index !== -1) {
        shoppingCart.splice(index, 1);
        localStorage.setItem('orderProduct', JSON.stringify(shoppingCart));

        // Xóa phần tử HTML tương ứng trong giao diện
        const productItem = document.querySelector(`.product-item[data-id="${productId}"]`);
        if (productItem) {
            productItem.remove();

            // Cập nhật lại danh sách sản phẩm hiển thị
            const productsDiv = document.querySelector('.products');
            productsDiv.innerHTML = ''; // Xóa danh sách hiện tại

            // Hiển thị lại danh sách sản phẩm từ localStorage
            displayProducts(shoppingCart, productsDiv);
        }

        // updateTotalPrice(); // Cập nhật lại tổng giá trị
    }
}

document.getElementById("buyer-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Ngăn chặn form gửi dữ liệu đi
    
    // Lấy thông tin từ các trường input
    var fullname = document.getElementById("fullname").value;
    var email = document.getElementById("email").value;
    var address = document.getElementById("address").value;
    var phone = document.getElementById("phone").value;
    
    // Tạo một đối tượng chứa thông tin khách hàng
    var customerInfo = {
        fullname: fullname,
        email: email,
        address: address,
        phone: phone
    };
    
    // Lưu thông tin khách hàng vào localstorage
    localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
    
    // Hiển thị pop-up thông báo thành công
    var popupElement = document.getElementById("popup");
    var popupMessageElement = document.getElementById("popup-message");
    popupMessageElement.textContent = "Đơn hàng đã được đặt thành công!";
    popupElement.classList.add("popup-show");

    setTimeout(function() {
        popupElement.classList.remove("popup-show");
    }, 3000);
    
    // Chuyển hướng hoặc thực hiện các hành động khác sau khi lưu thành công
    
    // Ví dụ: Chuyển hướng đến trang xác nhận đơn hàng
    setTimeout(() => {
        let baseUrl = window.location.hostname === '127.0.0.1' ? '' : '/cosmeticweb'; 
        window.location.href = `${baseUrl}/products.html`;
    }, 4000)
});;


function goBack() {
    // Chuyển hướng về trang danh sách sản phẩm (products.html)
    window.location.href = "/index.html";
}