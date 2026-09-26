import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  UploadCloud,
  X,
  Sparkles,
  ArrowLeft,
  Calendar,
  MapPin,
  Tag,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../api/mockData';
import reportService from '../api/reportService';

export const ReportLost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'ELECTRONICS',
    brand: '',
    color: '',
    location: CAMPUS_LOCATIONS[0],
    customLocation: '',
    date_lost: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please provide an item name.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('category', formData.category);
      payload.append('brand', formData.brand);
      payload.append('color', formData.color);
      payload.append('location', formData.customLocation ? formData.customLocation : formData.location);
      payload.append('date_lost', formData.date_lost);
      payload.append('description', formData.description);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const result = await reportService.createLostReport(payload);
      toast.success("Lost item report submitted! Running Matching Engine...");
      
      // Navigate to matches or dashboard
      setTimeout(() => {
        navigate('/matches');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="surface-card" style={{ padding: '2rem', borderRadius: '18px', borderTop: '4px solid var(--rose)' }}>
        <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-lost">LOST ITEM REPORT</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Step 1 of 6</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Report a Missing or Lost Item
          </h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Provide as many descriptive details as possible. Our 40/30/30 matching engine compares Category, Location, and Date.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Item Basic Info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="itemName">Item Name *</label>
              <input
                id="itemName"
                type="text"
                className="form-input"
                placeholder="e.g. Space Gray MacBook Air M2 or Blue Hydro Flask"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="category">Category *</label>
                <select
                  id="category"
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="brand">Brand / Manufacturer</label>
                <input
                  id="brand"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Apple, Sony, Nike, Tommy Hilfiger"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="color">Primary Color</label>
                <input
                  id="color"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Space Gray, Matte Black, Navy Blue"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & Timeline */}
          <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-800)' }}>
              Campus Location & When it was Lost
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="campusLocation">Campus Landmark / Building *</label>
                <select
                  id="campusLocation"
                  className="form-select"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  {CAMPUS_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dateLost">Date Lost *</label>
                <input
                  id="dateLost"
                  type="date"
                  className="form-input"
                  value={formData.date_lost}
                  onChange={(e) => setFormData({ ...formData, date_lost: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              <label className="form-label" htmlFor="specificLoc">Specific Room, Desk or Zone (Optional)</label>
              <input
                id="specificLoc"
                type="text"
                className="form-input"
                placeholder="e.g. Near 2nd floor window desks or Row 4 in Auditorium"
                value={formData.customLocation}
                onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
              />
            </div>
          </div>

          {/* Section 3: Description & Secret identifiers */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="description">Detailed Description & Visible Markings</label>
            <textarea
              id="description"
              className="form-textarea"
              rows={4}
              placeholder="Mention recognizable features (stickers, scratches, keychains, phone wallpaper, case color). Do not share passwords or PIN numbers!"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Section 4: Image Upload */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Item Photo (Optional but recommended)</label>
            
            {imagePreview ? (
              <div style={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid var(--slate-200)'
              }}>
                <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', display: 'block' }} />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '2rem',
                border: '2px dashed var(--slate-300)',
                borderRadius: '12px',
                backgroundColor: 'var(--slate-50)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease'
              }}>
                <UploadCloud size={32} color="var(--primary)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                  Click or drag image file here (PNG / JPG)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                  Max file size: 5MB
                </span>
                <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* AI Matching Engine Callout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '1.75rem',
            fontSize: '0.8125rem',
            color: 'var(--slate-700)'
          }}>
            <Sparkles size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Automated Matching Engine:</strong> Once submitted, our 40/30/30 algorithm will scan all reported found items and immediately alert you of potential matches.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              style={{ minWidth: '180px' }}
            >
              {submitting ? 'Submitting & Matching...' : 'Submit Lost Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportLost;
