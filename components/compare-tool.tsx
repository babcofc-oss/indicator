'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Plus, Star, X } from 'lucide-react'
import type { Player } from '@/lib/data'
import { IndicatorScore } from '@/components/indicator-score'
import { TrendBadge } from '@/components/badges'
import { Sparkline } from '@/components/sparkline'
import { scoreColor } from '@/lib/format'
import { cn } from '@/lib/utils'

const ROWS: { key: keyof Player; label: string; kind: 'score' | 'num' | 'trend' }[] = [
  { key: 'predictedPPG', label: 'Predicted PPG', kind: 'num' },
  { key: 'fantasyValue', label: 'Value', kind: 'num' },
  { key: 'opportunityMomentum', label: 'Opportunity', kind: 'score' },
  { key: 'efficiency', label: 'Efficiency', kind: 'score' },
  { key: 'roleSecurity', label: 'Role Security', kind: 'score' },
  { key: 'matchup', label: 'Matchup', kind: 'score' },
  { key: 'trend', label: 'Trend', kind: 'trend' },
]

export function CompareTool({
  allPlayers,
  initialIds,
}: {
  allPlayers: Player[]
  initialIds: string[]
}) {
  const [selected, setSelected] = useState<string[]>(
    initialIds.length ? initialIds.slice(0, 4) : ['caleb-douglas', 'nico-collins'],
  )
  const [adding, setAdding] = useState(false)

  const chosen = selected.map((id) => allPlayers.find((p) => p.id === id)).filter(Boolean) as Player[]
  const remaining = allPlayers.filter((p) => !selected.includes(p.id))

  function bestFor(key: keyof Player): number {
    return Math.max(...chosen.map((p) => Number(p[key])))
  }

  return (
    <div className="space-y-3">
      {/* Column headers */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${chosen.length + (chosen.length < 4 ? 1 : 0)}, minmax(0, 1fr))` }}
      >
        {chosen.map((p) => (
          <div key={p.id} className="relative rounded-xl border border-border bg-card p-3 text-center">
            <button
              type="button"
              onClick={() => setSelected((s) => s.filter((x) => x !== p.id))}
              className="absolute right-1.5 top-1.5 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label={`Remove ${p.name}`}
            >
              <X className="size-3.5" />
            </button>
            <div className="flex justify-center">
              <IndicatorScore score={p.indicatorScore} size={56} strokeWidth={5} label={false} />
            </div>
            <Link href={`/players/${p.id}`} className="mt-2 block truncate text-[13px] font-semibold text-foreground hover:underline">
              {p.name}
            </Link>
            <p className="font-mono text-[10px] text-muted-foreground">
              {p.position} · {p.team}
            </p>
            <div className="mt-2 flex justify-center">
              <Sparkline data={p.history} trend={p.trend} width={64} height={22} />
            </div>
          </div>
        ))}

        {chosen.length < 4 ? (
          <button
            type="button"
            onClick={() => setAdding((a) => !a)}
            className="flex min-h-[150px] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Plus className="size-5" />
            <span className="text-[11px] font-medium">Add player</span>
          </button>
        ) : null}
      </div>

      {adding && chosen.length < 4 ? (
        <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-1.5">
          {remaining.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelected((s) => [...s, p.id])
                setAdding(false)
              }}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-secondary/60"
            >
              <span className="text-sm font-medium text-foreground">{p.name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {p.position} · {p.team} · {p.indicatorScore}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Comparison matrix */}
      {chosen.length ? (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {ROWS.map((row, i) => {
            const best = row.kind === 'trend' ? null : bestFor(row.key)
            return (
              <div
                key={row.key as string}
                className={cn(
                  'grid items-center gap-2 px-3 py-2.5',
                  i % 2 ? 'bg-surface/40' : '',
                )}
                style={{ gridTemplateColumns: `110px repeat(${chosen.length}, minmax(0, 1fr))` }}
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {row.label}
                </span>
                {chosen.map((p) => {
                  const val = p[row.key]
                  if (row.kind === 'trend') {
                    return (
                      <div key={p.id} className="flex justify-center">
                        <TrendBadge trend={p.trend} />
                      </div>
                    )
                  }
                  const num = Number(val)
                  const isBest = best !== null && num === best && chosen.length > 1
                  return (
                    <div key={p.id} className="flex items-center justify-center gap-1">
                      <span
                        className={cn(
                          'tnum font-mono text-sm font-semibold',
                          isBest ? '' : 'text-foreground',
                        )}
                        style={isBest ? { color: scoreColor(row.kind === 'score' ? num : 80) } : undefined}
                      >
                        {row.kind === 'num' ? num.toFixed(1) : num}
                      </span>
                      {isBest ? (
                        <Star className="size-3 fill-primary text-primary" aria-label="best" />
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-border bg-card px-3 py-10 text-center text-sm text-muted-foreground">
          Add players to compare.
        </p>
      )}
    </div>
  )
}
