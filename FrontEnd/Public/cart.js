document.addEventListener('DOMContentLoaded', async () => {
  const userID = localStorage.getItem('userID');
  
  const khoanggiualink = document.getElementById('khoanggiua');
  const signupLink = document.getElementById('signup');
  const loginLink = document.getElementById('login');
  const userInfoLink = document.getElementById('user-information');

  // Kiểm tra nếu người dùng đã đăng nhập (userID có trong localStorage)
  if (userID) {
    signupLink.style.display = 'none';
    khoanggiualink.style.display = 'none';
    loginLink.style.display = 'none';
    userInfoLink.style.display = 'inline';
  } else {
    userInfoLink.style.display = 'none';
  }

  const cartContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price-value');
  const checkoutButton = document.getElementById('checkout-btn');

  // Hàm tải giỏ hàng
  async function loadCart() {
    if (!userID) {
      alert('Vui lòng đăng nhập để xem giỏ hàng!');
      return;
    }
    try {
      const response = await fetch(`/cart/${userID}`);
      const cartData = await response.json();

      if (cartData.cart && cartData.cart.items.length > 0) {
        let totalPrice = 0;
        let totalPrices = 0;
        cartContainer.innerHTML = '';

        // Lặp qua từng sản phẩm trong giỏ hàng và tạo bảng HTML
        cartData.cart.items.forEach(item => {
          const productRow = document.createElement('tr');
          productRow.innerHTML = `
            <td class="product-name">${item.name}</td>
            <td>
              <button class="decrease" data-product-id="${item.productID}">-</button>
              <input type="number" value="${item.quantity}" min="1" class="quantity" data-product-id="${item.productID}" />
              <button class="increase" data-product-id="${item.productID}">+</button>
            </td>
            <td>${item.price} VND</td>
            <td class="total-price">${item.total} VND</td>
            <td><button class="remove-btn" data-product-id="${item.productID}">Xóa</button></td>
          `;
          cartContainer.appendChild(productRow);
          totalPrice = item.quantity * item.price;
          totalPrices += totalPrice;
        });
        totalPriceElement.textContent = totalPrices;
        checkoutButton.style.display = 'block';

        // Thêm sự kiện xóa sản phẩm
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
          button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
            await removeFromCart(productId);
            loadCart();  // Tải lại giỏ hàng
          });
        });
      } else {
        cartContainer.innerHTML = '<tr><td colspan="5">Giỏ hàng của bạn trống.</td></tr>';
        totalPriceElement.textContent = '0';
      }
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
      alert('Lỗi khi tải giỏ hàng. Vui lòng thử lại sau!');
    }
  }

  // Hàm xóa sản phẩm khỏi giỏ hàng
  async function removeFromCart(productId) {
    try {
      const response = await fetch(`/cart/${userID}/remove/${productId}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        alert(result.message || 'Lỗi khi xóa sản phẩm!');
      }
    } catch (error) {
      alert('Lỗi khi xóa sản phẩm!');
    }
  }

  // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = async (productId, action) => {
    try {
      const response = await fetch(`/cart/${action}/${productId}/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 }) // Mỗi lần giảm/tăng là 1 sản phẩm
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi cập nhật giỏ hàng');
      }

      // Nếu thành công, tải lại giỏ hàng
      const data = await response.json();
      loadCart(); // Cập nhật lại giỏ hàng sau khi thay đổi
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi cập nhật giỏ hàng: ' + error.message);
    }
  };

  // Lắng nghe sự kiện cho nút giảm số lượng
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('decrease')) {
      const productId = event.target.getAttribute('data-product-id');
      updateQuantity(productId, 'decrease');
    }

    // Lắng nghe sự kiện cho nút tăng số lượng
    if (event.target.classList.contains('increase')) {
      const productId = event.target.getAttribute('data-product-id');
      updateQuantity(productId, 'increase');
    }
  });

  loadCart(); // Gọi loadCart lần đầu tiên khi DOM đã tải
});
