import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // Validate input
    if (!email || !code) {
      return NextResponse.json({ error: 'Email và mã xác thực là bắt buộc' }, { status: 400 })
    }

    // Mock verification (in real app, check against database)
    const validCodes = ['123456', '654321', '111111']
    
    if (!validCodes.includes(code)) {
      return NextResponse.json({ error: 'Mã xác thực không đúng' }, { status: 400 })
    }

    // In real app, update user verification status in database
    console.log(`Email verified for: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Email đã được xác thực thành công'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Lỗi server nội bộ' }, { status: 500 })
  }
}
