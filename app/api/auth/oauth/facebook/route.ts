import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/oauth/facebook/callback'

export async function GET(request: NextRequest) {
  try {
    if (!FACEBOOK_APP_ID) {
      return NextResponse.json({ error: 'Facebook OAuth not configured' }, { status: 500 })
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

    // Build Facebook OAuth URL
    const params = new URLSearchParams({
      client_id: FACEBOOK_APP_ID,
      redirect_uri: FACEBOOK_REDIRECT_URI,
      response_type: 'code',
      scope: 'email,public_profile',
      state: state
    })

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
    
    return NextResponse.redirect(authUrl)

  } catch (error) {
    console.error('Facebook OAuth initiation error:', error)
    return NextResponse.redirect(
      new URL('/auth/enhanced?error=oauth_init_failed', request.url)
    )
  }
}
