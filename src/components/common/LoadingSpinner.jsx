import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...', size = 32 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <Loader2 size={size} className="spin-icon" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', marginBottom: '0.75rem' }} />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>{message}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
