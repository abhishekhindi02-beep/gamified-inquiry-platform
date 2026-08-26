import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InquiryWorkspace } from './components/InquiryWorkspace';
import { CuriosityDashboard } from './components/CuriosityDashboard';
import { Toast } from './components/Toast';
import { apiClient } from './services/apiClient';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Workspace UI State vs Session Analytics State Separation
  const [latestEvaluation, setLatestEvaluation] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  const [streakInfo, setStreakInfo] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Load initial content topics and dashboard summary
  useEffect(() => {
    loadContent();
    refreshStreak();
  }, []);

  const loadContent = async () => {
    try {
      const data = await apiClient.getArticles();
      if (data.success && data.articles.length > 0) {
        setArticles(data.articles);
        setSelectedArticleId(data.articles[0].id);
      }
    } catch (err) {
      showToast('Failed to load scientific content topics.');
    }
  };

  const refreshStreak = async () => {
    try {
      const dash = await apiClient.getDashboard();
      if (dash && dash.progression) {
        setStreakInfo(dash.progression);
      }
    } catch (err) {
      // Silent error for header badge
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 6000);
  };

  const handleSubmitQuestion = async (payload) => {
    try {
      setIsEvaluating(true);
      setLatestEvaluation(null);

      const result = await apiClient.evaluateQuestion(payload);
      setLatestEvaluation(result);

      if (result.progression) {
        setStreakInfo(result.progression);
      }
    } catch (err) {
      console.error('Error submitting question:', err);
      showToast(err.message || 'An error occurred while evaluating your question. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  /**
   * Resets the Inquiry Workspace state (clears attached context, input question, evaluation card),
   * preparing a clean workspace for a new question WITHOUT deleting session analytics data.
   */
  const handleResetSession = () => {
    setLatestEvaluation(null);
    setResetTrigger(prev => prev + 1);
    refreshStreak();
    showToast('Inquiry workspace cleared. Ready for a new question.');
  };

  /**
   * Switches to Inquiry Workspace and clears workspace state for a new question.
   */
  const handleStartNewInquiry = () => {
    setActiveTab('workspace');
    handleResetSession();
  };

  return (
    <div className="app-shell">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakInfo={streakInfo}
        onResetSession={handleResetSession}
      />

      <main className="main-content">
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />

        {activeTab === 'workspace' ? (
          <InquiryWorkspace
            articles={articles}
            selectedArticleId={selectedArticleId}
            onSelectArticle={setSelectedArticleId}
            isEvaluating={isEvaluating}
            latestEvaluation={latestEvaluation}
            onSubmitQuestion={handleSubmitQuestion}
            onViewDashboard={() => setActiveTab('dashboard')}
            onResetEvaluation={() => setLatestEvaluation(null)}
            resetTrigger={resetTrigger}
          />
        ) : (
          <CuriosityDashboard
            onStartInquiry={handleStartNewInquiry}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Scientific Inquiry Platform — Human-Centric Cognitive Skill Development Engine</p>
      </footer>
    </div>
  );
}
