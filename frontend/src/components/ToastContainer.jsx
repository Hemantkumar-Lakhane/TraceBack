import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px',
      width: '100%',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => {
        let bg = '#1e293b';
        let border = '#334155';
        let icon = <Info size={20} color="#38bdf8" />;

        if (t.type === 'success') {
          bg = '#064e3b';
          border = '#059669';
          icon = <CheckCircle2 size={20} color="#34d399" />;
        } else if (t.type === 'error') {
          bg = '#7f1d1d';
          border = '#dc2626';
          icon = <AlertCircle size={20} color="#f87171" />;
        } else if (t.type === 'warning') {
          bg = '#78350f';
          border = '#d97706';
          icon = <AlertTriangle size={20} color="#fbbf24" />;
        }

        return (
          <div
            key={t.id}
            className="animate-fade-in"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: bg,
              color: '#ffffff',
              borderRadius: '10px',
              border: `1px solid ${border}`,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              fontSize: '0.875rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              {icon}
              <span style={{ fontWeight: 500 }}>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
