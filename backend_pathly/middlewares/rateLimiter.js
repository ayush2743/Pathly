import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    success: false,
    error: {
      message: "Too many requests from this IP, please try again later.",
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true, 
  legacyHeaders: false,
  skipSuccessfulRequests: false, 
});


export const aiGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, 
  message: {
    success: false,
    error: {
      message: "Too many AI generation requests. Please try again in an hour.",
    },
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});