import React, { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';
import { useAuth } from '../../context/AuthContext';
import { ItemCard } from '../../components/items/ItemCard';
import { ItemFilterBar } from '../../components/items/ItemFilterBar';
import { ItemReportModal } from '../../components/items/ItemReportModal';
import { ItemDetailModal } from '../../components/items/ItemDetailModal';
import { ClaimModal } from '../../components/claims/ClaimModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import { PlusCircle, PackageSearch, AlertCircle, Sparkles } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState(null);

  const fetchItems = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const res = await itemService.searchItems(currentFilters);
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to load items. Please check connection.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleItemCreated = (newItem) => {
    setToast({
      type: 'success',
      message: `Your ${newItem.type} item '${newItem.title}' was posted successfully! Smart Match engine is analyzing counterparts.`,
    });
    fetchItems(filters);
  };

  const handleClaimSubmitted = (newClaim) => {
    setToast({
      type: 'success',
      message: 'Claim submitted successfully! Track review progress under "My Claims".',
    });
    fetchItems(filters);
  };

  // Quick stats
  const totalCount = items.length;
  const lostCount = items.filter((i) => i.type === 'LOST').length;
  const foundCount = items.filter((i) => i.type === 'FOUND').length;

  return (
    <div>
      {/* Top Welcome & Actions Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1>Campus Listings Feed</h1>
          <p>Search, report, and recover lost property across university grounds</p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="btn btn-primary"
        >
          <PlusCircle size={18} /> Report Lost or Found Item
        </button>
      </div>

      {toast.message && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ type: '', message: '' })}
        />
      )}

      {/* Quick Stats Grid */}
      <div className="grid-stats">
        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>ACTIVE LISTINGS</p>
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: 'var(--primary)' }}>{totalCount}</h2>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>LOST ITEMS REPORTED</p>
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: 'var(--danger)' }}>{lostCount}</h2>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>FOUND ITEMS AVAILABLE</p>
          <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: 'var(--success)' }}>{foundCount}</h2>
        </div>
      </div>

      {/* Filter Bar */}
      <ItemFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Listings Grid */}
      {loading ? (
        <LoadingSpinner message="Searching campus listings..." />
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <PackageSearch size={48} style={{ color: 'var(--text-light)', marginBottom: '1rem' }} />
          <h3>No items found</h3>
          <p style={{ maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            We could not find any items matching your active filter criteria. Try resetting filters or report the item yourself!
          </p>
          <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-cards">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={(i) => setSelectedItemForDetail(i)}
              onClaim={(i) => setSelectedItemForClaim(i)}
              isOwner={item.reporter?.id === user?.id}
              isAdmin={user?.role === 'ROLE_ADMIN'}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ItemReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={handleItemCreated}
      />

      <ItemDetailModal
        item={selectedItemForDetail}
        isOpen={!!selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onClaim={(i) => setSelectedItemForClaim(i)}
        isOwner={selectedItemForDetail?.reporter?.id === user?.id}
        isAdmin={user?.role === 'ROLE_ADMIN'}
      />

      <ClaimModal
        item={selectedItemForClaim}
        isOpen={!!selectedItemForClaim}
        onClose={() => setSelectedItemForClaim(null)}
        onSuccess={handleClaimSubmitted}
      />
    </div>
  );
};
