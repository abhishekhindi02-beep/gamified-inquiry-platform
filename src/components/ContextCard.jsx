import React from 'react';
import { AlignLeft, Calculator, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

export function ContextCard({ context, onClearContext }) {
  if (!context || !context.snippet) {
    return (
      <div className="context-card empty">
        <div className="empty-context-hint">
          <CheckCircle2 size={18} className="hint-icon" />
          <span>Select text from the article, or click any formula or diagram below to attach context.</span>
        </div>
      </div>
    );
  }

  const getIcon = () => {
    switch (context.type) {
      case 'formula':
        return <Calculator size={16} className="context-icon formula" />;
      case 'diagram':
        return <ImageIcon size={16} className="context-icon diagram" />;
      case 'text':
      default:
        return <AlignLeft size={16} className="context-icon text" />;
    }
  };

  const getLabel = () => {
    switch (context.type) {
      case 'formula':
        return 'Formula Context Attached';
      case 'diagram':
        return 'Diagram Context Attached';
      case 'text':
      default:
        return 'Highlighted Text Passage';
    }
  };

  return (
    <div className={`context-card active ${context.type}`}>
      <div className="context-header">
        <div className="context-title">
          {getIcon()}
          <span className="context-type-tag">{getLabel()}</span>
          {context.label && <span className="context-label-sub">{context.label}</span>}
        </div>
        <button className="clear-context-btn" onClick={onClearContext} title="Remove attached context">
          <X size={14} />
          <span>Remove</span>
        </button>
      </div>

      <div className="context-body">
        {context.type === 'formula' ? (
          <div className="attached-formula-render">
            <MathRenderer latex={context.snippet} displayMode={true} />
          </div>
        ) : (
          <blockquote className="context-quote">
            "{context.snippet}"
          </blockquote>
        )}
      </div>
    </div>
  );
}
