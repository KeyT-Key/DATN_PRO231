
document.getElementById('logoutbtn').addEventListener('click', function () {

    localStorage.removeItem('userID');
    console.log('Đã đăng xuất thành công');
    
    window.location.replace('/');
  });
// none and block
document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.action-bar-btn-item:nth-child(1)'); // Nút "Thêm"
    const deleteButton = document.querySelector('.action-bar-btn-item:nth-child(2)'); // Nút "Xóa"
    const editButton = document.querySelector('.action-bar-btn-item:nth-child(3)'); // Nút "Sửa"
    const formAdd = document.getElementById('form-add');
    const formDelete = document.getElementById('form-delete');
    const formEditname = document.getElementById('form-edit-name');
    const formDeleteAdmin = document.getElementById('form-delete-admin');
    // Ẩn form thêm sản phẩm khi bắt đầu
    formAdd.style.display = 'none';

    // Sự kiện khi nhấn vào nút "Thêm"
    addButton.addEventListener('click', () => {
        // Ẩn tất cả các form khác
        formAdd.style.display = 'block';
        formEditname.style.display = 'none';
        formDelete.style.display ='none';
    });

    // Sự kiện khi nhấn vào nút "Xóa" (Tùy chỉnh thêm theo yêu cầu)
    deleteButton.addEventListener('click', () => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
          formAdd.style.display = 'none';
          formEditname.style.display = 'none';
          formDelete.style.display ='block';
          return;
        }
        formAdd.style.display = 'none';
        formEditname.style.display = 'none';
        formDelete.style.display ='block';
        formDeleteAdmin.style.display = 'block';
    });

    // Sự kiện khi nhấn vào nút "Sửa" (Tùy chỉnh thêm theo yêu cầu)
    editButton.addEventListener('click', () => {
        formAdd.style.display = 'none';
        formEditname.style.display = 'block';
        formDelete.style.display ='none';
    });
});
// thông tin người dùng
document.addEventListener("DOMContentLoaded", async function () {
    const userID = localStorage.getItem('userID');  // Lấy userID từ localStorage
    
    if (!userID) {
      alert("Vui lòng đăng nhập.");
      return;
    }
  
    try {
      // Gửi yêu cầu đến API để lấy thông tin người dùng
      const response = await fetch(`/user_info/${userID}`, {
        method: 'GET',
      });
  
      // Kiểm tra nếu server trả về kết quả thành công
      if (response.ok) {
        const data = await response.json();
        
        // Hiển thị thông tin người dùng lên form
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('password').value = data.password || '***********';  // Cân nhắc không hiển thị password
        document.getElementById('role').value = data.role || '';
      } else {
        // Nếu có lỗi từ server, hiển thị thông báo lỗi
        const data = await response.json();
        alert(data.message || 'Không thể lấy thông tin người dùng');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert('Không thể lấy thông tin người dùng');
    }
  });
// thêm sản phẩm
document.getElementById('submit-add-button').addEventListener('click', async function (event) {
    event.preventDefault(); // Ngăn chặn form gửi đi mặc định

    // Lấy giá trị từ các input trong form
    const name = document.getElementById('name-product-add').value;
    const price = parseFloat(document.getElementById('price-product-add').value);
    const category = document.getElementById('category-product-add').value;
    const imageUrl = document.getElementById('image-product-add').value;
    const discount = parseInt(document.getElementById('discount-product-add').value) || 0;
    const discountcode = document.getElementById('discount-code-product-add').value;
    const description = document.getElementById('description-product-add').value;
    const products_number = parseInt(document.getElementById('quantity-product-add').value);
    const slideimage = [
        {
            image1: document.getElementById('image-1-product-add').value,
            image2: document.getElementById('image-2-product-add').value,
            image3: document.getElementById('image-3-product-add').value
        }
    ];

    // Lấy userID từ localStorage, sessionStorage hoặc từ biến toàn cục (giả sử userID lưu trong localStorage)
    const userID = localStorage.getItem('userID');  // Hoặc lấy từ cookie/session nếu sử dụng phương thức khác

    if (!userID) {
        return alert('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập.');
    }

    // Tạo đối tượng product
    const productData = {
        name,
        price,
        category,
        imageUrl,
        discount,
        discountcode,
        description,
        products_number,
        slideimage,
        userID  // Đảm bảo gửi đúng userID
    };

    // Gửi request POST đến server
    try {
        const response = await fetch('/add_product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        const data = await response.json();
        
        if (response.status === 200) {
            // Nếu thêm sản phẩm thành công
            alert('Sản phẩm đã được thêm!');
        } else {
            // Nếu có lỗi trong quá trình thêm sản phẩm
            alert(`Lỗi: ${data.message}`);
        }
    } catch (error) {
        // Nếu có lỗi trong quá trình gửi request
        console.error('Error occurred:', error);
        alert('Lỗi khi thêm sản phẩm');
    }
});
// Xoá sản phẩm
document.addEventListener("DOMContentLoaded", function () {
    const formDelete = document.getElementById('form-delete');
    const deleteNameInput = document.getElementById('delete-name');
    const userID = localStorage.getItem('userID');  // Lấy userID từ localStorage
    const userRole = localStorage.getItem('role');  // Lấy role người dùng từ localStorage
    
    if (!userID || !userRole) {
      alert("Vui lòng đăng nhập.");
      return;
    }
  
    // Lắng nghe sự kiện submit của form
    formDelete.addEventListener('submit', async function (event) {
      event.preventDefault();  // Ngăn chặn hành vi mặc định của form (reload trang)
  
      const productName = deleteNameInput.value.trim();
  
      if (!productName) {
        alert("Vui lòng nhập tên sản phẩm cần xóa");
        return;
      }
  
      // Gửi yêu cầu DELETE tới API để xóa sản phẩm
      try {
        const response = await fetch('/delete_product_by_name', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productName: productName,
            userID: userID,  // Gửi userID từ localStorage
            role: userRole,  // Gửi role từ localStorage
          }),
        });
  
        const data = await response.json();
  
        if (response.status === 200) {
          alert(data.message || 'Sản phẩm đã được xóa');
          deleteNameInput.value = '';  // Xóa input sau khi xóa sản phẩm thành công
        } else {
          alert(data.message || 'Có lỗi khi xóa sản phẩm');
        }
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Không thể xóa sản phẩm');
      }
    });
  });
