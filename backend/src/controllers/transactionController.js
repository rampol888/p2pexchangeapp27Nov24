import Transaction from '../models/Transaction.js';
import Wallet from '../models/wallet.js';
import sequelize from '../config/db.config.js';

export const createTransaction = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { fromWalletId, toWalletId, amount, currency } = req.body;

    // Verify wallet ownership
    const fromWallet = await Wallet.findOne({
      where: { id: fromWalletId, userId: req.user.id }
    });

    if (!fromWallet) {
      return res.status(404).json({ message: 'Source wallet not found' });
    }

    if (fromWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const transaction = await Transaction.create({
      fromWalletId,
      toWalletId,
      amount,
      currency
    }, { transaction: t });

    // Update wallet balances
    await fromWallet.decrement('balance', { 
      by: amount,
      transaction: t 
    });

    await Wallet.increment('balance', {
      by: amount,
      where: { id: toWalletId },
      transaction: t
    });

    await t.commit();
    res.status(201).json(transaction);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const wallets = await Wallet.findAll({
      where: { userId: req.user.id },
      attributes: ['id']
    });

    const walletIds = wallets.map(wallet => wallet.id);

    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { fromWalletId: walletIds },
          { toWalletId: walletIds }
        ]
      }
    });

    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
