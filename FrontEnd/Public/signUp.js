document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Ngừng việc gửi form theo cách mặc định (trang sẽ không tải lại)
  
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value,
    };
  
    // Kiểm tra tính hợp lệ của dữ liệu trước khi gửi đi
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }
  
    // Gửi dữ liệu tới server thông qua fetch
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(data.message);  // Hiển thị thông báo từ server
        }
      })
      .catch(error => {
        console.error('Error:', error);  // Log lỗi nếu có
      });
  });