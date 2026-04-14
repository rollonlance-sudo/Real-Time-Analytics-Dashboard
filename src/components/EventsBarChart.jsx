import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChartTooltip, SectionTitle, Badge } from './UI';

export default function EventsBarChart({ data }) {
  return (
    <div style={{
      background: '#1a2235',
      border: '1px solid #2a3550',
      borderRadius: 10,
      padding: '18px 20px',
    }}>
      <SectionTitle badge={<Badge text="12 intervals" color="#8b5cf6" />}>
        Events / Min
      </SectionTitle>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3550" vertical={false} />
          <XAxis
            dataKey="t"
            tick={{ fill: '#64748b', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: '#2a3550' }}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="count"
            fill="#8b5cf6"
            radius={[3, 3, 0, 0]}
            name="Events"
            animationDuration={400}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
