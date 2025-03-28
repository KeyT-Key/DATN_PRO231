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
    // Lưu toàn bộ sản phẩm vào biến allProducts
    allProducts = data.products;

    // Hiển thị danh mục trong phần checkbox
    const categoryList = document.getElementById('filter-section');
    data.categories.forEach(category => {
      const label = document.createElement('label');
      label.innerHTML = `<input type="checkbox" value="${category}"> ${category}`;
      categoryList.appendChild(label);
      categoryList.appendChild(document.createElement('br'));
    });

    // Hiển thị sản phẩm trong danh sách sản phẩm
    const productList = document.querySelector('.product-list');
    function displayProducts(products) {
      productList.innerHTML = '';  // Xóa danh sách sản phẩm cũ
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
          <img src="${product.imageUrl || 'https://via.placeholder.com/200'}" alt="Sản phẩm">
          <h4>${product.name}</h4>
          <p class="price">đ ${product.price}</p>
          <p class="sold">Đã bán ${product.sold || '0'}</p>
          <span class="discount">${product.discount || ''}</span>
        `;
        productList.appendChild(productCard);
      });
    }

    // Hiển thị tất cả sản phẩm ban đầu
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
    document.querySelector('.button-clear').addEventListener('click', function () {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    displayProducts(allProducts);
  });
  })
  .catch(error => console.error('Lỗi khi lấy dữ liệu sản phẩm và danh mục:', error));