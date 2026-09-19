'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Player, SignalEvent, SignalType } from '@/lib/data'
import { SignalBadge, PositionTag } from '@/components/badges'
import { WatchButton } from '@/components/watch-button'
import { signalBadgeClass } from '@/lib/format'
import { cn } from '@/lib/utils'

const FILTERS: (SignalType | 'ALL')[] = [
  'ALL',
  'STRONG BUY',
  'BUY',
  'BREAKOUT ALERT',
  'ROLE CHANGE',
  'INJURY OPPORTUNITY',
  'WATCH',
  'HOLD',
  'SELL',
]

export function SignalsFeed({
  feed,
  playerMap,
}: {
  feed: SignalEvent[]
  playerMap: Record<string, Player>
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('ALL')

  const items = useMemo(
    () => (filter === 'ALL' ? feed : feed.filter((e) => e.type === filter)),
    [feed, filter],
  )

  return (
    <div className="space-y-3">
      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors',
              filter === f
                ? f === 'ALL'
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : signalBadgeClass(f as SignalType)
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="relative space-y-2.5 pl-4">
        <div className="absolute inset-y-1 left-[5px] w-px bg-border" aria-hidden />
        {items.map((e) => {
          const p = playerMap[e.playerId]
          if (!p) return null
          return (
            <div key={e.id} className="relative">
              <span className="absolute -left-[13.5px] top-3 size-2.5 rounded-full border-2 border-background bg-primary" aria-hidden />
              <Link
                href={`/players/${p.id}`}
                className="block rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-border/80 hover:bg-secondary/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SignalBadge signal={e.type} />
                    <span className="text-[11px] text-muted-foreground">{e.when}</span>
                  </div>
                  <WatchButton id={p.id} />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <PositionTag position={p.position} team={p.team} />
                </div>
                <p className="mt-1 text-[13px] font-medium text-foreground/90">{e.headline}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{e.detail}</p>
              </Link>
            </div>
          )
        })}
        {!items.length ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No signals of this type.</p>
        ) : null}
      </div>
    </div>
  )
}
