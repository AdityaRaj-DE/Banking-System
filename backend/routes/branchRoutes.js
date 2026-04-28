import express from 'express';
import branchController from '../controllers/branchController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', branchController.create);
router.get('/', branchController.getAll);
router.get('/:id', branchController.getById);
router.delete('/:id', branchController.delete);

export default router;
