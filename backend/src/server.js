const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Database connection pool
const pool = mysql.createPool({
    host: 'p2p-exchange.cddjruxsyl3k.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: '88Rosetrap88$',
    database: 'p2p_exchange',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10
});

pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

app.use(cors());
app.use(express.json());

// User signup endpoint
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const connection = await pool.getConnection();
        try {
            // Check if user exists
            const [existingUsers] = await connection.execute(
                'SELECT user_id FROM users WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                return res.status(409).json({
                    message: 'Email already exists'
                });
            }

            // Insert new user
            const [result] = await connection.execute(
                `INSERT INTO users (
                    email, 
                    password_hash, 
                    first_name,
                    last_name,
                    status
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    email,
                    password, // Note: Should be hashed in production
                    'Temporary',
                    'User',
                    'active'
                ]
            );

            res.status(201).json({
                userId: result.insertId,
                token: 'dummy-token',
                message: 'User created successfully'
            });

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Signup error details:', error);
        res.status(500).json({ 
            message: 'Failed to create account',
            details: error.message 
        });
    }
});

// Beneficiary endpoint with better error handling
app.post('/api/beneficiaries', async (req, res) => {
    try {
        const {
            userId,
            firstName,
            lastName,
            email,
            phoneNumber,
            bankName,
            accountNumber,
            swiftCode,
            country,
            city,
            address,
            relationship
        } = req.body;

        console.log('Adding beneficiary:', { userId, firstName, lastName });

        // Validate required fields
        if (!userId || !firstName || !lastName || !bankName || !accountNumber || !country) {
            return res.status(400).json({
                message: 'Missing required fields',
                details: 'Please fill in all required fields'
            });
        }

        const connection = await pool.getConnection();
        try {
            // Check if user exists
            const [users] = await connection.execute(
                'SELECT user_id FROM users WHERE user_id = ?',
                [userId]
            );

            if (users.length === 0) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Check if beneficiary already exists
            const [existingBeneficiaries] = await connection.execute(
                'SELECT id FROM beneficiaries WHERE user_id = ? AND account_number = ?',
                [userId, accountNumber]
            );

            if (existingBeneficiaries.length > 0) {
                return res.status(409).json({
                    message: 'Beneficiary with this account number already exists'
                });
            }

            // Insert beneficiary
            const [result] = await connection.execute(
                `INSERT INTO beneficiaries (
                    user_id,
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    bank_name,
                    account_number,
                    swift_code,
                    country,
                    city,
                    address,
                    relationship,
                    status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    firstName,
                    lastName,
                    email || null,
                    phoneNumber || null,
                    bankName,
                    accountNumber,
                    swiftCode || null,
                    country,
                    city || null,
                    address || null,
                    relationship || null,
                    'active'
                ]
            );

            console.log('Beneficiary added successfully:', {
                id: result.insertId,
                userId
            });

            res.status(201).json({
                id: result.insertId,
                message: 'Beneficiary added successfully'
            });

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Add beneficiary error:', error);
        res.status(500).json({ 
            message: 'Failed to add beneficiary',
            details: error.message 
        });
    }
});

// Payment intent endpoint
app.post('/api/payment/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, userId, metadata } = req.body;
        
        console.log('Received payment request:', { amount, currency, userId, metadata });

        // Validate required fields
        if (!amount || !currency) {
            return res.status(400).json({
                error: 'Missing required fields',
                details: { amount, currency }
            });
        }

        // Convert amount to cents for Stripe
        const amountInCents = Math.round(amount * 100);

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: currency.toLowerCase(),
            payment_method_types: ['card'],
            metadata: {
                userId: userId ? userId.toString() : undefined,
                type: 'exchange',
                ...(metadata || {})
            }
        });

        console.log('Created payment intent:', { 
            id: paymentIntent.id, 
            amount: amountInCents,
            currency 
        });

        // Store in database if userId is provided
        if (userId) {
            const connection = await pool.getConnection();
            try {
                await connection.execute(
                    `INSERT INTO transactions (
                        user_id,
                        amount,
                        currency,
                        transaction_type,
                        status
                    ) VALUES (?, ?, ?, ?, ?)`,
                    [
                        userId,
                        amount,
                        currency.toUpperCase(),
                        'exchange',
                        'pending'
                    ]
                );
            } finally {
                connection.release();
            }
        }

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });

    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Failed to create payment intent'
        });
    }
});

// Existing Wallet funding endpoint
app.post('/api/wallet/fund', async (req, res) => {
    try {
        const { amount, currency, userId } = req.body;
        
        console.log('Wallet funding request:', { amount, currency });

        if (!amount || !currency) {
            return res.status(400).json({
                error: 'Missing amount or currency'
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(parseFloat(amount) * 100),
            currency: currency.toLowerCase(),
            payment_method_types: ['card'],
            metadata: {
                type: 'wallet_funding',
                userId
            }
        });

        // Store wallet funding transaction
        await pool.execute(
            `INSERT INTO transactions (
                user_id,
                payment_intent_id,
                amount,
                currency,
                status,
                type
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                paymentIntent.id,
                amount,
                currency,
                paymentIntent.status,
                'wallet_funding'
            ]
        );

        res.json({
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Wallet funding error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Updated Payment verification endpoint
app.get('/api/payment/verify-payment/:paymentIntentId', async (req, res) => {
    try {
        const { paymentIntentId } = req.params;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        res.json({
            status: paymentIntent.status,
            amount: (paymentIntent.amount / 100).toFixed(2),
            currency: paymentIntent.currency,
            metadata: paymentIntent.metadata
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
