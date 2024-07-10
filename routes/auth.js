import express from "express";
import dotenv from "dotenv";
import { generateToken } from "../controllers/auth.js";

const router = express.Router();

router.get("/generate-token", generateToken);

export default router;
