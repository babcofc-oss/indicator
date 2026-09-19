import Link from 'next/link'
import type { Player } from '@/lib/data'
import { fmtPct, fmtValue, scoreTextClass } from '@/lib/format'
import { Sparkline } from '@/components/sparkline'
import { TrendBadge, PositionTag } from '@/components/badges'
import { WatchButton } from '@/components/watch-button'
import { cn } from '@/lib/utils'

export function PlayerRow({
  player,
  showSpark = true,
  metric = 'value',
}: {
  player: Player
  showSpark?: boolean
  metric?: 'value' | 'delta' | 'ppg'
}) {
  return (
    <Link
      href={`/players/${player.id}`}
      className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-secondary/60"
    >
      <div className="flex w-9 shrink-0 flex-col items-center">
        <span className={cn('tnum font-mono text-base font-bold leading-none', scoreTextClass(player.indicatorScore))}>
          {player.indicatorScore}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{player.name}</p>
        <PositionTag position={player.position} team={player.team} />
      </div>

      {showSpark ? (
        <div className="hidden sm:block">
          <Sparkline data={player.history} trend={player.trend} />
        </div>
      ) : null}

      <div className="flex w-[74px] shrink-0 flex-col items-end gap-1">
        {metric === 'value' ? (
          <span className="tnum font-mono text-sm font-semibold text-foreground">
            {fmtValue(player.fantasyValue)}
          </span>
        ) : metric === 'ppg' ? (
          <span className="tnum font-mono text-sm font-semibold text-foreground">
            {player.predictedPPG.toFixed(1)}
          </span>
        ) : (
          <span className="tnum font-mono text-sm font-semibold text-foreground">
            {fmtPct(player.valueDeltaPct)}
          </span>
        )}
        <TrendBadge trend={player.trend} deltaPct={metric === 'value' ? player.valueDeltaPct : undefined} />
      </div>

      <WatchButton id={player.id} />
    </Link>
  )
}
