import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Archive,
  AlertTriangle,
  FileCheck2,
  Lock
} from 'lucide-react';
import MatchScoreBadge from '../components/MatchScoreBadge';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { MOCK_CLAIMS, MOCK_REPORTS } from '../api/mockData';
import claimService from '../api/claimService';

export const SecurityClaimVerification = () => {
  const { id = 501 } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [claim, setClaim] = useState(MOCK_CLAIMS[0]);
  const [checklist, setChecklist] = useState({
    idVerified: false,
    secretMarksMatched: false,
    serialMatched: false,
    ownerSignature: false
  });

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const allChecked = checklist.idVerified && checklist.secretMarksMatched && checklist.ownerSignature;

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await claimService.updateClaimStatus(claim.id, 'APPROVED', 'Verified by Inspector Rajesh Kumar. Student presented valid university ID and unlocked device.');
      toast.success("Claim APPROVED! Handover voucher confirmed and case marked as RETURNED.");
      setShowApproveModal(false);
      setClaim(prev => ({ ...prev, status: 'APPROVED' }));
    } catch (err) {
      toast.error("Failed to approve claim.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejecting the claim.");
      return;
    }
    setProcessing(true);
    try {
      await claimService.updateClaimStatus(claim.id, 'REJECTED', rejectReason);
      toast.warning("Claim rejected with notice sent to student.");
      setShowRejectModal(false);
      setClaim(prev => ({ ...prev, status: 'REJECTED' }));
    } catch (err) {
      toast.error("Failed to reject claim.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/security/claims" className="btn btn-ghost btn-sm" style={{ gap: '6px', marginBottom: '4px' }}>
            <ArrowLeft size={16} /> Back to Claims Queue
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Claim Verification Audit #{claim.id}
            </h1>
            <StatusBadge status={claim.status} />
          </div>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Cross-examination workspace for physical custody return
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowRejectModal(true)}
            className="btn btn-danger btn-sm"
            disabled={claim.status === 'APPROVED' || claim.status === 'REJECTED'}
            style={{ gap: '6px' }}
          >
            <XCircle size={16} /> Reject Claim
          </button>
          <button
            onClick={() => setShowApproveModal(true)}
            className="btn btn-success"
            disabled={claim.status === 'APPROVED' || claim.status === 'REJECTED' || !allChecked}
            style={{ gap: '6px' }}
          >
            <CheckCircle2 size={16} /> Approve & Mark Returned
          </button>
        </div>
      </div>

      {/* Split Screen: Left (Student Claim Proof) vs Right (Vault Storage Record) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left Side: Student Claim Evidence */}
        <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '16px', borderTop: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Claimant Student Evidence</h3>
            </div>
            <MatchScoreBadge score={claim.matchScore || 92} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: 'var(--slate-50)', padding: '12px', borderRadius: '10px' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 700 }}>STUDENT NAME</span>
                <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{claim.claimant?.name}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 700 }}>CAMPUS ID</span>
                <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{claim.claimant?.studentId}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 700 }}>CAMPUS EMAIL</span>
                <div style={{ color: 'var(--slate-700)' }}>{claim.claimant?.email}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 700 }}>PHONE NUMBER</span>
                <div style={{ color: 'var(--slate-700)' }}>{claim.claimant?.phone}</div>
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                SECRET / HIDDEN IDENTIFIERS GIVEN BY STUDENT
              </span>
              <p style={{ color: 'var(--slate-800)', lineHeight: 1.5 }}>
                "{claim.verificationAnswers?.secretMarks}"
              </p>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--slate-50)', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '4px' }}>
                STATED SERIAL NUMBER & LOCKSCREEN HINT
              </span>
              <p style={{ color: 'var(--slate-800)' }}>
                Serial: <strong>{claim.verificationAnswers?.serialNumber || 'N/A'}</strong> <br />
                Wallpaper Hint: <strong>{claim.verificationAnswers?.lockScreenHint || 'N/A'}</strong>
              </p>
            </div>

            {claim.proofFile && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '6px' }}>
                  ATTACHED PROOF DOCUMENT / RECEIPT
                </span>
                <img
                  src={claim.proofFile}
                  alt="Proof Document"
                  style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid var(--slate-200)' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Physical Vault Record */}
        <div className="surface-card" style={{ padding: '1.75rem', borderRadius: '16px', borderTop: '4px solid var(--emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <Archive size={18} color="var(--emerald)" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Physical Vault Item</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ backgroundColor: 'var(--emerald-light)', padding: '12px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--emerald-dark)', textTransform: 'uppercase' }}>
                PHYSICAL LOCKER LOCATION
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--emerald-dark)', marginTop: '2px' }}>
                {claim.item?.storageLocation || 'Central Security Desk Locker A-12'}
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--slate-50)', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                ITEM DESCRIPTION
              </span>
              <strong>{claim.item?.name}</strong>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                Category: {claim.item?.category} • Color: {claim.item?.color || 'Space Gray'}
              </p>
            </div>

            {/* Officer Verification Checklist */}
            <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '8px' }}>
                Officer Physical Checklist:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={checklist.idVerified}
                    onChange={(e) => setChecklist({ ...checklist, idVerified: e.target.checked })}
                  />
                  <span>Student ID physically verified matches <strong>{claim.claimant?.studentId}</strong></span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={checklist.secretMarksMatched}
                    onChange={(e) => setChecklist({ ...checklist, secretMarksMatched: e.target.checked })}
                  />
                  <span>Secret markings / sticker position confirmed on physical item</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={checklist.serialMatched}
                    onChange={(e) => setChecklist({ ...checklist, serialMatched: e.target.checked })}
                  />
                  <span>Serial number or password unlock validated</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8125rem' }}>
                  <input
                    type="checkbox"
                    checked={checklist.ownerSignature}
                    onChange={(e) => setChecklist({ ...checklist, ownerSignature: e.target.checked })}
                  />
                  <span>Student signed physical handover log</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Confirmation Modal */}
      <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Confirm Ownership Approval & Handover">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <CheckCircle2 size={24} color="var(--emerald)" />
            <div style={{ fontSize: '0.875rem', color: 'var(--emerald-dark)' }}>
              <strong>Atomic State Update:</strong> Marking this claim as Approved will set the Claim to <strong>APPROVED</strong>, Found Report to <strong>RETURNED</strong>, and Match Record to <strong>CLOSED</strong>.
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>
            Are you sure you want to release <strong>{claim.item?.name}</strong> to <strong>{claim.claimant?.name}</strong>?
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
            <button onClick={() => setShowApproveModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleApprove} className="btn btn-success" disabled={processing}>
              {processing ? 'Processing Handover...' : 'Confirm & Handover Item'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Ownership Claim">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#fef2f2', padding: '14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
            <AlertTriangle size={24} color="var(--rose)" />
            <div style={{ fontSize: '0.875rem', color: 'var(--rose-dark)' }}>
              Claim rejection notice will be emailed to the student.
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="rejectReason">Rejection Reason *</label>
            <textarea
              id="rejectReason"
              className="form-textarea"
              rows={3}
              placeholder="e.g. Secret marks do not match the physical item in vault locker."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setShowRejectModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleReject} className="btn btn-danger" disabled={processing}>
              {processing ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SecurityClaimVerification;
