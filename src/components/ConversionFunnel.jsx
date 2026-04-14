import React from 'react';
import { SectionTitle } from './UI';

export default function ConversionFunnel({ data }) {
  const maxVal = data[0]?.value || 1;

  return (
    <div style={{
      background: '#1a2235',
      border: '1px solid #2a3550',
      borderRadius: 10,
      padding: '18px 20px',
    }}>
      <SectionTitle>Conversion Funnel</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((item, i) => {
          const pct = ((item.value / maxVal) * 100).toFixed(0);
          const convRate = i < data.length - 1
            ? ((data[i + 1].value / item.value) * 100).toFixed(1)
            : null;
          return (
            <div key={item.stage}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: '#e2e8f0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {item.stage}
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#e2e8f0',
                  fontWeight: 600,
                }}>
                  {item.value.toLocaleString()}
                </span>
              </div>
              <div style={{
                height: 22,
                background: '#0f1729',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${item.fill}, ${item.fill}aa)`,
                  borderRadius: 4,
                  transition: 'width 0.6s ease',
                  boxShadow: `0 0 10px ${item.fill}44`,
                }} />
              </div>
              {convRate && (
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: '#64748b',
                  marginTop: 2,
                  textAlign: 'right',
                }}>
                  → {convRate}% conversion
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
