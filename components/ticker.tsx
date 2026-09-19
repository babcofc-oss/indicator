import Link from 'next/link'
import { TrendingDown, TrendingUp } from 'lucide-react'
import type { Player } from '@/lib/data'
import { fmtPct } from '@/lib/format'
import { cn } from '@/lib/utils'

export function Ticker({ players }: { players: Player[] }) {
  return (
    <div className="no-scrollbar -mx-4 overflow-x-auto border-y border-border bg-surface/40 px-4">
      <div className="flex w-max items-center gap-4 py-2">
        {players.map((p) => {
          const up = p.valueDeltaPct >= 0
          return (
            <Link
              key={p.id}
              href={`/players/${p.id}`}
              className="flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="font-mono text-[11px] font-semibold text-foreground">
                {p.team} {p.name.split(' ').slice(-1)[0]}
              </span>
              <span
                className={cn(
                  'tnum inline-flex items-center gap-0.5 font-mono text-[11px] font-medium',
                  up ? 'text-rising' : 'text-falling',
                )}
              >
                {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {fmtPct(p.valueDeltaPct)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
