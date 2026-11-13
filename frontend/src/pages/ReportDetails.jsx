import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  Share2,
  GitMerge,
  MessageSquare,
  FileCheck2,
  QrCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import StatusBadge, { TypeBadge } from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';
import reportService from '../api/reportService';
import matchService from '../api/matchService';
import { getItemImageUrl, LOCAL_CATEGORY_IMAGES, CATEGORY_PLACEHOLDERS } from '../utils/imageUtils';
import { QRCodeSVG } from 'qrcode.react';

export const ReportDetails = () => {
  const { id, type = 'lost' } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await reportService.getReportById(id, type);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, type]);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--slate-400)' }}>Loading report details...</div>;
  }

  if (!report) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Report Not Found</h3>
        <Link to="/browse" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Browse</Link>
      </div>
    );
  }

  const item = report.item || {};
  const isLost = report.type === 'LOST';
  const itemImg = getItemImageUrl(item, true);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowQRModal(true)} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <QrCode size={14} /> Item QR Code
          </button>
          <button onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
          }} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      {/* Main Grid: Photo / Gallery Left & Item Details Right */}
      <div className="surface-card" style={{ padding: '2rem', borderRadius: '18px', overflow: 'hidden' }}>
        <div className="report-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.5rem' }}>
          {/* Left: Image */}
          <div>
            <div className="report-details-img-box" style={{
              width: '100%',
              height: '320px',
              backgroundColor: 'var(--slate-100)',
              borderRadius: '14px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--slate-200)',
              position: 'relative'
            }}>
              {itemImg ? (
                <img
                  src={itemImg}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
                  onError={(e) => {
                    const cat = item.category?.toUpperCase() || 'OTHER';
                    const localFallback = LOCAL_CATEGORY_IMAGES[cat] || '/uploads/demo-macbook.jpg';
                    if (!e.target.src.includes(localFallback)) {
                      e.target.src = localFallback;
                    }
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--slate-400)' }}>
                  <Tag size={48} style={{ margin: '0 auto 8px' }} />
                  <p>No photo provided</p>
                </div>
              )}

              <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                <TypeBadge type={report.type} />
              </div>
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <StatusBadge status={report.status} />
              </div>
            </div>

            {/* Storage / Safety Badge */}
            {report.storageLocation && (
              <div style={{
                marginTop: '1rem',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'var(--emerald-light)',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8125rem',
                color: 'var(--emerald-dark)'
              }}>
                <ShieldCheck size={18} />
                <span>
                  <strong>Safe Custody:</strong> {report.storageLocation}
                </span>
              </div>
            )}
          </div>

          {/* Right: Item Metadata & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                Report #{report.id} • Category: {item.category}
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '4px', marginBottom: '1rem' }}>
                {item.name}
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                backgroundColor: 'var(--slate-50)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.25rem',
                fontSize: '0.875rem'
              }}>
                <div>
                  <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>BRAND</span>
                  <strong>{item.brand || 'Not Specified'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>PRIMARY COLOR</span>
                  <strong>{item.color || 'Not Specified'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>LOCATION</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="var(--primary)" />
                    <strong>{report.location}</strong>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'block' }}>DATE REPORTED</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="var(--slate-400)" />
                    <strong>{report.date ? new Date(report.date).toLocaleDateString() : 'Recent'}</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Description & Notes:
                </h4>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, backgroundColor: 'var(--slate-50)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  {item.description || 'No additional description provided.'}
                </p>
              </div>
            </div>

            {/* Reporter privacy notice */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                Reported by: <strong>{report.user?.name || 'Verified Student'}</strong> (Contact masked for campus privacy)
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/matches" className="btn btn-primary btn-sm">
                  <GitMerge size={14} /> View Matches
                </Link>
                <Link to="/chat" className="btn btn-secondary btn-sm">
                  <MessageSquare size={14} /> Open Chat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title={`Item QR Tag #${report.id}`}>
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <div style={{
            width: '180px',
            height: '180px',
            margin: '0 auto 1.5rem',
            backgroundColor: '#ffffff',
            border: '2px solid #0f172a',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            padding: '10px',
            boxSizing: 'border-box'
          }}>
            {/* Real Scannable 2D QR Code */}
            <QRCodeSVG
              value={`https://traceback.vit.edu/verify/item/${report.id}?type=${report.type}&item=${encodeURIComponent(item.name || '')}`}
              size={150}
              level="H"
              includeMargin={false}
            />
          </div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item.name}</h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            Scan at any Campus Security Desk to verify custody and match ownership.
          </p>
          <button onClick={() => setShowQRModal(false)} className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
            Close Tag
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ReportDetails;
