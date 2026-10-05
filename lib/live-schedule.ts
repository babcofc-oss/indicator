import { unstable_cache } from 'next/cache'

export type UpcomingGame = { id: string; opponent: string; home: boolean; date: string; dateLabel: string; sourceUrl: string }
export type ScheduleSnapshot = { byTeam: Record<string, UpcomingGame[]>; checkedAt: string }

type Competitor = { homeAway?: string; team?: { abbreviation?: string } }
type ESPNEvent = { id?: string; date?: string; season?: { year?: number; type?: number }; links?: { href?: string }[]; competitions?: { timeValid?: boolean; competitors?: Competitor[]; status?: { type?: { name?: string } } }[] }

const normalize = (team: string) => team === 'WSH' ? 'WAS' : team
export function parseUpcomingGames(events: ESPNEvent[], now: number): Record<string, UpcomingGame[]> {
  const byTeam: Record<string, UpcomingGame[]> = {}
  const seen = new Set<string>()
  for (const event of [...events].sort((a,b) => Date.parse(a.date ?? '') - Date.parse(b.date ?? ''))) {
    const date = Date.parse(event.date ?? '')
    const competition = event.competitions?.[0]
    const competitors = competition?.competitors
    if (!event.id || seen.has(event.id) || !Number.isFinite(date) || date <= now || event.season?.type !== 2 || competitors?.length !== 2 || /CANCEL|POSTPON/i.test(competition?.status?.type?.name ?? '')) continue
    const sourceUrl = event.links?.find(link => link.href?.startsWith('https://www.espn.com/'))?.href
    if (!sourceUrl || !competitors.every(c => c.team?.abbreviation && ['home','away'].includes(c.homeAway ?? ''))) continue
    seen.add(event.id)
    for (let i=0; i<2; i++) {
      const team = normalize(competitors[i].team!.abbreviation!)
      const games = byTeam[team] ??= []
      if (games.length < 4) games.push({ id: event.id, opponent: normalize(competitors[1-i].team!.abbreviation!), home: competitors[i].homeAway === 'home', date: new Date(date).toISOString(), dateLabel: competition?.timeValid ? new Intl.DateTimeFormat('en-US', {month:'short',day:'numeric',timeZone:'America/New_York'}).format(date) : 'TBD', sourceUrl })
    }
  }
  return byTeam
}

// Cache the compact parsed schedule; the source response exceeds Next's 2 MB fetch-cache limit.
const getScheduleSnapshot = unstable_cache(async (): Promise<ScheduleSnapshot> => {
  const now = new Date()
  const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${now.getUTCFullYear()}&limit=1000`, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
  if (!response.ok) throw new Error(`ESPN schedule returned ${response.status}`)
  const data: { events?: ESPNEvent[] } = await response.json()
  if (!Array.isArray(data.events)) throw new Error('ESPN schedule events missing')
  return { byTeam: parseUpcomingGames(data.events, now.getTime()), checkedAt: response.headers.get('date') ?? now.toUTCString() }
}, ['espn-upcoming-nfl-schedule-v1'], { revalidate: 3600 })

export async function getLiveSchedule(): Promise<ScheduleSnapshot> {
  try {
    const snapshot = await getScheduleSnapshot()
    return { ...snapshot, byTeam: Object.fromEntries(Object.entries(snapshot.byTeam).map(([team,games]) => [team,games.filter(game => Date.parse(game.date) > Date.now())])) }
  } catch { return { byTeam: {}, checkedAt: '' } }
}
