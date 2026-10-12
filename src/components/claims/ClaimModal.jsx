import React, { useState } from 'react';
import { claimService } from '../../services/claimService';
import { X, ShieldCheck, AlertCircle } from 'lucide-react';
import { Toast } from '../common/Toast';

export const ClaimModal = ({ item, isOpen, onClose, onSuccess }) => {
  const [proofDescription, setProofDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofDescription.trim()) {
      setError('Please provide proof details describing your ownership.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await claimService.submitClaim({
        itemId: item.id,
        proofDescription: proofDescription.trim(),
      });

      if (res.success) {
        setProofDescription('');
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to submit claim.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
            <h3>Claim Ownership</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <Toast type="error" message={error} onClose={() => setError('')} />}

            <div style={{ background: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.25rem' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Found at: <strong>{item.location}</strong> &bull; Category: <strong>{item.category}</strong>
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Proof of Ownership <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Describe specific details only the rightful owner would know: unique scratches, stickers, serial numbers, wallpaper, contents, or battery brand..."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                required
              />
              <span className="form-text">
                Be specific. The campus administrator will compare these details before approving your pickup OTP.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
