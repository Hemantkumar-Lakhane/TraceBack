import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Laptop, CreditCard, Key, Briefcase, Shirt, BookOpen, HelpCircle } from 'lucide-react';
import { StatusBadge, TypeBadge } from './StatusBadge';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'ELECTRONICS': return <Laptop size={28} color="var(--primary)" />;
    case 'WALLETS_CARDS': return <CreditCard size={28} color="#b45309" />;
    case 'KEYS': return <Key size={28} color="#047857" />;
    case 'BAGS_BACKPACKS': return <Briefcase size={28} color="#6366f1" />;
    case 'CLOTHING_ACCESSORIES': return <Shirt size={28} color="#b91c1c" />;
    case 'BOOKS_STATIONERY': return <BookOpen size={28} color="#475569" />;
    default: return <HelpCircle size={28} color="var(--slate-500)" />;
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
      borderRadius: '14px',
      border: '1px solid var(--slate-200)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      height: '100%'
    }}>
      {/* Image Thumbnail / Fallback Header */}
      <div style={{
        height: '170px',
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
            gap: '8px',
            color: 'var(--slate-400)'
          }}>
            {getCategoryIcon(item.category)}
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{item.category || 'Item'}</span>
          </div>
        )}

        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
          <TypeBadge type={report.type} />
        </div>

        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <StatusBadge status={report.status} />
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h4 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--slate-900)',
            marginBottom: '6px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {item.name || 'Unnamed Item'}
          </h4>

          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--slate-600)',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5rem'
          }}>
            {item.description || 'No detailed description provided.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} color="var(--primary)" />
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {report.location || 'Campus'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} color="var(--slate-400)" />
              <span>
                {report.date ? new Date(report.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
            ID: #{report.id}
          </span>
          <Link
            to={`/reports/${report.type?.toLowerCase() || 'lost'}/${report.id}`}
            className="btn btn-outline btn-sm"
            style={{ gap: '4px', fontSize: '0.75rem', padding: '4px 10px' }}
          >
            Details <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
