import React, { useState, useEffect } from 'react';
import { claimService } from '../../services/claimService';
import { ClaimStatusBadge } from '../../components/claims/ClaimStatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { 
  FileCheck, 
  CheckCircle, 
  XCircle, 
  KeyRound, 
  X, 
  User, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const ManageClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal Dialog states
  const [rejectDialogClaim, setRejectDialogClaim] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [otpDialogClaim, setOtpDialogClaim] = useState(null);
  const [inputOtp, setInputOtp] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimService.getAllClaims();
      if (res.success) {
        setClaims(res.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to retrieve claims.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  // Admin approves claim
  const handleApprove = async (claimId) => {
    if (!window.confirm('Approve this claim? This will automatically generate a secure 6-digit Handover OTP for the student.')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await claimService.updateClaimStatus(claimId, { status: 'VERIFIED' });
      if (res.success) {
        setToast({
          type: 'success',
          message: 'Claim approved! 6-digit Handover OTP generated for the claimant.',
        });
        fetchClaims();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error approving claim.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Admin submits rejection
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await claimService.updateClaimStatus(rejectDialogClaim.id, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
      });
      if (res.success) {
        setToast({ type: 'info', message: 'Claim rejected with notification sent to student.' });
        setRejectDialogClaim(null);
        setRejectionReason('');
        fetchClaims();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Error rejecting claim.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Admin verifies OTP at desk
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!inputOtp || inputOtp.trim().length !== 6) {
      alert('Please enter the full 6-digit OTP.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await claimService.verifyOtp(otpDialogClaim.id, inputOtp.trim());
      if (res.success) {
        setToast({
          type: 'success',
          message: 'OTP Verified! Handover completed and item permanently marked as RECOVERED.',
        });
        setOtpDialogClaim(null);
        setInputOtp('');
        fetchClaims();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP code. Please verify code from student.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1>Manage Claims &amp; Handover OTP</h1>
        <p>Review student ownership proofs, approve/reject claims, and complete physical pickup handovers</p>
      </div>

      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Loading all campus claims..." />
      ) : claims.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <FileCheck size={40} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3>No claims found</h3>
          <p>There are currently no ownership claims submitted by students.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {claims.map((claim) => (
            <div key={claim.id} className="card">
              <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>
                    {claim.itemTitle}
                  </h3>
                  <p style={{ fontSize: '0.825rem' }}>
                    Item ID: #{claim.itemId} &bull; Category: <strong>{claim.itemCategory}</strong> &bull; Location: <strong>{claim.itemLocation}</strong>
                  </p>
                </div>
                <div>
                  <ClaimStatusBadge status={claim.status} />
                </div>
              </div>

              <div className="card-body">
                {/* Claimant profile */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                  <div><strong>Claimant:</strong> {claim.claimant?.fullName}</div>
                  <div><strong>Email:</strong> {claim.claimant?.email}</div>
                  {claim.claimant?.phoneNumber && <div><strong>Phone:</strong> {claim.claimant?.phoneNumber}</div>}
                  <div><strong>Submitted:</strong> {new Date(claim.createdAt).toLocaleDateString()}</div>
                </div>

                {/* Submitted proof */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Ownership Proof Description:
                  </h4>
                  <p style={{ fontSize: '0.925rem', lineHeight: 1.5, background: 'white', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    {claim.proofDescription}
                  </p>
                </div>

                {/* Rejection reason if rejected */}
                {claim.status === 'REJECTED' && claim.rejectionReason && (
                  <div style={{ marginTop: '0.75rem', background: 'var(--danger-light)', border: '1px solid var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--danger-dark)', fontSize: '0.875rem' }}>
                    <strong>Rejection Reason:</strong> {claim.rejectionReason}
                  </div>
                )}

                {/* Recovered info */}
                {claim.status === 'RECOVERED' && (
                  <div style={{ marginTop: '0.75rem', background: 'var(--success-light)', border: '1px solid var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: 'var(--success-dark)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={18} />
                    <span>Handover Verified &amp; Recovered on {claim.otpVerifiedAt ? new Date(claim.otpVerifiedAt).toLocaleString() : 'Pickup Desk'}.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                {claim.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => setRejectDialogClaim(claim)}
                      className="btn btn-outline-danger btn-sm"
                      disabled={actionLoading}
                    >
                      <XCircle size={16} /> Reject Claim
                    </button>
                    <button
                      onClick={() => handleApprove(claim.id)}
                      className="btn btn-success btn-sm"
                      disabled={actionLoading}
                    >
                      <CheckCircle size={16} /> Approve &amp; Generate OTP
                    </button>
                  </>
                )}

                {claim.status === 'VERIFIED' && (
                  <button
                    onClick={() => {
                      setOtpDialogClaim(claim);
                      setInputOtp('');
                    }}
                    className="btn btn-primary btn-sm"
                    disabled={actionLoading}
                  >
                    <KeyRound size={16} /> Enter Pickup Handover OTP
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal Dialog */}
      {rejectDialogClaim && (
        <div className="modal-overlay" onClick={() => setRejectDialogClaim(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Reject Claim</h3>
              <button className="close-btn" onClick={() => setRejectDialogClaim(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRejectSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Please state why this claim for <strong>{rejectDialogClaim.itemTitle}</strong> is being rejected:
                </p>
                <div className="form-group">
                  <label className="form-label">Reason for Rejection <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="e.g. Serial number does not match item, details inconsistent with item features..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRejectDialogClaim(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={actionLoading}>
                  {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Handover OTP Modal Dialog */}
      {otpDialogClaim && (
        <div className="modal-overlay" onClick={() => setOtpDialogClaim(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <KeyRound size={20} style={{ color: 'var(--primary)' }} />
                <h3>Verify Pickup Handover OTP</h3>
              </div>
              <button className="close-btn" onClick={() => setOtpDialogClaim(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleOtpSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  The student must present their <strong>6-digit Handover Code</strong> shown on their device screen for <strong>{otpDialogClaim.itemTitle}</strong>.
                </p>

                <div className="form-group" style={{ textAlign: 'center' }}>
                  <label className="form-label" style={{ marginBottom: '0.75rem' }}>Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    className="form-control"
                    placeholder="123456"
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    style={{
                      fontSize: '1.75rem',
                      letterSpacing: '0.35em',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      maxWidth: '240px',
                      margin: '0 auto',
                    }}
                    required
                  />
                  <span className="form-text">
                    Upon verification, this item will be closed and permanently marked as RECOVERED.
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setOtpDialogClaim(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={actionLoading}>
                  {actionLoading ? 'Verifying...' : 'Verify &amp; Complete Handover'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
