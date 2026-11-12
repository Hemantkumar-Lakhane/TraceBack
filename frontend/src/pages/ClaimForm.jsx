import React, { useState, useEffect } from 'react';
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
  Info,
  Sparkles,
  MapPin
} from 'lucide-react';
import claimService from '../api/claimService';
import matchService from '../api/matchService';

export const ClaimForm = () => {
  const { matchId = 1 } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    item_name: 'Space Gray MacBook Pro 14"',
    secret_marks: 'There is a small circular silver sticker of the React logo on the bottom right corner underneath the laptop chassis.',
    serial_number: 'FVFX9082MD6R',
    lock_screen_hint: 'Western Ghats wallpaper with username Aarav S.',
    pickup_date: new Date().toISOString().split('T')[0],
    pickup_time: '14:00',
    agree_terms: false
  });

  const [selectedSlot, setSelectedSlot] = useState('14:00');
  const [customHour, setCustomHour] = useState('02');
  const [customMinute, setCustomMinute] = useState('00');
  const [customPeriod, setCustomPeriod] = useState('PM');
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);

  // Fetch match details to dynamically populate item name & context
  useEffect(() => {
    let isCancelled = false;
    const loadMatch = async () => {
      try {
        const data = await matchService.getMatchDetails(matchId);
        if (!isCancelled && data) {
          setMatchDetails(data);
          const realName = data.lostReport?.item?.name || data.foundReport?.item?.name;
          if (realName) {
            setFormData(prev => ({
              ...prev,
              item_name: realName
            }));
          }
        }
      } catch (e) {
        console.warn("Could not fetch match details for claim", e);
      }
    };
    loadMatch();
    return () => { isCancelled = true; };
  }, [matchId]);

  // Appointment Slots
  const APPOINTMENT_SLOTS = [
    { id: '10:00', label: '10:00 AM', period: 'Morning Shift' },
    { id: '11:30', label: '11:30 AM', period: 'Pre-Lunch Slot' },
    { id: '14:00', label: '02:00 PM', period: 'Afternoon Shift' },
    { id: '16:30', label: '04:30 PM', period: 'Evening Slot' },
    { id: '18:00', label: '06:00 PM', period: 'Post-Class Shift' }
  ];

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot.id);
    setFormData(prev => ({ ...prev, pickup_time: slot.id }));
    const [h, m] = slot.id.split(':');
    let hourNum = parseInt(h, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    if (hourNum > 12) hourNum -= 12;
    if (hourNum === 0) hourNum = 12;
    setCustomHour(String(hourNum).padStart(2, '0'));
    setCustomMinute(m);
    setCustomPeriod(period);
  };

  const handleCustomTimeChange = (h, m, p) => {
    setCustomHour(h);
    setCustomMinute(m);
    setCustomPeriod(p);
    let hourNum = parseInt(h, 10);
    if (p === 'PM' && hourNum < 12) hourNum += 12;
    if (p === 'AM' && hourNum === 12) hourNum = 0;
    const time24 = `${String(hourNum).padStart(2, '0')}:${m}`;
    setSelectedSlot(time24);
    setFormData(prev => ({ ...prev, pickup_time: time24 }));
  };

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

      // Pack structured verification data
      const verificationDataObj = {
        secretMarks: formData.secret_marks,
        serialNumber: formData.serial_number,
        lockScreenHint: formData.lock_screen_hint,
        itemName: formData.item_name
      };
      payload.append('verification_data', JSON.stringify(verificationDataObj));

      // Append specific fields for backward compatibility
      payload.append('item_name', formData.item_name);
      payload.append('secret_marks', formData.secret_marks);
      payload.append('serial_number', formData.serial_number);
      payload.append('lock_screen_hint', formData.lock_screen_hint);

      if (formData.pickup_date) {
        payload.append('pickup_date', formData.pickup_date);
      }
      if (formData.pickup_time) {
        const timeVal = formData.pickup_time.length === 5 ? `${formData.pickup_time}:00` : formData.pickup_time;
        payload.append('pickup_time', timeVal);
      }
      if (proofFile) {
        payload.append('proof_file', proofFile);
      }

      const claim = await claimService.submitClaim(payload);
      toast.success("Verification claim submitted! Queued for Security Review.");
      navigate(`/claims/${claim.id || 1}`);
    } catch (err) {
      console.error("Claim submission failed", err);
      toast.error("Failed to submit claim. Please check required fields.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to={`/matches/${matchId}`} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Match
        </Link>
      </div>

      <div className="surface-card" style={{ padding: '2rem', borderRadius: '12px', borderTop: '4px solid #2563eb' }}>
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-open">Ownership Verification Pass</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Match #{matchId}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Submit Physical Ownership Claim
          </h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.84375rem', marginTop: '4px' }}>
            Provide non-public identifying details so Campus Security can verify lawful ownership before releasing custody.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Target Item Summary Banner */}
          <div style={{
            backgroundColor: 'var(--slate-50)',
            padding: '14px 18px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                MATCHED PROPERTY FOR RELEASE
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '2px' }}>
                {formData.item_name}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '3px' }}>
                <MapPin size={12} color="#2563eb" />
                <span>Ramanujan Central Security Vault • Custody Locker A-12</span>
              </div>
            </div>
            <span className="badge badge-matched" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
              {matchDetails?.matchScore || 100}% Confidence Match
            </span>
          </div>

          {/* Verification Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.75rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="secretMarks" style={{ fontWeight: 600 }}>
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
                style={{ fontSize: '0.875rem', lineHeight: 1.5 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="serialNumber" style={{ fontWeight: 600 }}>
                  2. Serial Number / IMEI / ID No. (If known)
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
                <label className="form-label" htmlFor="lockHint" style={{ fontWeight: 600 }}>
                  3. Screen Wallpaper / Passcode User Hint
                </label>
                <input
                  id="lockHint"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Photo of Western Ghats or PIN hint"
                  value={formData.lock_screen_hint}
                  onChange={(e) => setFormData({ ...formData, lock_screen_hint: e.target.value })}
                />
              </div>
            </div>

            {/* Proof document upload */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>
                4. Purchase Invoice, Warranty Card, or Prior Photo (Optional)
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '1.25rem',
                border: '2px dashed var(--border-color)',
                borderRadius: '10px',
                backgroundColor: 'var(--slate-50)',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease'
              }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb'
                }}>
                  <UploadCloud size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                    {proofFile ? proofFile.name : "Click to select invoice, photo, or ID receipt"}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                    JPG, PNG, or PDF up to 10MB
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProofFile(e.target.files[0]);
                      toast.success(`Attached ${e.target.files[0].name}`);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Enhanced Security Desk Appointment (With Modern Interactive Time Picker) */}
          <div style={{
            backgroundColor: 'var(--slate-50)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--slate-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="#10b981" />
                Physical Security Vault Pickup Appointment
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 500 }}>
                Operating Hours: 08:00 - 20:00 IST
              </span>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
              Pickup Location: <strong>Ramanujan Building Central Security Desk (Ground Floor)</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {/* Pickup Date Input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="pickupDate" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="#2563eb" />
                  Appointment Date
                </label>
                <input
                  id="pickupDate"
                  type="date"
                  className="form-input"
                  value={formData.pickup_date}
                  onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                  required
                  style={{ padding: '9px 12px', fontSize: '0.875rem' }}
                />
              </div>

              {/* Enhanced Time Selector with Presets & 12-Hour Selector */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#2563eb" />
                  Preferred Time Slot
                </label>

                {/* 12-Hour Selector Bar */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {/* Hours */}
                  <select
                    className="form-input"
                    value={customHour}
                    onChange={(e) => handleCustomTimeChange(e.target.value, customMinute, customPeriod)}
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span style={{ fontWeight: 700, color: 'var(--slate-400)' }}>:</span>
                  {/* Minutes */}
                  <select
                    className="form-input"
                    value={customMinute}
                    onChange={(e) => handleCustomTimeChange(customHour, e.target.value, customPeriod)}
                    style={{ flex: 1, padding: '8px 10px', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    {['00', '15', '30', '45'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {/* AM/PM */}
                  <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <button
                      type="button"
                      onClick={() => handleCustomTimeChange(customHour, customMinute, 'AM')}
                      style={{
                        padding: '7px 12px',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: customPeriod === 'AM' ? '#2563eb' : 'var(--card-bg)',
                        color: customPeriod === 'AM' ? '#ffffff' : 'var(--slate-600)',
                        cursor: 'pointer'
                      }}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCustomTimeChange(customHour, customMinute, 'PM')}
                      style={{
                        padding: '7px 12px',
                        border: 'none',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: customPeriod === 'PM' ? '#2563eb' : 'var(--card-bg)',
                        color: customPeriod === 'PM' ? '#ffffff' : 'var(--slate-600)',
                        cursor: 'pointer'
                      }}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Convenience Slots Chips */}
            <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Quick Standard Security Slots:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {APPOINTMENT_SLOTS.map((slot) => {
                  const isPicked = selectedSlot === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSlotSelect(slot)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: isPicked ? 700 : 500,
                        backgroundColor: isPicked ? '#2563eb' : 'var(--card-bg)',
                        color: isPicked ? '#ffffff' : 'var(--slate-700)',
                        border: isPicked ? '1px solid #2563eb' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isPicked && <CheckCircle2 size={12} color="#ffffff" />}
                      <span>{slot.label}</span>
                      <span style={{ fontSize: '0.65625rem', opacity: isPicked ? 0.9 : 0.6 }}>({slot.period})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* University Honor Code checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: 'var(--slate-50)',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem'
          }}>
            <input
              type="checkbox"
              id="honorCode"
              checked={formData.agree_terms}
              onChange={(e) => setFormData({ ...formData, agree_terms: e.target.checked })}
              style={{ marginTop: '3px', width: '16px', height: '16px', cursor: 'pointer' }}
              required
            />
            <label htmlFor="honorCode" style={{ fontSize: '0.8125rem', color: 'var(--slate-700)', lineHeight: 1.5, cursor: 'pointer' }}>
              <strong>Campus Honor Declaration:</strong> I solemnly confirm under university disciplinary policy that this is my lawful property. False claims are subject to immediate academic sanction and security audit.
            </label>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Link to={`/matches/${matchId}`} className="btn btn-secondary" style={{ padding: '0.625rem 1.25rem' }}>
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ padding: '0.625rem 1.75rem', fontWeight: 600, gap: '6px' }}
            >
              <FileCheck2 size={16} /> {submitting ? "Submitting..." : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
