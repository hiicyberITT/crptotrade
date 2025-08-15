import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Mock database - trong ứng dụng thực tế sẽ dùng database
let users: any[] = [
  {
    id: '1',
    email: 'admin@cryptotrade.com',
    firstName: 'Admin',
    lastName: 'User',
    password: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // hash của 'admin123'
    role: 'admin',
    isVerified: true,
    kycStatus: 'approved',
    walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    balance: { BTC: 1.0, USD: 10000, ETH: 10, USDT: 5000 },
    profile: {
      fullName: 'Admin User',
      dateOfBirth: '1990-01-01',
      nationality: 'VN',
      idType: 'CCCD',
      idNumber: '123456789',
      address: '123 Admin Street',
      city: 'Ho Chi Minh',
      country: 'VN',
      phone: '0123456789',
      occupation: 'Administrator'
    }
  },
  {
    id: '2',
    email: 'demo@cryptotrade.com',
    firstName: 'Demo',
    lastName: 'User',
    password: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // hash của 'demo123'
    role: 'user',
    isVerified: true,
    kycStatus: 'approved',
    walletAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    balance: { BTC: 0.1, USD: 1000, ETH: 1, USDT: 500 },
    profile: {
      fullName: 'Demo User',
      dateOfBirth: '1995-05-15',
      nationality: 'VN',
      idType: 'CCCD',
      idNumber: '987654321',
      address: '456 Demo Avenue',
      city: 'Ha Noi',
      country: 'VN',
      phone: '0987654321',
      occupation: 'Software Engineer'
    }
  }
]

// Hàm hash đơn giản
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'salt').digest('hex')
}

// Tạo token đơn giản
function createToken(userId: string, email: string, role: string): string {
  const payload = {
    userId,
    email,
    role,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 ngày
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

export async function POST(request: NextRequest) {
  try {
    console.log('Nhận yêu cầu đăng ký...')
    
    const body = await request.json()
    console.log('Dữ liệu nhận được:', { ...body, password: '***', confirmPassword: '***' })
    
    const { firstName, lastName, email, password, confirmPassword } = body

    // Kiểm tra các trường bắt buộc
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      console.log('Thiếu thông tin bắt buộc')
      return NextResponse.json({
        success: false,
        error: 'Vui lòng điền đầy đủ thông tin'
      }, { status: 400 })
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      console.log('Mật khẩu không khớp')
      return NextResponse.json({
        success: false,
        error: 'Mật khẩu xác nhận không khớp'
      }, { status: 400 })
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      console.log('Mật khẩu quá ngắn')
      return NextResponse.json({
        success: false,
        error: 'Mật khẩu phải có ít nhất 6 ký tự'
      }, { status: 400 })
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('Email không hợp lệ')
      return NextResponse.json({
        success: false,
        error: 'Định dạng email không hợp lệ'
      }, { status: 400 })
    }

    // Kiểm tra email đã tồn tại
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      console.log('Email đã tồn tại:', email)
      return NextResponse.json({
        success: false,
        error: 'Email này đã được đăng ký'
      }, { status: 409 })
    }

    // Tạo user mới
    const userId = crypto.randomUUID()
    const walletAddress = '1' + crypto.randomBytes(16).toString('hex').substring(0, 33)
    const hashedPassword = hashPassword(password)
    const fullName = `${firstName.trim()} ${lastName.trim()}`

    const newUser = {
      id: userId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      isVerified: false, // Tài khoản mới chưa xác thực
      kycStatus: 'pending', // Bắt buộc phải KYC
      walletAddress,
      createdAt: new Date().toISOString(),
      balance: {
        BTC: 0, // Không có bonus cho đến khi KYC
        USD: 0,
        ETH: 0,
        USDT: 0
      },
      profile: {
        fullName: fullName,
        dateOfBirth: '',
        nationality: '',
        idType: '',
        idNumber: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        occupation: ''
      },
      tradingLimits: {
        daily: 0, // Không thể giao dịch cho đến khi KYC
        monthly: 0,
        withdrawal: 0
      }
    }

    // Thêm vào database giả
    users.push(newUser)
    console.log('Tạo user thành công:', { id: userId, email, firstName, lastName, kycStatus: 'pending' })

    // Tạo token
    const token = createToken(userId, email, 'user')

    // Tạo response
    const userResponse = {
      id: userId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      isVerified: newUser.isVerified,
      kycStatus: newUser.kycStatus,
      walletAddress: newUser.walletAddress,
      balance: newUser.balance,
      profile: newUser.profile,
      tradingLimits: newUser.tradingLimits
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đăng ký thành công! Vui lòng hoàn thành xác thực danh tính để bắt đầu giao dịch.',
      user: userResponse,
      token,
      requiresKYC: true
    })

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 ngày
    })

    console.log('Đăng ký thành công cho user:', email, 'KYC required')
    return response

  } catch (error) {
    console.error('Lỗi đăng ký:', error)
    return NextResponse.json({
      success: false,
      error: 'Lỗi server. Vui lòng thử lại sau.'
    }, { status: 500 })
  }
}
