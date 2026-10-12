import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../../services/itemService';
import { claimService } from '../../services/claimService';
import { userService } from '../../services/userService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  ShieldCheck, 
  FileCheck, 
  PackageSearch, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  KeyRound
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    openClaims: 0,
    recoveredItems: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [itemsRes, claimsRes, usersRes] = await Promise.all([
          itemService.searchItems(),
          claimService.getAllClaims(),
          userService.getAllUsers(),
        ]);

        const items = itemsRes.success ? itemsRes.data : [];
        const claims = claimsRes.success ? claimsRes.data : [];
        const users = usersRes.success ? usersRes.data : [];

        setStats({
          totalItems: items.length,
          openClaims: claims.filter((c) => c.status === 'PENDING' || c.status === 'VERIFIED').length,
          recoveredItems: items.filter((i) => i.status === 'RECOVERED').length,
          totalUsers: users.length,
        });
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading administrator overview..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-admin">Administrator Control Center</span>
        </div>
        <h1>Campus Operations Dashboard</h1>
        <p>Oversee lost &amp; found listings, process ownership claims, and verify physical OTP pickup handovers</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid-stats">
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL LISTINGS</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem' }}>{stats.totalItems}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <PackageSearch size={26} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIVE CLAIMS</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem', color: 'var(--warning-dark)' }}>{stats.openClaims}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--warning-light)', borderRadius: 'var(--radius-md)', color: 'var(--warning-dark)' }}>
              <Clock size={26} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>RECOVERED ITEMS</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem', color: 'var(--success)' }}>{stats.recoveredItems}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--success-light)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
              <CheckCircle size={26} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>REGISTERED USERS</p>
              <h2 style={{ fontSize: '2rem', marginTop: '0.25rem', color: 'var(--secondary)' }}>{stats.totalUsers}</h2>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--secondary-light)', borderRadius: 'var(--radius-md)', color: 'var(--secondary)' }}>
              <Users size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: '#e0e7ff', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
              <FileCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Claims &amp; Pickup OTP</h3>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Audit student ownership claims, approve or reject with reasons, and enter pickup OTP codes at the collection desk.
          </p>
          <Link to="/admin/claims" className="btn btn-primary btn-sm">
            Manage Claims <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: '#ecfdf5', color: 'var(--success)', borderRadius: 'var(--radius-md)' }}>
              <PackageSearch size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Audit Campus Items</h3>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            View all reported items across all faculties, inspect details, and remove duplicate or spam listings.
          </p>
          <Link to="/admin/items" className="btn btn-secondary btn-sm">
            View All Items <ArrowRight size={16} />
          </Link>
        </div>

        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: '#f3e8ff', color: '#7c3aed', borderRadius: 'var(--radius-md)' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>User Administration</h3>
          </div>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Manage campus accounts, view student contact profiles, and toggle account activation/suspension.
          </p>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            Manage Users <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
