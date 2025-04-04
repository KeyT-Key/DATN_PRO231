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
const productId = urlParams.get('id'); 

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
        document.getElementById('product-price').innerText = product.price.toLocaleString() + " VNĐ";
        document.getElementById('products_number').innerText = product.products_number;
        document.getElementById('description').innerText = product.description;
        document.getElementById('mainImage').src = product.imageUrl;
      }
      if (product.slideimage && product.slideimage.length > 0) {
        document.getElementById('image1').src = product.slideimage[0].image1 || '';
        document.getElementById('image2').src = product.slideimage[0].image2 || '';
        document.getElementById('image3').src = product.slideimage[0].image3 || '';
      }
       else {
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
  const quantity = parseInt(quantityInput.value) || 1;

  // Lấy userID từ localStorage
  const userID = localStorage.getItem('userID');

  if (!userID) {
    alert('Bạn cần đăng nhập trước khi thêm sản phẩm vào giỏ hàng!');
    return;
  }

  // Lấy productID từ URL
  const productID = new URLSearchParams(window.location.search).get('id');

  // Kiểm tra productID có hợp lệ không
  if (!productID) {
    console.error('Không tìm thấy productID trong URL');
    alert('Lỗi: Không có thông tin sản phẩm.');
    return;
  }

  // Gửi yêu cầu POST đến API để lưu giỏ hàng
  fetch('/add_to_cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userID: userID,
      productID: productID,
      quantity: quantity,
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert(data.message);
    }
    updateCartIcon();
  })
  .catch(error => {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    alert('Lỗi khi thêm sản phẩm vào giỏ hàng');
  });
}

// Hàm cập nhật icon giỏ hàng (Lấy dữ liệu từ API)
function updateCartIcon() {
  const userID = localStorage.getItem('userID');
  if (!userID) {
    return; // Nếu không có userID, không cần gọi API
  }

  // Gọi API để lấy dữ liệu giỏ hàng mới nhất
  fetch(`/get_cart?userID=${userID}`)
    .then(response => response.json())
    .then(data => {
      if (data.cart) {
        const totalItems = data.cart.reduce((total, item) => total + item.quantity, 0);

        const cartIcon = document.querySelector('.cart-icon');
        const cartCount = cartIcon.querySelector('.cart-count');

        if (!cartCount) {
          // Nếu chưa có phần tử số lượng, tạo mới
          const newCartCount = document.createElement('span');
          newCartCount.classList.add('cart-count');
          newCartCount.textContent = totalItems;
          cartIcon.appendChild(newCartCount);
        } else {
          // Cập nhật số lượng nếu phần tử đã có
          cartCount.textContent = totalItems;
        }
      }
    })
    .catch(error => {
      console.error('Lỗi khi lấy giỏ hàng:', error);
    });
}

