import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { 
  TrendingUp, Award, Zap, Brain, Sparkles, CheckCircle2, 
  HelpCircle, Compass, Layers, ArrowRight, Activity
} from 'lucide-react';

export function CuriosityDashboard({ onStartInquiry }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiClient.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load curiosity analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Activity size={32} className="spinner" />
        <p>Calculating curiosity analytics & progression metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={loadDashboard} className="retry-btn">Retry</button>
      </div>
    );
  }

  const { summary, progression } = dashboardData || {};
  const totalInquiries = summary?.totalInquiries || 0;
  const tierDistribution = summary?.tierDistribution || { Good: 0, Excellent: 0, Genius: 0, Einstein: 0 };
  const milestones = progression?.milestones || [];

  return (
    <div className="curiosity-dashboard">
      {/* Dashboard Top Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Individual Curiosity Dashboard</h2>
          <p className="dashboard-subtitle">Personal cognitive analytics tracking scientific inquiry quality, originality, and progression.</p>
        </div>
        <button className="start-inquiry-btn" onClick={onStartInquiry}>
          <span>Ask New Question</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* KPI Cards Bar */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Total Inquiries</span>
            <HelpCircle size={18} className="kpi-icon blue" />
          </div>
          <div className="kpi-value">{totalInquiries}</div>
          <p className="kpi-sub">Submitted questions</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Avg Originality</span>
            <TrendingUp size={18} className="kpi-icon emerald" />
          </div>
          <div className="kpi-value">{summary?.avgOriginality || 0}<span className="kpi-denom">/10</span></div>
          <p className="kpi-sub">Original thinking metric</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Highest Score</span>
            <Brain size={18} className="kpi-icon purple" />
          </div>
          <div className="kpi-value">{summary?.highestScore || 0}<span className="kpi-denom">/10</span></div>
          <p className="kpi-sub">Peak quality tier</p>
        </div>

        <div className="kpi-card highlight-streak">
          <div className="kpi-header">
            <span className="kpi-title">Active Streak</span>
            <Zap size={18} className="kpi-icon amber" />
          </div>
          <div className="kpi-value">{progression?.currentStreak || 0}</div>
          <p className="kpi-sub">
            {progression?.einsteinStreakBadgeUnlocked ? '★ Einstein Badge Unlocked' : 'Consecutive inquiries'}
          </p>
        </div>
      </div>

      {/* Main Analytics Content Section */}
      {totalInquiries === 0 ? (
        <div className="empty-dashboard-card">
          <Sparkles size={48} className="empty-sparkle-icon" />
          <h3>No Inquiry Data Yet</h3>
          <p>You haven't submitted any questions in this session yet. Explore scientific articles, select text, formulas, or diagrams, and submit your questions to unlock curiosity analytics!</p>
          <button className="start-inquiry-btn lg" onClick={onStartInquiry}>
            <span>Explore Scientific Articles</span>
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="dashboard-content-grid">
          {/* Left Column: Tier Distribution & Discipline Trends */}
          <div className="dash-col">
            {/* Tier Distribution Breakdown */}
            <div className="dash-card">
              <div className="card-head">
                <Layers size={18} />
                <h3>Question Quality Tier Distribution</h3>
              </div>
              <p className="card-desc">Breakdown of submitted questions across the 4 cognitive quality tiers:</p>

              <div className="tier-bars-list">
                {Object.entries(tierDistribution).map(([tierName, count]) => {
                  const pctVal = totalInquiries > 0 ? ((count / totalInquiries) * 100) : 0;
                  const pctStr = pctVal % 1 === 0 ? pctVal.toString() : pctVal.toFixed(1);
                  return (
                    <div key={tierName} className={`tier-bar-item tier-${tierName.toLowerCase()}`}>
                      <div className="bar-labels">
                        <span className="tier-name">
                          <strong>{tierName}</strong>
                          <span className="tier-range-tag">
                            {tierName === 'Good' && ' (Score 1-4)'}
                            {tierName === 'Excellent' && ' (Score 5-7)'}
                            {tierName === 'Genius' && ' (Score 8-9)'}
                            {tierName === 'Einstein' && ' (Score 10)'}
                          </span>
                        </span>
                        <span className="tier-count">{count} questions ({pctStr}%)</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${pctVal}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Discipline Inquiry Trends */}
            <div className="dash-card">
              <div className="card-head">
                <Compass size={18} />
                <h3>Inquiry Trends Across Disciplines</h3>
              </div>

              {summary?.disciplineTrends && summary.disciplineTrends.length > 0 ? (
                <div className="discipline-table-container">
                  <table className="discipline-table">
                    <thead>
                      <tr>
                        <th>Discipline</th>
                        <th>Inquiries</th>
                        <th>Avg Quality Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.disciplineTrends.map((disc, idx) => (
                        <tr key={idx}>
                          <td><strong>{disc.discipline}</strong></td>
                          <td>{disc.count}</td>
                          <td>
                            <span className="score-pill">{disc.avgScore} / 10</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty-sub">No discipline trend data recorded.</p>
              )}
            </div>
          </div>

          {/* Right Column: Milestones & Einstein Streak Badge */}
          <div className="dash-col">
            {/* Einstein Streak Badge Showcase Card */}
            <div className={`dash-card streak-badge-showcase ${progression?.einsteinStreakBadgeUnlocked ? 'unlocked' : ''}`}>
              <div className="badge-showcase-header">
                <Award size={32} className="award-badge-icon" />
                <div>
                  <h3 className="badge-title">"Einstein Streak" Badge</h3>
                  <span className="badge-status">
                    {progression?.einsteinStreakBadgeUnlocked ? 'STATUS: UNLOCKED ★' : 'STATUS: IN PROGRESS'}
                  </span>
                </div>
              </div>

              <p className="badge-rule">
                <strong>Progression Goal:</strong> Achieve consistent high-order inquiries (Genius or Einstein Tier, Score ≥ 8).
              </p>

              <div className="badge-progress-box">
                <div className="progress-info">
                  <span>Current High-Order Streak: <strong>{progression?.highOrderStreak || 0}</strong></span>
                  <span>Configured Target: {progression?.einsteinStreakThreshold || 3}</span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill gold" 
                    style={{ width: `${Math.min(((progression?.highOrderStreak || 0) / (progression?.einsteinStreakThreshold || 3)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Milestones & Progression Timeline */}
            <div className="dash-card">
              <div className="card-head">
                <Brain size={18} />
                <h3>Progression & Milestones</h3>
              </div>

              <div className="milestones-list">
                {milestones.map((m) => (
                  <div key={m.id} className={`milestone-item ${m.achieved ? 'achieved' : 'locked'}`}>
                    <div className="milestone-icon">
                      {m.achieved ? <CheckCircle2 size={20} className="check" /> : <div className="dot"></div>}
                    </div>
                    <div className="milestone-content">
                      <div className="milestone-title-row">
                        <span className="m-title">{m.title}</span>
                        {m.achieved && <span className="unlocked-tag">Unlocked</span>}
                      </div>
                      <p className="m-desc">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Inquiries History */}
            {summary?.recentInquiries && summary.recentInquiries.length > 0 && (
              <div className="dash-card">
                <div className="card-head">
                  <Activity size={18} />
                  <h3>Recent Inquiry History</h3>
                </div>

                <div className="recent-history-list">
                  {summary.recentInquiries.map((inq) => (
                    <div key={inq.id} className="history-item">
                      <div className="history-head">
                        <span className={`history-tier-pill tier-${inq.tier.toLowerCase()}`}>
                          {inq.score}/10 — {inq.tier}
                        </span>
                        <span className="history-time">{new Date(inq.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="history-q">"{inq.question}"</p>
                      <span className="history-context">Context: {inq.contextSnippet.substring(0, 60)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
