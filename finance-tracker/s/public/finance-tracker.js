const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }

    const transactionList = document.getElementById('transaction-list');
    const addTransactionButton = document.getElementById('add-transaction');
    const logoutButton = document.getElementById('logout-btn');
    const setGoalButton = document.getElementById('set-goal-btn');
    const savingsGoalInput = document.getElementById('savings-goal');
    const goalNotification = document.getElementById('goal-notification');

    fetchTransactions();

    // Add transaction event
    addTransactionButton.addEventListener('click', async () => {
        const amount = document.getElementById('transaction-amount').value;
        const category = document.getElementById('transaction-category').value;

        if (amount && category) {
            await addTransaction(amount, category);
            fetchTransactions();
        } else {
            alert('Please fill in both fields.');
        }
    });

    // Set savings goal event
    setGoalButton.addEventListener('click', async () => {
        const savingsGoal = savingsGoalInput.value;
        if (savingsGoal) {
            await setSavingsGoal(savingsGoal);
            savingsGoalInput.value = '';  // Clear input
            fetchTransactions();  // Refresh transactions
        } else {
            alert('Please enter a savings goal.');
        }
    });

    // Logout button event
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    // Fetch transactions from server
    async function fetchTransactions() {
        const res = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const transactions = await res.json();
        transactionList.innerHTML = '';
        let totalExpenses = 0;

        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.amount}</td>
                <td>${transaction.category}</td>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
            `;
            transactionList.appendChild(row);
            totalExpenses += transaction.amount;  // Calculate total expenses
        });

        // Check if expenses exceed the savings goal
        const userGoal = await fetchSavingsGoal();
        if (userGoal !== null && totalExpenses > userGoal) {
            goalNotification.textContent = `Alert: Your expenses (₹${totalExpenses}) exceed your savings goal of ₹${userGoal}.`;
            goalNotification.style.color = 'red';
        } else {
            goalNotification.textContent = ''; // Clear notification if within limit
        }
    }

    // Fetch user's savings goal from the server
    async function fetchSavingsGoal() {
        const res = await fetch(`${API_BASE_URL}/savings-goal`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data.savingsGoal;  // Return the user's savings goal
    }

    // Set user's savings goal on the server
    async function setSavingsGoal(savingsGoal) {
        await fetch(`${API_BASE_URL}/savings-goal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ savingsGoal })
        });
    }

    // Add transaction to the server
    async function addTransaction(amount, category) {
        await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount, category })
        });
    }
});



// Explanation

// Important Parts for Interview Questions

// Authentication with Tokens:
// Question: How does the app ensure secure communication with the backend?
// Answer: The app sends the token as a Bearer token in the Authorization header for every API request.

// Dynamic UI Updates:
// Question: How does the app update the transaction list dynamically?
// Answer: The fetchTransactions() function retrieves the data and uses innerHTML and document.createElement to update the table.

// Error Handling:
// Question: What happens if the server returns an error or the user enters invalid data?
// Answer: While basic validation (e.g., checking if fields are filled) is done on the client side, the code could benefit from additional error handling for server responses.

// Savings Goal Logic:
// Question: How does the app notify the user if they exceed their savings goal?
// Answer: The total expenses are compared to the savings goal fetched from the server, and a warning message is shown if they exceed it.
// Code Optimization:

// Question: Can the code be optimized?
// Answer: Yes, for example:
// Combine repeated fetch logic into reusable functions.
// Add error handling for fetch requests.

// Security:
// Question: What are the security concerns in this implementation?
// Answer: The token is stored in localStorage, which is accessible via JavaScript. For better security, it could be stored in HttpOnly cookies.