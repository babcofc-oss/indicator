'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useWatchlist } from '@/components/watchlist-provider'
import { cn } from '@/lib/utils'

export function WatchButton({
  id,
  className,
  withLabel = false,
}: {
  id: string
  className?: string
  withLabel?: boolean
}) {
  const { has, toggle } = useWatchlist()
  const active = has(id)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from watchlist' : 'Add to watchlist'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md transition-colors',
        withLabel
          ? 'border border-border px-2.5 py-1.5 text-[13px] font-medium hover:bg-secondary'
          : 'p-1.5 hover:bg-secondary',
        active ? 'text-primary' : 'text-muted-foreground',
        className,
      )}
    >
      {active ? (
        <BookmarkCheck className="size-4" strokeWidth={2.4} />
      ) : (
        <Bookmark className="size-4" />
      )}
      {withLabel ? <span>{active ? 'Watching' : 'Watch'}</span> : null}
    </button>
  )
}
