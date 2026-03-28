import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  
  // Basic Auth for /admin
  if (url.pathname.startsWith('/admin')) {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }

    const authValue = authHeader.split(' ')[1]
    const [user, password] = atob(authValue).split(':')

    if (
      user !== process.env.ADMIN_USER ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }
  }

  // Supabase session update
  return await updateSession(req)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - logo.jpg (logo image)
     * - icon.jpg (favicon image)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|logo.jpg|icon.jpg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
