import { players, signalFeed } from '@/lib/data'
import { SignalsFeed } from '@/components/signals-feed'

export const metadata = {
  title: 'Signals — THE INDICATOR',
}

const playerMap = Object.fromEntries(players.map((p) => [p.id, p]))

export default function SignalsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">Signals</h1>
        <p className="text-[13px] text-muted-foreground">
          Sample signals showing how value changes could appear with verified data.
        </p>
      </div>
      <SignalsFeed feed={signalFeed} playerMap={playerMap} />
    </div>
  )
}
