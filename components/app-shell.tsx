'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, GitCompare, LineChart, Radio, Shield, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Market', icon: Activity },
  { href: '/players', label: 'Players', icon: LineChart },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/handcuffs', label: 'Handcuffs', icon: Shield },
  { href: '/signals', label: 'Signals', icon: Radio },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const home = pathname === '/'
  const viewportRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState({ scale: 1, height: 760 })
  useEffect(() => {
    if (!home || !viewportRef.current || !stageRef.current) return
    const measure = () => {
      const style = getComputedStyle(viewportRef.current!)
      const width = viewportRef.current!.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      const scale = Math.min(1, width / 1120)
      setFrame({ scale, height: stageRef.current!.scrollHeight * scale })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(viewportRef.current)
    observer.observe(stageRef.current)
    measure()
    return () => observer.disconnect()
  }, [home])

  return (
    <div ref={viewportRef} className={cn("min-h-dvh indicator-shell", home && "reference-home")}><div className="reference-frame" style={home ? { height: frame.height } : undefined}><div ref={stageRef} className="reference-stage" style={home ? { transform: `scale(${frame.scale})` } : undefined}>
      {/* Header */}
      <header className="shell-header sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="shell-header-inner mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3">
          <Link href="/" className="shell-brand flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
              <Activity className="size-4 text-primary" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-mono text-[13px] font-bold tracking-[0.16em] text-foreground">
                THE INDICATOR
              </span>
              <span className="mt-0.5 text-[10px] tracking-wide text-muted-foreground">
                FANTASY FOOTBALL. REAL INTELLIGENCE.
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="shell-nav hidden items-center gap-1 md:flex">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </Link>
              )
            })}
          </nav>

          {pathname === '/' ? <div id="terminal-search" /> : <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium tracking-wide text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            DEMO ANALYTICS
          </span>}
        </div>
      </header>

      {/* Main */}
      <main className="shell-main mx-auto max-w-[1440px] px-4 pb-28 pt-4 md:pb-12">{pathname !== '/' && <div role="note" className="mb-4 border border-amber-400/50 bg-amber-400/10 p-4 text-sm text-amber-200"><strong>DEMO ANALYTICS —</strong> Scores, rankings, projections, charts, depth charts and signals on this screen are illustrative. They are not verified and must not be used for roster decisions.</div>}{children}</main>

      </div></div>
      {/* Mobile bottom nav */}
      <nav className={cn(home && "home-bottom-nav", "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md md:hidden")}>
        <div className="mx-auto grid max-w-[1440px] grid-cols-6">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
