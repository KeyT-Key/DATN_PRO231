const btnOrder = document.getElementById('btn-order');
async function handleOrder() {
  const userID = localStorage.getItem('userID');

  if (!userID) {
    alert("Vui lòng đăng nhập để thực hiện thanh toán.");
    return;
  }

  try {
    const response = await fetch(`/buy/${userID}`, {
      method: 'POST',
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      window.location.href = '/';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Lỗi khi thanh toán:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
  }
}
btnOrder.addEventListener('click', handleOrder);

// Hàm để lấy dữ liệu giỏ hàng từ API theo userID
async function fetchCartItems() {
  const userID = localStorage.getItem('userID');

  if (!userID) {
    console.error('User ID không tồn tại trong localStorage');
    return;
  }
  try {
    let totalPrice = 0;
    const response = await fetch(`/order/${userID}`);
    const cartItems = await response.json();
    if (cartItems.length > 0) {
      const cartItemsContainer = document.getElementById('cart-item');
      cartItemsContainer.innerHTML = ''; // Reset nội dung giỏ hàng trước khi thêm sản phẩm mới

      cartItems.forEach(item => {
        // Thêm từng sản phẩm vào giỏ hàng thay vì thay thế nội dung
        cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <img class="product-img-item" src="${item.imageUrl}" alt="${item.name}">
          <ul class="product-info">
            <li class="product-name">${item.name}</li>
          </ul>
          
          <span class="type-product"></span>
          
          <div class="total-price">
            <div class="total-price-item">${item.price.toLocaleString()} VNĐ</div>
            <div class="total-price-item">${item.quantity}</div>
            <div class="total-price-item">${(item.price * item.quantity).toLocaleString()} VNĐ</div>
          </div>
        </div>
        `;
      });

      // Tính tổng tiền của giỏ hàng
      totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      document.getElementById('total-price-product').textContent = totalPrice + " VNĐ";
      let totalPaymentsum = 0;
      totalPaymentsum += totalPrice;
      document.getElementById('total-payment-price').textContent = `${totalPaymentsum} VNĐ`;
    } else {
      document.getElementById('cart-item').innerHTML = '<p>Giỏ hàng của bạn hiện tại chưa có sản phẩm nào.</p>';
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
    document.getElementById('cart-item').innerHTML = '<p>Không thể lấy dữ liệu giỏ hàng.</p>';
  }
}
fetchCartItems();

// địa chỉ
document.addEventListener("DOMContentLoaded", function () {
    const userID = localStorage.getItem('userID');
    const termsModal = document.getElementById("termsModal");
    const saveAddressButton = document.getElementById("saveAddress");
    const changeAddressLink = document.getElementById("changeAddress");
    const addNewAddressLink = document.getElementById("addNewAddress");
    const selectAddressModal = document.getElementById("selectAddressModal");
    const addressSelect = document.getElementById("addressSelect");
    const confirmAddressButton = document.getElementById("confirmAddress");

    const userAddressElement = document.getElementById("userAddress");

    // Hàm để lấy và hiển thị địa chỉ đã lưu
    async function getAddresses() {
        try {
            const response = await fetch(`/order/get_address/${userID}`);
            const addresses = await response.json();

            // Nếu có địa chỉ, hiển thị chúng trong select
            if (addresses.length > 0) {
                addressSelect.innerHTML = '<option value="">Chọn địa chỉ</option>'; // Reset options
                addresses.forEach(address => {
                    const option = document.createElement("option");
                    option.value = address._id; // Sử dụng _id của địa chỉ làm giá trị
                    option.textContent = address.address;
                    addressSelect.appendChild(option);
                });
            } else {
                userAddressElement.textContent = 'Địa chỉ: Chưa có địa chỉ nào';
            }
        } catch (err) {
            console.error('Lỗi khi lấy địa chỉ:', err);
        }
    }

    // Lấy danh sách địa chỉ khi tải trang
    getAddresses();

    // Mở modal để chọn địa chỉ đã lưu
    changeAddressLink.addEventListener("click", function () {
        selectAddressModal.style.display = "flex";
    });

    // Xác nhận chọn địa chỉ và cập nhật vào giao diện
    confirmAddressButton.addEventListener("click", async function () {
        const selectedAddressID = addressSelect.value;

        if (!selectedAddressID) {
            alert("Vui lòng chọn một địa chỉ");
            return;
        }

        try {
            const response = await fetch(`/order/get_address/${userID}`);
            const addresses = await response.json();
            const selectedAddress = addresses.find(addr => addr._id === selectedAddressID);

            if (selectedAddress) {
                userAddressElement.textContent = `Địa chỉ: ${selectedAddress.address}`;
            }

            // Đóng modal
            selectAddressModal.style.display = "none";
        } catch (err) {
            console.error('Lỗi khi chọn địa chỉ:', err);
            alert("Lỗi khi chọn địa chỉ");
        }
    });

    // Mở modal để thêm địa chỉ mới
    addNewAddressLink.addEventListener("click", function () {
        termsModal.style.display = "flex";
    });

    // Lưu địa chỉ mới
    saveAddressButton.addEventListener("click", async function () {
        const adrres = document.getElementById("adrres").value.trim();

        if (!adrres) {
            alert("Địa chỉ không được để trống");
            return;
        }

        try {
            const response = await fetch(`/order/add_address/${userID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address: adrres })
            });
            const result = await response.json();
            if (result.cart) {
                alert("Địa chỉ đã được thêm thành công!");
                termsModal.style.display = "none";
                getAddresses();  // Cập nhật danh sách địa chỉ hiển thị
            } else {
                alert("Lỗi khi thêm địa chỉ");
            }
        } catch (err) {
            console.error('Lỗi khi thêm địa chỉ:', err);
            alert("Lỗi khi thêm địa chỉ");
        }
    });

    // Đóng modal khi nhấn ngoài modal
    window.addEventListener("click", function (event) {
        if (event.target === termsModal) {
            termsModal.style.display = "none";
        }
        if (event.target === selectAddressModal) {
            selectAddressModal.style.display = "none";
        }
    });
});

