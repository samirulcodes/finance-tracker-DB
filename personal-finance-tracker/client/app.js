const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById('auth-form');
    const authButton = document.getElementById('auth-button');
    const errorMessageElement = document.getElementById('error-message');
    let isRegisterMode = false;

    // Handle form submission (Register/Login)
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validate input fields
        if (!username || !password) {
            errorMessageElement.textContent = 'Please fill in all fields';
            return;
        }

        // Clear previous error message
        errorMessageElement.textContent = '';

        // Handle Registration or Login depending on the mode
        if (isRegisterMode) {
            try {
                // Register request
                const res = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();
                if (res.status === 201) {
                    alert('Registration successful! Please login.');
                    isRegisterMode = false;  // Switch to login mode
                    updateFormMode();
                } else {
                    errorMessageElement.textContent = data.error || 'Registration failed';
                }
            } catch (err) {
                console.error('Registration error:', err);
                errorMessageElement.textContent = 'Server error during registration';
            }
        } else {
            try {
                // Login request
                const res = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();
                if (res.status === 200) {
                    alert('Login successful');
                    // Store the JWT token in localStorage and redirect to dashboard
                    window.localStorage.setItem('token', data.token);
                    window.location.href = '/finance-tracker.html';  // Redirect to main page after login
                } else {
                    errorMessageElement.textContent = data.error || 'Login failed';
                }
            } catch (err) {
                console.error('Login error:', err);
                errorMessageElement.textContent = 'Server error during login';
            }
        }
    });

    // Toggle between Login and Register modes
    document.getElementById('toggle-link').addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        updateFormMode();
    });

    // Update form title and button based on mode (Register/Login)
    function updateFormMode() {
        if (isRegisterMode) {
            document.getElementById('form-title').textContent = 'Register';
            authButton.textContent = 'Register';
            document.getElementById('toggle-text').innerHTML = 'Already have an account? <a href="#" id="toggle-link">Login</a>';
        } else {
            document.getElementById('form-title').textContent = 'Login';
            authButton.textContent = 'Login';
            document.getElementById('toggle-text').innerHTML = 'Don\'t have an account? <a href="#" id="toggle-link">Register</a>';
        }
    }
});
