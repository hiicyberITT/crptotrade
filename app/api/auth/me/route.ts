import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Mock user data - in real app, fetch from database
    const users = [
      {
        id: '1',
        email: 'admin@btcexchange.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        balance: {
          BTC: 1.5,
          ETH: 10.2,
          USD: 50000,
          USDT: 25000
        }
      },
      {
        id: '2',
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        balance: {
          BTC: 0.25,
          ETH: 2.5,
          USD: 5000,
          USDT: 3000
        }
      }
    ]

    const user = users.find(u => u.id === payload.userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        walletAddress: user.walletAddress,
        balance: user.balance
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
