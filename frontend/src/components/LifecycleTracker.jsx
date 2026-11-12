import React from 'react';
import { FileText, GitMerge, MessageSquare, FileCheck2, ShieldCheck, CheckCheck } from 'lucide-react';

export const LifecycleTracker = ({ currentStep = 3, showHeader = false }) => {
  const steps = [
    { number: 1, label: 'Report', desc: 'Item Logged', icon: <FileText size={14} /> },
    { number: 2, label: 'Match', desc: 'Correlation Engine', icon: <GitMerge size={14} /> },
    { number: 3, label: 'Chat', desc: 'Direct Verification', icon: <MessageSquare size={14} /> },
    { number: 4, label: 'Claim', desc: 'Proof Submitted', icon: <FileCheck2 size={14} /> },
    { number: 5, label: 'Security', desc: 'Custody Vault', icon: <ShieldCheck size={14} /> },
    { number: 6, label: 'Handover', desc: 'Return Verified', icon: <CheckCheck size={14} /> },
  ];

  return (
    <div style={{
      padding: '1.25rem 1.5rem',
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px'
    }}>
      {showHeader && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)', margin: 0 }}>
              Campus Recovery Lifecycle
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '2px 0 0' }}>
              Standard institutional audit process
            </p>
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-600)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            Stage {currentStep} of 6
          </span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        alignItems: 'center'
      }}>
        {steps.map((step) => {
          const isDone = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div
              key={step.number}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: isCurrent ? 'var(--slate-50)' : 'transparent',
                border: isCurrent ? '1px solid var(--slate-200)' : '1px solid transparent'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDone ? '#10b981' : isCurrent ? '#2563eb' : 'var(--slate-100)',
                color: isDone || isCurrent ? '#ffffff' : 'var(--slate-400)',
                flexShrink: 0
              }}>
                {isDone ? <CheckCheck size={13} /> : step.icon}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? '#2563eb' : isDone ? 'var(--slate-900)' : 'var(--slate-500)',
                  lineHeight: 1.2
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LifecycleTracker;
