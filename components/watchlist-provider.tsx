'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'

type WatchlistContextValue = {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  ready: boolean
}

const STORAGE_KEY = 'indicator.watchlist.v1'
const DEFAULT_IDS = ['caleb-douglas', 'terry-mclaurin', 'mike-washington']

const WatchlistContext = createContext<WatchlistContextValue | null>(null)

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(DEFAULT_IDS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setIds(JSON.parse(raw))
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // ignore
    }
  }, [ids, ready])

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const has = useCallback((id: string) => ids.includes(id), [ids])

  return (
    <WatchlistContext.Provider value={{ ids, has, toggle, ready }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
