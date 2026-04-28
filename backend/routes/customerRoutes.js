import express from 'express';
import customerController from '../controllers/customerController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Apply auth middleware to all customer routes (simplified)
router.use(authenticateToken);

router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.delete);
router.get('/:id/accounts', customerController.getAccounts);

export default router;
