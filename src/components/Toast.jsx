import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast-notification">
      <AlertTriangle size={18} className="toast-icon" />
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close-btn">
        <X size={14} />
      </button>
    </div>
  );
}
