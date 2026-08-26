import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  // Gamification threshold settings (configurable per project guidelines)
  einsteinStreakMinScore: parseInt(process.env.EINSTEIN_STREAK_MIN_SCORE || '8', 10),
  einsteinStreakRequiredCount: parseInt(process.env.EINSTEIN_STREAK_COUNT || '3', 10),
};
