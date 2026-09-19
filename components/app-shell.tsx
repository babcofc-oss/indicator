'use client'

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

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
              <Activity className="size-4 text-primary" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-mono text-[13px] font-bold tracking-[0.16em] text-foreground">
                THE INDICATOR
              </span>
              <span className="mt-0.5 text-[10px] tracking-wide text-muted-foreground">
                See the value before the market does
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
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

          <span className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[10px] font-medium tracking-wide text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            DEMO DATA
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-4 md:pb-12">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-5xl grid-cols-6">
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
