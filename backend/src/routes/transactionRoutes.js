import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  createTransaction,
  getTransactions,
  getTransactionById
} from '../controllers/transactionController.js';

const router = express.Router();

router.use(protect); // Protect all transaction routes

router.route('/')
  .post(createTransaction)
  .get(getTransactions);

router.get('/:id', getTransactionById);

export default router;
