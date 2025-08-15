import { NextRequest, NextResponse } from 'next/server'
import { signToken, verifyPassword } from '@/lib/auth'

// Mock user storage (should match the one in register route)
const users: Array<{
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  isVerified: boolean
  walletAddress: string
  createdAt: Date
}> = [
  // Demo accounts
  {
    id: 'demo_user_1',
    email: 'demo@example.com',
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // SHA256 of 'password123'
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    isVerified: true,
    walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    createdAt: new Date()
  },
  {
    id: 'admin_user_1',
    email: 'admin@example.com',
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // SHA256 of 'password123'
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isVerified: true,
    walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    createdAt: new Date()
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Create user object for response (without password)
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isVerified: user.isVerified,
      walletAddress: user.walletAddress,
      balance: {
        BTC: 0.001,
        USD: 100.00,
        ETH: 0.01,
        USDT: 50.00
      }
    }

    // Create response
    const response = NextResponse.json({
      message: 'Login successful',
      user: userResponse,
      token
    })

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 * 7 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}
