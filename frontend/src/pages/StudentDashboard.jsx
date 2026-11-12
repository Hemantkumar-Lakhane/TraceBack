import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PlusCircle,
  Search,
  GitMerge,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import LifecycleTracker from '../components/LifecycleTracker';
import ItemCard from '../components/ItemCard';
import StatusBadge from '../components/StatusBadge';
import MatchScoreBadge from '../components/MatchScoreBadge';
import reportService from '../api/reportService';
import matchService from '../api/matchService';
import { getItemImageUrl } from '../utils/imageUtils';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [lostReports, setLostReports] = useState([]);
  const [foundReports, setFoundReports] = useState([]);
  const [matches, setMatches] = useState([]);
  const [recentCampusReports, setRecentCampusReports] = useState([]);
  const [activeTab, setActiveTab] = useState('LOST');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [lost, found, myMatches, allReports] = await Promise.all([
          reportService.getMyReports('LOST'),
          reportService.getMyReports('FOUND'),
          matchService.getMyMatches(),
          reportService.getReports({})
        ]);
        setLostReports(lost || []);
        setFoundReports(found || []);
        setMatches(myMatches || []);
        setRecentCampusReports((allReports || []).slice(0, 4));
      } catch (err) {
        console.error("Dashboard data load error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingMatch = matches.find(m => m.status === 'ACTIVE' || !m.status);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Welcome & Quick Action Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--slate-200)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
            Welcome back, {user?.name || 'Aarav'}
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
            ID: {user?.studentId || 'IITB-2024-CS104'} • Campus Item Management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link to="/report/lost" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Report Lost Item
          </Link>
          <Link to="/report/found" className="btn btn-secondary btn-sm">
            <PlusCircle size={15} /> Report Found Item
          </Link>
          <Link to="/browse" className="btn btn-outline btn-sm">
            <Search size={15} /> Browse Items
          </Link>
        </div>
      </div>

      {/* Lifecycle Pipeline Tracker */}
      <LifecycleTracker currentStep={2} />

      {/* Action Needed Highlight Card (If match found) */}
      {pendingMatch && (
        <div className="surface-card" style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderLeft: '4px solid #2563eb',
          borderRadius: '6px',
          padding: '1.125rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: 'var(--slate-100)',
              color: 'var(--slate-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <GitMerge size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe'
                }}>
                  Match Detected
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-600)', fontWeight: 500 }}>
                  Correlation Score: <strong style={{ color: 'var(--slate-900)' }}>{pendingMatch.matchScore || 92}%</strong>
                </span>
              </div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                Match Found for your {pendingMatch.lostReport?.item?.name || 'MacBook Air'}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                A matching item was reported at <strong>{pendingMatch.foundReport?.location || 'Dr. APJ Abdul Kalam Library'}</strong>. Verify details with finder to initiate recovery.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link to={`/matches/${pendingMatch.id}`} className="btn btn-primary btn-sm">
              Review Match <ArrowRight size={14} />
            </Link>
            <Link to="/chat" className="btn btn-secondary btn-sm">
              <MessageSquare size={14} /> Open Chat
            </Link>
          </div>
        </div>
      )}

      {/* Metrics Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem'
      }}>
        <div className="surface-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>ACTIVE LOST REPORTS</span>
            <AlertCircle size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            {lostReports.length}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Open submissions</span>
        </div>

        <div className="surface-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>POTENTIAL MATCHES</span>
            <GitMerge size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            {matches.length}
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--emerald)' }}>1 High Confidence</span>
        </div>

        <div className="surface-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>CLAIMS IN VERIFICATION</span>
            <ShieldCheck size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            1
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Desk queue</span>
        </div>

        <div className="surface-card" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.75rem', fontWeight: 600 }}>
            <span>RECOVERY RATE</span>
            <TrendingUp size={16} color="var(--slate-400)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--slate-900)', marginTop: '4px' }}>
            82.2%
          </div>
          <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Avg 14h return time</span>
        </div>
      </div>

      {/* Main Two-Column Section: My Reports vs Recent Campus Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: My Reported Items */}
        <div className="surface-card" style={{ padding: '1.25rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>My Submissions</h3>
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--slate-100)', padding: '2px', borderRadius: '4px' }}>
              <button
                onClick={() => setActiveTab('LOST')}
                style={{
                  background: activeTab === 'LOST' ? '#ffffff' : 'transparent',
                  color: activeTab === 'LOST' ? 'var(--slate-900)' : 'var(--slate-600)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Lost ({lostReports.length})
              </button>
              <button
                onClick={() => setActiveTab('FOUND')}
                style={{
                  background: activeTab === 'FOUND' ? '#ffffff' : 'transparent',
                  color: activeTab === 'FOUND' ? 'var(--slate-900)' : 'var(--slate-600)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Found ({foundReports.length})
              </button>
            </div>
          </div>

          {activeTab === 'LOST' ? (
            lostReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-400)' }}>
                <p style={{ marginBottom: '0.75rem', fontSize: '0.8125rem' }}>No lost reports filed yet.</p>
                <Link to="/report/lost" className="btn btn-outline btn-sm">Report Lost Item</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lostReports.map(report => (
                  <div
                    key={report.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--card-bg)',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--slate-100)',
                        border: '1px solid var(--border-color)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={getItemImageUrl(report.item, true)}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/uploads/demo-macbook.jpg';
                          }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {report.item?.name || 'Unnamed Item'}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
                          <MapPin size={11} />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{report.location}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <StatusBadge status={report.status} />
                      <Link to={`/reports/lost/${report.id}`} className="btn btn-ghost btn-sm" style={{ padding: '3px 6px' }}>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            foundReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-400)' }}>
                <p style={{ marginBottom: '0.75rem', fontSize: '0.8125rem' }}>No found reports filed yet.</p>
                <Link to="/report/found" className="btn btn-outline btn-sm">Report Found Item</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {foundReports.map(report => (
                  <div
                    key={report.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--card-bg)',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--slate-100)',
                        border: '1px solid var(--border-color)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={getItemImageUrl(report.item, true)}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/uploads/demo-macbook.jpg';
                          }}
                        />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-900)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {report.item?.name || 'Unnamed Item'}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
                          <MapPin size={11} />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{report.location}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge status={report.status} />
                      <Link to={`/reports/found/${report.id}`} className="btn btn-ghost btn-sm" style={{ padding: '3px 6px' }}>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Right: Campus Activity Feed */}
        <div className="surface-card" style={{ padding: '1.25rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Campus Activity</h3>
              <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)' }}>Recent reports across campus</span>
            </div>
            <Link to="/browse" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Browse all →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentCampusReports.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--slate-100)',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={getItemImageUrl(item.item, true)}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/uploads/demo-macbook.jpg';
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                      <span style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: item.type === 'LOST' ? 'var(--rose)' : 'var(--emerald)'
                      }}>
                        [{item.type}]
                      </span>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--slate-900)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {item.item?.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--slate-500)' }}>
                      <MapPin size={11} />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.location}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/reports/${item.type?.toLowerCase()}/${item.id}`} className="btn btn-ghost btn-sm" style={{ padding: '2px 5px' }}>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
