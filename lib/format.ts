import type { SignalType, Trend } from '@/lib/data'

export function trendClass(trend: Trend): string {
  if (trend === 'Rising') return 'text-rising'
  if (trend === 'Falling') return 'text-falling'
  return 'text-stable'
}

export function trendBgClass(trend: Trend): string {
  if (trend === 'Rising') return 'bg-rising-muted text-rising'
  if (trend === 'Falling') return 'bg-falling-muted text-falling'
  return 'bg-stable-muted text-stable'
}

// Signal grouping -> tone: positive (green), negative (red), neutral (amber)
export function signalTone(signal: SignalType): 'pos' | 'neg' | 'neu' {
  switch (signal) {
    case 'STRONG BUY':
    case 'BUY':
    case 'BREAKOUT ALERT':
    case 'ROLE CHANGE':
    case 'INJURY OPPORTUNITY':
      return 'pos'
    case 'SELL':
      return 'neg'
    default:
      return 'neu'
  }
}

export function signalBadgeClass(signal: SignalType): string {
  const tone = signalTone(signal)
  if (tone === 'pos') return 'bg-rising-muted text-rising border-rising/30'
  if (tone === 'neg') return 'bg-falling-muted text-falling border-falling/30'
  return 'bg-stable-muted text-stable border-stable/30'
}

export function scoreColor(score: number): string {
  if (score >= 75) return 'var(--rising)'
  if (score >= 55) return 'var(--stable)'
  if (score >= 40) return 'oklch(0.75 0.13 55)'
  return 'var(--falling)'
}

export function scoreTextClass(score: number): string {
  if (score >= 75) return 'text-rising'
  if (score >= 55) return 'text-stable'
  return 'text-falling'
}

export function fmtValue(v: number): string {
  return v.toFixed(1)
}

export function fmtPct(v: number): string {
  const sign = v > 0 ? '+' : ''
  return `${sign}${v.toFixed(1)}%`
}

export function fmtDelta(v: number): string {
  const sign = v > 0 ? '+' : ''
  return `${sign}${v}`
}

export function positionAccent(position: string): string {
  switch (position) {
    case 'QB':
      return 'text-chart-5'
    case 'RB':
      return 'text-chart-4'
    case 'WR':
      return 'text-primary'
    case 'TE':
      return 'text-chart-3'
    default:
      return 'text-muted-foreground'
  }
}
