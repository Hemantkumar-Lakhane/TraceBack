import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Laptop, CreditCard, Key, Briefcase, Shirt, BookOpen, HelpCircle, Eye } from 'lucide-react';
import { StatusBadge, TypeBadge } from './StatusBadge';
import { getItemImageUrl, LOCAL_CATEGORY_IMAGES, CATEGORY_PLACEHOLDERS } from '../utils/imageUtils';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'ELECTRONICS': return <Laptop size={28} color="var(--slate-500)" />;
    case 'WALLETS_CARDS': return <CreditCard size={28} color="var(--slate-500)" />;
    case 'KEYS': return <Key size={28} color="var(--slate-500)" />;
    case 'BAGS_BACKPACKS': return <Briefcase size={28} color="var(--slate-500)" />;
    case 'CLOTHING_ACCESSORIES': return <Shirt size={28} color="var(--slate-500)" />;
    case 'BOOKS_STATIONERY': return <BookOpen size={28} color="var(--slate-500)" />;
    default: return <HelpCircle size={28} color="var(--slate-400)" />;
  }
};

export const ItemCard = ({ report }) => {
  const [isHovered, setIsHovered] = useState(false);
  const item = report.item || {};
  const isLost = report.type === 'LOST';
  const itemImg = getItemImageUrl(item, true);

  return (
    <div
      className="surface-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        height: '100%',
        backgroundColor: 'var(--card-bg)',
        boxShadow: isHovered
          ? '0 10px 24px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05)'
          : 'var(--shadow-sm)',
        transform: isHovered ? 'translateY(-3px)' : 'none',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Flipkart-Style Centered Product Image Stage */}
      <div style={{
        height: '190px',
        backgroundColor: 'var(--slate-50)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '16px',
        borderBottom: '1px solid var(--border-color)',
        boxSizing: 'border-box'
      }}>
        {itemImg ? (
          <img
            src={itemImg}
            alt={item.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.3s ease',
              filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08))'
            }}
            onError={(e) => {
              const cat = item.category?.toUpperCase() || 'OTHER';
              const localFallback = LOCAL_CATEGORY_IMAGES[cat] || '/uploads/demo-macbook.jpg';
              if (!e.target.src.includes(localFallback)) {
                e.target.src = localFallback;
              }
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
            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {item.category || 'Valuable'}
            </span>
          </div>
        )}

        {/* Floating Type & Status Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '4px', zIndex: 2 }}>
          <TypeBadge type={report.type} />
        </div>

        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
          <StatusBadge status={report.status} />
        </div>
      </div>

      {/* Card Content & E-Commerce Hierarchy */}
      <div style={{
        padding: '1.125rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div>
          {/* Brand & Category Subtitle */}
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: 'var(--slate-400)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px'
          }}>
            {item.brand ? `${item.brand} • ` : ''}{item.category?.replace('_', ' ') || 'Campus Item'}
          </div>

          <h4 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--slate-900)',
            marginBottom: '6px',
            lineHeight: 1.35,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.7rem'
          }}>
            {item.name || 'Unnamed Item'}
          </h4>

          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--slate-500)',
            marginBottom: '12px',
            lineHeight: 1.45,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.35rem'
          }}>
            {item.description || 'No detailed description provided.'}
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            fontSize: '0.71875rem',
            color: 'var(--slate-500)',
            backgroundColor: 'var(--slate-50)',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} color="#2563eb" style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {report.location}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={12} color="var(--slate-400)" style={{ flexShrink: 0 }} />
              <span>
                Reported {new Date(report.dateLost || report.dateFound || report.date || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
          <Link
            to={`/reports/${report.type?.toLowerCase() || 'lost'}/${report.id}`}
            className="btn btn-secondary btn-sm"
            style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: '0.8125rem',
              fontWeight: 600,
              gap: '6px',
              padding: '6px 12px'
            }}
          >
            <Eye size={14} /> View Case File <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
