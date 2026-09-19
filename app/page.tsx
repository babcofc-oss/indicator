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
  handcuffs,
} from '@/lib/data'
import { getLivePlayers, isAvailable } from '@/lib/live-players'
import { Panel, PanelHeader } from '@/components/panel'
import { PlayerRow } from '@/components/player-row'
import { Ticker } from '@/components/ticker'
import { TrendBadge } from '@/components/badges'
import { fmtValue } from '@/lib/format'

export default async function MarketPage() {
  const players = await getLivePlayers()
  const available = players.filter(isAvailable)
  const tickerPlayers = [...available].sort((a, b) => Math.abs(b.valueDeltaPct) - Math.abs(a.valueDeltaPct)).slice(0, 10)
  const marketRisers = [...available].sort((a, b) => b.valueDeltaPct - a.valueDeltaPct).slice(0, 5)
  const marketFallers = [...available].sort((a, b) => a.valueDeltaPct - b.valueDeltaPct).slice(0, 5)
  const buySignals = available.filter((p) => p.signal === 'STRONG BUY' || p.signal === 'BUY').sort((a, b) => b.scoreDelta - a.scoreDelta)
  const sellSignals = available.filter((p) => p.signal === 'SELL').sort((a, b) => a.scoreDelta - b.scoreDelta)
  const breakoutWatch = available.filter((p) => p.signal === 'BREAKOUT ALERT').sort((a, b) => b.scoreDelta - a.scoreDelta)
  const roleChanges = available.filter((p) => p.signal === 'ROLE CHANGE').sort((a, b) => b.scoreDelta - a.scoreDelta)
  const injuryOpportunities = available.filter((p) => p.signal === 'INJURY OPPORTUNITY').sort((a, b) => b.scoreDelta - a.scoreDelta)
  const waiverTargets = available.filter((p) => p.fantasyValue < 40 && p.trend === 'Rising').sort((a, b) => b.valueDeltaPct - a.valueDeltaPct).slice(0, 6)
  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">Market</h1>
          <p className="text-[13px] text-muted-foreground">
            Demo rankings and projections. Availability is checked against Sleeper's roster.
          </p>
        </div>
        <span className="hidden shrink-0 text-right text-[11px] text-muted-foreground sm:block">Sample metrics<br />Availability checked: {players[0]?.availabilityCheckedAt || 'unavailable'}</span>
      </div>
      {!available.length && <p className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-200">Player availability could not be verified. Recommendations are withheld until the roster check recovers.</p>}

      <Ticker players={tickerPlayers} />

      {/* Market movers */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel>
          <PanelHeader title="Sample Risers" icon={ArrowUpRight} accent="text-rising" />
          <div className="divide-y divide-border/60 p-1.5">
            {marketRisers.map((p) => (
              <PlayerRow key={p.id} player={p} metric="value" />
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Sample Fallers" icon={ArrowDownRight} accent="text-falling" />
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
          <PanelHeader title="Sample Buy Signals" icon={ArrowUpRight} accent="text-rising" />
          <div className="divide-y divide-border/60 p-1.5">
            {buySignals.map((p) => (
              <PlayerRow key={p.id} player={p} metric="ppg" />
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Sample Sell Signals" icon={ArrowDownRight} accent="text-falling" />
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
          {handcuffs.filter((hc) => available.some((p) => p.id === hc.backupId)).slice(0, 4).map((hc) => {
            const p = available.find((player) => player.id === hc.backupId)!
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
