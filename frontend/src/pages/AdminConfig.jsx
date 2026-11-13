import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Clock,
  Phone,
  Sliders,
  Save,
  CheckCircle2,
  Lock,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { CAMPUS_CONFIG } from '../config/campusConfig';

export const AdminConfig = () => {
  const { toast } = useToast();

  const [config, setConfig] = useState({
    campusName: CAMPUS_CONFIG.name,
    helpline: CAMPUS_CONFIG.securityOffice.helpline,
    officeLocation: CAMPUS_CONFIG.securityOffice.location,
    operatingHours: CAMPUS_CONFIG.securityOffice.hours,
    matchThreshold: 70,
    claimExpiryDays: 30,
    allowedEmailDomain: '@vit.edu',
    requirePrnAuth: true,
    autoCloseHandedOver: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Campus configuration saved and applied across platform.');
    }, 400);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-open">System Policy</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              {CAMPUS_CONFIG.name} Administration
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Campus System Configuration
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            Adjust campus security desks, matching engine sensitivity thresholds, and institutional access parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
          disabled={saving}
        >
          <Save size={14} /> {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Security Desk & Helpdesk Info */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="var(--accent, #2563eb)" /> Central Security Desk Parameters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Official Campus Name</label>
              <input
                type="text"
                className="form-input"
                value={config.campusName}
                onChange={(e) => setConfig({ ...config, campusName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Helpline Phone</label>
              <input
                type="text"
                className="form-input"
                value={config.helpline}
                onChange={(e) => setConfig({ ...config, helpline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Central Vault Location</label>
              <input
                type="text"
                className="form-input"
                value={config.officeLocation}
                onChange={(e) => setConfig({ ...config, officeLocation: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Operating Hours</label>
              <input
                type="text"
                className="form-input"
                value={config.operatingHours}
                onChange={(e) => setConfig({ ...config, operatingHours: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Matching Engine Settings */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} color="var(--accent, #2563eb)" /> Automated Matching Engine Sensitivity
          </h3>

          <div className="admin-two-col-grid">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Minimum Match Score Threshold</span>
                <strong style={{ color: 'var(--accent, #2563eb)' }}>{config.matchThreshold}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={config.matchThreshold}
                onChange={(e) => setConfig({ ...config, matchThreshold: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                Pairs matching category, brand, color, or location below this threshold will not trigger student notifications.
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Vault Custody Retention Period</span>
                <strong style={{ color: 'var(--text-main)' }}>{config.claimExpiryDays} Days</strong>
              </div>
              <input
                type="range"
                min="7"
                max="90"
                step="1"
                value={config.claimExpiryDays}
                onChange={(e) => setConfig({ ...config, claimExpiryDays: Number(e.target.value) })}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '4px', display: 'block' }}>
                Days unclaimed found items are held in Building 1 vault before institutional archiving.
              </span>
            </div>
          </div>
        </div>

        {/* Identity & Access Governance */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} color="var(--accent, #2563eb)" /> Identity & Student Security Policies
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
              <div>
                <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>Mandatory Institutional Email Domain</strong>
                <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Only emails ending with {config.allowedEmailDomain} can register</div>
              </div>
              <span className="badge badge-approved" style={{ fontSize: '0.6875rem' }}>ENFORCED</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '6px' }}>
              <div>
                <strong style={{ fontSize: '0.8125rem', color: 'var(--text-main)' }}>8-Digit PRN Password Verification</strong>
                <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Permanent Registration Number matching registrar records</div>
              </div>
              <span className="badge badge-approved" style={{ fontSize: '0.6875rem' }}>ACTIVE</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminConfig;

