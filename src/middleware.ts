import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Bakım modu kontrolü
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'
  if (isMaintenance) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  // Public routes - her zaman erişilebilir
  const publicPaths = ['/connect', '/feed', '/faq']
  
  // Eğer token varsa ve /connect veya / sayfalarındaysa yönlendir
  if (token) {
    if (pathname === '/connect' || pathname === '/') {
      console.log(`Redirecting from ${pathname} to /feed because token exists`)
      const response = NextResponse.redirect(new URL('/feed', request.url))
      return response
    }
  }

  // Public path'lere her zaman izin ver
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Önemli: Config'i düzgün ayarla
export const config = {
  matcher: [
    '/',
    '/connect',
    '/feed',
    '/profile/:path*',
    '/add-credit/:path*',
    '/faq',
    '/((?!api|_next/static|_next/image|maintenance|favicon.ico).*)'
  ]
}