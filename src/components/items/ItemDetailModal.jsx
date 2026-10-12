import React from 'react';
import { X, MapPin, Calendar, Tag, User, Phone, Mail, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

export const ItemDetailModal = ({ item, isOpen, onClose, onClaim, isOwner, isAdmin }) => {
  if (!isOpen || !item) return null;

  const isLost = item.type === 'LOST';
  const imageUrl = item.imageUrl 
    ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${API_BASE_URL}${item.imageUrl}`)
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
              {item.type}
            </span>
            <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`}>
              {item.status.replace('_', ' ')}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {imageUrl && (
            <div style={{ width: '100%', height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <img src={imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>
            {item.title}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <Tag size={16} style={{ color: 'var(--primary)' }} />
              <span><strong>Category:</strong> {item.category}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <MapPin size={16} style={{ color: 'var(--danger)' }} />
              <span><strong>Location:</strong> {item.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <Calendar size={16} style={{ color: 'var(--secondary)' }} />
              <span><strong>Date:</strong> {item.incidentDate}</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Description</h4>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {item.description}
            </p>
          </div>

          {/* Reporter details */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Reported By
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{item.reporter?.fullName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} style={{ color: 'var(--text-muted)' }} />
                <span>{item.reporter?.email}</span>
              </div>
              {item.reporter?.phoneNumber && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={15} style={{ color: 'var(--text-muted)' }} />
                  <span>{item.reporter?.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {item.type === 'FOUND' && item.status === 'OPEN' && !isOwner && !isAdmin && onClaim && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onClaim(item);
              }}
            >
              Claim This Item <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
