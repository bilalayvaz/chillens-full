import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Middleware running');
  console.log('Maintenance mode:', process.env.NEXT_PUBLIC_MAINTENANCE_MODE);
  console.log('Current path:', request.nextUrl.pathname);
  
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Bakım modu kontrolü
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'
  if (isMaintenance) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  // Public routes - her zaman erişilebilir
  const publicPaths = ['/connect', '/feed', '/faq']
  if (publicPaths.includes(pathname)) {
    // Connect sayfasında token varsa feed'e yönlendir
    if (pathname === '/connect' && token && !isMaintenance) {
      return NextResponse.redirect(new URL('/feed', request.url));
    }
    return NextResponse.next();
  }
  
  // Korumalı rotalar kontrolü
  const protectedPaths = ['/profile', '/add-credit']
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath && !token && !isMaintenance) {
    // URL'i sakla ve connect sayfasına yönlendir
    const url = new URL('/connect', request.url)
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  
  return response
}

export const config = {
  matcher: [
  '/((?!maintenance|api|_next/static|_next/image|favicon.ico).*)',
  ]
}
