import express from 'express';
import employeeController from '../controllers/employeeController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', employeeController.create);
router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.get('/branch/:branch_id', employeeController.getByBranchId);
router.delete('/:id', employeeController.delete);

export default router;
