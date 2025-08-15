export const oauthConfig = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/oauth/google/callback',
    scopes: ['openid', 'email', 'profile'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
  },
  facebook: {
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/oauth/facebook/callback',
    scopes: ['email', 'public_profile'],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me'
  }
}

export function validateOAuthConfig() {
  const errors: string[] = []

  if (!oauthConfig.google.clientId) {
    errors.push('GOOGLE_CLIENT_ID is not configured')
  }
  if (!oauthConfig.google.clientSecret) {
    errors.push('GOOGLE_CLIENT_SECRET is not configured')
  }
  if (!oauthConfig.facebook.appId) {
    errors.push('FACEBOOK_APP_ID is not configured')
  }
  if (!oauthConfig.facebook.appSecret) {
    errors.push('FACEBOOK_APP_SECRET is not configured')
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    errors.push('NEXT_PUBLIC_APP_URL is not configured')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
