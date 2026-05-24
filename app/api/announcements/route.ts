import { getAnnouncements } from '@/lib/db/queries'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const activeOnly = request.nextUrl.searchParams.get('active') === 'true'
  const announcements = await getAnnouncements(activeOnly)
  return Response.json(announcements)
}
