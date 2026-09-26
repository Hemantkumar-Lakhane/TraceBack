import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PlusCircle,
  Search,
  Sparkles,
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome & Quick Action Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--slate-200)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Welcome back, {user?.name || 'Alex'}!
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9375rem' }}>
            Campus ID: <strong>{user?.studentId || 'STU-89241'}</strong> • Manage your reports, matches & recovery passes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/report/lost" className="btn btn-primary" style={{ boxShadow: 'var(--shadow-glow)' }}>
            <PlusCircle size={16} /> Report Lost Item
          </Link>
          <Link to="/report/found" className="btn btn-secondary">
            <PlusCircle size={16} /> Report Found Item
          </Link>
          <Link to="/browse" className="btn btn-outline">
            <Search size={16} /> Search Database
          </Link>
        </div>
      </div>

      {/* Lifecycle Pipeline Tracker */}
      <LifecycleTracker currentStep={2} />

      {/* Action Needed Highlight Card (If match found) */}
      {pendingMatch && (
        <div className="surface-card" style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
          border: '1.5px solid #bfdbfe',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 10px rgba(29, 78, 216, 0.35)'
            }}>
              <Sparkles size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-open">ACTION REQUIRED</span>
                <MatchScoreBadge score={pendingMatch.matchScore || 92} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                High-Confidence Match Found for your {pendingMatch.lostReport?.item?.name || 'MacBook Air'}!
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                A matching item was found at <strong>{pendingMatch.foundReport?.location || 'Central Library'}</strong>. Review details and chat with the finder to initiate recovery.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to={`/matches/${pendingMatch.id}`} className="btn btn-primary">
              Review Match Details <ArrowRight size={16} />
            </Link>
            <Link to="/chat" className="btn btn-secondary">
              <MessageSquare size={16} /> Chat Finder
            </Link>
          </div>
        </div>
      )}

      {/* Metrics Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        <div className="surface-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8125rem', fontWeight: 600 }}>
            <span>MY ACTIVE LOST REPORTS</span>
            <AlertCircle size={18} color="var(--rose)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '8px' }}>
            {lostReports.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Tracked on campus</span>
        </div>

        <div className="surface-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8125rem', fontWeight: 600 }}>
            <span>POTENTIAL MATCHES</span>
            <Sparkles size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '8px' }}>
            {matches.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--emerald)' }}>1 High Confidence (92%)</span>
        </div>

        <div className="surface-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8125rem', fontWeight: 600 }}>
            <span>CLAIMS IN VERIFICATION</span>
            <ShieldCheck size={18} color="var(--amber)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--amber-dark)', marginTop: '8px' }}>
            1
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Queued at Security Desk</span>
        </div>

        <div className="surface-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate-500)', fontSize: '0.8125rem', fontWeight: 600 }}>
            <span>CAMPUS RECOVERY RATE</span>
            <TrendingUp size={18} color="var(--emerald)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '8px' }}>
            82.2%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Average return time: 14h</span>
        </div>
      </div>

      {/* Main Two-Column Section: My Reports vs Recent Campus Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left: My Reported Items */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>My Campus Submissions</h3>
            <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--slate-100)', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveTab('LOST')}
                style={{
                  background: activeTab === 'LOST' ? '#ffffff' : 'transparent',
                  color: activeTab === 'LOST' ? 'var(--rose-dark)' : 'var(--slate-600)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Lost Items ({lostReports.length})
              </button>
              <button
                onClick={() => setActiveTab('FOUND')}
                style={{
                  background: activeTab === 'FOUND' ? '#ffffff' : 'transparent',
                  color: activeTab === 'FOUND' ? 'var(--emerald-dark)' : 'var(--slate-600)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Found Items ({foundReports.length})
              </button>
            </div>
          </div>

          {activeTab === 'LOST' ? (
            lostReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--slate-400)' }}>
                <p style={{ marginBottom: '1rem' }}>You have not reported any lost items.</p>
                <Link to="/report/lost" className="btn btn-outline btn-sm">Report Lost Item</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {lostReports.map(report => (
                  <div
                    key={report.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--slate-200)',
                      backgroundColor: 'var(--slate-50)',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--slate-200)',
                        flexShrink: 0
                      }}>
                        {report.item?.image ? (
                          <img src={report.item.image} alt={report.item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--slate-400)' }}>
                            <AlertCircle size={20} />
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--slate-900)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {report.item?.name || 'Unnamed'}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                          <MapPin size={12} />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{report.location}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <StatusBadge status={report.status} />
                      <Link to={`/reports/lost/${report.id}`} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            foundReports.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--slate-400)' }}>
                <p style={{ marginBottom: '1rem' }}>You have not reported any found items.</p>
                <Link to="/report/found" className="btn btn-outline btn-sm">Report Found Item</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {foundReports.map(report => (
                  <div
                    key={report.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--slate-200)',
                      backgroundColor: 'var(--slate-50)',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{report.item?.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{report.location}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <StatusBadge status={report.status} />
                      <Link to={`/reports/found/${report.id}`} className="btn btn-ghost btn-sm">
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Right: Live Campus Activity Feed */}
        <div className="surface-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Campus Activity Feed</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Live reports across all university buildings</span>
            </div>
            <Link to="/browse" style={{ fontSize: '0.75rem', fontWeight: 700 }}>Browse All →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentCampusReports.map(item => (
              <div
                key={item.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--slate-200)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: item.type === 'LOST' ? 'var(--rose-dark)' : 'var(--emerald-dark)'
                    }}>
                      [{item.type}]
                    </span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {item.item?.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    <MapPin size={12} /> {item.location}
                  </div>
                </div>

                <Link to={`/reports/${item.type?.toLowerCase()}/${item.id}`} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
                  <ArrowRight size={14} />
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
