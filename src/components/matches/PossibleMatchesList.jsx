import React from 'react';
import { Sparkles, ArrowRight, MapPin, Calendar } from 'lucide-react';

export const PossibleMatchesList = ({ matches, onItemClick }) => {
  if (!matches || matches.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
        <Sparkles size={32} style={{ color: 'var(--text-light)', marginBottom: '0.5rem' }} />
        <p>No automated matches found yet above the 50% threshold.</p>
        <p style={{ fontSize: '0.8rem' }}>The Smart Match engine will notify you as soon as a counterpart is posted!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {matches.map((match) => {
        const score = Math.round(match.score);
        return (
          <div
            key={match.id}
            className="card"
            style={{
              padding: '1.25rem',
              borderLeft: '4px solid var(--primary)',
              background: '#fcfdff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <span className="badge badge-student" style={{ marginBottom: '0.25rem' }}>
                  Smart Match Engine
                </span>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                  {match.foundItem?.title || 'Found Item'} &bull; {match.lostItem?.title || 'Lost Item'}
                </h4>
              </div>

              {/* Score pill */}
              <div
                style={{
                  background: score >= 75 ? 'var(--success-light)' : 'var(--warning-light)',
                  color: score >= 75 ? 'var(--success-dark)' : 'var(--warning-dark)',
                  border: `1px solid ${score >= 75 ? 'var(--success)' : 'var(--warning)'}`,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                {score}% Match
              </div>
            </div>

            {/* Match Algorithm Reasoning Explanation */}
            <div style={{ background: '#f1f5f9', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              <strong>Match Factors:</strong> {match.matchReasons}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
                <span><strong>Lost Location:</strong> {match.lostItem?.location}</span>
                <span><strong>Found Location:</strong> {match.foundItem?.location}</span>
              </div>

              {onItemClick && (
                <button
                  onClick={() => onItemClick(match.foundItem)}
                  className="btn btn-primary btn-sm"
                >
                  View Found Item <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
