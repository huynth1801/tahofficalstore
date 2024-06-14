document.addEventListener('DOMContentLoaded', function () {
    // Hiển thị danh sách giao dịch
    displayTransactionList();

    // Hiển thị tổng doanh thu
    displayTotalRevenue();
});

// Hàm hiển thị danh sách giao dịch
function displayTransactionList() {
    const transactionListContainer = document.getElementById('transactionList');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const customersInfo = JSON.parse(localStorage.getItem('customerInfo')) || [];
    if (transactions.length > 0 ) {
        const transactionListHTML = transactions.map(transaction => {
            return `
                <tr>
                    <td>${transaction.name}</td>
                    <td>${transaction.quantity}</td>
                    <td>${transaction.totalPrice}</td>
                    <td>${transaction.timestamp}</td>
                    <td>
                        <button class="btn btn-sm btn-primary mr-2" onclick="editTransaction(${transaction.productId})">Sửa</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${transaction.productId})">Xoá</button>
                    </td>
                </tr>`;
        }).join('');

        // const customersInfoHTML =
        //         `
        //         <tr>
        //             <td>${customersInfo.fullname}</td>
        //             <td>${customersInfo.phone}</td>
        //             <td>${customersInfo.address}</td>
        //             <td>${customersInfo.email}</td>
        //             <td>
        //                 <button class="btn btn-sm btn-primary mr-2" onclick="editTransaction(${customersInfo.customerId})">Sửa</button>
        //                 <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${customersInfo.customerId})">Xoá</button>
        //             </td>
        //         </tr>`;

        transactionListContainer.innerHTML =  transactionListHTML;
    } else {
        transactionListContainer.innerHTML = '<tr><td colspan="5">Chưa có giao dịch nào.</td></tr>';
    }
}

// Hàm hiển thị tổng doanh thu
function displayTotalRevenue() {
    const totalRevenueContainer = document.getElementById('totalRevenue');
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    const totalRevenue = transactions.reduce((total, transaction) => total + transaction.totalPrice, 0);

    let totalQuantity = 0;

    transactions.forEach(transaction => {
        totalQuantity += transaction.quantity;
    });

    totalRevenueContainer.innerHTML = `
        <p style="font-size: 18px; color: red">Tổng doanh thu: ${totalRevenue} VNĐ</p>
        <p style="font-size: 18px; color: red">Số lượng sản phẩm được bán: ${totalQuantity}</p>`;
}

// Hàm sửa giao dịch
function editTransaction(transactionId) {
    console.log('Sửa giao dịch với ID: ' + transactionId);
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Tìm giao dịch có transactionId tương ứng trong mảng transactions
    const transaction = transactions.find(transaction => transaction.productId === transactionId);

    if (transaction) {
        // Tìm phần tử HTML tương ứng với giao dịch
        const transactionRow = document.querySelector(`.transaction-row[data-id="${transactionId}"]`);

        if (transactionRow) {
            // Tìm phần tử HTML hiển thị số lượng
            const quantityElement = transactionRow.querySelector('.quantity');

            // Prompt yêu cầu nhập số lượng mới
            const newQuantity = prompt('Nhập số lượng mới:', transaction.quantity);

            // Kiểm tra nếu người dùng không nhấn Cancel và số lượng mới hợp lệ
            if (newQuantity !== null && !isNaN(newQuantity) && newQuantity !== '') {
                // Chuyển đổi số lượng mới sang kiểu số
                const updatedQuantity = parseInt(newQuantity);

                // Kiểm tra nếu số lượng mới lớn hơn 0
                if (updatedQuantity > 0) {
                    // Cập nhật số lượng trong giao dịch
                    transaction.quantity = updatedQuantity;

                    // Cập nhật giá trị số lượng trên bảng
                    quantityElement.textContent = updatedQuantity;

                    // Lưu mảng transactions vào localStorage
                    localStorage.setItem('transactions', JSON.stringify(transactions));

                    // Hiển thị thông báo thành công
                    alert('Số lượng sản phẩm đã được chỉnh sửa thành công.');

                    // Gọi lại hàm tính lại tổng tiền
                    calculateTotalPrice();

                    // Gọi lại hàm hiển thị danh sách giao dịch
                    displayTransactionList();
                } else {
                    // Hiển thị thông báo lỗi nếu số lượng mới không hợp lệ
                    alert('Số lượng phải lớn hơn 0.');
                }
            }
        } else {
            // Hiển thị thông báo lỗi nếu không tìm thấy phần tử HTML tương ứng với giao dịch
            // alert('Không tìm thấy giao dịch với ID: ' + transactionId);
        }
    }
}

function deleteTransaction(transactionId) {
    // Xử lý logic xoá giao dịch
    console.log('Xoá giao dịch với ID: ' + transactionId);

    // Lấy danh sách giao dịch từ Local Storage
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Tìm vị trí của giao dịch cần xoá trong danh sách
    const transactionIndex = transactions.findIndex(transaction => transaction.productId === transactionId);

    if (transactionIndex !== -1) {
        // Xoá giao dịch khỏi danh sách
        transactions.splice(transactionIndex, 1);

        // Lưu danh sách giao dịch mới vào Local Storage
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Hiển thị lại danh sách giao dịch và tổng doanh thu
        displayTransactionList();
        displayTotalRevenue();
    }
}