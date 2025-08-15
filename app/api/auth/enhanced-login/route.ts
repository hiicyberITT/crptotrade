import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

// Mock user database
const users = [
  {
    id: '1',
    email: 'admin@btcexchange.com',
    phone: '0901234567',
    firstName: 'Admin',
    lastName: 'User',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    isVerified: true,
    walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    twoFactorEnabled: false,
    balance: {
      BTC: 1.5,
      ETH: 10.2,
      USD: 50000,
      USDT: 25000
    },
    loginAttempts: 0,
    lastLoginAttempt: null,
    isLocked: false
  },
  {
    id: '2',
    email: 'user@example.com',
    phone: '0987654321',
    firstName: 'Test',
    lastName: 'User',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    isVerified: true,
    walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    twoFactorEnabled: false,
    balance: {
      BTC: 0.25,
      ETH: 2.5,
      USD: 5000,
      USDT: 3000
    },
    loginAttempts: 0,
    lastLoginAttempt: null,
    isLocked: false
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, twoFactorCode, rememberMe, deviceInfo } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ 
        success: false,
        error: 'Vui lòng nhập email và mật khẩu' 
      }, { status: 400 })
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'Email hoặc mật khẩu không đúng' 
      }, { status: 401 })
    }

    // Check if account is locked
    if (user.isLocked) {
      return NextResponse.json({ 
        success: false,
        error: 'Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần' 
      }, { status: 423 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      // Increment login attempts
      user.loginAttempts += 1
      user.lastLoginAttempt = new Date()
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.isLocked = true
      }

      return NextResponse.json({ 
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
        attemptsRemaining: Math.max(0, 5 - user.loginAttempts)
      }, { status: 401 })
    }

    // Reset login attempts on successful password verification
    user.loginAttempts = 0
    user.lastLoginAttempt = null
    user.isLocked = false

    // Check if account is verified
    if (!user.isVerified) {
      return NextResponse.json({ 
        success: false,
        error: 'Tài khoản chưa được xác thực' 
      }, { status: 401 })
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled && !twoFactorCode) {
      return NextResponse.json({ 
        success: false,
        requiresTwoFactor: true,
        message: 'Vui lòng nhập mã xác thực 2FA'
      })
    }

    if (user.twoFactorEnabled && twoFactorCode) {
      // Mock 2FA verification - in real app, verify with authenticator
      if (twoFactorCode !== '123456') {
        return NextResponse.json({ 
          success: false,
          error: 'Mã xác thực 2FA không đúng' 
        }, { status: 401 })
      }
    }

    // Check for new device (mock implementation)
    const isNewDevice = deviceInfo && Math.random() > 0.8 // 20% chance of new device detection
    if (isNewDevice && !twoFactorCode) {
      return NextResponse.json({
        success: false,
        requiresDeviceVerification: true,
        message: 'Thiết bị mới được phát hiện. Vui lòng xác thực.'
      })
    }

    // Create JWT token
    const token = await signToken({ 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    })

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: rememberMe ? 86400 * 30 : 86400 * 7 // 30 days or 7 days
    }

    cookies().set('auth-token', token, cookieOptions)

    // Log successful login
    console.log('Enhanced login successful:', {
      userId: user.id,
      email: user.email,
      role: user.role,
      deviceInfo,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        walletAddress: user.walletAddress,
        isVerified: user.isVerified,
        balance: user.balance
      }
    })

  } catch (error) {
    console.error('Enhanced login error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Lỗi server nội bộ' 
    }, { status: 500 })
  }
}