// edit sản phẩm
document.addEventListener('DOMContentLoaded', function () {
  const formEditName = document.getElementById('form-edit-name');
  const formEdit = document.getElementById('form-edit');
  const editButton = document.getElementById('editButton');
  const productNameInput = document.getElementById('product-edit-name');

  // Hàm hiển thị form sửa thông tin sản phẩm
  const displayEditForm = (productData) => {
      document.getElementById('name-product-edit').value = productData.name || '';
      document.getElementById('price-product-edit').value = productData.price || '';
      document.getElementById('category--product-edit').value = productData.category || '';
      document.getElementById('image-product-edit').value = productData.imageUrl || '';
      document.getElementById('discount-code-product-edit').value = productData.discountcode || '';
      document.getElementById('discount-product-edit').value = productData.discount || '';
      document.getElementById('description-product-edit').value = productData.description || '';
      document.getElementById('quantity-product-edit').value = productData.products_number || '';
      document.getElementById('image1-product-edit').value = productData.image1 || '';
      document.getElementById('image2-product-edit').value = productData.image2 || '';
      document.getElementById('image3-product-edit').value = productData.image3 || '';

      formEdit.style.display = 'block';
      formEditName.style.display = 'none';
  };

  // Khi người dùng nhấn nút "Sửa sản phẩm" sau khi nhập tên sản phẩm
  editButton.addEventListener('click', function () {
      const productName = productNameInput.value.trim();

      if (!productName) {
          alert("Vui lòng nhập tên sản phẩm cần sửa.");
          return;
      }

      // Gửi yêu cầu tìm sản phẩm theo tên
      fetch(`/find_and_edit/${productName}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.product) {
            // Nếu tìm thấy sản phẩm, hiển thị form sửa với dữ liệu sản phẩm
            displayEditForm(data.product);
        } else if (data.message) {
            // Nếu không tìm thấy sản phẩm, hiển thị thông báo lỗi
            alert(data.message); // Hiển thị thông báo lỗi nếu không tìm thấy sản phẩm
            console.log("Thông báo lỗi:", data.message); // In ra thông báo lỗi trong console
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Lỗi khi kết nối đến server');
    });
  });

  // Khi người dùng gửi form sửa sản phẩm
  formEdit.addEventListener('submit', function (event) {
      event.preventDefault();

      const productName = productNameInput.value.trim();
      const updatedProductData = {
          newProductName: document.getElementById('name-product-edit').value,
          newProductPrice: document.getElementById('price-product-edit').value,
          newProductCategory: document.getElementById('category--product-edit').value,
          newProductImage: document.getElementById('image-product-edit').value,
          newProductDiscountCode: document.getElementById('discount-code-product-edit').value,
          newProductDiscount: document.getElementById('discount-product-edit').value,
          newProductDescription: document.getElementById('description-product-edit').value,
          newProductNumber: document.getElementById('quantity-product-edit').value,
          newProductImage1: document.getElementById('image1-product-edit').value,
          newProductImage2: document.getElementById('image2-product-edit').value,
          newProductImage3: document.getElementById('image3-product-edit').value
      };

      const userID = localStorage.getItem('userID');
      const role = localStorage.getItem('role');

      // Gửi yêu cầu PUT để cập nhật sản phẩm
      fetch(`/find_and_edit/${productName}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'userID': userID, // Thêm userID từ localStorage
              'role': role      // Thêm role từ localStorage
          },
          body: JSON.stringify(updatedProductData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.message) {
              alert(data.message); // Hiển thị thông báo thành công hoặc lỗi
          } else {
              alert('Đã xảy ra lỗi trong quá trình cập nhật');
          }
      })
      .catch(error => {
          console.error('Lỗi:', error);
          alert('Không thể kết nối đến server');
      });
  });
});

//xoá bình luận
document.getElementById('form-delete-admin').addEventListener('submit', async function(event) {
  event.preventDefault(); // Ngừng hành động mặc định của form (không reload trang)

  // Lấy giá trị từ input
  const productId = document.getElementById('delete-product-id').value;
  const reviewId = document.getElementById('delete-comment-id').value;
  const role = localStorage.getItem('role');
  // Kiểm tra dữ liệu nhập vào
  if (!productId || !reviewId) {
    alert('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  try {
    // Gọi API xóa bình luận (sử dụng fetch để gửi yêu cầu DELETE)
    const response = await fetch(`/reviews/${productId}/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-role': role,
      },
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }

  } catch (error) {
    alert('Lỗi hệ thống: ' + error.message);
  }
});