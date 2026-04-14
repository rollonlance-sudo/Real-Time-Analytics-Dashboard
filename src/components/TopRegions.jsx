import React from 'react';
import { SectionTitle } from './UI';

const FLAG_MAP = {
  US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', IN: '🇮🇳', BR: '🇧🇷', JP: '🇯🇵',
  FR: '🇫🇷', CA: '🇨🇦', AU: '🇦🇺', KR: '🇰🇷', NL: '🇳🇱', SG: '🇸🇬',
};

export default function TopRegions({ data }) {
  const sorted = [...data].sort((a, b) => b.users - a.users);
  const maxUsers = sorted[0]?.users || 1;

  return (
    <div style={{
      background: '#1a2235',
      border: '1px solid #2a3550',
      borderRadius: 10,
      padding: '18px 20px',
    }}>
      <SectionTitle>Top Regions</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.slice(0, 6).map((g) => (
          <div key={g.country} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, width: 24 }}>{FLAG_MAP[g.country] || g.country}</span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#e2e8f0',
              width: 28,
              fontWeight: 600,
            }}>
              {g.country}
            </span>
            <div style={{
              flex: 1,
              height: 16,
              background: '#0f1729',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${(g.users / maxUsers * 100).toFixed(0)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                borderRadius: 3,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: '#e2e8f0',
              width: 50,
              textAlign: 'right',
              fontWeight: 500,
            }}>
              {g.users.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
