/**
 * Centralized API Client for Frontend Communication with Backend Services
 */

const SESSION_KEY = 'inquiry_platform_session_id';

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

const headers = () => ({
  'Content-Type': 'application/json',
  'X-Session-ID': getSessionId()
});

export const apiClient = {
  async getArticles() {
    const res = await fetch('/api/content', { headers: headers() });
    if (!res.ok) throw new Error('Failed to load articles');
    return res.json();
  },

  async getArticleById(id) {
    const res = await fetch(`/api/content/${id}`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to load article details');
    return res.json();
  },

  async evaluateQuestion({ contextSnippet, contextType, contextLabel, question, discipline, articleId }) {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        contextSnippet,
        contextType,
        contextLabel,
        question,
        discipline,
        articleId
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Question evaluation failed');
    }
    return data;
  },

  async getDashboard() {
    const res = await fetch('/api/dashboard', { headers: headers() });
    if (!res.ok) throw new Error('Failed to load dashboard data');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to load dashboard');
    return data.dashboard;
  },

  async resetSession() {
    const res = await fetch('/api/reset', { method: 'POST', headers: headers() });
    return res.json();
  }
};
