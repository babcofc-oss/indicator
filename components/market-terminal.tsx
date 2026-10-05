'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { Player } from '@/lib/data'
import { playerPortrait } from '@/lib/player-images'

export function MarketTerminal({ players }: { players: Player[] }) {
  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState('ALL')
  const [search, setSearch] = useState('')
  const [failedPhotos, setFailedPhotos] = useState<string[]>([])
  const [searchHost, setSearchHost] = useState<HTMLElement | null>(null)
  useEffect(() => { setSearchHost(document.getElementById('terminal-search')) }, [])
  const searchField = <input aria-label="Search players" placeholder="Search players, teams…" value={search} onChange={e => setSearch(e.target.value)} />
  const player = players[index]
  const actionPhoto = player?.id === 'justin-herbert'
  const photo = actionPhoto ? '/justin-herbert-2021.jpg' : player && playerPortrait(player.id)
  const filtered = players.filter(p => (position === 'ALL' || p.position === position) && `${p.name} ${p.team}`.toLowerCase().includes(search.toLowerCase()))
  const cycle = (step: number) => setIndex(current => players.length ? (current + step + players.length) % players.length : 0)
  return <div className="terminal">
    <div className="terminal-status"><span>PUBLIC PREVIEW</span><span>Verified roster · Scores & signals awaiting usage evidence</span></div>
    {searchHost ? createPortal(searchField, searchHost) : <div className="search-fallback">{searchField}</div>}
    <div className="terminal-grid">
      <section className="terminal-panel market-list"><h1>MARKET <span>WATCHED PLAYERS</span></h1>
        <div className="position-tabs">{['ALL','QB','RB','WR','TE'].map(p => <button key={p} aria-pressed={position === p} onClick={() => setPosition(p)}>{p}</button>)}</div>
        <h2 className="up">↗ TRENDING UP</h2><p className="empty-note">No verified risers. Role-change evidence required.</p>
        <h2 className="down">↘ TRENDING DOWN</h2><p className="empty-note">No verified fallers. Scoring variance alone is insufficient.</p>
        <div className="market-head"><span>#</span><span>PLAYER</span><span>POS</span><span>TEAM</span><span>IND</span></div>
        {filtered.map((p, rank) => <button className="market-player" key={p.id} onClick={() => setIndex(players.findIndex(item => item.id === p.id))} aria-pressed={p.id === player?.id} title={`${p.name} · ${p.availability || 'UNKNOWN'}`}><span className="market-rank">{rank + 1}</span><strong>{p.name}<small className={p.availability === 'Active' ? 'status-active' : ''}>{p.availability || 'UNKNOWN'}</small></strong><span className="market-position">{p.position}</span><span className="market-team">{p.team}</span><span className="unknown">—</span></button>)}
        {!filtered.length && <p className="empty-note">No matching players.</p>}
      </section>
      <div className="feature-column">
        <div className="feature-controls"><span>FEATURED PLAYER</span><div><button aria-label="Previous featured player" disabled={!players.length} onClick={() => cycle(-1)}>‹</button><button aria-label="Next featured player" disabled={!players.length} onClick={() => cycle(1)}>›</button></div></div>
        {player ? <Link className="terminal-card" href={`/players/${player.id}`} aria-label={`Open ${player.name} profile`}>
          <div className="card-name"><span className="card-crest">{player.team}</span><div><h2>{player.name}</h2><p>{player.position} · {player.team}</p></div><span className="card-edition">NFL<br/>PLAYER</span></div>
          <div className="card-art"><div className="card-chart-grid" /><span className="chart-pending">UNDERLYING VALUE · UNKNOWN</span>
            {photo && !failedPhotos.includes(player.id) ? <img className={actionPhoto ? "game-photo" : undefined} src={photo} alt={`${player.name}${actionPhoto ? " in uniform, September 2021" : " portrait"}`} onError={() => setFailedPhotos(previous => [...previous,player.id])} /> : <div className="portrait-fallback">{player.name.split(' ').map(n=>n[0]).join('')}</div>}
            <span className="card-position">{player.position}<small>{player.team}</small></span><div className="card-ribbon"><span>UNDERLYING VALUE</span><span>OPPORTUNITY</span><span>UNRATED</span></div>
          </div><div className="card-brand">★ ★ ★ &nbsp; THE INDICATOR &nbsp; ★ ★ ★</div>
        </Link> : <div className="terminal-panel empty-note">Player directory unavailable. No roster claims published.</div>}
        {actionPhoto && <p className="photo-credit">2021 photo: <a href="https://commons.wikimedia.org/wiki/File:Justin_Herbert_2021.jpg">All-Pro Reels</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a> · display crop</p>}
        <section className="terminal-panel news"><h2>RECENT NEWS & NOTES</h2><p>No sourced news available yet.</p><p className="muted">Roster identity and availability are observed data. Projections and Indicator analysis remain unpublished.</p>{player?.availabilityCheckedAt && <small>Sleeper roster checked: {player.availabilityCheckedAt}</small>}</section>
      </div>
      <div className="intelligence-column"><section className="terminal-panel intelligence"><h2>PLAYER INTELLIGENCE</h2><h3>{player?.name || 'UNKNOWN'}</h3><p className="muted">{player?.position} · {player?.team}</p>
        <div className="score-box"><div><small>INDICATOR SCORE</small><strong>UNKNOWN</strong></div><div><small>TREND</small><b>UNRATED</b></div></div>
        <div className="intelligence-tabs"><span className="overview-active">Overview</span><span>OBSERVED DATA</span></div>
        <dl className="intelligence-primary">{['Projected PPG','Opportunity','Target share','Carry share'].map(label=><div key={label}><dt>{label}</dt><dd>UNKNOWN</dd></div>)}</dl>
        <div className="value-empty"><span>UNDERLYING VALUE HISTORY</span><p>Awaiting verified observations</p><div className="history-axis"><span>WEEKLY OPPORTUNITY</span><span>NO DATA</span></div></div>
        <div className="intelligence-detail-grid"><section><h4>NEXT GAMES</h4><dl>{['Matchup','Upcoming schedule','Injury environment'].map(label=><div key={label}><dt>{label}</dt><dd>UNKNOWN</dd></div>)}</dl></section><section><h4>SEASON OUTLOOK</h4><dl>{['Position rank','Score movement','Usage / snaps','Rest-of-season'].map(label=><div key={label}><dt>{label}</dt><dd>UNKNOWN</dd></div>)}</dl></section></div>
        <div className="availability-line"><span>ROSTER AVAILABILITY</span><strong>{player?.availability || 'UNKNOWN'}</strong></div>
        <p className="empty-note">Signals withheld until role changes and availability are verified.</p>
      </section><section className="terminal-panel news"><h2>LATEST SIGNALS</h2><p>Signals withheld — insufficient verified evidence.</p><Link href="/signals">Open signal feed</Link></section></div>
    </div>
  </div>
}
