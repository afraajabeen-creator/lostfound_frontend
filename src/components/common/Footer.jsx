import React from 'react';

export const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'white', padding: '1.5rem', textAlign: 'center', marginTop: 'auto' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        &copy; {new Date().getFullYear()} Campus Lost &amp; Found Portal &bull; Academic Project &bull; Built with React &amp; Spring Boot
      </p>
    </footer>
  );
};
