import React, { useState, useEffect, useRef, useCallback } from 'react';
import StatCard from './components/StatCard';
import UserActivityChart from './components/UserActivityChart';
import ConversionFunnel from './components/ConversionFunnel';
import EventsBarChart from './components/EventsBarChart';
import TopRegions from './components/TopRegions';
import DeviceChart from './components/DeviceChart';
import EventStream from './components/EventStream';
import AlertsList from './components/AlertsList';
import { LiveDot, Badge } from './components/UI';
import {
  generateInitialTimeSeries, nextTimeSeriesPoint,
  generateInitialStats, updateStats,
  generateEvent, maybeGenerateAlert,
  generateGeoData, updateGeoData,
  generateFunnelData, generateDeviceData,
  generateEventsPerMinute, updateEventsPerMinute,
} from './data';

// ─── Global Styles (injected once) ─────────────────────────────────────────
const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root {
    height: 100%;
    background: #0a0e17;
    color: #e2e8f0;
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* CRT scanline overlay */
  #root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #0a0e17; }
  ::-webkit-scrollbar-thumb { background: #2a3550; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #3a4560; }
`;

function App() {
  const [tab, setTab] = useState('overview');
  const [timeSeries, setTimeSeries] = useState(() => generateInitialTimeSeries());
  const [stats, setStats] = useState(() => ({ ...generateInitialStats(), deltas: { activeUsers: 0, rps: 0, latency: 0, errorRate: 0 } }));
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [geo, setGeo] = useState(() => generateGeoData());
  const [funnel, setFunnel] = useState(() => generateFunnelData());
  const [devices, setDevices] = useState(() => generateDeviceData());
  const [eventsPerMin, setEventsPerMin] = useState(() => generateEventsPerMinute());
  const [clock, setClock] = useState(new Date());
  const tickRef = useRef(0);

  // Inject global CSS once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Main simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      setClock(new Date());

      // Time series — shift + add
      setTimeSeries((prev) => {
        const next = [...prev.slice(1)];
        next.push(nextTimeSeriesPoint(prev[prev.length - 1]));
        return next;
      });

      // Stats
      setStats((prev) => updateStats(prev));

      // Events per minute bar chart
      setEventsPerMin((prev) => updateEventsPerMinute(prev));

      // New event each tick
      setEvents((prev) => [generateEvent(), ...prev].slice(0, 50));

      // Maybe an alert
      const alert = maybeGenerateAlert();
      if (alert) {
        setAlerts((prev) => [alert, ...prev].slice(0, 10));
      }

      // Geo / device updates less frequently
      if (tick % 5 === 0) {
        setGeo((prev) => updateGeoData(prev));
        setDevices(generateDeviceData());
      }
      if (tick % 8 === 0) {
        setFunnel(generateFunnelData());
      }
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const clockStr = clock.toLocaleTimeString('en-US', { hour12: false });
  const dateStr = clock.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const TABS = ['overview', 'events', 'alerts'];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow circles */}
      <div style={{
        position: 'fixed', top: -200, left: -100, width: 600, height: 600,
        borderRadius: '50%', background: '#3b82f6', opacity: 0.03, filter: 'blur(120px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -200, right: -100, width: 500, height: 500,
        borderRadius: '50%', background: '#8b5cf6', opacity: 0.03, filter: 'blur(120px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '40%', left: '60%', width: 400, height: 400,
        borderRadius: '50%', background: '#06b6d4', opacity: 0.02, filter: 'blur(100px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 24px' }}>
        {/* ─── HEADER ────────────────────────────────────────────── */}
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 0', borderBottom: '1px solid #2a3550',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
              <rect x="7" y="18" width="4" height="8" rx="1" fill="#fff" opacity="0.9" />
              <rect x="14" y="12" width="4" height="14" rx="1" fill="#fff" opacity="0.9" />
              <rect x="21" y="6" width="4" height="20" rx="1" fill="#fff" opacity="0.9" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#e2e8f0',
            }}>
              Analytics<span style={{ color: '#3b82f6' }}>HQ</span>
            </span>
            <LiveDot />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge text="WebSocket" color="#10b981" />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#64748b',
            }}>
              {dateStr}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: '#e2e8f0', fontWeight: 600,
            }}>
              {clockStr}
            </span>
          </div>
        </header>

        {/* ─── NAV TABS ──────────────────────────────────────────── */}
        <nav style={{
          display: 'flex', gap: 4, padding: '12px 0',
        }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '8px 20px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: tab === t ? '#3b82f6' : '#1a2235',
                color: tab === t ? '#fff' : '#64748b',
                boxShadow: tab === t ? '0 0 12px #3b82f644' : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </nav>

        {/* ─── STATS BAR ─────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}>
          <StatCard label="Active Users" value={stats.activeUsers} delta={stats.deltas.activeUsers} accent="#3b82f6" />
          <StatCard label="Requests/sec" value={stats.rps} unit="rps" delta={stats.deltas.rps} accent="#06b6d4" />
          <StatCard label="Avg Latency" value={stats.latency} unit="ms" delta={stats.deltas.latency} accent="#f59e0b" />
          <StatCard label="Error Rate" value={stats.errorRate} unit="%" delta={stats.deltas.errorRate} accent="#ef4444" />
        </div>

        {/* ─── TAB CONTENT ───────────────────────────────────────── */}
        <div key={tab} style={{ animation: 'fadeIn 0.3s ease' }}>
          {tab === 'overview' && (
            <>
              {/* Row 1: main chart + funnel */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 16,
                marginBottom: 16,
              }}>
                <UserActivityChart data={timeSeries} />
                <ConversionFunnel data={funnel} />
              </div>
              {/* Row 2: events bar, top regions, device split */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 16,
                marginBottom: 20,
              }}>
                <EventsBarChart data={eventsPerMin} />
                <TopRegions data={geo} />
                <DeviceChart data={devices} />
              </div>
            </>
          )}

          {tab === 'events' && (
            <EventStream events={events} />
          )}

          {tab === 'alerts' && (
            <AlertsList alerts={alerts} />
          )}
        </div>

        {/* ─── FOOTER ────────────────────────────────────────────── */}
        <footer style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0',
          borderTop: '1px solid #2a3550',
          marginTop: 12,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#64748b',
          }}>
            AnalyticsHQ v2.14.3
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: 'WebSocket', ok: true },
              { label: 'Kafka', ok: true },
              { label: 'Redis', ok: true },
            ].map((s) => (
              <span key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#64748b',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: s.ok ? '#10b981' : '#ef4444',
                  boxShadow: s.ok ? '0 0 4px #10b981' : '0 0 4px #ef4444',
                }} />
                {s.label}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
