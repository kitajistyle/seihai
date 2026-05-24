import { NextResponse, type NextRequest } from 'next/server'

const MAIN_DOMAIN = 'seisai.vercel.app'
const ADMIN_DOMAIN = 'seihai-admin.vercel.app'

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

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

  // /api/* の認証
  if (url.pathname.startsWith('/api/')) {
    const key = req.headers.get('x-api-key')
    if (!key || key !== process.env.API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // /admin の書き込み操作のみ Basic Auth
  if (url.pathname.startsWith('/admin') && MUTATION_METHODS.includes(req.method)) {
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
    const decoded = atob(authValue)
    const colonIndex = decoded.indexOf(':')
    const user = decoded.slice(0, colonIndex)
    const password = decoded.slice(colonIndex + 1)

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|seisai-bg.jpg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
