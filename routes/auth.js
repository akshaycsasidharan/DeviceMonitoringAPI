import express from 'express';
import { generateToken } from '../controllers/auth.js';

const router = express.Router();

router.get('/generate-token', generateToken);

export default router;
