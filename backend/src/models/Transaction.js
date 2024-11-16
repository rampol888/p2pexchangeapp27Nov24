import { DataTypes } from 'sequelize';
import sequelize from '../config/db.config.js';
import Wallet from './wallet.js';
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fromWalletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Wallet,
      key: 'id'
    }
  },
  toWalletId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Wallet,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  }
});

export default Transaction;
