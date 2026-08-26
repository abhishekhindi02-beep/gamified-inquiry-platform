import React, { useState, useEffect } from 'react';
import { ContentReader } from './ContentReader';
import { ContextCard } from './ContextCard';
import { QuestionForm } from './QuestionForm';
import { EvaluationResult } from './EvaluationResult';

export function InquiryWorkspace({
  articles,
  selectedArticleId,
  onSelectArticle,
  isEvaluating,
  latestEvaluation,
  onSubmitQuestion,
  onViewDashboard,
  onResetEvaluation,
  resetTrigger
}) {
  const [context, setContext] = useState(null);

  // Clear context state when workspace is reset
  useEffect(() => {
    if (resetTrigger) {
      setContext(null);
    }
  }, [resetTrigger]);

  const handleAttachContext = (newContext) => {
    setContext(newContext);
    if (latestEvaluation) {
      onResetEvaluation();
    }
  };

  const handleClearContext = () => {
    setContext(null);
  };

  const handleSubmit = (questionText) => {
    if (!context) return;
    const article = articles.find(a => a.id === selectedArticleId) || {};
    
    onSubmitQuestion({
      contextSnippet: context.snippet,
      contextType: context.type,
      contextLabel: context.label || '',
      question: questionText,
      discipline: article.discipline || 'General Science',
      articleId: selectedArticleId
    });
  };

  const handleAskAnother = () => {
    onResetEvaluation();
    setContext(null);
  };

  return (
    <div className="inquiry-workspace-grid">
      {/* Left Column: Interactive Scientific Reader */}
      <div className="workspace-column reader-column">
        <ContentReader
          articles={articles}
          selectedArticleId={selectedArticleId}
          onSelectArticle={onSelectArticle}
          onAttachContext={handleAttachContext}
          currentContext={context}
        />
      </div>

      {/* Right Column: Context Preview, Question Submission & AI Evaluation */}
      <div className="workspace-column interaction-column">
        <div className="sticky-interaction-panel">
          {/* Active Context Card */}
          <ContextCard
            context={context}
            onClearContext={handleClearContext}
          />

          {/* AI Evaluation Result Card or Submission Form */}
          {latestEvaluation ? (
            <EvaluationResult
              result={latestEvaluation}
              onAskAnother={handleAskAnother}
              onViewDashboard={onViewDashboard}
            />
          ) : (
            <QuestionForm
              context={context}
              isEvaluating={isEvaluating}
              onSubmitQuestion={handleSubmit}
              resetTrigger={resetTrigger}
            />
          )}
        </div>
      </div>
    </div>
  );
}
