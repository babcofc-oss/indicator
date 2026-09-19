// Sleeper player directory IDs, matched to the roster on 2026-09-19.
// Portraits are served by Sleeper; these are player photos, not game-action images.
const sleeperIds: Record<string, string> = {
  'caleb-douglas': '13296',
  'terry-mclaurin': '5927',
  'jahmyr-gibbs': '9221',
  'nico-collins': '7569',
  'braelon-allen': '11576',
  'jayden-reed': '10222',
  'mike-washington': '13305',
  'jordan-mason': '8408',
  'cade-otton': '8111',
  'justin-herbert': '6797',
  'ja-marr-chase': '7564',
  'jaxon-smith-njigba': '9488',
  'jaylen-wright': '11643',
  'cole-kmet': '6826',
  'rj-harvey': '12489',
  'ceedee-lamb': '6786',
  'trey-benson': '11589',
  'brian-thomas': '11631',
  'saquon-barkley': '4866',
  'michael-penix': '11559',
  'khalil-shakir': '8134',
  'kendre-miller': '9757',
}

export function sleeperPlayerId(id: string): string | undefined {
  return sleeperIds[id]
}

export function playerPortrait(id: string): string | undefined {
  const sleeperId = sleeperPlayerId(id)
  return sleeperId && `https://sleepercdn.com/content/nfl/players/${sleeperId}.jpg`
}
