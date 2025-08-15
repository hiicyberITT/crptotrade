import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signToken } from '@/lib/auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/oauth/google/callback'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      const errorMessage = error === 'access_denied' ? 'oauth_cancelled' : 'oauth_error'
      return NextResponse.redirect(
        new URL(`/auth/enhanced?error=${errorMessage}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/auth/enhanced?error=oauth_invalid_request', request.url)
      )
    }

    // Verify state for CSRF protection
    const storedState = cookies().get('oauth_state')?.value
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/auth/enhanced?error=oauth_state_mismatch', request.url)
      )
    }

    // Clear state cookie
    cookies().delete('oauth_state')

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens')
    }

    const tokens = await tokenResponse.json()

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const googleUser = await userResponse.json()

    // Mock user creation/login logic
    const user = {
      id: `google_${googleUser.id}`,
      email: googleUser.email,
      name: googleUser.name,
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      avatar: googleUser.picture,
      role: 'user' as const,
      isVerified: googleUser.verified_email,
      provider: 'google',
      createdAt: new Date()
    }

    // Create JWT token
    const jwtToken = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      provider: 'google'
    })

    // Set auth cookie
    cookies().set('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    })

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/', request.url))

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/auth/enhanced?error=oauth_callback_failed', request.url)
    )
  }
}
