import React from 'react';
import { Badge } from './UI';

export default function EventStream({ events }) {
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
        Live Event Stream
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: '#64748b',
          marginLeft: 10,
          fontWeight: 400,
          textTransform: 'none',
          letterSpacing: 0,
        }}>
          {events.length} events
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {events.map((evt, i) => (
          <div
            key={evt.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '72px 26px 90px 1fr 36px',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 6,
              background: i === 0 ? '#1e2940' : 'transparent',
              animation: i === 0 ? 'slideIn 0.3s ease' : 'none',
              transition: 'background 0.2s',
            }}
          >
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: '#64748b',
            }}>
              {evt.time}
            </span>
            <span style={{ fontSize: 14 }}>{evt.icon}</span>
            <Badge text={evt.type} color={evt.color} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#94a3b8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {evt.page}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: '#64748b',
              textAlign: 'right',
            }}>
              {evt.country}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
