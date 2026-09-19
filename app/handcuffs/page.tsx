import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { handcuffs, getPlayer } from '@/lib/data'
import { Panel } from '@/components/panel'
import { IndicatorScore } from '@/components/indicator-score'
import { PositionTag, TrendBadge } from '@/components/badges'
import { WatchButton } from '@/components/watch-button'
import { fmtValue } from '@/lib/format'

export const metadata = {
  title: 'Handcuffs — THE INDICATOR',
}

const ranked = [...handcuffs].sort((a, b) => b.inheritValue - a.inheritValue)

export default function HandcuffsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">Handcuffs</h1>
        <p className="text-[13px] text-muted-foreground">
          Hypothetical backup scenarios using sample values. Depth chart roles are not verified.
        </p>
      </div>

      <div className="space-y-3">
        {ranked.map((hc, idx) => {
          const p = getPlayer(hc.backupId)
          if (!p) return null
          const upside = ((hc.inheritValue - hc.standaloneValue) / hc.standaloneValue) * 100
          return (
            <Panel key={hc.id} className="p-3.5">
              <div className="flex items-center gap-3">
                <span className="tnum w-5 shrink-0 font-mono text-sm font-bold text-muted-foreground">
                  {idx + 1}
                </span>
                <IndicatorScore score={p.indicatorScore} size={48} strokeWidth={4.5} label={false} />
                <div className="min-w-0 flex-1">
                  <Link href={`/players/${p.id}`} className="block truncate text-sm font-semibold text-foreground hover:underline">
                    {p.name}
                  </Link>
                  <div className="flex items-center gap-1.5">
                    <PositionTag position={p.position} team={p.team} />
                    <span className="text-[11px] text-muted-foreground">
                      · behind <span className="text-foreground/80">{hc.starterName}</span>
                    </span>
                  </div>
                </div>
                <WatchButton id={p.id} />
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-3 py-2.5">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Standalone</p>
                  <p className="tnum font-mono text-base font-semibold text-foreground">
                    {fmtValue(hc.standaloneValue)}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">If starter sits</p>
                  <p className="tnum font-mono text-base font-semibold text-primary">
                    {fmtValue(hc.inheritValue)}
                  </p>
                </div>
                <div className="ml-auto">
                  <TrendBadge trend="Rising" deltaPct={upside} />
                </div>
              </div>

              <p className="mt-2.5 flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground">
                <Shield className="mt-0.5 size-3.5 shrink-0 text-stable" />
                {hc.note}
              </p>
            </Panel>
          )
        })}
      </div>

      <p className="px-1 pt-1 text-center text-[11px] leading-relaxed text-muted-foreground">
        Prototype data for demonstration only. Inherited-value projections are illustrative.
      </p>
    </div>
  )
}
