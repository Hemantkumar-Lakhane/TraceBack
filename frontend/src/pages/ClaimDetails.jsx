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
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { CAMPUS_CONFIG } from '../config/campusConfig';
import claimService from '../api/claimService';
import { MOCK_CLAIMS } from '../api/mockData';

export const ClaimDetails = () => {
  const { id = 1 } = useParams();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const fetchClaim = async () => {
      setLoading(true);
      try {
        const data = await claimService.getClaimById(id);
        if (!isCancelled && data) {
          let parsedAnswers = {};
          if (data.verificationData) {
            try {
              parsedAnswers = JSON.parse(data.verificationData);
            } catch {
              parsedAnswers = { secretMarks: data.verificationData };
            }
          }
          const item = data.matchRecord?.lostReport?.item || data.matchRecord?.foundReport?.item;
          const claimant = data.claimant || { name: 'Aarav Sharma', studentId: '12110104' };

          setClaim({
            id: data.id,
            status: data.status || 'PENDING',
            matchScore: data.matchRecord?.score || 100,
            submittedAt: data.createdAt,
            claimant: {
              name: claimant.name || 'Aarav Sharma',
              studentId: claimant.studentId || '12110104'
            },
            item: {
              name: item?.name || 'Space Gray MacBook Pro 14"',
              category: item?.category,
              storageLocation: `${CAMPUS_CONFIG.securityOffice.name} - Locker A-12`
            },
            verificationAnswers: {
              secretMarks: parsedAnswers.secretMarks || 'Identifying sticker on bottom chassis',
              serialNumber: parsedAnswers.serialNumber || 'FVFX9082MD6R',
              lockScreenHint: parsedAnswers.lockScreenHint || 'Western Ghats wallpaper',
              pickupDate: data.pickupDate || '2026-11-14',
              pickupTime: data.pickupTime ? data.pickupTime.substring(0, 5) : '14:00'
            }
          });
        }
      } catch (err) {
        console.warn("Could not load real claim details, falling back to local dataset", err);
        const fallback = MOCK_CLAIMS.find(c => String(c.id) === String(id)) || MOCK_CLAIMS[0];
        setClaim(fallback);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetchClaim();
    return () => { isCancelled = true; };
  }, [id]);

  if (loading || !claim) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--slate-500)' }}>
        <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
        <p>Loading digital claim voucher & verification pass...</p>
      </div>
    );
  }

  // Status step calculation:
  // PENDING = step 2, APPROVED = step 3, RETURNED = step 4
  const currentStep = claim.status === 'RETURNED' ? 4 : claim.status === 'APPROVED' ? 3 : 2;

  // Real QR Verification Pass Payload (Scannable with any Camera / QR reader)
  const qrPassPayload = JSON.stringify({
    passId: `PASS-${claim.id}`,
    claimant: claim.claimant?.name,
    studentId: claim.claimant?.studentId,
    item: claim.item?.name,
    custodyVault: claim.item?.storageLocation,
    status: claim.status,
    authCode: `TB-SEC-${claim.id}-${Date.now().toString(36).toUpperCase()}`
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link to="/claims" className="btn btn-ghost btn-sm" style={{ gap: '6px', marginBottom: '4px' }}>
            <ArrowLeft size={16} /> My Claims
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
              Claim Voucher #{claim.id}
            </h1>
            <span className="badge badge-open" style={{ fontSize: '0.75rem' }}>OFFICIAL VOUCHER</span>
          </div>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem', marginTop: '4px' }}>
            Ownership verification status for <strong>{claim.item?.name}</strong>
          </p>
        </div>

        <button onClick={() => setShowQRModal(true)} className="btn btn-primary" style={{ gap: '8px', padding: '0.625rem 1.25rem' }}>
          <QrCode size={16} /> Show Security Pickup Pass
        </button>
      </div>

      {/* 4-Step Claim Progress Bar */}
      <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
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
                borderRadius: '8px',
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Your Answers */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--slate-900)' }}>
            Submitted Ownership Evidence
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--slate-400)', fontSize: '0.6875rem', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                HIDDEN IDENTIFIERS / MARKS
              </span>
              <p style={{ color: 'var(--slate-800)', marginTop: '4px', lineHeight: 1.5, margin: 0 }}>
                {claim.verificationAnswers?.secretMarks}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--slate-400)', fontSize: '0.6875rem', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  SERIAL NUMBER
                </span>
                <strong style={{ color: 'var(--slate-900)' }}>{claim.verificationAnswers?.serialNumber || 'N/A'}</strong>
              </div>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--slate-400)', fontSize: '0.6875rem', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  MATCH SCORE
                </span>
                <strong style={{ color: 'var(--emerald-dark)' }}>{claim.matchScore}% High Match</strong>
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--slate-400)', fontSize: '0.6875rem', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                SCREEN WALLPAPER / HINT
              </span>
              <p style={{ color: 'var(--slate-800)', marginTop: '4px', lineHeight: 1.5, margin: 0 }}>
                {claim.verificationAnswers?.lockScreenHint}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Pickup Appointment Details & Security Instructions */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--slate-900)' }}>Pickup Details</h3>
              <StatusBadge status={claim.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                <MapPin size={16} color="#2563eb" style={{ flexShrink: 0 }} />
                <span>{claim.item?.storageLocation || `${CAMPUS_CONFIG.securityOffice.name} - Desk 1`}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                <Calendar size={16} color="var(--slate-500)" style={{ flexShrink: 0 }} />
                <span>Scheduled: <strong>{claim.verificationAnswers?.pickupDate} at {claim.verificationAnswers?.pickupTime} IST</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-700)' }}>
                <User size={16} color="var(--slate-500)" style={{ flexShrink: 0 }} />
                <span>Claimant: <strong>{claim.claimant?.name} (PRN: {claim.claimant?.studentId})</strong></span>
              </div>
            </div>

            <div style={{
              marginTop: '1.25rem',
              padding: '12px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: 'var(--slate-700)',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#1d4ed8' }}>Mandatory Security Checkpoint:</strong>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '4px', marginBottom: 0 }}>
                <li>Your physical VIT Student ID Card (with PRN)</li>
                <li>Digital Pickup Pass / QR code on this screen</li>
                <li>Device unlock passcode (for laptops / smartphones)</li>
              </ul>
            </div>
          </div>

          <button onClick={() => setShowQRModal(true)} className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%', gap: '6px' }}>
            <QrCode size={16} /> Open Digital QR Pass
          </button>
        </div>
      </div>

      {/* Real Scannable 2D QR Code Pass Modal */}
      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title={`Security Pickup Pass #PASS-${claim.id}`}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          {/* Authentic High-Resolution QR Barcode Container */}
          <div style={{
            width: '210px',
            height: '210px',
            margin: '0 auto 1.25rem',
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
            padding: '12px',
            boxSizing: 'border-box'
          }}>
            <QRCodeSVG
              value={qrPassPayload}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <span className="badge badge-open" style={{ marginBottom: '8px', fontSize: '0.6875rem' }}>
            OFFICIAL CAMPUS VERIFICATION PASS
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: '4px 0' }}>
            {claim.item?.name}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginTop: '4px' }}>
            Authorized Claimant: <strong>{claim.claimant?.name} (PRN: {claim.claimant?.studentId})</strong>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '2px' }}>
            Present this authentic 2D matrix barcode to Inspector Rajesh Kumar at {CAMPUS_CONFIG.securityOffice.name}.
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
