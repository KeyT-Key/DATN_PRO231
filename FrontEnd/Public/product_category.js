// SLide show ads
let slideIndex = 1;
showSlides(slideIndex);
function plusSlides(n) {
  showSlides(slideIndex += n);
}
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("side");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
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

 // Lưu trữ toàn bộ sản phẩm để hiển thị lại khi nhấn nút Clear
let allProducts = [];
 // Fetch sản phẩm và danh mục từ API
fetch('/products-with-categories')
  .then(response => response.json())
  .then(data => {
    allProducts = data.products;

    // Hiển thị danh mục trong phần checkbox
    const categoryList = document.getElementById('filter-section');
    data.categories.forEach(category => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${category}"> ${category}`;
      categoryList.appendChild(label);
      categoryList.appendChild(document.createElement('br'));
    });

    const productList = document.querySelector('.product-list');
    function displayProducts(products) {
      productList.innerHTML = '';
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
          <a href="/product_information?id=${product._id}">
          <img src="${product.imageUrl || 'https://via.placeholder.com/200'}" alt="Sản phẩm">
          </a>
          <h4>${product.name}</h4>
          <p class="price">${product.price} VNĐ</p>
        `;
        productList.appendChild(productCard);
      });
    }

    displayProducts(allProducts);

    // Lắng nghe sự kiện thay đổi checkbox để lọc sản phẩm
    document.getElementById('filter-section').addEventListener('change', function () {
      const selectedCategories = [];
      document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        selectedCategories.push(checkbox.value);
      });
      const filteredProducts = allProducts.filter(product => 
        selectedCategories.length === 0 || selectedCategories.includes(product.category)
      );
      displayProducts(filteredProducts);
    });
    // Lấy danh mục từ query parameter trong URL
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category');

    // Nếu có danh mục từ URL, chọn checkbox tương ứng
    if (selectedCategory) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        if (checkbox.value === selectedCategory) {
          checkbox.checked = true;
        }
      });
      const filteredProducts = allProducts.filter(product =>
        product.category === selectedCategory
      );
      displayProducts(filteredProducts);
    }
    document.querySelector('.button-clear').addEventListener('click', function () {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    displayProducts(allProducts);
  });
  })
  .catch(error => console.error('Lỗi khi lấy dữ liệu sản phẩm và danh mục:', error));
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
updateCartIcon();