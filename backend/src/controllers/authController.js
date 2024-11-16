import User from '../models/User.js';
import Wallet from '../models/wallet.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import sequelize from '../config/db.config.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    }, { transaction: t });

    // Create wallets for different currencies
    const currencies = ['USD', 'EUR', 'GBP', 'SGD', 'JPY', 'CAD'];
    await Promise.all(currencies.map(currency => 
      Wallet.create({
        userId: user.id,
        currency,
        balance: 0.00
      }, { transaction: t })
    ));

    await t.commit();

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
