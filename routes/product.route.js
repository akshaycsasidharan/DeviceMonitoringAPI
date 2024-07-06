import express from "express";
import { getAnalyticalData , getUptimeData , getOverallReport } from "../controllers/product.controllers.js";
const router = express.Router();


router.get('/analytical', getAnalyticalData);

router.get('/uptime', getUptimeData);

router.get('/overallreport', getOverallReport);

export default router;