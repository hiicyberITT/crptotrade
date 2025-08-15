import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { code, secret } = await request.json()

    // Validate input
    if (!code || !secret) {
      return NextResponse.json({ error: 'Code and secret are required' }, { status: 400 })
    }

    // Mock TOTP verification (in real app, use libraries like speakeasy)
    const validCodes = ['123456', '654321', '111111']
    
    if (!validCodes.includes(code)) {
      return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 })
    }

    // In real app, save 2FA secret to user profile in database
    console.log(`2FA enabled for user: ${user.id}`)

    // Generate backup codes
    const backupCodes = Array.from({ length: 6 }, () => 
      Math.random().toString(36).substring(2, 6) + '-' + 
      Math.random().toString(36).substring(2, 6)
    )

    return NextResponse.json({
      success: true,
      backupCodes,
      message: '2FA đã được kích hoạt thành công'
    })

  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