// mã giảm giá
// Lấy các phần tử DOM
const voucherModal = document.getElementById("voucher-modal");
const voucherLink = document.querySelector(".cart-item-shop-voucher-link");
const closeVoucherModal = document.getElementById("close-voucher-modal");
const discountCodeInput = document.getElementById("discount-code-input");
const applyDiscountBtn = document.getElementById("apply-discount-btn");
const voucherList = document.getElementById("voucher-list");
const totalPriceElement = document.getElementById("total-price-product");
const voucherDiscountElement = document.getElementById("voucher-discount");
const totalPaymentPriceElement = document.getElementById("total-payment-price");

let userID = localStorage.getItem('userID'); // Lấy userID từ localStorage

// Hiển thị modal khi người dùng nhấn vào "Chọn Voucher"
voucherLink.addEventListener("click", async () => {
  try {
    // Mở modal để chọn voucher
    voucherModal.style.display = "block";

    // Lấy danh sách các voucher từ server
    const response = await fetch(`/api/vouchers/${userID}`);
    const vouchers = await response.json();

    // Hiển thị danh sách voucher trong modal
    voucherList.innerHTML = '';
    vouchers.forEach(voucher => {
      const listItem = document.createElement("li");
      listItem.textContent = `${voucher.code} - Giảm ${voucher.discount} VNĐ`;
      listItem.dataset.code = voucher.code;
      listItem.dataset.discount = voucher.discount;
      listItem.classList.add("voucher-item");
      voucherList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách voucher", error);
  }
});

// Đóng modal khi nhấn nút "Đóng"
closeVoucherModal.addEventListener("click", () => {
  voucherModal.style.display = "none";
});

// Áp dụng voucher khi nhấn nút "Áp dụng"
let vouchers = []; 
applyDiscountBtn.addEventListener('click', async function () {
  let currentVoucherCode = document.getElementById("discount-code-input").value;

  // Kiểm tra nếu mã voucher chưa được nhập
  if (!currentVoucherCode) {
    alert("Vui lòng nhập mã voucher!");
    return;
  }

  // Nếu danh sách voucher chưa được tải từ trước, gọi API để lấy danh sách voucher
  if (vouchers.length === 0) {
    try {
      const response = await fetch(`/api/vouchers/${userID}`);
      vouchers = await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher", error);
      alert("Có lỗi xảy ra khi tải danh sách voucher!");
      return;
    }
  }

  // Kiểm tra voucher có trong danh sách hay không
  const selectedVoucher = vouchers.find(voucher => voucher.code === currentVoucherCode);

  if (selectedVoucher) {
    // Nếu voucher hợp lệ, cập nhật giảm giá
    const discountAmount = selectedVoucher.discount;

    // Hiển thị thông tin giảm giá vào giao diện
    voucherDiscountElement.textContent = `${discountAmount} VNĐ`;

    // Cập nhật tổng thanh toán sau khi áp dụng voucher
    updateTotalPayment();
    
  } else {
    alert("Voucher không hợp lệ!");
  }
});

// Lắng nghe sự kiện click vào các voucher để chọn voucher
voucherList.addEventListener("click", (event) => {
  const selectedVoucher = event.target;

  if (selectedVoucher.classList.contains("voucher-item")) {
    const voucherCode = selectedVoucher.dataset.code;
    const voucherDiscountAmount = selectedVoucher.dataset.discount;

    // Hiển thị voucher đã chọn vào ô nhập mã giảm giá
    discountCodeInput.value = voucherCode;

    // Cập nhật giá trị voucher đã chọn
    currentVoucherCode = voucherCode;
    voucherDiscountElement.textContent = `${voucherDiscountAmount} VNĐ`;

    updateTotalPayment();  // Cập nhật tổng thanh toán
  }
});

// Hàm tính toán tổng thanh toán sau khi áp dụng voucher
function updateTotalPayment() {
  // Lấy giá trị tổng tiền hàng và voucher giảm giá từ các phần tử HTML
  const totalPrice = parseFloat(totalPriceElement.textContent.replace(' VNĐ', '').trim());
  const discount = parseFloat(voucherDiscountElement.textContent.replace(' VNĐ', '').trim());

  // Tính tổng thanh toán sau khi giảm giá
  const totalPayment = totalPrice - discount;

  // Cập nhật tổng thanh toán vào giao diện
  totalPaymentPriceElement.textContent = `${totalPayment.toLocaleString()} VNĐ`;  // Hiển thị dưới dạng VNĐ
}