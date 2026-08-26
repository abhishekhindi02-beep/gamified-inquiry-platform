import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, Loader2, Lightbulb } from 'lucide-react';

export function QuestionForm({ context, isEvaluating, onSubmitQuestion, resetTrigger }) {
  const [questionText, setQuestionText] = useState('');
  const [validationError, setValidationError] = useState('');

  // Clear input and validation state when workspace is reset
  useEffect(() => {
    if (resetTrigger) {
      setQuestionText('');
      setValidationError('');
    }
  }, [resetTrigger]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!context || !context.snippet) {
      setValidationError('Please select a text passage, formula, or diagram from the article first.');
      return;
    }

    if (!questionText || questionText.trim().length === 0) {
      setValidationError('Please enter a scientific question before submitting.');
      return;
    }

    if (questionText.trim().length < 6) {
      setValidationError('Your question is too short. Please type a complete scientific inquiry.');
      return;
    }

    onSubmitQuestion(questionText.trim());
  };

  // Provide example high-order questions for inspiration
  const sampleInquiries = [
    {
      tier: 'Einstein',
      text: 'Could biological homochirality stem from cosmic electroweak parity violations in protocells?'
    },
    {
      tier: 'Genius',
      text: 'How does quantum tunneling alter kinetic isotope effects across temperatures in enzymes?'
    },
    {
      tier: 'Excellent',
      text: 'How does RuBisCO denaturation affect carbon fixation rates in C3 plants?'
    },
    {
      tier: 'Good',
      text: 'What wavelength of light do chlorophyll pigments absorb?'
    }
  ];

  return (
    <div className="question-form-container">
      <h3 className="form-heading">Formulate Your Scientific Inquiry</h3>
      
      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
          <textarea
            className="question-textarea"
            placeholder="Type your question about the selected context here... (e.g., How does variable X alter quantum state Y under non-equilibrium conditions?)"
            value={questionText}
            onChange={(e) => {
              setQuestionText(e.target.value);
              if (validationError) setValidationError('');
            }}
            rows={4}
            disabled={isEvaluating}
          />
        </div>

        {validationError && (
          <div className="validation-alert">
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        <div className="form-footer">
          <div className="sample-inquiries">
            <span className="sample-label">
              <Lightbulb size={13} />
              <span>Inquiry Inspiration Examples:</span>
            </span>
            <div className="sample-chips">
              {sampleInquiries.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  className={`sample-chip tier-${sample.tier.toLowerCase()}`}
                  onClick={() => setQuestionText(sample.text)}
                  disabled={isEvaluating}
                  title={`Sample ${sample.tier} Tier Question`}
                >
                  <span className="sample-tier">{sample.tier}:</span> {sample.text.substring(0, 45)}...
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isEvaluating || !context || !context.snippet}
          >
            {isEvaluating ? (
              <>
                <Loader2 size={16} className="spinner" />
                <span>Evaluating Inquiry...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Inquiry for AI Evaluation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
