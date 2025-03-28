document.addEventListener('DOMContentLoaded', async () => {
  const userID = localStorage.getItem('userID'); // Lấy userID từ localStorage

  // Các phần tử cần ẩn/hiện
  const khoanggiualink = document.getElementById('khoanggiua');
  const signupLink = document.getElementById('signup');
  const loginLink = document.getElementById('login');
  const userInfoLink = document.getElementById('user-information');

  // Kiểm tra nếu userID tồn tại, có nghĩa là người dùng đã đăng nhập
  if (userID) {
      signupLink.style.display = 'none';
      khoanggiualink.style.display = 'none';
      loginLink.style.display = 'none';
      userInfoLink.style.display = 'inline'; // Hiển thị thông tin người dùng
  } else {
      userInfoLink.style.display = 'none';
  }

  const cartContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price-value');
  const checkoutButton = document.getElementById('checkout-btn');
  
   // Hàm để tải giỏ hàng từ API
   async function loadCart() {
    try {
      const response = await fetch(`/cart/${userID}`);  // Gọi API lấy giỏ hàng
      const cartData = await response.json();
  
      if (cartData.cart && cartData.cart.items.length > 0) {
        let totalPrice = 0;
        let totalPrices = 0;
        cartContainer.innerHTML = ''; // Xóa nội dung giỏ hàng cũ
  
        cartData.cart.items.forEach(item => {
          const productRow = document.createElement('tr');
          productRow.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price} VND</td>
            <td>${item.price*item.quantity} VND</td>
            <td><button class="remove-btn" data-product-id="${item.productID}">Xóa</button></td>
          `;
          cartContainer.appendChild(productRow);
  
          totalPrice = item.quantity * item.price;  // Tổng giá trị giỏ hàng
          totalPrices += totalPrice;
          console.log(item);
        });
  
        totalPriceElement.textContent = totalPrices;  // Hiển thị tổng giá giỏ hàng
        // Thêm sự kiện xóa sản phẩm
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
          button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-product-id');
            await removeFromCart(productId);
            loadCart();  // Tải lại giỏ hàng sau khi xóa
          });
        });
      } else {
        cartContainer.innerHTML = '<tr><td colspan="5">Giỏ hàng của bạn trống.</td></tr>';
        totalPriceElement.textContent = '0';
      }
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
    }
  }

  // Hàm để xóa sản phẩm khỏi giỏ hàng
  async function removeFromCart(productId) {
    try {
      const response = await fetch(`/cart/${userID}/remove/${productId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (response.ok) {
        alert('Sản phẩm đã được xóa khỏi giỏ hàng!');
      } else {
        alert(result.message || 'Lỗi khi xóa sản phẩm!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      alert('Lỗi khi xóa sản phẩm khỏi giỏ hàng!');
    }
  }

  // Hàm xử lý thêm sản phẩm vào giỏ hàng
  async function addToCart(productID, quantity) {
    try {
      const response = await fetch('/add_to_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, productID, quantity }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Thông báo khi sản phẩm được thêm vào giỏ hàng
        loadCart();  // Cập nhật giỏ hàng sau khi thêm sản phẩm
      } else {
        alert(result.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      alert('Lỗi khi thêm sản phẩm vào giỏ hàng!');
    }
  }
  
    // Hàm xử lý checkout (thanh toán)
    // checkoutButton.addEventListener('click', async () => {
    //   try {
    //     const response = await fetch(`/cart/${userID}/checkout`, {
    //       method: 'POST'
    //     });
    //     const result = await response.json();
        
    //     if (response.ok) {
    //       alert('Thanh toán thành công!');
    //       // Có thể chuyển hướng người dùng đến trang thanh toán hoặc thông báo thành công
    //     } else {
    //       alert(result.message || 'Lỗi khi thanh toán!');
    //     }
    //   } catch (error) {
    //     console.error('Lỗi khi thanh toán:', error);
    //     alert('Lỗi khi thanh toán!');
    //   }
    // });

    // // Tải giỏ hàng khi trang đã sẵn sàng
    loadCart();
});