const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Add beneficiary endpoint
router.post('/beneficiaries', async (req, res) => {
    try {
        const {
            userId,
            name,
            currency,
            bankName,
            bankDetails,
            addressLine1,
            city,
            state,
            postalCode,
            country
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO beneficiaries (
                user_id, name, currency, bank_name, bank_details,
                address_line1, city, state, postal_code, country
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                name,
                currency,
                bankName,
                JSON.stringify(bankDetails),
                addressLine1,
                city,
                state,
                postalCode,
                country
            ]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Beneficiary added successfully'
        });
    } catch (error) {
        console.error('Add beneficiary error:', error);
        res.status(500).json({ message: 'Failed to add beneficiary' });
    }
});
