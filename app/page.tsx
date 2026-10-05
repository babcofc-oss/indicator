import { getLivePlayers } from '@/lib/live-players'
import { getLiveSchedule } from '@/lib/live-schedule'
import { MarketTerminal } from '@/components/market-terminal'
export default async function MarketPage() {
  const [players, schedule] = await Promise.all([getLivePlayers(), getLiveSchedule()])
  const featured = [...players].sort((a,b) => Number(b.id === 'justin-herbert') - Number(a.id === 'justin-herbert'))
  return <MarketTerminal schedule={schedule} players={featured.map(({ id, name, team, position, availability, availabilityCheckedAt }) => ({ id, name, team, position, availability, availabilityCheckedAt }))} />
}
