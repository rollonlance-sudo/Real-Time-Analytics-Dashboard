import React from 'react';

export function Badge({ text, color, style = {} }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '3px 8px',
        borderRadius: 4,
        background: `${color}22`,
        color: color,
        border: `1px solid ${color}44`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </span>
  );
}

export function LiveDot() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#10b981',
          boxShadow: '0 0 8px #10b981',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 600,
          color: '#10b981',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        LIVE
      </span>
    </span>
  );
}

export function SectionTitle({ children, badge, right }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            color: '#e2e8f0',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {children}
        </h3>
        {badge}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: '#1a2235',
        border: '1px solid #2a3550',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: '#64748b',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: p.color,
            marginBottom: 2,
          }}
        >
          {p.name}: {p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
}
