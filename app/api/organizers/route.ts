import { getOrganizers } from '@/lib/db/queries'

export async function GET() {
  const organizers = await getOrganizers()
  return Response.json(organizers)
}
