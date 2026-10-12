import React, { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';
import { matchService } from '../../services/matchService';
import { ItemCard } from '../../components/items/ItemCard';
import { ItemDetailModal } from '../../components/items/ItemDetailModal';
import { PossibleMatchesList } from '../../components/matches/PossibleMatchesList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { PackageSearch, Sparkles, Trash2, Eye } from 'lucide-react';

export const MyReportedItems = () => {
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'matches'
  const [myItems, setMyItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, matchesRes] = await Promise.all([
        itemService.getMyItems(),
        matchService.getMyMatches(),
      ]);

      if (itemsRes.success) setMyItems(itemsRes.data);
      if (matchesRes.success) setMatches(matchesRes.data);
    } catch {
      setToast({ type: 'error', message: 'Could not fetch reported items or match suggestions.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this reported item?')) return;

    try {
      const res = await itemService.deleteItem(itemId);
      if (res.success) {
        setToast({ type: 'success', message: 'Item listing deleted.' });
        fetchData();
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to delete item.' });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1>My Reported Items</h1>
        <p>Manage items you reported as Lost or Found, and view automated Smart Match predictions</p>
      </div>

      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('items')}
          className={`btn ${activeTab === 'items' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <PackageSearch size={16} /> My Listings ({myItems.length})
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`btn ${activeTab === 'matches' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          <Sparkles size={16} /> Smart Match Suggestions ({matches.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your listings and match calculations..." />
      ) : activeTab === 'items' ? (
        myItems.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <PackageSearch size={40} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
            <h3>No reports yet</h3>
            <p>You have not reported any lost or found items so far.</p>
          </div>
        ) : (
          <div className="grid-cards">
            {myItems.map((item) => (
              <div key={item.id} style={{ position: 'relative' }}>
                <ItemCard
                  item={item}
                  onSelect={(i) => setSelectedItem(i)}
                  isOwner={true}
                  isAdmin={false}
                />
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="btn btn-outline-danger btn-sm"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 2,
                    background: 'white',
                    padding: '0.35rem 0.5rem',
                  }}
                  title="Delete this listing"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <PossibleMatchesList
          matches={matches}
          onItemClick={(item) => setSelectedItem(item)}
        />
      )}

      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        isOwner={true}
        isAdmin={false}
      />
    </div>
  );
};
