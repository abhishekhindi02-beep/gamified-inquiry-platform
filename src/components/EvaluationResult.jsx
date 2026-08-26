import React from 'react';
import { Award, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export function EvaluationResult({ result, onAskAnother, onViewDashboard }) {
  if (!result || !result.evaluation) return null;

  const { score, tier, explanation, metrics } = result.evaluation;
  const progression = result.progression;

  const getTierClass = (t) => {
    switch (t) {
      case 'Einstein': return 'tier-einstein';
      case 'Genius': return 'tier-genius';
      case 'Excellent': return 'tier-excellent';
      case 'Good':
      default: return 'tier-good';
    }
  };

  const getTierDescription = (t) => {
    switch (t) {
      case 'Einstein': return 'First-Principles Synthesis — Bridges disparate domains & builds novel thought experiments';
      case 'Genius': return 'Edge Cases & Anomalies — Probes boundary conditions & non-obvious trade-offs';
      case 'Excellent': return 'System Dynamics — Explores cause-and-effect relationships across variables';
      case 'Good':
      default: return 'Fact-seeking & Recall — Baseline definitions & direct mechanism clarification';
    }
  };

  return (
    <div className={`evaluation-result-card ${getTierClass(tier)}`}>
      <div className="eval-header">
        <div className="eval-badge-group">
          <span className="eval-label">AI Quality Evaluation</span>
          <span className={`tier-pill ${getTierClass(tier)}`}>
            <Sparkles size={14} />
            <span>Tier: {tier}</span>
          </span>
        </div>

        <div className="score-ring-container">
          <div className="score-number-display">
            <span className="score-val">{score}</span>
            <span className="score-denom">/10</span>
          </div>
        </div>
      </div>

      <div className="tier-focus-banner">
        <strong>Focus:</strong> {getTierDescription(tier)}
      </div>

      <div className="eval-explanation-box">
        <h4 className="box-title">Pedagogical Micro-Explanation</h4>
        <p className="micro-explanation-text">"{explanation}"</p>
      </div>

      {/* Metric Breakdown Progress Bars */}
      {metrics && (
        <div className="metrics-breakdown">
          <h4 className="breakdown-title">Cognitive Skill Breakdown</h4>
          <div className="metrics-grid">
            <div className="metric-row">
              <div className="metric-info">
                <span>Originality</span>
                <span className="metric-val">{metrics.originality}/10</span>
              </div>
              <div className="metric-bar-bg">
                <div className="metric-bar-fill originality" style={{ width: `${metrics.originality * 10}%` }}></div>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-info">
                <span>Mechanistic Depth</span>
                <span className="metric-val">{metrics.mechanisticDepth}/10</span>
              </div>
              <div className="metric-bar-bg">
                <div className="metric-bar-fill depth" style={{ width: `${metrics.mechanisticDepth * 10}%` }}></div>
              </div>
            </div>

            <div className="metric-row">
              <div className="metric-info">
                <span>Reasoning Rigor</span>
                <span className="metric-val">{metrics.reasoningRigor}/10</span>
              </div>
              <div className="metric-bar-bg">
                <div className="metric-bar-fill rigor" style={{ width: `${metrics.reasoningRigor * 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progression & Streak Alert Banner */}
      {progression && (
        <div className="progression-banner">
          <div className="streak-stat">
            <Zap size={16} className="zap-icon" />
            <span>Total Session Inquiries: <strong>{progression.currentStreak}</strong></span>
          </div>

          {progression.einsteinStreakBadgeUnlocked && (
            <div className="einstein-unlocked-alert">
              <Award size={18} className="award-icon" />
              <span><strong>"Einstein Streak" Badge Unlocked!</strong> You achieved consistent high-order inquiries!</span>
            </div>
          )}
        </div>
      )}

      <div className="eval-actions">
        <button className="ask-another-btn" onClick={onAskAnother}>
          <CheckCircle size={16} />
          <span>Ask Another Question</span>
        </button>

        <button className="view-dashboard-btn" onClick={onViewDashboard}>
          <span>View Curiosity Dashboard</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
