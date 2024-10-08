# finance-tracker-DB

<!-- server.js/app.js -->

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

const SECRET_KEY = 'your secret key';

// Connect to MongoDB
mongoose.connect('your mongoDB connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    savingsGoal: { type: Number, default: 0 },  // Add savings goal
});

const User = mongoose.model('User', userSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    category: String,
    date: { type: Date, default: Date.now },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// User Registration
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY);
    res.json({ token });
});

// Fetch user-specific transactions
app.get('/api/transactions', authenticateToken, async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
});

// Add new transaction
app.post('/api/transactions', authenticateToken, async (req, res) => {
    const { amount, category } = req.body;
    const transaction = new Transaction({
        userId: req.user.id,
        amount,
        category,
    });
    await transaction.save();
    res.json({ message: 'Transaction added successfully' });
});



// Set user's savings goal
app.post('/api/savings-goal', authenticateToken, async (req, res) => {
    const { savingsGoal } = req.body;
    await User.findByIdAndUpdate(req.user.id, { savingsGoal });
    res.json({ message: 'Savings goal updated successfully' });
});

// Get user's savings goal
app.get('/api/savings-goal', authenticateToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ savingsGoal: user.savingsGoal });
});



// Serve the index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
