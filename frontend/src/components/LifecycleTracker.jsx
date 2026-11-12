import React from 'react';
import { FileText, GitMerge, MessageSquare, FileCheck2, ShieldCheck, CheckCheck } from 'lucide-react';

export const LifecycleTracker = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: 'Report', desc: 'Item Logged', icon: <FileText size={15} /> },
    { number: 2, label: 'Match', desc: 'Attribute Pairing', icon: <GitMerge size={15} /> },
    { number: 3, label: 'Contact', desc: 'Direct Verification', icon: <MessageSquare size={15} /> },
    { number: 4, label: 'Claim', desc: 'Proof Submitted', icon: <FileCheck2 size={15} /> },
    { number: 5, label: 'Security', desc: 'Desk Verification', icon: <ShieldCheck size={15} /> },
    { number: 6, label: 'Return', desc: 'Handover Complete', icon: <CheckCheck size={15} /> },
  ];

  return (
    <div className="surface-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--slate-500)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Workflow Pipeline
          </span>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
            Recovery & Verification Progress
          </h4>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
          Step {currentStep} of 6
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflowX: 'auto',
        padding: '0.25rem 0'
      }}>
        {steps.map((step) => {
          const isDone = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          let stepColor = 'var(--slate-400)';
          let stepBg = '#ffffff';
          let stepBorder = 'var(--slate-200)';

          if (isDone) {
            stepColor = '#ffffff';
            stepBg = '#059669';
            stepBorder = '#059669';
          } else if (isCurrent) {
            stepColor = '#ffffff';
            stepBg = '#0f172a';
            stepBorder = '#0f172a';
          }

          return (
            <div key={step.number} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              minWidth: '90px',
              zIndex: 2
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: stepBg,
                color: stepColor,
                border: `1px solid ${stepBorder}`,
                marginBottom: '4px',
                fontSize: '0.8125rem',
                fontWeight: 600
              }}>
                {isDone ? <CheckCheck size={14} /> : step.icon}
              </div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: isCurrent ? 600 : 500,
                color: isCurrent ? 'var(--slate-900)' : isDone ? 'var(--emerald-dark)' : 'var(--slate-500)'
              }}>
                {step.label}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '1px' }}>
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LifecycleTracker;
