import { getLivePlayers } from '@/lib/live-players'
import { MarketTerminal } from '@/components/market-terminal'
export default async function MarketPage() {
  const players = await getLivePlayers()
  const featured = [...players].sort((a,b) => Number(b.id === 'justin-herbert') - Number(a.id === 'justin-herbert'))
  return <MarketTerminal players={featured} />
}
