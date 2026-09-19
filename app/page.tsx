import Link from 'next/link'
import {
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Repeat,
  Stethoscope,
  Sparkles,
  ShieldPlus,
  ChevronRight,
} from 'lucide-react'
import {
  players,
  marketRisers,
  marketFallers,
  buySignals,
  sellSignals,
  breakoutWatch,
  roleChanges,
  injuryOpportunities,
  waiverTargets,
  handcuffs,
  getPlayer,
} from '@/lib/data'
import { Panel, PanelHeader } from '@/components/panel'
import { PlayerRow } from '@/components/player-row'
import { Ticker } from '@/components/ticker'
import { TrendBadge } from '@/components/badges'
import { fmtValue } from '@/lib/format'

const tickerPlayers = [...players].sort((a, b) => Math.abs(b.valueDeltaPct) - Math.abs(a.valueDeltaPct)).slice(0, 10)

export default function MarketPage() {
  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">Market</h1>
          <p className="text-[13px] text-muted-foreground">
            Where player value is moving — and why, before the box scores catch up.
          </p>
        </div>
        <span className="hidden shrink-0 text-right text-[11px] text-muted-foreground sm:block">
          Illustrative 2026 season
          <br />
          Sample Week 10 snapshot
        </span>
      </div>

      <Ticker players={tickerPlayers} />

      {/* Market movers */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel>
          <PanelHeader title="Top Risers" icon={ArrowUpRight} accent="text-rising" />
          <div className="divide-y divide-border/60 p-1.5">
            {marketRisers.map((p) => (
              <PlayerRow key={p.id} player={p} metric="value" />
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Top Fallers" icon={ArrowDownRight} accent="text-falling" />
          <div className="divide-y divide-border/60 p-1.5">
            {marketFallers.map((p) => (
              <PlayerRow key={p.id} player={p} metric="value" />
            ))}
          </div>
        </Panel>
      </div>

      {/* Buy / Sell */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel>
          <PanelHeader title="Buy Signals" icon={ArrowUpRight} accent="text-rising" />
          <div className="divide-y divide-border/60 p-1.5">
            {buySignals.map((p) => (
              <PlayerRow key={p.id} player={p} metric="ppg" />
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Sell Signals" icon={ArrowDownRight} accent="text-falling" />
          <div className="divide-y divide-border/60 p-1.5">
            {sellSignals.map((p) => (
              <PlayerRow key={p.id} player={p} metric="ppg" />
            ))}
          </div>
        </Panel>
      </div>

      {/* Breakout / Role change */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel>
          <PanelHeader title="Breakout Watch" icon={Flame} accent="text-primary" />
          <div className="divide-y divide-border/60 p-1.5">
            {breakoutWatch.map((p) => (
              <PlayerRow key={p.id} player={p} metric="delta" />
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Role Changes" icon={Repeat} accent="text-primary" />
          <div className="divide-y divide-border/60 p-1.5">
            {roleChanges.map((p) => (
              <PlayerRow key={p.id} player={p} metric="delta" />
            ))}
          </div>
        </Panel>
      </div>

      {/* Injury opp / Waiver */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel>
          <PanelHeader title="Injury Opportunities" icon={Stethoscope} accent="text-stable" />
          <div className="divide-y divide-border/60 p-1.5">
            {injuryOpportunities.map((p) => (
              <PlayerRow key={p.id} player={p} metric="delta" />
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Waiver Targets" icon={Sparkles} accent="text-primary" />
          <div className="divide-y divide-border/60 p-1.5">
            {waiverTargets.map((p) => (
              <PlayerRow key={p.id} player={p} metric="delta" />
            ))}
          </div>
        </Panel>
      </div>

      {/* Handcuff value changes */}
      <Panel>
        <PanelHeader
          title="Handcuff Value Changes"
          icon={ShieldPlus}
          accent="text-stable"
          action={
            <Link
              href="/handcuffs"
              className="flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              All handcuffs <ChevronRight className="size-3.5" />
            </Link>
          }
        />
        <div className="divide-y divide-border/60 p-1.5">
          {handcuffs.slice(0, 4).map((hc) => {
            const p = getPlayer(hc.backupId)
            if (!p) return null
            const upside = ((hc.inheritValue - hc.standaloneValue) / hc.standaloneValue) * 100
            return (
              <Link
                key={hc.id}
                href={`/players/${p.id}`}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-secondary/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    behind <span className="text-foreground/80">{hc.starterName}</span> · {p.team}
                  </p>
                </div>
                <div className="text-right">
                  <p className="tnum font-mono text-[11px] text-muted-foreground">
                    {fmtValue(hc.standaloneValue)} → <span className="text-foreground">{fmtValue(hc.inheritValue)}</span>
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">if starter sits</p>
                </div>
                <TrendBadge trend="Rising" deltaPct={upside} />
              </Link>
            )
          })}
        </div>
      </Panel>

      <p className="px-1 pt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        Prototype data for demonstration only. Values are illustrative and not verified live statistics.
      </p>
    </div>
  )
}
