import { NextRequest, NextResponse } from 'next/server'

// Import users from the registration route
const users: any[] = [
  {
    id: '1',
    email: 'admin@btcexchange.com',
    phone: '0901234567',
    firstName: 'Admin',
    lastName: 'User'
  },
  {
    id: '2',
    email: 'user@example.com',
    phone: '0987654321',
    firstName: 'Test',
    lastName: 'User'
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone } = body

    let available = true
    let message = ''

    if (email) {
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        available = false
        message = 'Email đã được sử dụng'
      }
    }

    if (phone && available) {
      const cleanPhone = phone.replace(/[\s\-()]/g, '')
      const existingPhone = users.find(u => u.phone === cleanPhone)
      if (existingPhone) {
        available = false
        message = 'Số điện thoại đã được sử dụng'
      }
    }

    return NextResponse.json({
      available,
      message: available ? 'Có thể sử dụng' : message
    })

  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { available: null, message: 'Lỗi kiểm tra' },
      { status: 500 }
    )
  }
}
