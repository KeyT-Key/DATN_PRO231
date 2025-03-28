document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();  // Ngừng việc gửi form theo cách mặc định

  const formData = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  // Gửi yêu cầu đăng nhập
  fetch('/login', {  // Đảm bảo URL là '/login' cho API POST
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Server Response:', data);

      if (data.message) {
        alert(data.message);
      }

      // Lưu userID vào localStorage
      if (data.user && data.user.userID && data.user.name) {
        localStorage.setItem('userID', data.user.userID);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('name', data.user.name);
        console.log("User ID saved to localStorage:", localStorage.getItem('userID'));
        console.log("User ID saved to localStorage:", localStorage.getItem('role'));
        // Có thể chuyển hướng người dùng sau khi đăng nhập thành công
        window.location.replace('/');   // Ví dụ: điều hướng về trang chính
      } else {
        alert('Không có userID trong phản hồi từ server!');
      }
    })
    .catch(error => {
      console.error('Error:', error);  // Log lỗi nếu có
      alert('Đã xảy ra lỗi: ' + error.message);  // Hiển thị thông báo lỗi người dùng
    });
});