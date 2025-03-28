
document.getElementById('logoutbtn').addEventListener('click', function () {

    localStorage.removeItem('userID');
    console.log('Đã đăng xuất thành công');
    
    window.location.replace('/');
  });
  // ẩn hiện user information
  document.addEventListener('DOMContentLoaded', () => {
    const userID = localStorage.getItem('userID');
    
    const khoanggiualink = document.getElementById('khoanggiua')
    const signupLink = document.getElementById('signup');
    const loginLink = document.getElementById('login');
    const userInfoLink = document.getElementById('user-information');
  
    if (userID) {

        signupLink.style.display = 'none';
        khoanggiualink.style.display = 'none';
        loginLink.style.display = 'none';
        userInfoLink.style.display = 'inline'; 
    } else {

        userInfoLink.style.display = 'none';
    }
});
