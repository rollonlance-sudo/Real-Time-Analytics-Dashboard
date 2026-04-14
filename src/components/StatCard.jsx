import React from 'react';

const styles = {
  card: {
    background: '#1a2235',
    border: '1px solid #2a3550',
    borderRadius: 10,
    padding: '18px 20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#64748b',
    marginBottom: 8,
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  value: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 32,
    fontWeight: 700,
    color: '#e2e8f0',
    lineHeight: 1,
  },
  unit: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    color: '#64748b',
    fontWeight: 500,
  },
  delta: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    fontWeight: 600,
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  glow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: '50%',
    opacity: 0.12,
    filter: 'blur(25px)',
    pointerEvents: 'none',
  },
};

export default function StatCard({ label, value, unit, delta, accent = '#3b82f6' }) {
  const isPositive = delta >= 0;
  // For latency and error rate, positive is bad
  const isGood = label === 'Avg Latency' || label === 'Error Rate' ? !isPositive : isPositive;
  const deltaColor = isGood ? '#10b981' : '#ef4444';
  const arrow = isPositive ? '▲' : '▼';

  return (
    <div style={{ ...styles.card, boxShadow: `0 0 20px ${accent}18` }}>
      <div style={{ ...styles.glow, background: accent }} />
      <div style={styles.label}>{label}</div>
      <div style={styles.valueRow}>
        <span style={styles.value}>{typeof value === 'number' ? value.toLocaleString() : value}</span>
        {unit && <span style={styles.unit}>{unit}</span>}
      </div>
      {delta !== undefined && (
        <div style={{ ...styles.delta, color: deltaColor }}>
          {arrow} {Math.abs(delta)}%
          <span style={{ color: '#64748b', marginLeft: 4, fontWeight: 400 }}>vs prev</span>
        </div>
      )}
    </div>
  );
}
