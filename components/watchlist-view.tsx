'use client'

import Link from 'next/link'
import { Bookmark } from 'lucide-react'
import type { Player } from '@/lib/data'
import { useWatchlist } from '@/components/watchlist-provider'
import { Panel } from '@/components/panel'
import { PlayerRow } from '@/components/player-row'
import { SignalBadge } from '@/components/badges'

export function WatchlistView({ allPlayers }: { allPlayers: Player[] }) {
  const { ids, ready } = useWatchlist()

  if (!ready) {
    return <div className="h-40 animate-pulse rounded-xl border border-border bg-card" />
  }

  const saved = allPlayers.filter((p) => ids.includes(p.id))

  if (!saved.length) {
    return (
      <Panel className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
          <Bookmark className="size-5 text-muted-foreground" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Your watchlist is empty</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Tap the bookmark on any player to track their Indicator Score.
          </p>
        </div>
        <Link
          href="/players"
          className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Browse players
        </Link>
      </Panel>
    )
  }

  const rising = saved.filter((p) => p.trend === 'Rising').length
  const falling = saved.filter((p) => p.trend === 'Falling').length
  const avg = Math.round(saved.reduce((s, p) => s + p.indicatorScore, 0) / saved.length)

  const sorted = [...saved].sort((a, b) => b.indicatorScore - a.indicatorScore)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="tnum font-mono text-xl font-bold text-foreground">{avg}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Avg Score</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="tnum font-mono text-xl font-bold text-rising">{rising}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rising</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <p className="tnum font-mono text-xl font-bold text-falling">{falling}</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Falling</p>
        </div>
      </div>

      <Panel className="p-1.5">
        <div className="divide-y divide-border/60">
          {sorted.map((p) => (
            <div key={p.id} className="flex items-center gap-2 pr-2">
              <div className="min-w-0 flex-1">
                <PlayerRow player={p} metric="value" showSpark />
              </div>
              <div className="hidden shrink-0 sm:block">
                <SignalBadge signal={p.signal} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
