import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const MAIN_DOMAIN = 'seihai-esports.vercel.app'
const ADMIN_DOMAIN = 'seihai-admin.vercel.app'

export async function proxy(req: NextRequest) {
  const url = req.nextUrl
  const host = req.headers.get('host') ?? ''

  const isAdminDomain = host === ADMIN_DOMAIN
  const isMainDomain = host === MAIN_DOMAIN

  // admin ドメイン: ルートへのアクセスは /admin にリダイレクト
  if (isAdminDomain && url.pathname === '/') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // メインドメイン: /admin へのアクセスは admin ドメインにリダイレクト
  if (isMainDomain && url.pathname.startsWith('/admin')) {
    return NextResponse.redirect(
      new URL(url.pathname + url.search, `https://${ADMIN_DOMAIN}`)
    )
  }

  // Basic Auth for /admin
  if (url.pathname.startsWith('/admin')) {
    const authHeader = req.headers.get('authorization')

    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="seihai-esports Admin"',
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
          'WWW-Authenticate': 'Basic realm="seihai-esports Admin"',
        },
      })
    }
  }

  // Supabase session update
  return await updateSession(req)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|logo.jpg|icon.jpg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
