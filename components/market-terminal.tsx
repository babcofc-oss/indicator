'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Player } from '@/lib/data'
import { playerPortrait } from '@/lib/player-images'

export function MarketTerminal({ players }: { players: Player[] }) {
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState('ALL')
  const [search, setSearch] = useState('')
  const [failedPhotos, setFailedPhotos] = useState<string[]>([])
  const player = players[index]
  const filtered = players.filter(p => (position === 'ALL' || p.position === position) && p.name.toLowerCase().includes(search.toLowerCase()))
  const cycle = (step: number) => setIndex((index + step + players.length) % players.length)
  return <div className="terminal">
    <div className="terminal-status"><span>PLAYER INTELLIGENCE / PUBLIC PREVIEW</span><span>Scores & signals awaiting verified usage data</span></div>
    <div className="terminal-grid">
      <section className="terminal-panel market-list"><h1>MARKET <span>WATCHED PLAYERS</span></h1>
        <input aria-label="Search players" placeholder="Search players…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="position-tabs">{['ALL','QB','RB','WR','TE'].map(p => <button key={p} aria-pressed={position === p} onClick={() => setPosition(p)}>{p}</button>)}</div>
        <h2 className="up">↗ TRENDING UP</h2><p className="empty-note">No verified risers. Role-change evidence required.</p>
        <h2 className="down">↘ TRENDING DOWN</h2><p className="empty-note">No verified fallers. Scoring variance alone is insufficient.</p>
        <div className="market-head"><span>PLAYER / TEAM</span><span>IND</span></div>
        {filtered.map(p => <button className="market-player" key={p.id} onClick={() => setIndex(players.findIndex(item => item.id === p.id))} aria-pressed={p.id === player?.id}><span><strong>{p.name}</strong><small>{p.position} · {p.team} · {p.availability || 'UNKNOWN'}</small></span><span className="unknown">—</span></button>)}
        {!filtered.length && <p className="empty-note">No matching players.</p>}
      </section>
      <div className="feature-column">
        <div className="feature-controls"><span>FEATURED PLAYER</span><div><button aria-label="Previous featured player" disabled={!players.length} onClick={() => cycle(-1)}>‹</button><button aria-label="Next featured player" disabled={!players.length} onClick={() => cycle(1)}>›</button></div></div>
        {player ? <Link className="terminal-card" href={`/players/${player.id}`} aria-label={`Open ${player.name} profile`}>
          <div className="card-name"><span className="card-crest">{player.team}</span><div><h2>{player.name}</h2><p>{player.position} · {player.team}</p></div><span className="card-edition">NFL<br/>PLAYER</span></div>
          <div className="card-art"><div className="card-chart-grid" /><span className="chart-pending">UNDERLYING VALUE · UNKNOWN</span>
            {playerPortrait(player.id) && !failedPhotos.includes(player.id) ? <img src={playerPortrait(player.id)} alt={`${player.name} portrait`} onError={() => setFailedPhotos(previous => [...previous,player.id])} /> : <div className="portrait-fallback">{player.name.split(' ').map(n=>n[0]).join('')}</div>}
            <span className="card-position">{player.position}<small>{player.team}</small></span><div className="card-ribbon">AWAITING<br/>VERIFIED<br/>SIGNAL</div>
          </div><div className="card-brand">★ ★ ★ &nbsp; THE INDICATOR &nbsp; ★ ★ ★</div>
        </Link> : <div className="terminal-panel empty-note">Player directory unavailable. No roster claims published.</div>}
        <section className="terminal-panel news"><h2>RECENT NEWS & NOTES</h2><p>No sourced news available yet.</p><p className="muted">Roster identity and availability are observed data. Projections and Indicator analysis remain unpublished.</p>{player?.availabilityCheckedAt && <small>Sleeper roster checked: {player.availabilityCheckedAt}</small>}</section>
      </div>
      <div className="intelligence-column"><section className="terminal-panel intelligence"><h2>PLAYER INTELLIGENCE</h2><h3>{player?.name || 'UNKNOWN'}</h3><p className="muted">{player?.position} · {player?.team}</p>
        <div className="score-box"><div><small>INDICATOR SCORE</small><strong>UNKNOWN</strong></div><div><small>TREND</small><b>UNRATED</b></div></div>
        <div className="intelligence-tabs">OVERVIEW <span>OBSERVED DATA</span></div>
        <dl>{['Score movement','Position rank','Projected fantasy points','Opportunity momentum','Usage / snap share','Target / carry share','Matchup','Upcoming schedule','Rest-of-season outlook'].map(label=><div key={label}><dt>{label}</dt><dd>UNKNOWN</dd></div>)}<div><dt>Roster availability</dt><dd>{player?.availability || 'UNKNOWN'}</dd></div><div><dt>Injury environment</dt><dd>UNKNOWN</dd></div></dl>
        <div className="value-empty"><span>UNDERLYING VALUE HISTORY</span><p>Awaiting verified observations</p></div>
        <p className="empty-note">No bullish or bearish recommendation is issued without verified opportunity changes and current availability.</p>
      </section><section className="terminal-panel news"><h2>LATEST SIGNALS</h2><p>Signals withheld — insufficient verified evidence.</p><Link href="/signals">Open signal feed</Link></section></div>
    </div>
  </div>
}
