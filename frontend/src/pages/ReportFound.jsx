import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  UploadCloud,
  X,
  Sparkles,
  ArrowLeft,
  Calendar,
  MapPin,
  ShieldCheck,
  Building,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../api/mockData';
import reportService from '../api/reportService';

export const ReportFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: 'ELECTRONICS',
    brand: '',
    color: '',
    location: CAMPUS_LOCATIONS[0],
    customLocation: '',
    date_found: new Date().toISOString().split('T')[0],
    description: '',
    storage_location: 'Central Security Desk - Student Union Hall'
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
      payload.append('date_found', formData.date_found);
      payload.append('description', formData.description);
      payload.append('storage_location', formData.storage_location);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      await reportService.createFoundReport(payload);
      toast.success("Found item logged successfully! Checking for matching lost reports...");
      
      setTimeout(() => {
        if (user?.role === 'SECURITY') navigate('/security');
        else navigate('/dashboard');
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log found report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to={user?.role === 'SECURITY' ? '/security' : '/dashboard'} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="surface-card" style={{ padding: '2rem', borderRadius: '18px', borderTop: '4px solid var(--emerald)' }}>
        <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-found">FOUND ITEM LOG</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Reporter: {user?.name || 'Campus Member'}</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Log a Found Campus Item
          </h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Thank you for helping keep our campus safe and trustworthy! Log the item details so the rightful owner can be matched and verified.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Item details */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="foundItemName">Item Name / Summary *</label>
              <input
                id="foundItemName"
                type="text"
                className="form-input"
                placeholder="e.g. Sony Wireless Headphones in Black Case"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="foundCategory">Category *</label>
                <select
                  id="foundCategory"
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
                <label className="form-label" htmlFor="foundBrand">Brand (if visible)</label>
                <input
                  id="foundBrand"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sony, Apple, Nike"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="foundColor">Color</label>
                <input
                  id="foundColor"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Black, Silver, Blue"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Location Found */}
          <div style={{ marginBottom: '1.5rem', backgroundColor: 'var(--slate-50)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-800)' }}>
              Where & When was it Found?
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="foundLocation">Building / Area Found *</label>
                <select
                  id="foundLocation"
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
                <label className="form-label" htmlFor="dateFound">Date Found *</label>
                <input
                  id="dateFound"
                  type="date"
                  className="form-input"
                  value={formData.date_found}
                  onChange={(e) => setFormData({ ...formData, date_found: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              <label className="form-label" htmlFor="customFoundLoc">Specific Spot Found</label>
              <input
                id="customFoundLoc"
                type="text"
                className="form-input"
                placeholder="e.g. Left under study desk #14 near power outlet"
                value={formData.customLocation}
                onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
              />
            </div>
          </div>

          {/* Custody / Drop-off location */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="storageLocation">
              <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: 'var(--emerald)' }} />
              Current Physical Custody / Drop-Off Location *
            </label>
            <select
              id="storageLocation"
              className="form-select"
              value={formData.storage_location}
              onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
            >
              <option value="Central Security Desk - Student Union Hall">Central Security Desk (Student Union Hall)</option>
              <option value="Main Library Front Desk Locker">Main Library Front Desk Locker</option>
              <option value="Engineering Block B Office (Room 101)">Engineering Block B Office</option>
              <option value="Sports Complex Reception Desk">Sports Complex Reception Desk</option>
              <option value="With Finder (Pending Handover to Owner/Security)">With Finder (Personal Custody)</option>
            </select>
            <span className="form-hint">
              High-value items (laptops, phones, wallets) are strongly recommended to be dropped off at the Central Security Desk.
            </span>
          </div>

          {/* Public Description */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="foundDesc">General Public Description</label>
            <textarea
              id="foundDesc"
              className="form-textarea"
              rows={3}
              placeholder="Describe general appearance. DO NOT list private details (such as ID names or secret markings) so the owner can prove ownership through verification!"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image upload */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Item Photo (Optional)</label>
            {imagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--slate-200)' }}>
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
                cursor: 'pointer'
              }}>
                <UploadCloud size={32} color="var(--emerald)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                  Click to upload item photo
                </span>
                <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Link to={user?.role === 'SECURITY' ? '/security' : '/dashboard'} className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-success btn-lg"
              disabled={submitting}
              style={{ minWidth: '180px' }}
            >
              {submitting ? 'Logging Found Item...' : 'Log Found Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFound;
