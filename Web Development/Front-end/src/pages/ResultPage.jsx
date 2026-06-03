import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

// Sidebar icons as inline SVG components
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const IconSimulation = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
  </svg>
);
const IconHistory = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#50453e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#50453e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M19.07 19.07A10 10 0 0 0 4.93 4.93" />
  </svg>
);
const IconMoon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1b6d24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const IconCoffee = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);
const IconTrend = () => (
  <svg width="20" height="12" viewBox="0 0 24 14" fill="none" stroke="#553722" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 1 13 11 8 6 1 13" />
    <polyline points="17 1 23 1 23 7" />
  </svg>
);

// Donut ring chart component
function RiskGauge({ percent = 34 }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const strokeDash = (percent / 100) * circ;
  return (
    <div style={{ position: 'relative', width: '192px', height: '192px' }}>
      <svg width="192" height="192" viewBox="0 0 192 192">
        {/* Background track */}
        <circle cx="96" cy="96" r={r} fill="none" stroke="#e8e0da" strokeWidth="20" />
        {/* Progress arc */}
        <circle
          cx="96" cy="96" r={r}
          fill="none"
          stroke="#553722"
          strokeWidth="20"
          strokeDasharray={`${strokeDash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 96 96)"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      {/* Center content */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <span style={{ fontSize: '44px', fontWeight: '800', color: '#1b6d24', letterSpacing: '-1px', lineHeight: 1 }}>{percent}%</span>
        <span style={{ background: '#a0f399', color: '#217128', borderRadius: '9999px', padding: '2px 10px', fontSize: '14px', fontWeight: '500' }}>Low Risk</span>
      </div>
    </div>
  );
}

// Bar chart data
const barData = [
  { day: 'Sen', mg: 210, active: false },
  { day: 'Sel', mg: 160, active: false },
  { day: 'Rab', mg: 340, active: false },
  { day: 'Kam', mg: 280, active: true },
  { day: 'Jum', mg: 200, active: false },
  { day: 'Sab', mg: 150, active: false },
  { day: 'Min', mg: 380, active: false },
];
const maxMg = Math.max(...barData.map(d => d.mg));

export default function ResultPage() {
  const [hydration, setHydration] = useState(60);
  const [activity, setActivity] = useState(55);
  const [sleep, setSleep] = useState(65);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalCaffeine, setTotalCaffeine] = useState(240);

  const hydrationVal = (1.5 + (hydration / 100) * 2.5).toFixed(1);
  const activityLabel = activity < 33 ? 'Rendah' : activity < 66 ? 'Moderate' : 'Tinggi';
  const sleepVal = (5 + (sleep / 100) * 4).toFixed(1);
  const metabolicScore = Math.round(40 + (hydration + activity + sleep) / 9);

  const navItems = [
    { icon: <IconDashboard />, label: 'Dashboard', active: true, to: '/result' },
    { icon: <IconSimulation />, label: 'Simulation', active: false, to: '/simulation' },
    { icon: <IconHistory />, label: 'Riwayat', active: false, to: '/history' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#fcf9f8', fontFamily: "'Inter', sans-serif" }}>

      {/* ── GLOBAL HEADER ── */}
      <Header />

      {/* Main Layout Container (Sidebar + Content) */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* ── SIDEBAR (Desktop only) ── */}
        <aside style={{
          width: '256px', height: 'calc(100vh - 73px)', background: '#fcf9f8',
          borderRight: '1px solid #d4c3ba', padding: '24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'fixed', left: 0, top: '73px', zIndex: 100,
        }} className="d-none d-lg-flex">
          {/* Top */}
          <div>
            {/* Brand */}
            <div style={{ paddingBottom: '40px' }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#553722', lineHeight: 1.2 }}>Kopi Metric</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#50453e', letterSpacing: '0.14px', marginTop: '2px' }}>Analisis Konsumsi Kafein</div>
            </div>

            {/* Nav */}
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
                style={{ fontSize: '12px', color: '#82746d', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                className="hover-text-green"
              >
                Edit Profil
              </Link>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="main-content-offset" style={{ flex: 1, minWidth: 0, width: '100%' }}>
          <main style={{ padding: '28px 16px 80px', boxSizing: 'border-box', width: '100%', maxWidth: '1100px' }}>
            <PageContent
              hydration={hydration} setHydration={setHydration}
              activity={activity} setActivity={setActivity}
              sleep={sleep} setSleep={setSleep}
              hydrationVal={hydrationVal} activityLabel={activityLabel}
              sleepVal={sleepVal} metabolicScore={metabolicScore}
              totalCaffeine={totalCaffeine}
              setIsModalOpen={setIsModalOpen}
            />
          </main>
        </div>

      </div>

      {/* ── MOBILE BOTTOM NAVIGATION (hidden on desktop) ── */}
      <nav className="d-flex d-lg-none" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#fcf9f8', borderTop: '1px solid #d4c3ba',
        padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center'
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

      {/* ── CAFFEINE MODAL POPUP ── */}
      {isModalOpen && (
        <CaffeineModal
          onClose={() => setIsModalOpen(false)}
          onSave={(newCaffeine) => setTotalCaffeine(prev => prev + newCaffeine)}
        />
      )}
    </div>
  );
}

function PageContent({ hydration, setHydration, activity, setActivity, sleep, setSleep, hydrationVal, activityLabel, sleepVal, metabolicScore, totalCaffeine, setIsModalOpen }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const riskPercent = useMemo(() => {
    return Math.min(100, Math.round((totalCaffeine / 700) * 100));
  }, [totalCaffeine]);

  const sleepDelayMinutes = useMemo(() => {
    return Math.round(totalCaffeine * 0.175);
  }, [totalCaffeine]);

  const dynamicTargetTime = useMemo(() => {
    // simple dynamic offset from 22:00
    const extraMinutes = Math.round(totalCaffeine * 0.18);
    const baseHour = 22;
    const hour = baseHour + Math.floor(extraMinutes / 60);
    const minute = extraMinutes % 60;
    const minuteStr = minute < 10 ? `0${minute}` : minute;
    return `${hour}:${minuteStr}`;
  }, [totalCaffeine]);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 30px)', fontWeight: '700', color: '#553722', letterSpacing: '-0.3px', margin: 0 }}>Biometric Overview</h1>
          <p style={{ fontSize: '14px', color: '#50453e', marginTop: '6px', marginBottom: 0 }}>
            Klirens metabolik kafein Anda saat ini terpantau pada 1.4x baseline.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: '#030712',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          className="hover:opacity-90 hover:scale-[1.02] transition-transform"
        >
          Catat Konsumsi
          <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
        </button>
      </div>

      {/* ── ROW 1: Risk Gauge + AI Prediction ── */}
      <div className="row g-3 mb-3">

        {/* 1. Health Risk Gauge */}
        <div className="col-12 col-md-4">
          <div style={{
            background: '#fff', border: '1px solid #d4c3ba', borderRadius: '12px',
            padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            position: 'relative', overflow: 'hidden', minHeight: '320px',
            justifyContent: 'space-between'
          }}>
            <div style={{ position: 'absolute', top: '14px', left: '16px', fontSize: '11px', fontWeight: '700', color: '#50453e', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              RISIKO SAAT INI
            </div>
            <div style={{ marginTop: '28px' }}>
              <RiskGauge percent={riskPercent} />
            </div>
            <p style={{ textAlign: 'center', color: '#50453e', fontSize: '13px', marginTop: '16px', marginBottom: 0, lineHeight: '1.6' }}>
              Variabilitas detak jantung (HRV) tetap dalam kisaran optimal meskipun telah mengonsumsi {totalCaffeine} mg.
            </p>
          </div>
        </div>

        {/* 2. AI Prediction Card */}
        <div className="col-12 col-md-8">
          <div style={{
            background: '#f0eded', border: '1px solid #d4c3ba', borderRadius: '12px',
            padding: '28px', position: 'relative', overflow: 'hidden', minHeight: '320px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            {/* Decorative circle */}
            <div style={{ position: 'absolute', top: '-64px', right: '-64px', width: '128px', height: '128px', borderRadius: '0 0 0 9999px', background: 'rgba(85,55,34,0.07)' }} />

            <div>
              {/* Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '16px' }}>✨</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#553722', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                  PREDIKSI AI • DAMPAK TIDUR
                </span>
              </div>

              {/* Headline */}
              <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1b1c1c', marginBottom: '14px', lineHeight: 1.3 }}>
                Proyeksi Latensi Tidur: +{sleepDelayMinutes} Menit
              </h2>

              {/* Body */}
              <p style={{ fontSize: '15px', color: '#50453e', lineHeight: '1.7', maxWidth: '560px', marginBottom: 0 }}>
                Berdasarkan waktu paruh metabolisme Anda, mengonsumsi kafein saat ini akan menunda mulainya fase REM sekitar {sleepDelayMinutes} menit. Kami menyarankan Anda untuk berhenti total pada pukul 14.30 agar siklus tidur nyenyak Anda malam ini tetap terjaga.
              </p>
            </div>

            {/* Footer metadata */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '32px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconMoon />
                <span style={{ fontSize: '15px', color: '#1b6d24' }}>Target: {dynamicTargetTime}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconCoffee />
                <span style={{ fontSize: '15px', color: '#57361c' }}>Dosis Terakhir: 10:15</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Bar Chart + Lifestyle Sliders ── */}
      <div className="row g-3 mb-3">

        {/* 3. 7-Day Bar Chart */}
        <div className="col-12 col-md-7">
          <div style={{
            background: '#fff', border: '1px solid #d4c3ba', borderRadius: '12px',
            padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            minHeight: '340px', display: 'flex', flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#50453e', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                KONSENTRASI SERUM 7 HARI
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#553722' }} />
                <span style={{ fontSize: '14px', color: '#50453e' }}>Aktual (mg)</span>
              </div>
            </div>

            {/* Bars */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '0 8px' }}>
              {barData.map((d, i) => (
                <div
                  key={d.day}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  <div style={{
                    background: '#1b1c1c', color: '#fff', borderRadius: '4px',
                    padding: '2px 8px', fontSize: '11px', whiteSpace: 'nowrap',
                    opacity: hoveredBar === i ? 1 : 0, transition: 'opacity 0.15s'
                  }}>{d.mg}mg</div>
                  {/* Bar */}
                  <div style={{
                    width: '100%',
                    height: `${(d.mg / maxMg) * 200}px`,
                    background: d.active ? '#553722' : '#f6f3f2',
                    borderRadius: '6px 6px 0 0',
                    transition: 'background 0.2s',
                    minHeight: '20px'
                  }} />
                </div>
              ))}
            </div>

            {/* Day labels */}
            <div style={{ display: 'flex', gap: '8px', padding: '10px 8px 0', borderTop: '1px solid #f0eded', marginTop: '4px' }}>
              {barData.map((d) => (
                <div key={d.day} style={{ flex: 1, textAlign: 'center', fontSize: '14px', color: d.active ? '#553722' : '#50453e', fontWeight: d.active ? '700' : '400' }}>
                  {d.day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Lifestyle Simulation Sliders */}
        <div className="col-12 col-md-5">
          <div style={{
            background: '#fff', border: '1px solid #d4c3ba', borderRadius: '12px',
            padding: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <IconTrend />
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#50453e', letterSpacing: '0.6px', textTransform: 'uppercase' }}>SIMULATION ENGINE</span>
              </div>
              <p style={{ fontSize: '14px', color: '#50453e', lineHeight: '1.6', marginBottom: 0 }}>
                Sesuaikan variabel gaya hidup untuk melihat efek real-time pada laju metabolisme kafein.
              </p>
            </div>

            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '16px' }}>
              {/* Hydration */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '15px', color: '#1b1c1c' }}>Hidrasi Harian</span>
                  <span style={{ fontSize: '15px', color: '#1b6d24', fontWeight: '500' }}>{hydrationVal} L</span>
                </div>
                <input type="range" min="0" max="100" value={hydration} onChange={e => setHydration(+e.target.value)}
                  style={{ width: '100%', accentColor: '#553722', cursor: 'pointer' }} />
              </div>

              {/* Activity */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '15px', color: '#1b1c1c' }}>Aktivitas Fisik</span>
                  <span style={{ fontSize: '15px', color: '#1b6d24', fontWeight: '500' }}>{activityLabel}</span>
                </div>
                <input type="range" min="0" max="100" value={activity} onChange={e => setActivity(+e.target.value)}
                  style={{ width: '100%', accentColor: '#553722', cursor: 'pointer' }} />
              </div>

              {/* Sleep */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '15px', color: '#1b1c1c' }}>Tidur Malam Sebelumnya</span>
                  <span style={{ fontSize: '15px', color: '#57361c', fontWeight: '500' }}>{sleepVal} jam</span>
                </div>
                <input type="range" min="0" max="100" value={sleep} onChange={e => setSleep(+e.target.value)}
                  style={{ width: '100%', accentColor: '#553722', cursor: 'pointer' }} />
              </div>
            </div>

            {/* Metabolic Score */}
            <div style={{ borderTop: '1px solid #d4c3ba', marginTop: '24px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', color: '#50453e' }}>Skor Metabolik</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: '700', color: '#553722' }}>{metabolicScore}</span>
                <IconTrend />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DETECTED SOURCES ── */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#50453e', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '12px' }}>
          SUMBER TERDETEKSI
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Espresso', color: '#553722', bg: 'rgba(85,55,34,0.1)', border: 'rgba(85,55,34,0.2)', icon: '☕' },
            { label: 'Latte/Cappucino', color: '#8b5a2b', bg: 'rgba(139,90,43,0.1)', border: 'rgba(139,90,43,0.2)', icon: '🥛' },
            { label: 'Cold Brew', color: '#57361c', bg: 'rgba(87,54,28,0.1)', border: 'rgba(87,54,28,0.2)', icon: '🧊' },
          ].map(({ label, color, bg, border, icon }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: bg, border: `1px solid ${border}`,
              borderRadius: '9999px', padding: '5px 14px',
              fontSize: '14px', color, cursor: 'default'
            }}>
              <span>{icon}</span>
              {label}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// Inline Close icon for the modal
const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function CaffeineModal({ onClose, onSave }) {
  const [selectedDrink, setSelectedDrink] = useState('espresso');
  const [searchQuery, setSearchQuery] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [timeOption, setTimeOption] = useState('now'); // 'now', 'custom'

  const getTenMinutesAgoTime = () => {
    const d = new Date(Date.now() - 10 * 60 * 1000);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };
  const [customTime, setCustomTime] = useState(getTenMinutesAgoTime());

  const beverages = [
    { id: 'espresso', name: 'Espresso', icon: '☕', baseCaffeine: 70, range: '60-80 mg', desc: 'Espresso Shot' },
    { id: 'instant', name: 'Kopi Instan', icon: '☕', baseCaffeine: 80, range: '60-100 mg', desc: 'Instant Coffee' },
    { id: 'latte', name: 'Latte/Cappucino', icon: '🥛', baseCaffeine: 92.5, range: '60-125 mg', desc: 'Latte / Cappuccino' },
    { id: 'coldbrew', name: 'Cold Brew', icon: '🧊', baseCaffeine: 150, range: '100-200 mg', desc: 'Cold Brew Coffee' }
  ];

  // Live filter beverages based on search input
  const filteredBeverages = beverages.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic caffeine calculation
  const calculatedCaffeine = useMemo(() => {
    const selected = beverages.find(b => b.id === selectedDrink) || beverages[0];
    return Math.round(selected.baseCaffeine * frequency);
  }, [selectedDrink, frequency]);

  // Sleep Impact delay (minutes)
  const sleepImpactMin = Math.round(calculatedCaffeine * 0.3);

  const handleSave = () => {
    onSave(calculatedCaffeine);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(3, 7, 18, 0.4)',
      backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#fcf9f8', border: '1px solid #d4c3ba', borderRadius: '12px',
        width: '100%', maxWidth: '600px', maxHeight: '95vh', display: 'flex',
        flexDirection: 'column', boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid #d4c3ba', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#553722', margin: 0 }}>Catat Konsumsi Kafein</h2>
          <button
            onClick={onClose}
            style={{ background: '#f0eded', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            className="hover:opacity-85"
          >
            <IconClose />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Section 1: Choose Drink */}
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center">
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#50453e', letterSpacing: '0.6px' }}>PILIH MINUMAN</span>
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: '#f6f3f2', border: '1px solid #d4c3ba', borderRadius: '9999px',
                  padding: '6px 14px', fontSize: '13px', width: '150px', outline: 'none'
                }}
              />
            </div>

            {/* Grid of beverages */}
            <div className="row g-2">
              {filteredBeverages.map(b => {
                const isActive = b.id === selectedDrink;
                return (
                  <div key={b.id} className="col-6">
                    <button
                      type="button"
                      onClick={() => setSelectedDrink(b.id)}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: '12px',
                        background: isActive ? '#e4e2e1' : '#fcf9f8',
                        border: isActive ? '2px solid #553722' : '1.5px solid #d4c3ba',
                        boxShadow: isActive ? '0 0 0 2px #fff, 0 0 0 3px #553722' : 'none',
                        display: 'flex', alignItems: 'center', gap: '12px',
                        cursor: 'pointer', transition: 'all 0.15s'
                      }}
                      className="hover-lift"
                    >
                      <span style={{ fontSize: '32px', flexShrink: 0 }}>{b.icon}</span>
                      <div style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#553722', display: 'block' }}>{b.name}</span>
                        <span style={{ fontSize: '11px', color: '#82746d', fontWeight: '600' }}>{b.range}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Frequency Customizer */}
          <div className="d-flex flex-column gap-2">
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#50453e', letterSpacing: '0.6px' }}>FREKUENSI KONSUMSI HARIAN</span>
            <div style={{
              background: '#f6f3f2', border: '1px solid #d4c3ba', borderRadius: '12px',
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '16px',
              maxWidth: '320px', justifyContent: 'space-between'
            }}>
              <button
                type="button"
                onClick={() => setFrequency(f => Math.max(1, f - 1))}
                style={{
                  background: '#fff', border: '1px solid #d4c3ba', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                }}
                className="hover:bg-gray-100"
              >
                -
              </button>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={frequency}
                  onChange={e => setFrequency(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '60px',
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#553722',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#50453e' }}>cangkir / hari</span>
              </div>
              <button
                type="button"
                onClick={() => setFrequency(f => Math.min(20, f + 1))}
                style={{
                  background: '#fff', border: '1px solid #d4c3ba', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                }}
                className="hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Section 3: Time Input */}
          <div className="d-flex flex-column gap-2">
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#50453e', letterSpacing: '0.6px' }}>WAKTU KONSUMSI</span>
            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <button
                  type="button"
                  onClick={() => setTimeOption('now')}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px',
                    background: timeOption === 'now' ? 'rgba(160,243,153,0.1)' : '#f6f3f2',
                    border: timeOption === 'now' ? '1.5px solid #1b6d24' : '1px solid #d4c3ba',
                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left',
                    minHeight: '62px', boxSizing: 'border-box'
                  }}
                >
                  <div style={{
                    background: timeOption === 'now' ? '#1b6d24' : '#fff', border: timeOption === 'now' ? '2px solid #1b6d24' : '2px solid #82746d',
                    width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {timeOption === 'now' && <div style={{ background: '#fff', width: '6px', height: '6px', borderRadius: '50%' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: timeOption === 'now' ? '#1b6d24' : '#50453e' }}>Sekarang</div>
                    <div style={{ fontSize: '11px', color: timeOption === 'now' ? '#1b6d24' : '#82746d', fontWeight: '500' }}>Baru saja diminum</div>
                  </div>
                </button>
              </div>

              <div className="col-12 col-sm-6">
                <button
                  type="button"
                  onClick={() => setTimeOption('custom')}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px',
                    background: timeOption === 'custom' ? 'rgba(160,243,153,0.1)' : '#f6f3f2',
                    border: timeOption === 'custom' ? '1.5px solid #1b6d24' : '1px solid #d4c3ba',
                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textAlign: 'left',
                    minHeight: '62px', boxSizing: 'border-box'
                  }}
                >
                  <div style={{
                    background: timeOption === 'custom' ? '#1b6d24' : '#fff', border: timeOption === 'custom' ? '2px solid #1b6d24' : '2px solid #82746d',
                    width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {timeOption === 'custom' && <div style={{ background: '#fff', width: '6px', height: '6px', borderRadius: '50%' }} />}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '13px', fontWeight: timeOption === 'custom' ? '700' : '500', color: timeOption === 'custom' ? '#1b6d24' : '#50453e' }}>Pilih Waktu</div>
                    {timeOption === 'custom' ? (
                      <input
                        type="time"
                        value={customTime}
                        onClick={e => e.stopPropagation()}
                        onChange={e => setCustomTime(e.target.value)}
                        style={{
                          border: '1px solid #d4c3ba', borderRadius: '6px',
                          background: '#fff', padding: '3px 8px', fontSize: '12px',
                          fontWeight: '600', color: '#553722', outline: 'none',
                          width: '100%', boxSizing: 'border-box', marginTop: '2px', cursor: 'pointer'
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: '11px', color: '#82746d', fontWeight: '500' }}>10 Menit yang lalu</div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ background: '#f6f3f2', borderTop: '1px solid #d4c3ba', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#50453e', padding: '10px 24px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
            className="hover:text-black"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            style={{
              background: '#553722', color: '#fff', border: 'none', borderRadius: '8px',
              padding: '10px 48px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1)'
            }}
            className="hover:opacity-90"
          >
            Simpan & Analisis
          </button>
        </div>

      </div>
    </div>
  );
}
