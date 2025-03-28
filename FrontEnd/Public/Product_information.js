
  // Quantity Controls
  const decreaseBtn = document.getElementById('decreaseBtn');
  const increaseBtn = document.getElementById('increaseBtn');
  const quantityInput = document.getElementById('quantityInput');

  decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
      }
  });

  increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
  });

// Lấy productId từ URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');  // Lấy đúng 'id' từ URL

// Gọi hàm để hiển thị thông tin sản phẩm
if (productId) {
  showProductInfo(productId);
} else {
  console.error('Không có productId trong URL');
}

// Hàm hiển thị thông tin chi tiết sản phẩm
function showProductInfo(productId) {
  fetch(`/product_information/${productId}`)  // Đảm bảo API nhận đúng id
    .then(response => {
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Mã trạng thái: ${response.status}`);
      }
      return response.json();
    })
    .then(product => {
      // Kiểm tra xem product có dữ liệu không
      if (product) {
        document.getElementById('product-name').innerText = product.name;
        document.getElementById('product-price').innerText = product.price.toLocaleString();
        document.getElementById('products_number').innerText = product.products_number;
        document.getElementById('description').innerText = product.description;
        document.getElementById('mainImage').src = product.imageUrl;
      } else {
        console.error('Không tìm thấy sản phẩm');
      }
    })
    .catch(error => {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    });
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart() {
  // Lấy giá trị quantity từ input
  const quantity = parseInt(quantityInput.value) || 1; // Nếu không có giá trị, mặc định là 1

  // Lấy userID từ localStorage
  const userID = localStorage.getItem('userID');

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!userID) {
    alert('Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng!');
    return;
  }

  // Lấy productID từ URL (hoặc từ bất kỳ nguồn nào khác)
  const productID = new URLSearchParams(window.location.search).get('id');

  // Kiểm tra xem productID có hợp lệ không
  if (!productID) {
    console.error('Không tìm thấy productID trong URL');
    alert('Lỗi: Không có thông tin sản phẩm.');
    return;
  }

  // Kiểm tra dữ liệu trước khi gửi yêu cầu
  console.log('Product ID:', productID);
  console.log('User ID:', userID);
  console.log('Quantity:', quantity);

  // Gửi yêu cầu POST để thêm sản phẩm vào giỏ hàng
  fetch('/add_to_cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: userID,       // Lấy userID từ localStorage
      productID: productID, // Lấy productID từ URL
      quantity: quantity,   // Số lượng sản phẩm muốn thêm
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(data.message); // Thông báo khi thêm thành công
    } else {
      alert('Sản phẩm đã được thêm vào giỏ hàng!');
    }
  })
  .catch(error => {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    alert('Lỗi khi thêm sản phẩm vào giỏ hàng');
  });
}

// Thêm sự kiện click cho nút "Thêm Vào Giỏ Hàng"
const addToCartBtn = document.querySelector('.add-to-cart');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', addToCart);
}
// ẩn hiện user information
document.addEventListener('DOMContentLoaded', () => {
  const userID = localStorage.getItem('userID'); // Lấy userID từ localStorage (hoặc sessionStorage nếu muốn)
  
  // Các phần tử cần ẩn/hiện
  const khoanggiualink = document.getElementById('khoanggiua')
  const signupLink = document.getElementById('signup');
  const loginLink = document.getElementById('login');
  const userInfoLink = document.getElementById('user-information');
  
  // Kiểm tra nếu userID tồn tại, có nghĩa là người dùng đã đăng nhập
  if (userID) {
      // Ẩn Đăng Ký và Đăng nhập, hiển thị thông tin người dùng
      signupLink.style.display = 'none';
      khoanggiualink.style.display = 'none';
      loginLink.style.display = 'none';
      userInfoLink.style.display = 'inline'; // Hiển thị thông tin người dùng
  } else {
      // Nếu chưa đăng nhập, ẩn "Thông tin người dùng"
      userInfoLink.style.display = 'none';
  }
});
// bình luận và mô tả
function showContent(tabNumber) {
  const allContents = document.querySelectorAll('.content');
allContents.forEach(content => {
  content.style.display = 'none';
});
const show = document.getElementById(`content-${tabNumber}`);
show.style.display = 'block';

 // Di chuyển thanh dưới tới vị trí tab đã chọn
 const underline = document.querySelector('.underline');
const tab = document.querySelectorAll('.tab')[tabNumber - 1];

const tabPosition = tab.offsetLeft;
const tabWidth = tab.offsetWidth;

underline.style.width = `${tabWidth}px`;
underline.style.left = `${tabPosition}px`;
}
window.onload = function() {
showContent(1);
};
// đánh giá bình luận
document.addEventListener('DOMContentLoaded', () => {
  const stars = document.querySelectorAll('.stars i');
  const ratingDisplay = document.getElementById('selected-rating');
  const addReviewButton = document.getElementById('addReviewButton');
  const reviewInput = document.getElementById('reviewInput');
  const contentDiv = document.getElementById('content-1');

  let selectedRating = 0;

  // Sự kiện khi người dùng click vào sao
  stars.forEach(star => {
    star.addEventListener('click', (e) => {
      selectedRating = parseInt(e.target.getAttribute('data-value'));
      ratingDisplay.textContent = selectedRating;

      // Cập nhật màu sắc của sao đã chọn
      stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= selectedRating) {
          star.classList.add('fas');
          star.classList.add('far');
          star.classList.add('selected');
        } else {
          star.classList.remove('fas');
          star.classList.remove('far');
          star.classList.remove('selected');
        }
      });
    });
  });

  // API gọi thêm bình luận
  addReviewButton.addEventListener('click', async () => {
    const productId = new URLSearchParams(window.location.search).get('id'); 
    const name = localStorage.getItem('name');
    const rating = selectedRating.toString(); 
    const userID = localStorage.getItem('userID');
    const date = new Date().toISOString();

    const content = reviewInput.value.trim();

    if (!rating || !content) {
      alert('Vui lòng chọn đánh giá và nhập bình luận!');
      return;
    }

    // Gửi yêu cầu thêm bình luận
    try {
      const response = await fetch('/addreviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          name,
          rating,
          userID,
          date,
          content,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Bình luận đã được thêm thành công!');
        reviewInput.value = '';
        location.reload();
      } else {
        alert(`Lỗi: ${data.message}`);
      }
    } catch (err) {
      console.error('Lỗi khi gửi bình luận:', err);
      alert('Đã xảy ra lỗi khi thêm bình luận');
    }
  });

  // API gọi để lấy bình luận của sản phẩm
  async function getReviews(productId) {
    try {
      const response = await fetch(`/reviews/?productId=${productId}`);
      const data = await response.json();
      if (response.ok) {
        // Hiển thị các bình luận
        data.reviews.forEach(review => {
          const reviewDiv = document.createElement('div');
          reviewDiv.classList.add('review-item');
          reviewDiv.innerHTML = `
            <strong>${review.name}</strong> (${review.rating} sao)
            <p>${review.date}</p>
            <p>${review.content}</p>
          `;
          contentDiv.appendChild(reviewDiv);
        });
      } else {
        alert(`Lỗi khi lấy bình luận: ${data.message}`);
      }
    } catch (err) {
      console.error('Lỗi khi lấy bình luận:', err);
      alert('Đã xảy ra lỗi khi lấy bình luận');
    }
  }

  // Lấy bình luận khi trang được tải lên
  const productId = new URLSearchParams(window.location.search).get('id'); // Thay thế bằng ID sản phẩm thực tế
  getReviews(productId);
});