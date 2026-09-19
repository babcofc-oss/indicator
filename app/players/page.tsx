import { players } from '@/lib/data'
import { PlayersExplorer } from '@/components/players-explorer'

export const metadata = {
  title: 'Players — THE INDICATOR',
}

export default function PlayersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">Players</h1>
        <p className="text-[13px] text-muted-foreground">
          Every tracked asset, ranked by Indicator Score. Search, filter and sort.
        </p>
      </div>
      <PlayersExplorer allPlayers={players} />
    </div>
  )
}
