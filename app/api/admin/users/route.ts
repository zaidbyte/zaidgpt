import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

// GET — list all users
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, user_id, created_at, expires_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST — create a user (permanent or temporary)
export async function POST(request: NextRequest) {
  try {
    const { userId, password, expiresIn } = await request.json()

    if (!userId || !password) {
      return NextResponse.json({ error: 'User ID and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const password_hash = await bcrypt.hash(password, 12)

    // expiresIn is in hours (e.g. 24 = 1 day, 168 = 7 days). null = permanent
    let expires_at = null
    if (expiresIn) {
      expires_at = new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({ user_id: userId, password_hash, expires_at })
      .select('id, user_id, created_at, expires_at')
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'User ID already exists' }, { status: 409 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE — delete a user
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    const { error } = await supabaseAdmin.from('users').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabaseAdmin.from('sessions').delete().eq('user_id', id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
