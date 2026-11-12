import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Grid, List, PlusCircle, RefreshCw, X } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { CATEGORIES, CAMPUS_LOCATIONS } from '../api/mockData';
import reportService from '../api/reportService';

export const BrowseReports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState('ALL'); // ALL, LOST, FOUND
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // grid | list
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFilteredReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports({
        type: selectedType,
        category: selectedCategory,
        location: selectedLocation,
        search
      });
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredReports();
  }, [selectedType, selectedCategory, selectedLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredReports();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedType('ALL');
    setSelectedCategory('ALL');
    setSelectedLocation('ALL');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderBottom: '1px solid var(--slate-200)',
        paddingBottom: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Browse Campus Lost & Found
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.875rem' }}>
            Real-time searchable database across all university departments, libraries and grounds
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/report/lost" className="btn btn-primary btn-sm">
            <PlusCircle size={14} /> Report Lost
          </Link>
          <Link to="/report/found" className="btn btn-secondary btn-sm">
            <PlusCircle size={14} /> Report Found
          </Link>
        </div>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="surface-card" style={{ padding: '1.25rem', borderRadius: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="text"
              placeholder="Search by keywords (e.g. MacBook, Wallet, Dorm Keys, Hydro Flask)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
            Search Items
          </button>
          {(search || selectedType !== 'ALL' || selectedCategory !== 'ALL' || selectedLocation !== 'ALL') && (
            <button type="button" onClick={clearFilters} className="btn btn-ghost" style={{ gap: '4px' }}>
              <X size={16} /> Reset
            </button>
          )}
        </form>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Type Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', minWidth: '60px' }}>TYPE:</span>
            {['ALL', 'LOST', 'FOUND'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                style={{
                  background: selectedType === t ? (t === 'LOST' ? 'var(--rose)' : t === 'FOUND' ? 'var(--emerald)' : 'var(--primary)') : 'var(--slate-100)',
                  color: selectedType === t ? '#ffffff' : 'var(--slate-700)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '4px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {t === 'ALL' ? 'All Items' : t === 'LOST' ? 'Lost Items' : 'Found Items'}
              </button>
            ))}
          </div>

          {/* Category Dropdown & Location Dropdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '4px' }}>
            <div>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '2px' }}>
                CATEGORY
              </label>
              <select
                className="form-select"
                style={{ padding: '4px 8px', fontSize: '0.8125rem' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--slate-500)', display: 'block', marginBottom: '2px' }}>
                CAMPUS LOCATION
              </label>
              <select
                className="form-select"
                style={{ padding: '4px 8px', fontSize: '0.8125rem' }}
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="ALL">All Campus Buildings</option>
                {CAMPUS_LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header & View Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--slate-600)', fontWeight: 600 }}>
          Showing <strong>{reports.length}</strong> items
        </span>

        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--slate-100)', padding: '2px', borderRadius: '8px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              background: viewMode === 'grid' ? 'var(--card-bg)' : 'transparent',
              boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: viewMode === 'grid' ? 'var(--primary)' : 'var(--slate-500)'
            }}
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              background: viewMode === 'list' ? 'var(--card-bg)' : 'transparent',
              boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: viewMode === 'list' ? 'var(--primary)' : 'var(--slate-500)'
            }}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Items Container */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--slate-400)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p>Filtering items...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="surface-card" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '16px' }}>
          <Search size={40} color="var(--slate-300)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
            No reports found matching your criteria
          </h3>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Try expanding your search query, selecting "All Categories", or clearing building location filters.
          </p>
          <button onClick={clearFilters} className="btn btn-outline btn-sm">
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {reports.map(r => (
            <ItemCard key={r.id} report={r} />
          ))}
        </div>
      ) : (
        <div className="surface-card" style={{ borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', textAlign: 'left', color: 'var(--slate-500)' }}>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Item Name</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontWeight: 700, color: r.type === 'LOST' ? 'var(--rose-dark)' : 'var(--emerald-dark)' }}>
                      [{r.type}]
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{r.item?.name}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>{r.item?.category}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate-600)' }}>{r.location}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--slate-500)' }}>
                    {r.date ? new Date(r.date).toLocaleDateString() : 'Recent'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className="badge badge-open">{r.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <Link to={`/reports/${r.type?.toLowerCase() || 'lost'}/${r.id}`} className="btn btn-outline btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrowseReports;
