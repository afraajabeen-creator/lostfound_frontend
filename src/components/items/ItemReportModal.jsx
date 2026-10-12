import React, { useState } from 'react';
import { itemService } from '../../services/itemService';
import { X, Upload, PlusCircle, AlertCircle } from 'lucide-react';
import { Toast } from '../common/Toast';

export const ItemReportModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'LOST',
    title: '',
    category: 'Electronics',
    description: '',
    location: '',
    incidentDate: new Date().toISOString().split('T')[0],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      let uploadedImageUrl = null;
      if (selectedFile) {
        const uploadRes = await itemService.uploadImage(selectedFile);
        if (uploadRes.success) {
          uploadedImageUrl = uploadRes.data.imageUrl;
        }
      }

      const payload = {
        ...formData,
        imageUrl: uploadedImageUrl,
      };

      const res = await itemService.createItem(payload);
      if (res.success) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to create item.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error reporting item. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={20} style={{ color: 'var(--primary)' }} />
            <h3>Report Item</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <Toast type="error" message={error} onClose={() => setError('')} />}

            {/* Type selector toggle */}
            <div className="form-group">
              <label className="form-label">Are you reporting a Lost or Found item?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn ${formData.type === 'LOST' ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => setFormData({ ...formData, type: 'LOST' })}
                >
                  I Lost Something
                </button>
                <button
                  type="button"
                  className={`btn ${formData.type === 'FOUND' ? 'btn-success' : 'btn-secondary'}`}
                  onClick={() => setFormData({ ...formData, type: 'FOUND' })}
                >
                  I Found Something
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Item Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Casio FX-991EX Calculator, Blue Water Bottle, Black Leather Wallet..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Category & Date Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date Lost/Found</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">
                Location on Campus <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Library 2nd Floor, Central Cafeteria Table 12, Mechanical Lab..."
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Detailed Description <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Include color, model, brand, distinctive scratches or stickers, contents inside..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="form-group">
              <label className="form-label">Upload Photo (Optional, Max 5MB)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <div style={{ marginTop: '0.75rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '140px' }}>
                  <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
