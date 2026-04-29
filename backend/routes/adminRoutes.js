import express from 'express';
import adminController from '../controllers/adminController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/backup', adminController.backup);
router.post('/restore', adminController.restore);
router.get('/query-analysis', adminController.analyzeQuery);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/analytics', adminController.getAnalytics);

export default router;
