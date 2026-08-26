import express from 'express';
import { aiEvaluationService } from '../services/aiEvaluationService.js';
import { gamificationService } from '../services/gamificationService.js';
import { contentService } from '../services/contentService.js';
import { inquiryRepository } from '../repository/inquiryRepository.js';

const router = express.Router();

// Helper to extract session ID from request headers or default
const getSessionId = (req) => req.headers['x-session-id'] || 'default_session';

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Gamified Scientific Inquiry API'
  });
});

/**
 * GET /api/content
 * List available scientific learning topics
 */
router.get('/content', (req, res) => {
  try {
    const articles = contentService.getArticles();
    res.json({ success: true, articles });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch content list' });
  }
});

/**
 * GET /api/content/:id
 * Fetch detailed scientific article with formulas & diagrams
 */
router.get('/content/:id', (req, res) => {
  try {
    const article = contentService.getArticleById(req.params.id);
    res.json({ success: true, article });
  } catch (err) {
    res.status(404).json({ success: false, error: 'Article not found' });
  }
});

/**
 * POST /api/evaluate
 * Main Question Evaluation Endpoint
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { contextSnippet, contextType, contextLabel, question, discipline, articleId } = req.body;
    const sessionId = getSessionId(req);

    // Payload validation
    if (!contextSnippet || typeof contextSnippet !== 'string' || contextSnippet.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing scientific context. Please select a passage, formula, or diagram before submitting a question.'
      });
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing question. Please type a scientific inquiry before submitting.'
      });
    }

    if (question.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Question is too short. Please ask a complete scientific question.'
      });
    }

    // Call AI Evaluation Service
    const evalResult = await aiEvaluationService.evaluateQuestion({
      contextSnippet: contextSnippet.trim(),
      contextType: contextType || 'text',
      question: question.trim(),
      discipline: discipline || 'General Science'
    });

    // Save record to repository
    const inquiryRecord = await inquiryRepository.saveInquiry(sessionId, {
      question: question.trim(),
      contextSnippet: contextSnippet.trim(),
      contextType: contextType || 'text',
      contextLabel: contextLabel || '',
      discipline: discipline || 'General Science',
      articleId: articleId || '',
      score: evalResult.score,
      tier: evalResult.tier,
      explanation: evalResult.explanation,
      metrics: evalResult.metrics
    });

    // Fetch updated inquiries for session and calculate progression
    const sessionInquiries = await inquiryRepository.getInquiriesBySession(sessionId);
    const progression = gamificationService.evaluateProgression(sessionInquiries);

    res.json({
      success: true,
      evaluation: evalResult,
      inquiryId: inquiryRecord.id,
      timestamp: inquiryRecord.timestamp,
      progression
    });

  } catch (err) {
    console.error('Error during question evaluation:', err.message);
    res.status(500).json({
      success: false,
      error: 'Unable to evaluate the question right now. Please try again.'
    });
  }
});

/**
 * GET /api/dashboard
 * Fetch student's individual curiosity dashboard analytics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const summary = await inquiryRepository.getDashboardSummary(sessionId);
    const sessionInquiries = await inquiryRepository.getInquiriesBySession(sessionId);
    const progression = gamificationService.evaluateProgression(sessionInquiries);

    res.json({
      success: true,
      dashboard: {
        summary,
        progression
      }
    });
  } catch (err) {
    console.error('Error fetching dashboard analytics:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve curiosity dashboard data.'
    });
  }
});

/**
 * POST /api/reset
 * Reset session inquiries (for demo or testing)
 */
router.post('/reset', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    await inquiryRepository.resetSession(sessionId);
    res.json({ success: true, message: 'Session data reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reset session data' });
  }
});

export default router;
