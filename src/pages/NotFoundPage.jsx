import React from 'react';
import { Link } from 'react-router-dom';
import { PackageX, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div
        style={{
          width: '72px',
          height: '72px',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <PackageX size={36} />
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ maxWidth: '400px', margin: '0.75rem auto 1.5rem' }}>
        The page you are looking for doesn&apos;t exist or was moved to another campus location.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  );
};
