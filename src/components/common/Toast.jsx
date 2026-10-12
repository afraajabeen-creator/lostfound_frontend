import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const config = {
    success: { bg: 'var(--success-light)', border: 'var(--success)', color: 'var(--success-dark)', icon: <CheckCircle2 size={18} /> },
    error: { bg: 'var(--danger-light)', border: 'var(--danger)', color: 'var(--danger-dark)', icon: <AlertCircle size={18} /> },
    info: { bg: 'var(--info-light)', border: 'var(--info)', color: 'var(--primary-dark)', icon: <Info size={18} /> },
  }[type] || { bg: 'var(--info-light)', border: 'var(--info)', color: 'var(--primary-dark)', icon: <Info size={18} /> };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        marginBottom: '1rem',
        fontSize: '0.9rem',
        fontWeight: 500,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {config.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: config.color, padding: '0.2rem' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
