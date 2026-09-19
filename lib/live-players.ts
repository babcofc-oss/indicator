import { players, type Player } from '@/lib/data'
import { sleeperPlayerId } from '@/lib/player-images'
import { unstable_cache } from 'next/cache'

type SleeperPlayer = {
  status?: string | null
  injury_status?: string | null
  injury_body_part?: string | null
}

const unavailable = new Set(['IR', 'Out', 'Doubtful', 'PUP', 'NFI', 'Suspended', 'Inactive'])

// Cache only the tracked players, not Sleeper's ~19 MB directory response.
// The full directory is fetched at most once per daily cache window per deployment.
const getStatusSnapshot = unstable_cache(async () => {
  const response = await fetch('https://api.sleeper.app/v1/players/nfl', {
    cache: 'no-store',
    signal: AbortSignal.timeout(12000),
  })
  if (!response.ok) throw new Error(`Sleeper roster returned ${response.status}`)
  const directory: Record<string, SleeperPlayer> = await response.json()
  return {
    records: Object.fromEntries(players.map((player) => [player.id, directory[sleeperPlayerId(player.id) ?? ''] ?? null])) as Record<string, SleeperPlayer | null>,
    checkedAt: response.headers.get('date') ?? new Date().toUTCString(),
  }
}, ['sleeper-tracked-player-availability-v1'], { revalidate: 86400 })

export async function getLivePlayers(): Promise<Player[]> {
  let snapshot: { records: Record<string, SleeperPlayer | null>; checkedAt: string } = { records: {}, checkedAt: '' }
  try {
    snapshot = await getStatusSnapshot()
  } catch {
    // Do not publish a positive recommendation when availability cannot be checked.
  }

  return players.map((sample) => {
    const record = snapshot.records[sample.id]
    const availability = record
      ? (record.injury_status || (record.status !== 'Active' ? record.status : null) || 'Active')
      : 'Unverified'
    if (availability === 'Active') return { ...sample, availability, availabilityCheckedAt: snapshot.checkedAt }

    const isOut = unavailable.has(availability)
    const detail = record?.injury_body_part ? ` (${record.injury_body_part})` : ''
    return {
      ...sample,
      availability,
      availabilityCheckedAt: snapshot.checkedAt,
      signal: 'WATCH',
      trend: 'Stable',
      scoreDelta: 0,
      valueDeltaPct: 0,
      predictedPPG: isOut ? 0 : sample.predictedPPG,
      rationale: `${availability}${detail} per Sleeper roster status. Sample score and underlying value are not a current recommendation. Confirm availability with the team before making a roster decision.`,
      history: sample.history.map((point) => ({ ...point, value: sample.fantasyValue })),
    }
  })
}

export function isAvailable(player: Player): boolean {
  return player.availability === 'Active'
}
