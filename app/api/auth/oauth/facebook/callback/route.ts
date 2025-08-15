import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { signToken } from '@/lib/auth'

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET
const FACEBOOK_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/oauth/facebook/callback'

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

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: FACEBOOK_APP_ID!,
        client_secret: FACEBOOK_APP_SECRET!,
        code,
        redirect_uri: FACEBOOK_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for access token')
    }

    const tokens = await tokenResponse.json()

    // Get user info from Facebook
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture&access_token=${tokens.access_token}`
    )

    if (!userResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const facebookUser = await userResponse.json()

    // Check if email is available
    if (!facebookUser.email) {
      return NextResponse.redirect(
        new URL('/auth/enhanced?error=email_not_provided', request.url)
      )
    }

    // Mock user creation/login logic
    const user = {
      id: `facebook_${facebookUser.id}`,
      email: facebookUser.email,
      name: facebookUser.name,
      firstName: facebookUser.first_name,
      lastName: facebookUser.last_name,
      avatar: facebookUser.picture?.data?.url,
      role: 'user' as const,
      isVerified: true, // Facebook emails are considered verified
      provider: 'facebook',
      createdAt: new Date()
    }

    // Create JWT token
    const jwtToken = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      provider: 'facebook'
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
    console.error('Facebook OAuth callback error:', error)
    return NextResponse.redirect(
      new URL('/auth/enhanced?error=oauth_callback_failed', request.url)
    )
  }
}
