import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Check, Layers } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

export function ContentReader({ articles, selectedArticleId, onSelectArticle, onAttachContext, currentContext }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedArticleId) {
      setLoading(true);
      fetch(`/api/content/${selectedArticleId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setArticle(data.article);
          }
        })
        .catch(err => console.error('Failed to load article:', err))
        .finally(() => setLoading(false));
    }
  }, [selectedArticleId]);

  // Handle text selection from passage
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection) return;
    const selectedText = selection.toString().trim();
    
    if (selectedText.length > 5) {
      onAttachContext({
        type: 'text',
        snippet: selectedText,
        label: article ? article.title : 'Article Text'
      });
    }
  };

  const isSelected = (type, snippet) => {
    return currentContext && currentContext.type === type && currentContext.snippet === snippet;
  };

  if (loading) {
    return (
      <div className="content-reader-skeleton">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="content-reader-empty">
        <BookOpen size={32} />
        <p>Select a scientific topic to begin inquiry.</p>
      </div>
    );
  }

  return (
    <div className="content-reader">
      {/* Topic Switcher Bar */}
      <div className="topic-bar">
        <span className="topic-bar-label">
          <Layers size={14} />
          <span>Scientific Topic:</span>
        </span>
        <div className="topic-chips">
          {articles.map(a => (
            <button
              key={a.id}
              className={`topic-chip ${a.id === selectedArticleId ? 'active' : ''}`}
              onClick={() => onSelectArticle(a.id)}
            >
              {a.title}
            </button>
          ))}
        </div>
      </div>

      {/* Article Header */}
      <div className="article-header">
        <div className="discipline-tag">{article.discipline}</div>
        <h2 className="article-title">{article.title}</h2>
        <p className="article-summary">{article.summary}</p>
      </div>

      {/* Interactive Article Content with Highlight Listener */}
      <div 
        className="article-body-container"
        onMouseUp={handleTextSelection}
        title="Highlight any text passage to attach as question context"
      >
        <div className="selection-prompt-banner">
          <Sparkles size={14} />
          <span>Highlight any passage below, or click an equation or diagram to attach context to your question.</span>
        </div>

        <div className="article-text-body">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Render Formulas Section */}
      {article.formulas && article.formulas.length > 0 && (
        <div className="context-section formulas-section">
          <h3 className="section-title">Formulas & Equations</h3>
          <p className="section-subtitle">Click an equation to attach it to your scientific inquiry:</p>

          <div className="formula-cards-grid">
            {article.formulas.map(f => {
              const active = isSelected('formula', f.latex);
              return (
                <div
                  key={f.id}
                  className={`formula-card ${active ? 'selected' : ''}`}
                  onClick={() => onAttachContext({
                    type: 'formula',
                    snippet: f.latex,
                    label: f.label
                  })}
                >
                  <div className="formula-header">
                    <span className="formula-label">{f.label}</span>
                    {active && <span className="attached-badge"><Check size={12} /> Attached</span>}
                  </div>

                  <div className="formula-math-display">
                    <MathRenderer latex={f.latex} displayMode={true} />
                  </div>

                  <p className="formula-explanation">{f.explanation}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Render Diagrams Section */}
      {article.diagrams && article.diagrams.length > 0 && (
        <div className="context-section diagrams-section">
          <h3 className="section-title">Scientific Diagrams</h3>
          <p className="section-subtitle">Click a diagram to attach visual context to your inquiry:</p>

          <div className="diagram-cards-grid">
            {article.diagrams.map(d => {
              const active = isSelected('diagram', d.caption);
              return (
                <div
                  key={d.id}
                  className={`diagram-card ${active ? 'selected' : ''}`}
                  onClick={() => onAttachContext({
                    type: 'diagram',
                    snippet: d.caption,
                    label: d.title
                  })}
                >
                  <div className="diagram-header">
                    <span className="diagram-title">{d.title}</span>
                    {active && <span className="attached-badge"><Check size={12} /> Attached</span>}
                  </div>
                  <div className="diagram-visual-placeholder">
                    <div className="svg-diagram-graphic">
                      <div className="graphic-node source">Input State</div>
                      <div className="graphic-arrow">──────▶</div>
                      <div className="graphic-node quantum">Quantum State</div>
                      <div className="graphic-arrow">──────▶</div>
                      <div className="graphic-node target">Output Reaction</div>
                    </div>
                  </div>
                  <p className="diagram-caption">{d.caption}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
