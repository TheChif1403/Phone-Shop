// Lấy ra elements của trang
const registrationForm = document.getElementById('registrationForm');
const Lastnameelement = document.getElementById('Lastname');
const Firstnameelement = document.getElementById('Firstname');
const Usernameelement = document.getElementById('Username');
const Passwordelement = document.getElementById('Password');
const Emailelement = document.getElementById('Email');
const Phoneelement = document.getElementById('Phone');
const agreeTermselement = document.getElementById('agreeTerms');
const successAlert = document.querySelector('.success-alert');

// error elements
const HoError = document.getElementById('HoError');
const TenError = document.getElementById('TenError');
const UsernameError = document.getElementById('UsernameError');
const PasswordError = document.getElementById('PasswordError');
const EmailError = document.getElementById('EmailError');
const SDTError = document.getElementById('SDTError');
const agreeTermsError = document.getElementById('agreeTermsError');

// Sự kiện submit form
registrationForm.addEventListener('submit', function(e) {
    // Chặn load lại trang
    e.preventDefault();
    
    // Reset error messages
    HoError.style.display = "none";
    TenError.style.display = "none";
    UsernameError.style.display = "none";
    PasswordError.style.display = "none";
    EmailError.style.display = "none";
    SDTError.style.display = "none";
    agreeTermsError.style.display = "none";
    
    // Validate dữ liệu đầu vào
    let isValid = true;
    
    // Regex đơn giản cho từng trường
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]{2,}$/; // Họ và tên: chữ cái, dấu cách, ít nhất 2 ký tự
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/; // Username: chữ, số, gạch dưới, ít nhất 4 ký tự
    const passwordRegex = /^.{6,}$/; // Mật khẩu: ít nhất 6 ký tự bất kỳ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email đơn giản
    const phoneRegex = /^[0-9]{10,11}$/; // Số điện thoại: 10-11 chữ số
    
    // Validate Họ
    if (!Lastnameelement.value.trim()) {
        HoError.textContent = "Họ không được để trống";
        HoError.style.display = "block";
        isValid = false;
    } else if (!nameRegex.test(Lastnameelement.value)) {
        HoError.textContent = "Họ chỉ chứa chữ cái và khoảng trắng, ít nhất 2 ký tự";
        HoError.style.display = "block";
        isValid = false;
    }
    
    // Validate Tên
    if (!Firstnameelement.value.trim()) {
        TenError.textContent = "Tên không được để trống";
        TenError.style.display = "block";
        isValid = false;
    } else if (!nameRegex.test(Firstnameelement.value)) {
        TenError.textContent = "Tên chỉ chứa chữ cái và khoảng trắng, ít nhất 2 ký tự";
        TenError.style.display = "block";
        isValid = false;
    }
    
    // Validate Username
    if (!Usernameelement.value.trim()) {
        UsernameError.textContent = "Username không được để trống";
        UsernameError.style.display = "block";
        isValid = false;
    } else if (!usernameRegex.test(Usernameelement.value)) {
        UsernameError.textContent = "Username chỉ chứa chữ, số, gạch dưới, ít nhất 4 ký tự";
        UsernameError.style.display = "block";
        isValid = false;
    }
    
    // Validate Password
    if (!Passwordelement.value.trim()) {
        PasswordError.textContent = "Mật khẩu không được để trống";
        PasswordError.style.display = "block";
        isValid = false;
    } else if (!passwordRegex.test(Passwordelement.value)) {
        PasswordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
        PasswordError.style.display = "block";
        isValid = false;
    }
    
    // Validate Email
    if (!Emailelement.value.trim()) {
        EmailError.textContent = "Email không được để trống";
        EmailError.style.display = "block";
        isValid = false;
    } else if (!emailRegex.test(Emailelement.value)) {
        EmailError.textContent = "Email không hợp lệ (ví dụ: example@domain.com)";
        EmailError.style.display = "block";
        isValid = false;
    }
    
    // Validate Số điện thoại
    if (!Phoneelement.value.trim()) {
        SDTError.textContent = "Số điện thoại không được để trống";
        SDTError.style.display = "block";
        isValid = false;
    } else if (!phoneRegex.test(Phoneelement.value)) {
        SDTError.textContent = "Số điện thoại phải có 10-11 chữ số";
        SDTError.style.display = "block";
        isValid = false;
    }
    
    // Validate Điều khoản
    if (!agreeTermselement.checked) {
        agreeTermsError.textContent = "Bạn phải đồng ý với điều khoản";
        agreeTermsError.style.display = "block";
        isValid = false;
    }
    
    // Nếu tất cả đều hợp lệ
    if (isValid) {
        // Hiển thị thông báo thành công
        successAlert.style.display = "block";
        
        // Reset form
        registrationForm.reset();
        
        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
            successAlert.style.display = "none";
        }, 3000);
    }
});