import express from 'express';
import accountController from '../controllers/accountController.js';
import transactionController from '../controllers/transactionController.js';
import { authenticateToken } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

router.use(authenticateToken);

const createAccountSchema = {
  customer_id: { required: true, type: 'number' },
  account_type: { required: true }
};

const transactionSchema = {
  amount: { required: true, type: 'number', min: 1 }
};

router.post('/', validate(createAccountSchema), accountController.create);
router.get('/:id', accountController.getById);
router.get('/customer/:id', accountController.getByCustomerId);
router.patch('/:id/status', accountController.updateStatus);

// Transaction endpoints on account resource
router.post('/:id/deposit', validate(transactionSchema), transactionController.deposit);
router.post('/:id/withdraw', validate(transactionSchema), transactionController.withdraw);

export default router;
