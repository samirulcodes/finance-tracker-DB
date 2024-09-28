// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });

// module.exports = mongoose.model('User', UserSchema);


// models/User.js (Assume you already have this)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Other fields, e.g., email if needed
});

module.exports = mongoose.model('User', userSchema);

// models/Transaction.js (New Schema)
const transactionSchema = new Schema({
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Associate transaction with a user
});

module.exports = mongoose.model('Transaction', transactionSchema);
