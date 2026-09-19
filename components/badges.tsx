import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import type { SignalType, Trend } from '@/lib/data'
import { fmtPct, signalBadgeClass, trendBgClass } from '@/lib/format'
import { cn } from '@/lib/utils'

export function TrendBadge({
  trend,
  deltaPct,
  className,
}: {
  trend: Trend
  deltaPct?: number
  className?: string
}) {
  const Icon = trend === 'Rising' ? TrendingUp : trend === 'Falling' ? TrendingDown : Minus
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
        trendBgClass(trend),
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {deltaPct !== undefined ? (
        <span className="tnum font-mono">{fmtPct(deltaPct)}</span>
      ) : (
        <span>{trend}</span>
      )}
    </span>
  )
}

export function SignalBadge({ signal, className }: { signal: SignalType; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider',
        signalBadgeClass(signal),
        className,
      )}
    >
      {signal}
    </span>
  )
}

export function PositionTag({ position, team }: { position: string; team: string }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-muted-foreground">
      <span className="text-foreground">{position}</span>
      <span className="text-muted-foreground/50">/</span>
      <span>{team}</span>
    </span>
  )
}
