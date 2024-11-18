// /controllers/userController.js
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');  // Import DB connection

// User Registration Controller
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
        await pool.query(sql, [username, hashedPassword, role]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err.message);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

// User Login Controller
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const sql = 'SELECT * FROM users WHERE username = ?';
        const [result] = await pool.query(sql, [username]);

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

// Fetch all users controller
const getUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, username, role FROM users');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
};

// Delete User Controller
const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const sql = 'DELETE FROM users WHERE id = ?';
        const [result] = await pool.query(sql, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

module.exports = { registerUser, loginUser, getUsers, deleteUser };
