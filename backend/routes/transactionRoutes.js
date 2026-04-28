import express from 'express';
import transactionController from '../controllers/transactionController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

router.use(authenticateToken);

const transferSchema = {
  from_account: { required: true, type: 'number' },
  to_account: { required: true, type: 'number' },
  amount: { required: true, type: 'number', min: 1 }
};

router.post('/transfer', validate(transferSchema), transactionController.transfer);
router.get('/account/:account_id', transactionController.getHistory);
router.get('/:id', transactionController.getById);

export default router;
