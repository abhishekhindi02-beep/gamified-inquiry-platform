import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function MathRenderer({ latex, displayMode = true, className = '' }) {
  const html = useMemo(() => {
    if (!latex) return '';
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false
      });
    } catch (err) {
      console.warn('KaTeX render error:', err);
      return `<span class="katex-fallback">${latex}</span>`;
    }
  }, [latex, displayMode]);

  return (
    <div
      className={`math-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
