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

// hiển thị sản phẩm
fetch('/products')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Lỗi HTTP! mã trạng thái: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const productList = document.getElementById('product-list');
    if (data.products && data.products.length > 0) {
      data.products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-card');
        productElement.innerHTML = `
       <a href="/product_information?id=${product._id}">
      <img src="${product.imageUrl}" alt="${product.name}" />
        </a>
      <h4>${product.name}</h4>
      <p class="price">${product.price.toLocaleString()}</p>
      <p class="sold">Đã bán 7,2k</p>
      <span class="discount">${product.discount || 'No Discount'}</span>
        `;
        productList.appendChild(productElement);
      });
    } else {
      productList.innerHTML = '<p>Không có sản phẩm nào</p>';
    }
  })
  .catch(error => {
    console.error('Lỗi:', error);
  });
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
