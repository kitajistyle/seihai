import { NextResponse, type NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/api/')) {
    const key = req.headers.get('x-api-key')
    if (!key || key !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
  if (pathname.startsWith('/admin') && MUTATION_METHODS.includes(req.method)) {
    const authHeader = req.headers.get('authorization')

    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      })
    }

    const [user, password] = atob(authHeader.split(' ')[1]).split(':')
    if (user !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
