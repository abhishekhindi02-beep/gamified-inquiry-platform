import React from 'react';
import { BookOpen, BarChart3, Flame, RefreshCw, Atom } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, streakInfo, onResetSession }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand" onClick={() => setActiveTab('workspace')}>
          <div className="brand-logo">
            <Atom className="icon-atom" size={26} />
          </div>
          <div>
            <h1 className="brand-title">Scientific Inquiry Platform</h1>
            <span className="brand-subtitle">Cultivating First-Principles Scientific Thinking</span>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveTab('workspace')}
          >
            <BookOpen size={18} />
            <span>Inquiry Workspace</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 size={18} />
            <span>Curiosity Dashboard</span>
          </button>
        </nav>

        <div className="nav-actions">
          {streakInfo && (
            <div className={`streak-badge ${streakInfo.einsteinStreakBadgeUnlocked ? 'unlocked' : ''}`} title="Active High-Order Inquiries Streak">
              <Flame size={16} className="flame-icon" />
              <span>{streakInfo.currentStreak || 0} Streak</span>
              {streakInfo.einsteinStreakBadgeUnlocked && (
                <span className="einstein-pill">Einstein Badge Unlocked!</span>
              )}
            </div>
          )}

          <button
            className="reset-btn"
            onClick={onResetSession}
            title="Reset Session Data"
          >
            <RefreshCw size={14} />
            <span>Reset Session</span>
          </button>
        </div>
      </div>
    </header>
  );
}
