'use client'

import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import type { Trend, ValuePoint } from '@/lib/data'

const COLOR: Record<Trend, string> = {
  Rising: 'var(--rising)',
  Falling: 'var(--falling)',
  Stable: 'var(--stable)',
}

export function Sparkline({
  data,
  trend,
  width = 72,
  height = 28,
}: {
  data: ValuePoint[]
  trend: Trend
  width?: number
  height?: number
}) {
  const color = COLOR[trend]
  const id = `spark-${trend}`
  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)

  return (
    <div style={{ width, height }} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[min - (max - min) * 0.2, max + (max - min) * 0.2]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#${id})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
