import { players } from '@/lib/data'
import { WatchlistView } from '@/components/watchlist-view'

export const metadata = {
  title: 'Watchlist — THE INDICATOR',
}

export default function WatchlistPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">Watchlist</h1>
        <p className="text-[13px] text-muted-foreground">
          Your saved assets and how their Indicator Score is moving.
        </p>
      </div>
      <WatchlistView allPlayers={players} />
    </div>
  )
}
