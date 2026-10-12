import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { Users, Ban, CheckCircle, Shield, User } from 'lucide-react';

export const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      if (res.success) {
        setUsers(res.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to retrieve user accounts.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (user) => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (!window.confirm(`Are you sure you want to ${action} ${user.fullName}?`)) return;

    try {
      const res = await userService.toggleBlockUser(user.id);
      if (res.success) {
        setToast({
          type: 'success',
          message: `User '${user.fullName}' has been ${res.data.isBlocked ? 'blocked' : 'unblocked'}.`,
        });
        fetchUsers();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || `Failed to ${action} user.` });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1>User Management</h1>
          <p>Oversee registered campus students and administrators</p>
        </div>

        <div style={{ width: '280px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Loading user directory..." />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isMasterAdmin = u.email === 'admin@campus.com';
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{u.id}</div>
                      </td>
                      <td>
                        <div>{u.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.phoneNumber || 'No phone'}</div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-student'}`}>
                          {u.role === 'ROLE_ADMIN' ? 'Administrator' : 'Student'}
                        </span>
                      </td>
                      <td>
                        {u.isBlocked ? (
                          <span className="badge badge-lost">Blocked / Inactive</span>
                        ) : (
                          <span className="badge badge-found">Active</span>
                        )}
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        {!isMasterAdmin && (
                          <button
                            onClick={() => handleToggleBlock(u)}
                            className={`btn ${u.isBlocked ? 'btn-success' : 'btn-outline-danger'} btn-sm`}
                          >
                            {u.isBlocked ? (
                              <>
                                <CheckCircle size={14} /> Unblock
                              </>
                            ) : (
                              <>
                                <Ban size={14} /> Block
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
