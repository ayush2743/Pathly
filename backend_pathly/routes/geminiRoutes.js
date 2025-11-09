import express from "express";
import geminiController from "../controllers/geminiController.js";
import { aiGenerationLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Generate learning map with strict rate limiting
router.post("/generate-map", aiGenerationLimiter, geminiController.generateMap);

export default router;

