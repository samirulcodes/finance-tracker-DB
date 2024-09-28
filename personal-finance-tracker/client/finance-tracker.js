document.addEventListener('DOMContentLoaded', () => {
    let totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let savingsGoal = parseFloat(localStorage.getItem('savingsGoal')) || 0;
    let totalExpenses = 0;
    let currentSavings = 0;
  
    const incomeInput = document.getElementById('income-amount');
    const addIncomeBtn = document.getElementById('add-income');
    const totalIncomeText = document.getElementById('total-income');
  
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseCategorySelect = document.getElementById('expense-category');
    const addExpenseBtn = document.getElementById('add-expense');
    const expensesList = document.getElementById('expenses-list');
  
    const savingsGoalInput = document.getElementById('savings-goal');
    const currentSavingsText = document.getElementById('current-savings');
    const goalStatusText = document.getElementById('goal-status');
  
    const breakdownChartCanvas = document.getElementById('breakdown-chart');
    let chart;
  
    // Function to update and display the total income
    function updateIncome() {
      totalIncomeText.textContent = `Total Income: $${totalIncome.toFixed(2)}`;
      localStorage.setItem('totalIncome', totalIncome);  // Save to localStorage
      updateSavingsGoal();
    }
  
    // Function to update the total expenses, savings, and chart
    function updateExpenses() {
      totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
      renderExpenses();
      updateSavingsGoal();
      updateBreakdownChart();
      localStorage.setItem('expenses', JSON.stringify(expenses));  // Save to localStorage
    }
  
    // Function to update savings goal progress and display current savings
    function updateSavingsGoal() {
      currentSavings = totalIncome - totalExpenses;
      const progress = savingsGoal > 0 ? Math.min((currentSavings / savingsGoal) * 100, 100) : 0;
  
      currentSavingsText.textContent = `Current Savings: $${currentSavings.toFixed(2)}`;
      goalStatusText.textContent = `Savings Goal Progress: ${progress.toFixed(2)}%`;
  
      localStorage.setItem('savingsGoal', savingsGoal);  // Save to localStorage
    }
  
    // Function to render expenses in the list
    function renderExpenses() {
      expensesList.innerHTML = '';
      expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.name} - $${expense.amount.toFixed(2)} (${expense.category})`;
        expensesList.appendChild(li);
      });
    }
  
    // Function to update the breakdown chart
    function updateBreakdownChart() {
      if (!breakdownChartCanvas) return; // Ensure the chart canvas exists
  
      const ctx = breakdownChartCanvas.getContext('2d');
      const categories = [...new Set(expenses.map(expense => expense.category))];
      const data = categories.map(category => {
        return expenses
          .filter(expense => expense.category === category)
          .reduce((total, expense) => total + expense.amount, 0);
      });
  
      if (chart) chart.destroy(); // Destroy previous chart
  
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [{
            label: 'Expenses Breakdown',
            data: data,
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  
    // Event listener for adding income
    addIncomeBtn.addEventListener('click', () => {
      const income = parseFloat(incomeInput.value);
      if (!isNaN(income) && income > 0) {
        totalIncome += income;
        updateIncome();
        incomeInput.value = '';
      } else {
        alert('Please enter a valid income amount.');
      }
    });
  
    // Event listener for adding expenses
    addExpenseBtn.addEventListener('click', () => {
      const name = expenseNameInput.value;
      const amount = parseFloat(expenseAmountInput.value);
      const category = expenseCategorySelect.value;
  
      if (name && !isNaN(amount) && amount > 0 && category) {
        expenses.push({ name, amount, category });
        updateExpenses();
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
      } else {
        alert('Please enter valid expense details.');
      }
    });
  
    // Event listener for updating savings goal
    savingsGoalInput.addEventListener('input', () => {
      const goal = parseFloat(savingsGoalInput.value);
      if (!isNaN(goal) && goal >= 0) {
        savingsGoal = goal;
        updateSavingsGoal();
      } else {
        alert('Please enter a valid savings goal.');
      }
    });
  
    // Initial rendering after page load
    updateIncome();
    updateExpenses();
    updateSavingsGoal();
  });
  