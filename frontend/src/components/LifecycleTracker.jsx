import React from 'react';
import { FileText, Sparkles, MessageSquare, FileCheck2, ShieldCheck, CheckCheck } from 'lucide-react';

export const LifecycleTracker = ({ currentStep = 1 }) => {
  const steps = [
    { number: 1, label: '1. Report', desc: 'Item Logged', icon: <FileText size={16} /> },
    { number: 2, label: '2. Match', desc: 'AI Scoring (40/30/30)', icon: <Sparkles size={16} /> },
    { number: 3, label: '3. Chat', desc: 'Finder Verification', icon: <MessageSquare size={16} /> },
    { number: 4, label: '4. Claim', desc: 'Proof Submitted', icon: <FileCheck2 size={16} /> },
    { number: 5, label: '5. Verify', desc: 'Security Audit', icon: <ShieldCheck size={16} /> },
    { number: 6, label: '6. Return', desc: 'Physical Handover', icon: <CheckCheck size={16} /> },
  ];

  return (
    <div className="surface-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            TraceBack Golden Path
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-800)' }}>
            Item Recovery Pipeline
          </h4>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
          Campus Trust Protocol
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflowX: 'auto',
        padding: '0.5rem 0'
      }}>
        {steps.map((step, idx) => {
          const isDone = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          let stepColor = 'var(--slate-400)';
          let stepBg = '#ffffff';
          let stepBorder = 'var(--slate-200)';

          if (isDone) {
            stepColor = '#ffffff';
            stepBg = 'var(--emerald)';
            stepBorder = 'var(--emerald)';
          } else if (isCurrent) {
            stepColor = '#ffffff';
            stepBg = 'var(--primary)';
            stepBorder = 'var(--primary)';
          }

          return (
            <React.Fragment key={step.number}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                minWidth: '100px',
                zIndex: 2
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: stepBg,
                  color: stepColor,
                  border: `2px solid ${stepBorder}`,
                  boxShadow: isCurrent ? '0 0 12px rgba(29, 78, 216, 0.4)' : 'none',
                  marginBottom: '6px',
                  transition: 'all 0.3s ease'
                }}>
                  {step.icon}
                </div>
                <span style={{
                  fontSize: '0.8125rem',
                  fontWeight: isCurrent ? 700 : 600,
                  color: isCurrent ? 'var(--primary)' : isDone ? 'var(--slate-800)' : 'var(--slate-500)'
                }}>
                  {step.label}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>
                  {step.desc}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: '3px',
                  backgroundColor: isDone ? 'var(--emerald)' : 'var(--slate-200)',
                  margin: '0 8px',
                  marginTop: '-24px',
                  minWidth: '24px',
                  borderRadius: '2px',
                  transition: 'background-color 0.3s ease'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default LifecycleTracker;
