import React, { useState, useEffect } from 'react';
import { claimService } from '../../services/claimService';
import { ClaimStatusBadge } from '../../components/claims/ClaimStatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { KeyRound, ShieldAlert, CheckCircle, Clock, Copy, Check, MapPin } from 'lucide-react';

export const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [copiedOtpId, setCopiedOtpId] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimService.getMyClaims();
      if (res.success) {
        setClaims(res.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Unable to retrieve claims.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleCopyOtp = (otp, id) => {
    navigator.clipboard.writeText(otp);
    setCopiedOtpId(id);
    setTimeout(() => setCopiedOtpId(null), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1>My Ownership Claims</h1>
        <p>Track administrator reviews and view your confidential Pickup OTP codes</p>
      </div>

      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Fetching your claims..." />
      ) : claims.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <ShieldAlert size={40} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3>No claims submitted</h3>
          <p>When you spot an item in the feed that belongs to you, submit a claim with proof.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {claims.map((claim) => (
            <div key={claim.id} className="card">
              <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>{claim.itemTitle}</h3>
                  <p style={{ fontSize: '0.825rem' }}>
                    Category: <strong>{claim.itemCategory}</strong> &bull; Found at: <strong>{claim.itemLocation}</strong>
                  </p>
                </div>
                <div>
                  <ClaimStatusBadge status={claim.status} />
                </div>
              </div>

              <div className="card-body">
                {/* Proof Submitted */}
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Your Submitted Ownership Proof
                  </h4>
                  <p style={{ fontSize: '0.925rem', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    {claim.proofDescription}
                  </p>
                </div>

                {/* APPROVED / VERIFIED: Confidential 6-digit Handover OTP Box */}
                {claim.status === 'VERIFIED' && claim.handoverOtp && (
                  <div className="otp-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <KeyRound size={22} />
                      <h3 style={{ color: 'white' }}>Your Secure Pickup Handover Code</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.25rem' }}>
                      Present this 6-digit OTP code in person to the campus administrator to collect your item.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div className="otp-code">
                        {claim.handoverOtp}
                      </div>
                      <button
                        onClick={() => handleCopyOtp(claim.handoverOtp, claim.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-md)' }}
                        title="Copy OTP"
                      >
                        {copiedOtpId === claim.id ? <Check size={18} style={{ color: 'var(--success)' }} /> : <Copy size={18} />}
                      </button>
                    </div>

                    <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.5rem' }}>
                      Desk Location: <strong>Main Campus Security &amp; Lost Property Office</strong>
                    </div>
                  </div>
                )}

                {/* REJECTED with Reason */}
                {claim.status === 'REJECTED' && claim.rejectionReason && (
                  <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--danger-dark)', marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      Rejection Reason from Administrator:
                    </h4>
                    <p style={{ fontSize: '0.875rem' }}>{claim.rejectionReason}</p>
                  </div>
                )}

                {/* RECOVERED Complete */}
                {claim.status === 'RECOVERED' && (
                  <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--success-dark)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={22} />
                    <div>
                      <h4 style={{ fontSize: '0.925rem' }}>Item Successfully Handed Over &amp; Recovered</h4>
                      <p style={{ fontSize: '0.8rem' }}>
                        Physical handover verified at {claim.otpVerifiedAt ? new Date(claim.otpVerifiedAt).toLocaleString() : 'Desk'}.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-footer" style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Submitted on {new Date(claim.createdAt).toLocaleDateString()}</span>
                <span>Claim ID: #{claim.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
