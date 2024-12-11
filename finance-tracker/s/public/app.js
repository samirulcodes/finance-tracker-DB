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



// Explanation

// What is the purpose of isRegisterMode?
// It tracks whether the form is in "login" or "register" mode to decide the API endpoint and update the UI accordingly.

// What does updateFormMode do?
// It dynamically updates the form's title, button text, and toggle link to reflect the current mode (login/register).

// How does the code handle server errors?
// It checks the response status and displays an error message from the server (data.error) or a generic message in case of failure.

// Why is e.preventDefault() used in the form submission?
// To prevent the default page reload behavior and handle the form submission using JavaScript.

// Why are username and password sent as JSON in the Fetch request?
// The server expects data in JSON format, and the header Content-Type: application/json specifies this format.

// Why is localStorage used?
// To store the authentication token so it can persist across browser sessions.

// Is storing the token in localStorage secure?
// No, it is vulnerable to XSS attacks. A more secure alternative is storing the token in httpOnly cookies.

// What does window.location.href do?
// Redirects the user to the specified page (finance-tracker.html) after a successful login.

// How does the code decide whether to login or register?
// It uses the value of isRegisterMode to choose the endpoint (/login or /register).

// What would you do if the API URL changes?
// Use a configuration file or environment variables to avoid hardcoding the base URL.

// What is the purpose of Content-Type: application/json in the headers?
// It tells the server that the request body contains JSON-formatted data.

// How does the code handle UI updates dynamically?
// By modifying the text content of specific elements (form-title, auth-button, and toggle-text) based on the mode.

// How can this code handle a network failure?
// It catches errors in the try-catch block and displays a "Server error" message.

// What is the difference between localStorage and sessionStorage?
// localStorage persists data across browser sessions, while sessionStorage clears data when the tab or browser is closed.

// How would you add a "forgot password" feature?
// Add a new API endpoint for password reset and a link on the login page to trigger that process