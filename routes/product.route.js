import express from 'express';
import { getAnalyticalData, getUptimeData, getOverallReport } from '../controllers/product.controllers.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/analytical', verifyToken, getAnalyticalData);
router.get('/uptime', verifyToken, getUptimeData);
router.get('/overallreport', verifyToken, getOverallReport);

export default router;
