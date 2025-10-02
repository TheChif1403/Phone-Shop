// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('Username');
const passwordInput = document.getElementById('Password');
const usernameError = document.getElementById('UsernameError');
const passwordError = document.getElementById('PasswordError');
const successAlert = document.querySelector('.success-alert');

// Constants
const DISPLAY_BLOCK = 'block';
const DISPLAY_NONE = 'none';
const PASSWORD_MIN_LENGTH = 6;
const ALERT_TIMEOUT = 3000;

// Regex Patterns
const USERNAME_REGEX = /^[a-zA-Z0-9_]{4,20}$/; // 4-20 ký tự, chỉ chữ, số và gạch dưới
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/; // Ít nhất 6 ký tự, có ít nhất 1 chữ và 1 số

// Error Messages
const ERROR_MESSAGES = {
    username: {
        required: 'Tên đăng nhập không được để trống',
        invalid: 'Tên đăng nhập phải có 4-20 ký tự, chỉ chứa chữ, số và gạch dưới'
    },
    password: {
        required: 'Mật khẩu không được để trống',
        length: `Mật khẩu phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự`,
        invalid: 'Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số'
    }
};

// Form validation
const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    usernameError.style.display = DISPLAY_NONE;
    passwordError.style.display = DISPLAY_NONE;

    // Validate username
    const usernameValue = usernameInput.value.trim();
    if (!usernameValue) {
        usernameError.textContent = ERROR_MESSAGES.username.required;
        usernameError.style.display = DISPLAY_BLOCK;
        isValid = false;
    } else if (!USERNAME_REGEX.test(usernameValue)) {
        usernameError.textContent = ERROR_MESSAGES.username.invalid;
        usernameError.style.display = DISPLAY_BLOCK;
        isValid = false;
    }

    // Validate password
    const passwordValue = passwordInput.value.trim();
    if (!passwordValue) {
        passwordError.textContent = ERROR_MESSAGES.password.required;
        passwordError.style.display = DISPLAY_BLOCK;
        isValid = false;
    } else if (passwordValue.length < PASSWORD_MIN_LENGTH) {
        passwordError.textContent = ERROR_MESSAGES.password.length;
        passwordError.style.display = DISPLAY_BLOCK;
        isValid = false;
    } else if (!PASSWORD_REGEX.test(passwordValue)) {
        passwordError.textContent = ERROR_MESSAGES.password.invalid;
        passwordError.style.display = DISPLAY_BLOCK;
        isValid = false;
    }

    return isValid;
};

// Form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            successAlert.style.display = DISPLAY_BLOCK;
            loginForm.reset();
            
            setTimeout(() => {
                successAlert.style.display = DISPLAY_NONE;
            }, ALERT_TIMEOUT);
        }
    });
}