import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Mock user database - In production, this would be a real database
let users: any[] = [
  {
    id: '1',
    email: 'admin@btcexchange.com',
    phone: '0901234567',
    firstName: 'Admin',
    lastName: 'User',
    password: '$2a$10$example', // hashed password
    role: 'admin',
    isVerified: true,
    twoFactorEnabled: false,
    walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    agreeToMarketing: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    balance: {
      BTC: 1.5,
      USD: 50000.00
    }
  },
  {
    id: '2',
    email: 'user@example.com',
    phone: '0987654321',
    firstName: 'Test',
    lastName: 'User',
    password: '$2a$10$example', // hashed password
    role: 'user',
    isVerified: true,
    twoFactorEnabled: false,
    walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    agreeToMarketing: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    balance: {
      BTC: 0.05,
      USD: 1000.00
    }
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      confirmPassword,
      agreeToMarketing 
    } = body

    console.log('Registration attempt:', { email, phone, firstName, lastName })

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu xác nhận không khớp' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Định dạng email không hợp lệ' },
        { status: 400 }
      )
    }

    // Phone validation - more flexible
    const cleanPhone = phone.replace(/[\s\-()]/g, '')
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Số điện thoại phải có ít nhất 10 chữ số' },
        { status: 400 }
      )
    }

    // Password validation - less strict
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email này đã được đăng ký. Vui lòng sử dụng email khác.' },
        { status: 409 }
      )
    }

    // Check if phone already exists
    const existingPhone = users.find(u => u.phone === cleanPhone)
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: 'Số điện thoại này đã được đăng ký. Vui lòng sử dụng số khác.' },
        { status: 409 }
      )
    }

    // Hash password
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 10)
    } catch (error) {
      console.error('Password hashing error:', error)
      return NextResponse.json(
        { success: false, error: 'Lỗi xử lý mật khẩu' },
        { status: 500 }
      )
    }

    // Generate user ID and wallet address
    const userId = crypto.randomUUID()
    const walletAddress = generateBitcoinAddress()

    // Create new user
    const newUser = {
      id: userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: cleanPhone,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      twoFactorEnabled: false,
      walletAddress,
      agreeToMarketing: agreeToMarketing || false,
      createdAt: new Date().toISOString(),
      balance: {
        BTC: 0.001, // Welcome bonus
        USD: 10.00  // Welcome bonus
      },
      settings: {
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        currency: 'USD',
        theme: 'dark',
        notifications: {
          email: true,
          sms: false,
          push: true,
          trading: true,
          security: true,
          marketing: agreeToMarketing || false
        }
      }
    }

    // Add to mock database
    users.push(newUser)

    console.log('User registered successfully:', {
      userId,
      email: newUser.email,
      phone: newUser.phone,
      walletAddress,
      timestamp: new Date().toISOString()
    })

    // Create demo account data
    try {
      await createDemoAccountData(userId)
    } catch (error) {
      console.error('Error creating demo data:', error)
      // Don't fail registration if demo data creation fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công! Chào mừng bạn đến với BTC Exchange Pro.',
      user: {
        id: userId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        walletAddress,
        isVerified: false,
        balance: newUser.balance,
        settings: newUser.settings
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}

function generateBitcoinAddress(): string {
  // Generate a mock Bitcoin address
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let result = '1' // Bitcoin addresses start with 1
  for (let i = 0; i < 33; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function createDemoAccountData(userId: string) {
  // Create demo trading history
  const demoTrades = [
    {
      id: crypto.randomUUID(),
      userId,
      symbol: 'BTCUSDT',
      side: 'buy',
      amount: 0.0005,
      price: 45000,
      total: 22.5,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    },
    {
      id: crypto.randomUUID(),
      userId,
      symbol: 'BTCUSDT',
      side: 'sell',
      amount: 0.0002,
      price: 46000,
      total: 9.2,
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      status: 'completed'
    }
  ]

  // Create demo wallet transactions
  const demoTransactions = [
    {
      id: crypto.randomUUID(),
      userId,
      type: 'bonus',
      currency: 'BTC',
      amount: 0.001,
      status: 'completed',
      timestamp: new Date().toISOString(),
      description: 'Bonus chào mừng thành viên mới'
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: 'bonus',
      currency: 'USD',
      amount: 10,
      status: 'completed',
      timestamp: new Date().toISOString(),
      description: 'Bonus chào mừng thành viên mới'
    }
  ]

  console.log('Demo account data created:', {
    userId,
    trades: demoTrades.length,
    transactions: demoTransactions.length
  })

  return { trades: demoTrades, transactions: demoTransactions }
}

// Export users for other API routes to access
export { users }
