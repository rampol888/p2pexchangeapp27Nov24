const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Signup endpoint
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into database
        const [result] = await pool.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );
        
        res.status(201).json({
            userId: result.insertId,
            token: 'dummy-token', // Implement proper JWT token generation
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Signup error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Failed to create account' });
        }
    }
}); 