'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Player, Position } from '@/lib/data'
import { PlayerRow } from '@/components/player-row'
import { cn } from '@/lib/utils'

const POSITIONS: (Position | 'ALL')[] = ['ALL', 'QB', 'RB', 'WR', 'TE']
const SORTS = [
  { key: 'score', label: 'Score' },
  { key: 'value', label: 'Value' },
  { key: 'mover', label: 'Movers' },
  { key: 'ppg', label: 'PPG' },
] as const

type SortKey = (typeof SORTS)[number]['key']

export function PlayersExplorer({ allPlayers }: { allPlayers: Player[] }) {
  const [query, setQuery] = useState('')
  const [pos, setPos] = useState<(typeof POSITIONS)[number]>('ALL')
  const [sort, setSort] = useState<SortKey>('score')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = allPlayers.filter((p) => {
      const matchPos = pos === 'ALL' || p.position === pos
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
      return matchPos && matchQ
    })
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'value':
          return b.fantasyValue - a.fantasyValue
        case 'mover':
          return Math.abs(b.valueDeltaPct) - Math.abs(a.valueDeltaPct)
        case 'ppg':
          return b.predictedPPG - a.predictedPPG
        default:
          return b.indicatorScore - a.indicatorScore
      }
    })
    return list
  }, [allPlayers, query, pos, sort])

  const metric = sort === 'ppg' ? 'ppg' : sort === 'mover' ? 'delta' : 'value'

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search players or teams…"
          className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          {POSITIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPos(p)}
              className={cn(
                'rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide transition-colors',
                pos === p
                  ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                  : 'text-muted-foreground hover:bg-secondary/60',
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={cn(
                'rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
                sort === s.key
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/60',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-1.5">
        {filtered.length ? (
          <div className="divide-y divide-border/60">
            {filtered.map((p) => (
              <PlayerRow key={p.id} player={p} metric={metric} />
            ))}
          </div>
        ) : (
          <p className="px-3 py-10 text-center text-sm text-muted-foreground">No players match.</p>
        )}
      </div>
    </div>
  )
}
