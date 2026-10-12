import React, { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { PackageSearch, Trash2, Eye, Search } from 'lucide-react';
import { ItemDetailModal } from '../../components/items/ItemDetailModal';

export const ManageItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await itemService.searchItems();
      if (res.success) {
        setItems(res.data);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to load items.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete listing '${title}'? This action cannot be undone.`)) return;

    try {
      const res = await itemService.deleteItem(id);
      if (res.success) {
        setToast({ type: 'success', message: 'Item listing removed.' });
        fetchItems();
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to delete listing.' });
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.reporter?.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1>Audit Campus Listings</h1>
          <p>Oversee all Lost and Found property posted across faculties and departments</p>
        </div>

        <div style={{ width: '280px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search listings or reporters..."
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
        <LoadingSpinner message="Loading all campus listings..." />
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <PackageSearch size={40} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3>No items match criteria</h3>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title &amp; Category</th>
                  <th>Location</th>
                  <th>Incident Date</th>
                  <th>Reporter</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td>
                      <strong>{item.title}</strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.category}</div>
                    </td>
                    <td>{item.location}</td>
                    <td>{item.incidentDate}</td>
                    <td>
                      <div>{item.reporter?.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.reporter?.email}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${item.status.toLowerCase().replace('_', '-')}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="btn btn-secondary btn-sm"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="btn btn-outline-danger btn-sm"
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        isOwner={false}
        isAdmin={true}
      />
    </div>
  );
};
