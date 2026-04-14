// Data simulation utilities for the real-time analytics dashboard

const EVENT_TYPES = [
  { type: 'page_view', icon: '👁️', color: '#3b82f6' },
  { type: 'signup', icon: '✨', color: '#10b981' },
  { type: 'purchase', icon: '💰', color: '#f59e0b' },
  { type: 'error', icon: '❌', color: '#ef4444' },
  { type: 'api_call', icon: '⚡', color: '#8b5cf6' },
  { type: 'logout', icon: '🚪', color: '#64748b' },
];

const PAGES = ['/home', '/pricing', '/docs', '/dashboard', '/settings', '/api', '/blog', '/signup', '/checkout', '/profile'];

const COUNTRIES = ['US', 'GB', 'DE', 'FR', 'JP', 'BR', 'IN', 'CA', 'AU', 'KR', 'NL', 'SG'];

const ALERT_POOL = {
  critical: [
    'CPU usage exceeded 95% on node-03',
    'Error rate spike detected: 12.4% (threshold: 5%)',
    'DB connection pool exhausted on primary',
    'Memory OOM killed worker process',
    'Disk usage critical: 98% on /data volume',
  ],
  warning: [
    'Memory usage above 80% on node-07',
    'Latency p99 > 800ms on /api/search',
    'SSL cert expiring in 7 days',
    'Queue depth exceeding 10k messages',
    'Cache hit ratio dropped below 60%',
  ],
  info: [
    'Auto-scaling triggered: 4 → 6 instances',
    'Deployment v2.14.3 rolled out successfully',
    'Database backup completed',
    'CDN cache purged for /assets/*',
    'New region activated: ap-southeast-2',
  ],
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

function formatTimeSec(d) {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function randomWalk(prev, step, min, max) {
  const delta = (Math.random() - 0.5) * 2 * step;
  return clamp(Math.round(prev + delta), min, max);
}

// Generate initial 30-point time series
export function generateInitialTimeSeries() {
  const now = new Date();
  const data = [];
  let users = rand(2000, 5000);
  let sessions = rand(1000, 2500);
  let events = rand(1500, 4000);

  for (let i = 29; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 2000);
    users = randomWalk(users, 300, 100, 10000);
    sessions = randomWalk(sessions, 200, 50, 5000);
    events = randomWalk(events, 400, 200, 10000);
    data.push({ t: formatTime(t), users, sessions, events });
  }
  return data;
}

// Generate next time series data point
export function nextTimeSeriesPoint(prev) {
  const t = formatTime(new Date());
  return {
    t,
    users: randomWalk(prev.users, 300, 100, 10000),
    sessions: randomWalk(prev.sessions, 200, 50, 5000),
    events: randomWalk(prev.events, 400, 200, 10000),
  };
}

// Generate initial stats
export function generateInitialStats() {
  return {
    activeUsers: rand(3200, 5800),
    rps: rand(800, 2200),
    latency: rand(42, 180),
    errorRate: +(Math.random() * 3 + 0.5).toFixed(2),
  };
}

// Update stats with deltas
export function updateStats(prev) {
  const activeUsers = clamp(prev.activeUsers + rand(-200, 200), 100, 15000);
  const rps = clamp(prev.rps + rand(-100, 100), 50, 5000);
  const latency = clamp(prev.latency + rand(-15, 15), 10, 500);
  const errorRate = +clamp(prev.errorRate + (Math.random() - 0.5) * 0.8, 0.1, 12).toFixed(2);

  return {
    activeUsers,
    rps,
    latency,
    errorRate,
    deltas: {
      activeUsers: +(((activeUsers - prev.activeUsers) / prev.activeUsers) * 100).toFixed(1),
      rps: +(((rps - prev.rps) / prev.rps) * 100).toFixed(1),
      latency: +(((latency - prev.latency) / prev.latency) * 100).toFixed(1),
      errorRate: +(((errorRate - prev.errorRate) / Math.max(prev.errorRate, 0.01)) * 100).toFixed(1),
    },
  };
}

// Generate a random event
let eventId = 0;
export function generateEvent() {
  const evtType = EVENT_TYPES[rand(0, EVENT_TYPES.length - 1)];
  return {
    id: ++eventId,
    time: formatTimeSec(new Date()),
    type: evtType.type,
    icon: evtType.icon,
    page: PAGES[rand(0, PAGES.length - 1)],
    country: COUNTRIES[rand(0, COUNTRIES.length - 1)],
    color: evtType.color,
  };
}

// Maybe generate an alert (~12% chance)
let alertId = 0;
export function maybeGenerateAlert() {
  if (Math.random() > 0.12) return null;
  const severities = ['critical', 'warning', 'info'];
  const weights = [0.2, 0.4, 0.4];
  const r = Math.random();
  let severity;
  if (r < weights[0]) severity = severities[0];
  else if (r < weights[0] + weights[1]) severity = severities[1];
  else severity = severities[2];

  const pool = ALERT_POOL[severity];
  return {
    id: ++alertId,
    time: formatTimeSec(new Date()),
    severity,
    msg: pool[rand(0, pool.length - 1)],
  };
}

// Generate initial geo data
export function generateGeoData() {
  const top = ['US', 'GB', 'DE', 'IN', 'BR', 'JP'];
  return top.map((country) => ({ country, users: rand(800, 8000) }));
}

// Update geo data
export function updateGeoData(prev) {
  return prev.map((g) => ({ ...g, users: clamp(g.users + rand(-300, 300), 100, 12000) }));
}

// Generate funnel data
export function generateFunnelData() {
  const visit = rand(30000, 60000);
  const signup = rand(8000, Math.floor(visit * 0.4));
  const activate = rand(3000, Math.floor(signup * 0.6));
  const subscribe = rand(500, Math.floor(activate * 0.5));
  return [
    { stage: 'Visit', value: visit, fill: '#3b82f6' },
    { stage: 'Signup', value: signup, fill: '#06b6d4' },
    { stage: 'Activate', value: activate, fill: '#8b5cf6' },
    { stage: 'Subscribe', value: subscribe, fill: '#10b981' },
  ];
}

// Generate device split data
export function generateDeviceData() {
  const desktop = rand(45, 65);
  const mobile = rand(20, 40);
  const tablet = 100 - desktop - mobile;
  return [
    { name: 'Desktop', value: Math.max(desktop, 1) },
    { name: 'Mobile', value: Math.max(mobile, 1) },
    { name: 'Tablet', value: Math.max(tablet, 1) },
  ];
}

// Generate events per minute bar chart data (12 intervals)
export function generateEventsPerMinute() {
  const data = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5000);
    data.push({ t: formatTime(t), count: rand(200, 2000) });
  }
  return data;
}

export function updateEventsPerMinute(prev) {
  const next = [...prev.slice(1)];
  next.push({ t: formatTime(new Date()), count: rand(200, 2000) });
  return next;
}
