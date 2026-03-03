import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return NextResponse.json({ error: 'User ID and password are required' }, { status: 400 })
    }

    // Check against environment variables
    const validUserId = process.env.ADMIN_USER_ID
    const validPassword = process.env.ADMIN_PASSWORD

    if (userId !== validUserId || password !== validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create a simple session token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
