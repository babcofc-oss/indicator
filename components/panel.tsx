import type { LucideIcon } from 'lucide-react'
import { ScoreBar } from '@/components/indicator-score'
import { cn } from '@/lib/utils'

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn('rounded-xl border border-border bg-card', className)}
    >
      {children}
    </section>
  )
}

export function PanelHeader({
  title,
  icon: Icon,
  accent,
  action,
}: {
  title: string
  icon?: LucideIcon
  accent?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border px-3.5 py-2.5">
      <div className="flex items-center gap-2">
        {Icon ? (
          <Icon className={cn('size-4', accent ?? 'text-muted-foreground')} strokeWidth={2.2} />
        ) : null}
        <h2 className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}

export function StatTile({
  label,
  value,
  suffix,
  score,
  hint,
}: {
  label: string
  value: string | number
  suffix?: string
  score?: number
  hint?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-surface/60 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 flex items-baseline gap-0.5">
        <span className="tnum font-mono text-lg font-semibold text-foreground">{value}</span>
        {suffix ? <span className="text-xs text-muted-foreground">{suffix}</span> : null}
      </p>
      {score !== undefined ? <ScoreBar value={score} className="mt-2" /> : null}
      {hint ? <p className="mt-1.5 text-[11px] leading-tight text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

export function MetricScore({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="tnum font-mono text-sm font-semibold text-foreground">{value}</span>
      </div>
      <ScoreBar value={value} className="mt-1.5" />
    </div>
  )
}
