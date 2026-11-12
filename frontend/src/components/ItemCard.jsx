import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Laptop, CreditCard, Key, Briefcase, Shirt, BookOpen, HelpCircle } from 'lucide-react';
import { StatusBadge, TypeBadge } from './StatusBadge';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'ELECTRONICS': return <Laptop size={24} color="var(--slate-600)" />;
    case 'WALLETS_CARDS': return <CreditCard size={24} color="var(--slate-600)" />;
    case 'KEYS': return <Key size={24} color="var(--slate-600)" />;
    case 'BAGS_BACKPACKS': return <Briefcase size={24} color="var(--slate-600)" />;
    case 'CLOTHING_ACCESSORIES': return <Shirt size={24} color="var(--slate-600)" />;
    case 'BOOKS_STATIONERY': return <BookOpen size={24} color="var(--slate-600)" />;
    default: return <HelpCircle size={24} color="var(--slate-500)" />;
  }
};

export const ItemCard = ({ report }) => {
  const item = report.item || {};
  const isLost = report.type === 'LOST';

  return (
    <div className="surface-card" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: '6px',
      border: '1px solid var(--border-color)',
      height: '100%',
      backgroundColor: 'var(--card-bg)'
    }}>
      {/* Image Thumbnail / Fallback Header */}
      <div style={{
        height: '150px',
        backgroundColor: 'var(--slate-100)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--slate-400)'
          }}>
            {getCategoryIcon(item.category)}
            <span style={{ fontSize: '0.6875rem', fontWeight: 500 }}>{item.category || 'Item'}</span>
          </div>
        )}

        <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px' }}>
          <TypeBadge type={report.type} />
        </div>

        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <StatusBadge status={report.status} />
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h4 style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--slate-900)',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {item.name || 'Unnamed Item'}
          </h4>

          <p style={{
            fontSize: '0.75rem',
            color: 'var(--slate-500)',
            marginBottom: '10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.2rem',
            lineHeight: 1.4
          }}>
            {item.description || 'No detailed description provided.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={11} />
              <span>{report.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={11} />
              <span>{new Date(report.date || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            to={`/reports/${report.type?.toLowerCase() || 'lost'}/${report.id}`}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.75rem', padding: '3px 8px' }}
          >
            Details <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
