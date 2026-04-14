import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { SectionTitle } from './UI';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4'];

export default function DeviceChart({ data }) {
  return (
    <div style={{
      background: '#1a2235',
      border: '1px solid #2a3550',
      borderRadius: 10,
      padding: '18px 20px',
    }}>
      <SectionTitle>Device Split</SectionTitle>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <ResponsiveContainer width={130} height={130}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={38}
              outerRadius={58}
              dataKey="value"
              stroke="none"
              animationDuration={500}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.map((d, i) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: COLORS[i % COLORS.length],
                display: 'inline-block',
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: '#e2e8f0',
              }}>
                {d.name}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: '#64748b',
                fontWeight: 600,
              }}>
                {d.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
