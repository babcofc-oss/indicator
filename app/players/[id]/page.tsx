import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, GitCompare, Quote } from 'lucide-react'
import { players, getPlayer } from '@/lib/data'
import { IndicatorScore } from '@/components/indicator-score'
import { Panel, PanelHeader, StatTile, MetricScore } from '@/components/panel'
import { ValueChart } from '@/components/value-chart'
import { SignalBadge, TrendBadge, PositionTag } from '@/components/badges'
import { WatchButton } from '@/components/watch-button'
import { fmtValue } from '@/lib/format'

export function generateStaticParams() {
  return players.map((p) => ({ id: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const player = getPlayer(id)
  if (!player) return { title: 'Player — THE INDICATOR' }
  return {
    title: `${player.name} · ${player.position} ${player.team} — THE INDICATOR`,
    description: player.rationale,
  }
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = getPlayer(id)
  if (!player) notFound()

  const isPasser = player.position === 'QB'

  const usageTiles = isPasser
    ? [
        { label: 'Snap %', value: player.snapPct, suffix: '%' },
        { label: 'Rush Att', value: player.carries },
        { label: 'RZ Opps', value: player.redZoneUsage },
        { label: 'Explosive Plays', value: player.explosivePlays },
      ]
    : [
        { label: 'Snap %', value: player.snapPct, suffix: '%' },
        { label: 'Route Part.', value: player.routeParticipation, suffix: '%' },
        { label: 'Target Share', value: player.targetShare, suffix: '%' },
        { label: 'Air-Yard Share', value: player.airYardShare, suffix: '%' },
        { label: 'RZ Usage', value: player.redZoneUsage },
        { label: 'Carries', value: player.carries },
        { label: 'Targets', value: player.targets },
        { label: 'Explosive Plays', value: player.explosivePlays },
      ]

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Market
      </Link>

      {/* Hero */}
      <Panel className="relative overflow-hidden border border-primary/35 bg-gradient-to-br from-primary/15 via-surface to-background p-4 shadow-[inset_0_0_0_3px_var(--background),inset_0_0_0_4px_var(--border)]">
        <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">The Indicator · Player card</p>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SignalBadge signal={player.signal} />
              <PositionTag position={player.position} team={player.team} />
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{player.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Value</p>
                <p className="tnum font-mono text-lg font-semibold text-foreground">
                  {fmtValue(player.fantasyValue)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Pred. PPG</p>
                <p className="tnum font-mono text-lg font-semibold text-foreground">
                  {player.predictedPPG.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Trend</p>
                <TrendBadge trend={player.trend} deltaPct={player.valueDeltaPct} className="mt-0.5" />
              </div>
            </div>
          </div>
          <IndicatorScore score={player.indicatorScore} size={84} strokeWidth={7} />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <WatchButton id={player.id} withLabel />
          <Link
            href={`/compare?ids=${player.id}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <GitCompare className="size-4" /> Compare
          </Link>
        </div>
      </Panel>

      {/* Value chart */}
      <Panel>
        <PanelHeader title="Underlying Value" action={<TrendBadge trend={player.trend} deltaPct={player.valueDeltaPct} />} />
        <div className="px-2 py-3">
          <ValueChart data={player.history} trend={player.trend} height={210} />
        </div>
      </Panel>

      {/* Rationale */}
      <Panel className="p-4">
        <div className="flex items-start gap-3">
          <Quote className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground">
              Rationale
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/90">{player.rationale}</p>
          </div>
        </div>
      </Panel>

      {/* Component scores */}
      <Panel className="p-4">
        <h2 className="mb-3 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground">
          Value Drivers
        </h2>
        <div className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">
          <MetricScore label="Opportunity Momentum" value={player.opportunityMomentum} />
          <MetricScore label="Efficiency" value={player.efficiency} />
          <MetricScore label="Role Security" value={player.roleSecurity} />
          <MetricScore label="Matchup" value={player.matchup} />
          <MetricScore label="Injury Environment" value={player.injuryEnvironment} />
        </div>
      </Panel>

      {/* Usage */}
      <Panel className="p-4">
        <h2 className="mb-3 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground">
          Usage &amp; Opportunity
        </h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {usageTiles.map((t) => (
            <StatTile key={t.label} label={t.label} value={t.value} suffix={t.suffix} />
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Prototype data for demonstration only — illustrative values, not verified live statistics.
        </p>
      </Panel>
    </div>
  )
}
