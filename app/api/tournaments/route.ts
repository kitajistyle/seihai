import { getTournaments } from '@/lib/db/queries'

export async function GET() {
  const tournaments = await getTournaments()
  return Response.json(tournaments)
}
