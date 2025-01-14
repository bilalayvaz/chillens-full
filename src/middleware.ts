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

  // Eğer token varsa ve kullanıcı / veya /connect'e gitmeye çalışıyorsa
  // sadece yönlendirme yap, cookie'lere dokunma
  if (token && (pathname === '/connect' || pathname === '/')) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  // Public routes - her zaman erişilebilir
  const publicPaths = ['/connect', '/feed', '/faq']
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

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