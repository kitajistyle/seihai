import { getTournamentDetail } from '@/lib/db/queries'
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tournament = await getTournamentDetail(id)
  if (!tournament) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }
  return Response.json(tournament)
}
