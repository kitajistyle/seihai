import { getReports } from '@/lib/db/queries'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit') ?? '20')
  const reports = await getReports(limit)
  return Response.json(reports)
}
