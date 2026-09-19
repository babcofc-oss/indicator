'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Trend, ValuePoint } from '@/lib/data'

const COLOR: Record<Trend, string> = {
  Rising: 'var(--rising)',
  Falling: 'var(--falling)',
  Stable: 'var(--stable)',
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border bg-popover px-2.5 py-1.5 shadow-lg">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="tnum font-mono text-sm font-semibold text-foreground">
        {payload[0].value.toFixed(1)}
      </p>
    </div>
  )
}

export function ValueChart({
  data,
  trend,
  height = 200,
}: {
  data: ValuePoint[]
  trend: Trend
  height?: number
}) {
  const color = COLOR[trend]
  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = (max - min) * 0.15 || 4

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            domain={[min - pad, max + pad]}
            tickLine={false}
            axisLine={false}
            width={34}
            tickFormatter={(v: number) => Math.round(v).toString()}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--grid)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.25}
            fill="url(#valueFill)"
            isAnimationActive={false}
            dot={false}
            activeDot={{ r: 3.5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
