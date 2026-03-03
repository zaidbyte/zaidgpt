import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Allow login pages through unconditionally ───────────────────────────
  if (pathname === '/login') return NextResponse.next()
  if (pathname === '/admin/login') return NextResponse.next()

  // ── Admin route protection ──────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session')?.value
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // ── Main chat route protection ──────────────────────────────────────────
  if (pathname === '/') {
    const userSession = request.cookies.get('user_session')?.value
    if (!userSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*'],
}
