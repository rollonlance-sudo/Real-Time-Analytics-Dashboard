import React from 'react';
import { Badge } from './UI';

const SEVERITY_STYLES = {
  critical: { color: '#ef4444', bg: '#ef444412', border: '#ef444430' },
  warning: { color: '#f59e0b', bg: '#f59e0b12', border: '#f59e0b30' },
  info: { color: '#3b82f6', bg: 'transparent', border: 'transparent' },
};

export default function AlertsList({ alerts }) {
  return (
    <div style={{
      background: '#1a2235',
      border: '1px solid #2a3550',
      borderRadius: 10,
      padding: '18px 20px',
      maxHeight: 520,
      overflowY: 'auto',
    }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        color: '#e2e8f0',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 14,
      }}>
        System Alerts
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: '#64748b',
          marginLeft: 10,
          fontWeight: 400,
          textTransform: 'none',
          letterSpacing: 0,
        }}>
          {alerts.length} active
        </span>
      </div>
      {alerts.length === 0 && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: '#64748b',
          textAlign: 'center',
          padding: 40,
        }}>
          No alerts — all systems nominal
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {alerts.map((alert, i) => {
          const s = SEVERITY_STYLES[alert.severity];
          return (
            <div
              key={alert.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 6,
                background: s.bg,
                border: `1px solid ${s.border}`,
                animation: i === 0 ? 'slideIn 0.3s ease' : 'none',
              }}
            >
              <span style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: s.color,
                boxShadow: `0 0 6px ${s.color}88`,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: '#64748b',
                flexShrink: 0,
                width: 64,
              }}>
                {alert.time}
              </span>
              <Badge text={alert.severity} color={s.color} style={{ flexShrink: 0 }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: '#e2e8f0',
                flex: 1,
              }}>
                {alert.msg}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
