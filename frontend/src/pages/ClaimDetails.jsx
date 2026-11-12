import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileCheck2,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowLeft,
  User,
  ExternalLink
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { MOCK_CLAIMS } from '../api/mockData';

export const ClaimDetails = () => {
  const { id = 501 } = useParams();
  const [claim, setClaim] = useState(MOCK_CLAIMS[0]);
  const [showQRModal, setShowQRModal] = useState(false);

  // Status step calculation:
  // PENDING = step 2, APPROVED = step 3, RETURNED = step 4
  const currentStep = claim.status === 'RETURNED' ? 4 : claim.status === 'APPROVED' ? 3 : 2;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem' }}>
        <div>
          <Link to="/claims" className="btn btn-ghost btn-sm" style={{ gap: '6px', marginBottom: '4px' }}>
            <ArrowLeft size={16} /> My Claims
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Claim Voucher #{claim.id}
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Ownership verification status for <strong>{claim.item?.name}</strong>
          </p>
        </div>

        <button onClick={() => setShowQRModal(true)} className="btn btn-primary" style={{ gap: '8px' }}>
          <QrCode size={16} /> Show Security Pickup Pass
        </button>
      </div>

      {/* 4-Step Claim Progress Bar */}
      <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '1.25rem' }}>
          Verification Lifecycle Status
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', position: 'relative' }}>
          {[
            { step: 1, title: "1. Submitted", desc: "Answers Logged", done: currentStep >= 1 },
            { step: 2, title: "2. Security Review", desc: "Locker Verification", done: currentStep >= 2, active: currentStep === 2 },
            { step: 3, title: "3. Approved", desc: "Pass Issued", done: currentStep >= 3, active: currentStep === 3 },
            { step: 4, title: "4. Returned", desc: "Physical Handover", done: currentStep >= 4, active: currentStep === 4 }
          ].map((s) => (
            <div
              key={s.step}
              style={{
                backgroundColor: s.done ? (s.active ? 'var(--primary-light)' : '#f0fdf4') : 'var(--slate-100)',
                border: `1.5px solid ${s.done ? (s.active ? 'var(--primary)' : 'var(--emerald)') : 'var(--slate-200)'}`,
                borderRadius: '10px',
                padding: '10px 12px',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: s.done ? (s.active ? 'var(--primary)' : 'var(--emerald-dark)') : 'var(--slate-400)'
              }}>
                {s.title}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Card Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left: Your Answers */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
            Submitted Ownership Evidence
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>HIDDEN IDENTIFIERS / MARKS</span>
              <p style={{ color: 'var(--slate-800)', marginTop: '2px' }}>{claim.verificationAnswers?.secretMarks}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>SERIAL NUMBER</span>
                <strong>{claim.verificationAnswers?.serialNumber || 'N/A'}</strong>
              </div>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>MATCH SCORE</span>
                <strong style={{ color: 'var(--emerald-dark)' }}>{claim.matchScore}% High Match</strong>
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>SCREEN WALLPAPER / HINT</span>
              <p style={{ color: 'var(--slate-800)', marginTop: '2px' }}>{claim.verificationAnswers?.lockScreenHint}</p>
            </div>
          </div>
        </div>

        {/* Right: Pickup Appointment Details & Security Instructions */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Pickup Details</h3>
              <StatusBadge status={claim.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                <MapPin size={16} color="var(--primary)" />
                <span>{claim.item?.storageLocation || 'Central Security Desk'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                <Calendar size={16} color="var(--slate-500)" />
                <span>Scheduled: <strong>{claim.verificationAnswers?.pickupDate} at {claim.verificationAnswers?.pickupTime}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                <User size={16} color="var(--slate-500)" />
                <span>Claimant: <strong>{claim.claimant?.name} ({claim.claimant?.studentId})</strong></span>
              </div>
            </div>

            <div style={{
              marginTop: '1.25rem',
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              fontSize: '0.75rem',
              color: 'var(--slate-700)',
              lineHeight: 1.4
            }}>
              <strong>What to bring to the desk:</strong>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '4px' }}>
                <li>Your physical Student ID Card</li>
                <li>Digital Pickup Pass / QR code on this screen</li>
                <li>Item unlock passcode (for laptops/phones)</li>
              </ul>
            </div>
          </div>

          <button onClick={() => setShowQRModal(true)} className="btn btn-outline" style={{ marginTop: '1.25rem', width: '100%' }}>
            <QrCode size={16} /> Open Digital QR Pass
          </button>
        </div>
      </div>

      {/* QR Code Pass Modal */}
      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title={`Security Pickup Pass #PASS-${claim.id}`}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{
            width: '200px',
            height: '200px',
            margin: '0 auto 1.25rem',
            backgroundColor: '#ffffff',
            border: '3px solid #0f172a',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <QrCode size={160} color="#0f172a" />
          </div>

          <span className="badge badge-open" style={{ marginBottom: '8px' }}>CAMPUS VERIFICATION PASS</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {claim.item?.name}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginTop: '4px' }}>
            Authorized Claimant: <strong>{claim.claimant?.name} ({claim.claimant?.studentId})</strong>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '2px' }}>
            Present this screen to Inspector Rajesh Kumar at Ramanujan Central Security Vault.
          </p>

          <button onClick={() => setShowQRModal(false)} className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ClaimDetails;