// Gọi hàm updateCartIcon khi trang tải
document.addEventListener('DOMContentLoaded', updateCartIcon);

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

  let selectedRating = 1;
  ratingDisplay.textContent = selectedRating;
  stars.forEach(star => {
    if (parseInt(star.getAttribute('data-value')) <= selectedRating) {
      star.classList.add('fas');
      star.classList.add('far-star');
      star.classList.add('selected');
    } else {
      star.classList.remove('fas');
      star.classList.remove('far-star');
      star.classList.remove('selected');
    }
  });

  // Sự kiện khi người dùng click vào sao
  stars.forEach(star => {
    star.addEventListener('click', (e) => {
      selectedRating = parseInt(e.target.getAttribute('data-value'));
      ratingDisplay.textContent = selectedRating;

      // Cập nhật màu sắc của sao đã chọn
      stars.forEach(star => {
        if (parseInt(star.getAttribute('data-value')) <= selectedRating) {
          star.classList.add('fas');
          star.classList.add('far-star');
          star.classList.add('selected');
        } else {
          star.classList.remove('fas');
          star.classList.remove('far-star');
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
        const commentsDiv = document.querySelector('.comments'); // Lấy phần tử .comments từ DOM
        commentsDiv.innerHTML = ''; // Làm sạch các bình luận cũ
        // Hiển thị các bình luận mới
        data.reviews.forEach(review => {
          const reviewDiv = document.createElement('div');
          reviewDiv.classList.add('comment'); // Chỉnh lại class cho các bình luận
          reviewDiv.innerHTML = `
            <strong>${review.name}</strong> (${review.rating} sao) <br>
            <span>${review.date}</span> <br>
            <p>${review.content}</p>
          `;
          commentsDiv.appendChild(reviewDiv); // Thêm bình luận vào div có class 'comments'
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
// tìm kiếm
const input = document.getElementById('search-input');
const suggestionsBox = document.getElementById('suggestions');
const searchButton = document.getElementById('search-button');

// Hàm hiển thị gợi ý tìm kiếm
function showSuggestions(suggestions) {
  suggestionsBox.innerHTML = '';  // Xóa các gợi ý cũ
  if (suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      const div = document.createElement('div');
      div.textContent = suggestion.name;  // Hiển thị tên sản phẩm
      div.addEventListener('click', () => {
        input.value = suggestion.name;  // Điền gợi ý vào ô tìm kiếm khi chọn
        suggestionsBox.style.display = 'none';  // Ẩn gợi ý khi chọn
        redirectToProductPage(suggestion._id);  // Chuyển hướng tới trang product_information.html với ID sản phẩm
      });
      suggestionsBox.appendChild(div);
    });
    suggestionsBox.style.display = 'block';  // Hiển thị danh sách gợi ý
  } else {
    suggestionsBox.style.display = 'none';  // Ẩn gợi ý nếu không có kết quả
  }
}

// Lắng nghe sự kiện khi người dùng nhập liệu vào ô tìm kiếm
input.addEventListener('input', async () => {
  const query = input.value.trim();  // Lấy giá trị trong ô input và loại bỏ khoảng trắng thừa
  if (query.length > 0) {
    try {
      const response = await fetch(`/search/suggestions?q=${query}`);
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu từ API');
      }
      const suggestions = await response.json();  // Nhận các gợi ý từ API
      showSuggestions(suggestions);  // Hiển thị gợi ý lên giao diện
    } catch (error) {
      console.error('Lỗi:', error);
    }
  } else {
    suggestionsBox.style.display = 'none';  // Ẩn gợi ý nếu ô input trống
  }
});

// Xử lý sự kiện khi nhấn nút tìm kiếm
searchButton.addEventListener('click', async (event) => {
  event.preventDefault();  // Ngăn chặn reload trang khi nhấn nút tìm kiếm
  const query = input.value.trim();  // Lấy giá trị trong ô input
  if (query.length > 0) {
    try {
      const response = await fetch(`/search/suggestions?q=${query}`);
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu từ API');
      }
      const suggestions = await response.json();  // Nhận các gợi ý từ API
      if (suggestions.length > 0) {
        redirectToProductPage(suggestions[0]._id);  // Chuyển hướng đến trang product_information.html với ID sản phẩm đầu tiên
      }
    } catch (error) {
      console.error('Lỗi:', error);
    }
  }
});

// Hàm chuyển hướng tới trang product_information.html với ID sản phẩm
function redirectToProductPage(productId) {
  if (productId) {
    // Chuyển hướng sang trang product_information.html và truyền id sản phẩm dưới dạng query string
    window.location.href = `product_information?id=${encodeURIComponent(productId)}`;
  } else {
    console.error('ID sản phẩm không hợp lệ');
  }
}

// Ẩn gợi ý khi người dùng click bên ngoài
document.addEventListener('click', (event) => {
  if (!event.target.closest('#search-input') && !event.target.closest('#suggestions')) {
    suggestionsBox.style.display = 'none';  // Ẩn gợi ý khi click ra ngoài
  }
});
// Lấy tất cả các thẻ hình ảnh thu nhỏ
const thumbs = document.querySelectorAll('.thumb img');  // Lấy tất cả các thẻ img trong class .thumb

// Lặp qua từng thẻ hình ảnh thu nhỏ
thumbs.forEach(thumb => {
  thumb.addEventListener('click', function() {
    const newImageSrc = this.src; 
    document.getElementById('mainImage').src = newImageSrc;
  });
});