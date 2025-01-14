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
  
  // Ana sayfa veya public path kontrolü
  if (pathname === '/' || publicPaths.includes(pathname)) {
    // Ana sayfada token varsa feed'e yönlendir
    if (pathname === '/' && token && !isMaintenance) {
      return NextResponse.redirect(new URL('/feed', request.url));
    }
    
    // Connect sayfasında token varsa feed'e yönlendir
    if (pathname === '/connect' && token && !isMaintenance) {
      return NextResponse.redirect(new URL('/feed', request.url));
    }
    
    return NextResponse.next();
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
    '/((?!maintenance|api|_next/static|_next/image|favicon.ico).*)'
  ]
}