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
