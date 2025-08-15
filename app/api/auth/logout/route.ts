import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Clear the auth cookie
    cookies().delete('auth-token')

    return NextResponse.json({
      success: true,
      message: 'Đăng xuất thành công'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Lỗi server nội bộ' }, { status: 500 })
  }
}
