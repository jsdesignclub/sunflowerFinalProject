// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const bcrypt = require('bcryptjs');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes,); // Using user-related routes

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
