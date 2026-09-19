import { players } from '@/lib/data'
import { CompareTool } from '@/components/compare-tool'

export const metadata = {
  title: 'Compare — THE INDICATOR',
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids } = await searchParams
  const initialIds = ids ? ids.split(',').filter(Boolean) : []

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-mono text-lg font-bold tracking-tight text-foreground">Compare</h1>
        <p className="text-[13px] text-muted-foreground">
          Stack 2–4 players side by side across the metrics that move value.
        </p>
      </div>
      <CompareTool allPlayers={players} initialIds={initialIds} />
    </div>
  )
}
