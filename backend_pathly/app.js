import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geminiRoutes from "./routes/geminiRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

connectDB();

app.use(cors());
app.use(express.json());

// Apply general rate limiting to all API routes
app.use("/api", generalLimiter);

app.get("/", (req, res) => {
  res.json({ 
    message: "Pathly Backend API is running!", 
    status: "healthy" 
  });
});


app.use("/api/gemini", geminiRoutes);
app.use("/api/skills", skillRoutes);


app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on ${BACKEND_URL}`);
  console.log(`📡 Gemini API: ${BACKEND_URL}/api/gemini/generate-map`);
  console.log(`📚 Skills API: ${BACKEND_URL}/api/skills`);
});