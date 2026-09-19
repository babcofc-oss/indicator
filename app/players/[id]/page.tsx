import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, GitCompare, Quote } from 'lucide-react'
import { players, getPlayer } from '@/lib/data'
import { Panel, PanelHeader, StatTile, MetricScore } from '@/components/panel'
import { ValueChart } from '@/components/value-chart'
import { SignalBadge, TrendBadge } from '@/components/badges'
import { WatchButton } from '@/components/watch-button'
import { fmtValue } from '@/lib/format'
import { playerPortrait } from '@/lib/player-images'

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
  const chartValues = player.history.map((point) => point.value)
  const chartMin = Math.min(...chartValues)
  const chartRange = Math.max(...chartValues) - chartMin || 1
  const cardChartPoints = player.history.map((point, index) => {
    const x = 40 + (index * 920) / Math.max(player.history.length - 1, 1)
    const y = 350 - ((point.value - chartMin) / chartRange) * 245
    return `${x},${y}`
  }).join(' ')
  const lastChartPoint = cardChartPoints.split(' ').at(-1)?.split(',').map(Number) ?? [960, 350]

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

      <section className="player-card" aria-label={`${player.name} player card`}>
        <div className="player-card__masthead">
          <span className="player-card__brand">THE INDICATOR <span>◆</span> 2026</span>
          <span className="player-card__edition">PLAYER INTELLIGENCE · NO. {String(players.indexOf(player) + 1).padStart(3, '0')}</span>
        </div>
        <div className="player-card__nameplate">
          <span className="player-card__crest" aria-hidden="true">◆</span>
          <div className="player-card__identity">
            <h1>{player.name}</h1>
            <p className="player-card__eyebrow">{player.position} <span>•</span> {player.team}</p>
          </div>
          <div className="player-card__score"><span>INDICATOR</span><strong>{player.indicatorScore}</strong><small>/ 100</small></div>
        </div>
        <div className="player-card__field">
          <svg className="player-card__chart" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="card-chart-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffe28c" stopOpacity=".35" />
                <stop offset="100%" stopColor="#ffe28c" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="player-card__chart-grid" d="M0 100H1000 M0 200H1000 M0 300H1000 M0 400H1000 M200 0V500 M400 0V500 M600 0V500 M800 0V500" />
            <polygon points={`40,500 ${cardChartPoints} 960,500`} fill="url(#card-chart-fill)" />
            <polyline className="player-card__chart-line" points={cardChartPoints} />
            <circle cx={lastChartPoint[0]} cy={lastChartPoint[1]} r="9" fill="#ffe28c" />
          </svg>
          {playerPortrait(player.id) ? (
            <img className="player-card__portrait" src={playerPortrait(player.id)} alt={`${player.name} portrait`} />
          ) : (
            <div className="player-card__monogram" aria-hidden="true">{player.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
          )}
          <div className="player-card__photo-label">{player.team} <span>◆</span> {player.position}</div>
          <div className="player-card__ribbon"><span>{player.signal}</span><strong>{player.trend.toUpperCase()}</strong></div>
        </div>
        <div className="player-card__footer">
          <div><span>UNDERLYING VALUE</span><strong>{fmtValue(player.fantasyValue)}</strong></div>
          <div><span>PROJECTED PPG</span><strong>{player.predictedPPG.toFixed(1)}</strong></div>
          <div><span>VALUE TREND</span><strong>{player.valueDeltaPct > 0 ? '+' : ''}{player.valueDeltaPct.toFixed(1)}%</strong></div>
          <div className="player-card__actions"><WatchButton id={player.id} withLabel /><Link href={`/compare?ids=${player.id}`} className="inline-flex items-center gap-1.5 rounded-md border border-white/30 px-2.5 py-1.5 text-[13px] font-medium hover:bg-white/15"><GitCompare className="size-4" /> Compare</Link></div>
        </div>
      </section>

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
