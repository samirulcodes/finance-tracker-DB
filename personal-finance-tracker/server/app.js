const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');  // Add this to handle serving static files
const authRoutes = require('./routes');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, '../client')));



// API Routes
app.use('/api', authRoutes);

// Handle any other routes and serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
