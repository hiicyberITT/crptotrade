import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/oauth/google/callback'

export async function GET(request: NextRequest) {
  try {
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 })
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex')
    
    // Store state in cookie
    cookies().set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600 // 10 minutes
    })

    // Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      state: state,
      access_type: 'offline',
      prompt: 'consent'
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    return NextResponse.redirect(authUrl)

  } catch (error) {
    console.error('Google OAuth initiation error:', error)
    return NextResponse.redirect(
      new URL('/auth/enhanced?error=oauth_init_failed', request.url)
    )
  }
}
