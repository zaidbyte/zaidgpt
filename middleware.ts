import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Admin route protection ──────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value

    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify the token is a valid Supabase session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user }, error } = await supabase.auth.getUser(adminToken)

    if (error || !user) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_token')
      return response
    }

    return NextResponse.next()
  }

  // ── Main chat route protection ──────────────────────────────────────────
  if (pathname === '/') {
    const userSession = request.cookies.get('user_session')?.value

    if (!userSession) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Validate session exists and isn't expired (quick check via cookie value)
    // Full validation happens in the API routes
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/admin/:path*'],
}
