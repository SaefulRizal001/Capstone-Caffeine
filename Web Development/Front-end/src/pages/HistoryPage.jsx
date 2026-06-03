import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// Sidebar icons as inline SVG components
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const IconSimulation = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
  </svg>
);
const IconHistory = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#50453e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#50453e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M19.07 19.07A10 10 0 0 0 4.93 4.93"/>
  </svg>
);
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconFilter = () => (
  <svg width="18" height="12" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="2" x2="20" y2="2"/>
    <line x1="7" y1="7" x2="17" y2="7"/>
    <line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
);
const IconArrowUp = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="#1b6d24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 7 6 2 11 7"/>
  </svg>
);
const IconDots = () => (
  <svg width="4" height="16" viewBox="0 0 4 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="2" cy="2" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="2" cy="8" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="2" cy="14" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);

// Drink Category Icon Renderers
const DrinkIcon = ({ type }) => {
  const bg = type === 'espresso' ? '#ffdcc4' : type === 'matcha' ? '#a3f69c' : '#ffdcc6';
  const emoji = type === 'espresso' ? '☕' : type === 'matcha' ? '🍵' : '🧊';
  return (
    <div style={{
      background: bg, width: '40px', height: '40px',
      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '20px', flexShrink: 0
    }}>
      {emoji}
    </div>
  );
};

export default function HistoryPage() {
  const navigate = useNavigate();

  // 1. History Page filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRange, setActiveRange] = useState('7d'); // 'today' | '7d' | '30d'
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock Database Entries
  const rawHistoryData = [
    { id: 1, name: 'Double Espresso', type: 'espresso', desc: 'Arabica Blend', time: '08:30 AM', date: 'Oct 24, 2026', caffeine: 120, status: 'Optimal', range: 'today', percent: 75 },
    { id: 2, name: 'Matcha Latte', type: 'matcha', desc: 'Premium Ceremonial', time: '11:15 AM', date: 'Oct 24, 2026', caffeine: 70, status: 'Stable', range: 'today', percent: 50 },
    { id: 3, name: 'Cold Brew', type: 'coldbrew', desc: '12h Steeping', time: '02:45 PM', date: 'Oct 24, 2026', caffeine: 150, status: 'High Spike', range: 'today', percent: 100 },
    { id: 4, name: 'Americano', type: 'espresso', desc: 'Single Origin', time: '09:00 AM', date: 'Oct 23, 2026', caffeine: 80, status: 'Optimal', range: '7d', percent: 75 },
    { id: 5, name: 'Flat White', type: 'espresso', desc: 'Classic Blend', time: '03:15 PM', date: 'Oct 22, 2026', caffeine: 110, status: 'Stable', range: '7d', percent: 50 },
    { id: 6, name: 'Cappuccino', type: 'espresso', desc: 'Robust Roast', time: '10:30 AM', date: 'Oct 20, 2026', caffeine: 90, status: 'Optimal', range: '7d', percent: 75 },
    { id: 7, name: 'Mocha', type: 'espresso', desc: 'Rich Chocolate Blend', time: '04:00 PM', date: 'Oct 15, 2026', caffeine: 95, status: 'Stable', range: '30d', percent: 50 },
    { id: 8, name: 'Affogato', type: 'espresso', desc: 'Espresso & Vanilla', time: '07:30 PM', date: 'Oct 10, 2026', caffeine: 65, status: 'Optimal', range: '30d', percent: 75 },
    { id: 9, name: 'Turkish Coffee', type: 'espresso', desc: 'Cardamom Infused', time: '11:00 AM', date: 'Oct 05, 2026', caffeine: 130, status: 'High Spike', range: '30d', percent: 100 }
  ];

  // 2. Filter logic based on tab and search
  const filteredData = useMemo(() => {
    return rawHistoryData.filter((item) => {
      // Range Tab check
      // - 'today' shows only 'today'
      // - '7d' shows 'today' & '7d'
      // - '30d' shows 'today' & '7d' & '30d'
      if (activeRange === 'today' && item.range !== 'today') return false;
      if (activeRange === '7d' && item.range === '30d') return false;

      // Search query check
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.desc.toLowerCase().includes(query);
        return matchesName || matchesDesc;
      }

      return true;
    });
  }, [activeRange, searchQuery]);

  // 3. Pagination calculation
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  
  // Safe page index adjustment on data changes
  const currentPageClamped = Math.max(1, Math.min(currentPage, totalPages));

  const paginatedData = useMemo(() => {
    const start = (currentPageClamped - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPageClamped]);

  // Navigation Items
  const navItems = [
    { icon: <IconDashboard />, label: 'Dashboard', active: false, to: '/result' },
    { icon: <IconSimulation />, label: 'Simulation', active: false, to: '/simulation' },
    { icon: <IconHistory />, label: 'Riwayat', active: true, to: '/history' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fcf9f8', fontFamily: "'Inter', sans-serif" }}>

      {/* ── GLOBAL HEADER ── */}
      <Header />

      {/* Main Layout Container (Sidebar + Content) */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* ── SIDEBAR (DESKTOP) ── */}
        <aside style={{
          width: '256px', height: 'calc(100vh - 73px)', background: '#fcf9f8',
          borderRight: '1px solid #d4c3ba', padding: '24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'fixed', left: 0, top: '73px', zIndex: 100,
          transition: 'transform 0.3s ease',
        }} className="d-none d-lg-flex">
          <div>
            {/* Brand */}
            <div style={{ paddingBottom: '40px' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#553722', lineHeight: 1.2 }}>Kopi Metric</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#50453e', letterSpacing: '0.14px', marginTop: '2px' }}>Analisis Konsumsi Kafein</div>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map(({ icon, label, active, to }) => (
                <Link
                  key={label}
                  to={to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px', borderRadius: '8px', textDecoration: 'none',
                    background: active ? '#a0f399' : 'transparent',
                    color: active ? '#217128' : '#50453e',
                    fontWeight: active ? '600' : '400',
                    fontSize: '15px',
                    transition: 'background 0.15s'
                  }}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '24px', borderTop: '1px solid #d4c3ba' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #553722, #a0f399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', color: '#fff', fontWeight: '700', flexShrink: 0
            }}>A</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1b1c1c' }}>Alex Chen</div>
              <Link 
                to="/profile" 
                style={{ 
                  fontSize: '12px', 
                  color: '#82746d', 
                  textDecoration: 'none', 
                  cursor: 'pointer', 
                  transition: 'color 0.15s' 
                }}
                className="hover-text-green"
              >
                Edit Profil
              </Link>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="main-content-offset" style={{ flex: 1, minWidth: 0, width: '100%' }}>
          <main style={{ padding: '28px 16px 80px', boxSizing: 'border-box', width: '100%', maxWidth: '1200px' }}>
          
          {/* Page Top Header Section */}
          <div className="d-flex flex-column gap-3 mb-4">
            {/* Kembali Button */}
            <button 
              onClick={() => navigate('/result')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'transparent', border: 'none', color: '#553722',
                fontWeight: '700', fontSize: '16px', cursor: 'pointer',
                padding: '4px 0', alignSelf: 'flex-start'
              }}
              className="hover:opacity-80 transition-opacity"
            >
              <IconBack />
              Kembali
            </button>

            {/* Riwayat Title */}
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: '700', color: '#553722', margin: 0, letterSpacing: '-0.32px' }}>
                Riwayat
              </h1>
            </div>
          </div>

          {/* Section - Bento Style Summary Stats */}
          <div className="row g-4 mb-4">
            
            {/* 1. Daily Avg Intake */}
            <div className="col-12 col-md-4">
              <div style={{
                background: '#fff', border: '1px solid #d4c3ba', borderRadius: '12px',
                padding: '24px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '160px',
                justifyContent: 'center'
              }} className="hover-lift">
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#50453e', tracking: '0.6px', textTransform: 'uppercase' }}>
                  DAILY AVG INTAKE
                </span>
                <div className="d-flex align-items-baseline gap-2 my-2">
                  <span style={{ fontSize: '32px', fontWeight: '600', color: '#553722', lineHeight: 1 }}>245</span>
                  <span style={{ fontSize: '16px', fontWeight: '400', color: '#50453e' }}>mg</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <IconArrowUp />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1b6d24' }}>
                    12% from last week
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Sleep Quality Score */}
            <div className="col-12 col-md-4">
              <div style={{
                background: '#fff', border: '1px solid #d4c3ba', borderRadius: '12px',
                padding: '24px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '160px',
                justifyContent: 'center'
              }} className="hover-lift">
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#50453e', tracking: '0.6px', textTransform: 'uppercase' }}>
                  SLEEP QUALITY SCORE
                </span>
                <div className="d-flex align-items-baseline gap-1 my-2">
                  <span style={{ fontSize: '32px', fontWeight: '600', color: '#553722', lineHeight: 1 }}>82</span>
                  <span style={{ fontSize: '16px', fontWeight: '400', color: '#50453e' }}>/100</span>
                </div>
                <div style={{ background: '#f0eded', height: '8px', borderRadius: '9999px', overflow: 'hidden', width: '100%', marginTop: '4px' }}>
                  <div style={{ background: '#1b6d24', height: '100%', width: '82%', borderRadius: '9999px' }} />
                </div>
              </div>
            </div>

            {/* 3. Top Source */}
            <div className="col-12 col-md-4">
              <div style={{
                background: '#fff', border: '1px solid #d4c3ba', borderRadius: '12px',
                padding: '24px', boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '160px',
                justifyContent: 'center', position: 'relative', overflow: 'hidden'
              }} className="hover-lift">
                
                {/* Decorative circular element from figma */}
                <div style={{
                  position: 'absolute', bottom: '-16px', right: '-16px', width: '72px', height: '72px',
                  background: 'rgba(85,55,34,0.04)', borderRadius: '50%'
                }} />

                <span style={{ fontSize: '12px', fontWeight: '600', color: '#50453e', tracking: '0.6px', textTransform: 'uppercase' }}>
                  TOP SOURCE
                </span>
                <div className="my-1">
                  <div style={{ fontSize: '24px', fontWeight: '600', color: '#553722', lineHeight: 1.2 }}>
                    Double Espresso
                  </div>
                </div>
                <div className="d-flex align-items-center mt-2">
                  <span style={{
                    background: '#a0f399', color: '#217128', borderRadius: '9999px',
                    padding: '3px 12px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.6px'
                  }}>
                    42% of total
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Section - Filters & Search controls */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3 mb-4">
            
            {/* Filter Range tabs - horizontally scrollable on mobile */}
            <div className="no-scrollbar" style={{ overflowX: 'auto', flexShrink: 0 }}>
              <div style={{ background: '#f0eded', padding: '4px', borderRadius: '8px', display: 'inline-flex', whiteSpace: 'nowrap' }}>
                <button 
                  onClick={() => { setActiveRange('today'); setCurrentPage(1); }}
                  style={{
                    background: activeRange === 'today' ? '#fff' : 'transparent',
                    border: 'none', padding: '8px 20px', borderRadius: '6px',
                    fontSize: '14px', fontWeight: activeRange === 'today' ? '600' : '500',
                    color: activeRange === 'today' ? '#553722' : '#50453e',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  className={activeRange === 'today' ? 'shadow-sm' : ''}
                >
                  Today
                </button>
                <button 
                  onClick={() => { setActiveRange('7d'); setCurrentPage(1); }}
                  style={{
                    background: activeRange === '7d' ? '#fff' : 'transparent',
                    border: 'none', padding: '8px 20px', borderRadius: '6px',
                    fontSize: '14px', fontWeight: activeRange === '7d' ? '600' : '500',
                    color: activeRange === '7d' ? '#553722' : '#50453e',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  className={activeRange === '7d' ? 'shadow-sm' : ''}
                >
                  Last 7 Days
                </button>
                <button 
                  onClick={() => { setActiveRange('30d'); setCurrentPage(1); }}
                  style={{
                    background: activeRange === '30d' ? '#fff' : 'transparent',
                    border: 'none', padding: '8px 20px', borderRadius: '6px',
                    fontSize: '14px', fontWeight: activeRange === '30d' ? '600' : '500',
                    color: activeRange === '30d' ? '#553722' : '#50453e',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  className={activeRange === '30d' ? 'shadow-sm' : ''}
                >
                  Last 30 Days
                </button>
              </div>
            </div>

            {/* Actions: Search + Filter button */}
            <div className="d-flex align-items-center gap-2" style={{ minWidth: 0 }}>
              {/* Search bar – full width on mobile, auto on larger */}
              <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }}>
                  <IconSearch />
                </div>
                <input 
                  type="text" 
                  placeholder="Search drinks..." 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  style={{
                    border: '1px solid #d4c3ba', background: '#fff', borderRadius: '8px',
                    padding: '10px 16px 10px 38px', fontSize: '15px', color: '#1b1c1c',
                    width: '100%', outline: 'none'
                  }}
                />
              </div>

              {/* Filter button */}
              <button style={{
                border: '1px solid #d4c3ba', background: '#fff', borderRadius: '8px',
                padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '14px', fontWeight: '500', color: '#1b1c1c', cursor: 'pointer',
                flexShrink: 0
              }} className="hover:bg-gray-50 transition-colors">
                <IconFilter />
                <span className="d-none d-sm-inline">Filter</span>
              </button>
            </div>

          </div>

          {/* Section - Table / List Area Bento-Style */}
          <div style={{
            background: '#fff', border: '1px solid #d4c3ba', borderRadius: '12px',
            boxShadow: '0px 1px 2px rgba(0,0,0,0.05)', overflow: 'hidden'
          }} className="mb-4">
            
            {/* Table wrapper for horizontal overflow scrolling on mobile */}
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: '#f6f3f2', borderBottom: '1px solid #d4c3ba' }}>
                    <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '600', color: '#50453e', letterSpacing: '0.6px' }}>DRINK NAME</th>
                    <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '600', color: '#50453e', letterSpacing: '0.6px' }}>TIME</th>
                    <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '600', color: '#50453e', letterSpacing: '0.6px', textAlign: 'right' }}>CAFFEINE (MG)</th>
                    <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '600', color: '#50453e', letterSpacing: '0.6px' }}>METABOLISM STATUS</th>
                    <th style={{ padding: '20px 24px', fontSize: '12px', fontWeight: '600', color: '#50453e', letterSpacing: '0.6px', textAlign: 'center' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => {
                      const isLastRow = index === paginatedData.length - 1;
                      const statusColor = item.status === 'High Spike' ? '#ba1a1a' : '#1b6d24';
                      const statusProgressBg = item.status === 'High Spike' ? '#ba1a1a' : '#1b6d24';
                      
                      return (
                        <tr 
                          key={item.id} 
                          style={{ 
                            borderBottom: isLastRow ? 'none' : '1px solid #d4c3ba',
                            transition: 'background 0.15s'
                          }}
                          className="hover:bg-[#fdfbf9]"
                        >
                          {/* Drink name column */}
                          <td style={{ padding: '16px 24px' }}>
                            <div className="d-flex align-items-center gap-3">
                              <DrinkIcon type={item.type} />
                              <div>
                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#553722' }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#50453e', fontWeight: '600', letterSpacing: '0.3px', marginTop: '2px' }}>
                                  {item.desc}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Time consumed column */}
                          <td style={{ padding: '16px 24px' }}>
                            <div>
                              <div style={{ fontSize: '16px', fontWeight: '400', color: '#1b1c1c' }}>
                                {item.time}
                              </div>
                              <div style={{ fontSize: '12px', color: '#50453e', fontWeight: '600', letterSpacing: '0.3px', marginTop: '2px' }}>
                                {item.date}
                              </div>
                            </div>
                          </td>

                          {/* Caffeine count column */}
                          <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                            <span style={{ fontSize: '22px', fontWeight: '600', color: '#553722' }}>
                              {item.caffeine}
                            </span>
                          </td>

                          {/* Metabolism progress bar column */}
                          <td style={{ padding: '16px 24px' }}>
                            <div className="d-flex align-items-center gap-2">
                              <div style={{ background: '#f0eded', height: '6px', width: '100px', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div style={{ background: statusProgressBg, height: '100%', width: `${item.percent}%`, borderRadius: '9999px' }} />
                              </div>
                              <span style={{ fontSize: '14px', fontWeight: '500', color: statusColor }}>
                                {item.status}
                              </span>
                            </div>
                          </td>

                          {/* Actions column */}
                          <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                            <button style={{
                              background: 'transparent', border: 'none', color: '#82746d',
                              cursor: 'pointer', padding: '8px'
                            }} className="hover:text-black">
                              <IconDots />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#82746d', fontSize: '15px' }}>
                        Tidak ada riwayat konsumsi kopi yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer Section */}
            <div style={{ borderTop: '1px solid #d4c3ba', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              {/* Pagination Label */}
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#50453e' }}>
                Showing {filteredData.length > 0 ? (currentPageClamped - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPageClamped * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {/* Prev Button */}
                  <button 
                    disabled={currentPageClamped === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    style={{
                      background: 'transparent', border: 'none', opacity: currentPageClamped === 1 ? 0.3 : 1,
                      cursor: currentPageClamped === 1 ? 'default' : 'pointer', padding: '8px'
                    }}
                  >
                    ◀
                  </button>

                  {/* Page numbers list */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isPageActive = pageNum === currentPageClamped;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          width: '32px', height: '32px', borderRadius: '4px',
                          background: isPageActive ? '#553722' : 'transparent',
                          color: isPageActive ? '#fff' : '#1b1c1c',
                          border: 'none', fontSize: '14px', fontWeight: '500',
                          cursor: 'pointer', transition: 'all 0.15s'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button 
                    disabled={currentPageClamped === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    style={{
                      background: 'transparent', border: 'none', opacity: currentPageClamped === totalPages ? 0.3 : 1,
                      cursor: currentPageClamped === totalPages ? 'default' : 'pointer', padding: '8px'
                    }}
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION (hidden on desktop) ── */}
      <nav className="d-flex d-lg-none" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#fcf9f8', borderTop: '1px solid #d4c3ba',
        padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
        justifyContent: 'space-around', alignItems: 'center'
      }}>
        {navItems.map(({ icon, label, active, to }) => (
          <Link
            key={label}
            to={to}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              padding: '6px 16px', borderRadius: '10px', textDecoration: 'none',
              background: active ? 'rgba(160,243,153,0.2)' : 'transparent',
              color: active ? '#217128' : '#82746d',
              fontSize: '11px', fontWeight: active ? '600' : '400',
              transition: 'all 0.15s', minWidth: '64px'
            }}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
