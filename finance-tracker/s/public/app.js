const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    const authButton = document.getElementById('auth-button');
    const errorMessageElement = document.getElementById('error-message');
    let isRegisterMode = false;

    // Toggle between login and register modes
    document.getElementById('toggle-link').addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        updateFormMode();
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        errorMessageElement.textContent = '';

        try {
            const res = await fetch(`${API_BASE_URL}/${isRegisterMode ? 'register' : 'login'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (res.ok) {
                if (isRegisterMode) {
                    alert('Registration successful! Please login.');
                    isRegisterMode = false;
                    updateFormMode();
                } else {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'finance-tracker.html';
                }
            } else {
                errorMessageElement.textContent = data.error || 'Something went wrong.';
            }
        } catch (err) {
            errorMessageElement.textContent = 'Server error. Please try again later.';
        }
    });

    function updateFormMode() {
        document.getElementById('form-title').textContent = isRegisterMode ? 'Register' : 'Login';
        authButton.textContent = isRegisterMode ? 'Register' : 'Login';
        document.getElementById('toggle-text').innerHTML = isRegisterMode ? 'Already have an account? <a href="#">Login</a>' : 'Don\'t have an account? <a href="#">Register</a>';
    }
});
