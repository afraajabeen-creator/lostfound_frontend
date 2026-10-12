import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const ItemFilterBar = ({ filters, onChange, onReset }) => {
  const categories = [
    'Electronics',
    'ID / Student Card',
    'Books & Stationery',
    'Keys',
    'Clothing',
    'Bags & Backpacks',
    'Wallets',
    'Sports Equipment',
    'Others',
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
        {/* Keyword Search */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Search size={14} /> Keyword Search
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search items, titles, words..."
            value={filters.keyword || ''}
            onChange={(e) => handleInputChange('keyword', e.target.value)}
          />
        </div>

        {/* Listing Type */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Item Type</label>
          <select
            className="form-select"
            value={filters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <option value="">All Types (Lost &amp; Found)</option>
            <option value="LOST">Lost Items Only</option>
            <option value="FOUND">Found Items Only</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={filters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Library, Cafeteria..."
            value={filters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>

        {/* Reset Button */}
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            style={{ width: '100%' }}
            title="Clear all filters"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
