import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { 
  PackageSearch, 
  Bell, 
  ShieldAlert, 
  LogOut, 
  User, 
  FileCheck, 
  Layers, 
  Users, 
  LogIn, 
  UserPlus 
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnread = async () => {
        try {
          const res = await notificationService.getUnreadCount();
          if (res.success) {
            setUnreadCount(res.data);
          }
        } catch {
          // ignore error if unauthorized or offline
        }
      };

      fetchUnread();
      const interval = setInterval(fetchUnread, 15000); // Poll unread notifications every 15s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/student') : '/login'} className="navbar-brand">
          <div className="brand-icon">
            <PackageSearch size={22} />
          </div>
          <div>
            Campus <span style={{ color: 'var(--primary)' }}>Lost&amp;Found</span>
          </div>
        </Link>

        <nav className="navbar-links">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                <>
                  <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Layers size={17} /> Overview
                  </NavLink>
                  <NavLink to="/admin/claims" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FileCheck size={17} /> Claims &amp; OTP
                  </NavLink>
                  <NavLink to="/admin/items" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <PackageSearch size={17} /> All Items
                  </NavLink>
                  <NavLink to="/admin/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Users size={17} /> Users
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/student" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Layers size={17} /> Explore
                  </NavLink>
                  <NavLink to="/student/my-items" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <PackageSearch size={17} /> My Reports
                  </NavLink>
                  <NavLink to="/student/claims" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FileCheck size={17} /> My Claims &amp; OTP
                  </NavLink>
                  <NavLink to="/student/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Bell size={17} /> Alerts
                    {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                  </NavLink>
                </>
              )}

              {/* User Profile Tag & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-student'}`}>
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user?.fullName?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  title="Logout"
                  style={{ padding: '0.4rem 0.6rem' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} /> Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} /> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
