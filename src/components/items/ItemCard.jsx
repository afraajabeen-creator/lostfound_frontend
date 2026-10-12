import React from 'react';
import { MapPin, Calendar, Tag, ShieldAlert, ArrowRight, Eye } from 'lucide-react';
import { API_BASE_URL } from '../../services/api';

export const ItemCard = ({ item, onSelect, onClaim, isOwner, isAdmin }) => {
  const isLost = item.type === 'LOST';
  const imageUrl = item.imageUrl 
    ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${API_BASE_URL}${item.imageUrl}`)
    : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Banner or Image */}
      <div
        style={{
          height: '160px',
          backgroundColor: isLost ? '#fef2f2' : '#f0fdf4',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: isLost ? '#ef4444' : '#10b981' }}>
            <Tag size={40} strokeWidth={1.5} />
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.25rem' }}>
              {item.category}
            </p>
          </div>
        )}

        {/* Badges on image overlay */}
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {item.type}
          </span>
        </div>

        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`}>
            {item.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>
          {item.title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {item.description}
        </p>

        {/* Meta details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.location}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
            <span>{item.incidentDate}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="card-footer" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
        <button
          onClick={() => onSelect(item)}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
        >
          <Eye size={15} /> Details
        </button>

        {item.type === 'FOUND' && item.status === 'OPEN' && !isOwner && !isAdmin && onClaim && (
          <button
            onClick={() => onClaim(item)}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            Claim <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
