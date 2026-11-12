import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  FileCheck2,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  Clock,
  UploadCloud,
  CheckCircle2,
  Lock,
  Info
} from 'lucide-react';
import claimService from '../api/claimService';

export const ClaimForm = () => {
  const { matchId = 1 } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    item_name: 'Space Gray MacBook Air M2',
    secret_marks: 'There is a small circular silver sticker of the React logo on the bottom right corner underneath the laptop chassis.',
    serial_number: 'FVFX9082MD6R',
    lock_screen_hint: 'Western Ghats wallpaper with username Aarav S.',
    pickup_date: '2026-09-27',
    pickup_time: '14:00',
    agree_terms: false
  });

  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree_terms) {
      toast.warning("Please confirm the campus honor declaration.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('match_id', matchId);
      payload.append('item_name', formData.item_name);
      payload.append('secret_marks', formData.secret_marks);
      payload.append('serial_number', formData.serial_number);
      payload.append('lock_screen_hint', formData.lock_screen_hint);
      payload.append('pickup_date', formData.pickup_date);
      payload.append('pickup_time', formData.pickup_time);
      if (proofFile) {
        payload.append('proof_file', proofFile);
      }

      const claim = await claimService.submitClaim(payload);
      toast.success("Verification claim submitted! Queued for Security Review.");
      navigate(`/claims/${claim.id || 501}`);
    } catch (err) {
      toast.error("Failed to submit claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to={`/matches/${matchId}`} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Match
        </Link>
      </div>

      <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '6px', borderTop: '3px solid #0f172a' }}>
        <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-open">Ownership Verification</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Match #{matchId}</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--slate-900)' }}>
            Submit Ownership Claim
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            Provide identifying details so Campus Security can verify your ownership before releasing deposited property.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Target Item Summary */}
          <div style={{
            backgroundColor: 'var(--primary-light)',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '1px solid #bfdbfe',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                MATCHED ITEM FOR CLAIM
              </span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                {formData.item_name}
              </h4>
            </div>
            <span className="badge badge-matched">92% Match</span>
          </div>

          {/* Verification Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="secretMarks">
                1. Secret / Hidden Identifying Marks *
              </label>
              <textarea
                id="secretMarks"
                className="form-textarea"
                rows={3}
                placeholder="Mention features not visible in public photos (e.g., custom stickers, engravings, contents of inner pockets, scratch positions)"
                value={formData.secret_marks}
                onChange={(e) => setFormData({ ...formData, secret_marks: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="serialNumber">
                  2. Serial Number / IMEI (If known)
                </label>
                <input
                  id="serialNumber"
                  type="text"
                  className="form-input"
                  placeholder="e.g. FVFX9082MD6R or Model #"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lockHint">
                  3. Screen Wallpaper / Passcode User Hint
                </label>
                <input
                  id="lockHint"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Photo of Golden Gate Bridge"
                  value={formData.lock_screen_hint}
                  onChange={(e) => setFormData({ ...formData, lock_screen_hint: e.target.value })}
                />
              </div>
            </div>

            {/* Proof document upload */}
            <div className="form-group">
              <label className="form-label">4. Proof of Purchase or Prior Photo (Optional)</label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '1rem',
                border: '2px dashed var(--slate-300)',
                borderRadius: '10px',
                backgroundColor: 'var(--slate-50)',
                cursor: 'pointer'
              }}>
                <UploadCloud size={24} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                    {proofFile ? proofFile.name : 'Upload receipt, invoice, or previous photo of item'}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>PDF, JPG, PNG accepted</div>
                </div>
                <input type="file" style={{ display: 'none' }} onChange={(e) => setProofFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          {/* Security Desk Appointment */}
          <div style={{
            backgroundColor: 'var(--slate-50)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--slate-200)',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} color="var(--emerald)" />
              Security Desk Pickup Appointment
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
              Location: <strong>Central Security Desk (Student Union Hall Ground Floor)</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="pickupDate">Preferred Pickup Date</label>
                <input
                  id="pickupDate"
                  type="date"
                  className="form-input"
                  value={formData.pickup_date}
                  onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pickupTime">Estimated Time</label>
                <input
                  id="pickupTime"
                  type="time"
                  className="form-input"
                  value={formData.pickup_time}
                  onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* University Honor Code checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--slate-200)',
            marginBottom: '1.75rem'
          }}>
            <input
              type="checkbox"
              id="honorCode"
              checked={formData.agree_terms}
              onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })}
              style={{ marginTop: '3px', cursor: 'pointer' }}
            />
            <label htmlFor="honorCode" style={{ fontSize: '0.8125rem', color: 'var(--slate-700)', cursor: 'pointer', lineHeight: 1.4 }}>
              <strong>Campus Honor Declaration:</strong> I solemnly confirm under university disciplinary policy that this is my lawful property. False claims are subject to immediate academic sanction.
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Link to={`/matches/${matchId}`} className="btn btn-secondary btn-sm">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting}
              style={{ minWidth: '160px' }}
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
