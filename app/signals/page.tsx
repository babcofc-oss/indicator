import { signalFeed } from '@/lib/data'
import { getLivePlayers, isAvailable } from '@/lib/live-players'
import { SignalsFeed } from '@/components/signals-feed'

export const metadata = {
  title: 'Signals — THE INDICATOR',
}

export default async function SignalsPage() {
  const players = await getLivePlayers()
  const playerMap = Object.fromEntries(players.map((p) => [p.id, p]))
  const feed = signalFeed.filter((event) => players.some((p) => p.id === event.playerId && isAvailable(p)))
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">Signals</h1>
        <p className="text-[13px] text-muted-foreground">
          Sample signals showing how value changes could appear with verified data.
        </p>
      </div>
      <SignalsFeed feed={feed} playerMap={playerMap} />
    </div>
  )
}
