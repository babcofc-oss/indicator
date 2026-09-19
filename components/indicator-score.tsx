import { scoreColor } from '@/lib/format'
import { cn } from '@/lib/utils'

export function IndicatorScore({
  score,
  size = 72,
  strokeWidth = 6,
  label = true,
}: {
  score: number
  size?: number
  strokeWidth?: number
  label?: boolean
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = scoreColor(score)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="tnum font-mono font-bold leading-none"
          style={{ color, fontSize: size * 0.3 }}
        >
          {score}
        </span>
        {label ? (
          <span
            className="mt-0.5 font-mono uppercase tracking-wider text-muted-foreground"
            style={{ fontSize: size * 0.12 }}
          >
            Score
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function ScoreBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-secondary', className)}>
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: scoreColor(value) }}
      />
    </div>
  )
}
