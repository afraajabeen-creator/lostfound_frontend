import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { Bell, CheckCheck, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to load notifications.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setToast({ type: 'success', message: 'All notifications marked as read.' });
    } catch {
      setToast({ type: 'error', message: 'Could not mark all as read.' });
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'MATCH_FOUND':
        return <Sparkles size={20} style={{ color: 'var(--primary)' }} />;
      case 'CLAIM_UPDATE':
        return <ShieldCheck size={20} style={{ color: 'var(--warning-dark)' }} />;
      case 'ITEM_STATUS':
        return <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />;
      default:
        return <Bell size={20} style={{ color: 'var(--secondary)' }} />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <h1>Alerts &amp; Notifications</h1>
          <p>Real-time updates regarding match recommendations and claim reviews</p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Loading your notifications..." />
      ) : notifications.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Bell size={40} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3>No notifications yet</h3>
          <p>You will receive alerts here when Smart Matches are detected or your claims are reviewed.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                backgroundColor: item.isRead ? 'white' : '#f8faff',
                borderLeft: item.isRead ? '1px solid var(--border)' : '4px solid var(--primary)',
              }}
            >
              <div style={{ padding: '0.4rem', background: '#f1f5f9', borderRadius: 'var(--radius-md)' }}>
                {getIcon(item.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {item.message}
                </p>
              </div>

              {!item.isRead && (
                <button
                  onClick={() => handleMarkAsRead(item.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
