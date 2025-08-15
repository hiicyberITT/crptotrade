import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock session data - in production, fetch from database
    const mockSessions = [
      {
        id: 'current-session',
        deviceType: 'desktop',
        browser: 'Chrome 120.0',
        os: 'Windows 11',
        location: 'Hồ Chí Minh, Việt Nam',
        country: 'Vietnam',
        countryCode: 'VN',
        ip: '203.162.4.191',
        lastActivity: new Date(),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isCurrent: true,
        isTrusted: true,
        isActive: true
      },
      {
        id: 'mobile-session-1',
        deviceType: 'mobile',
        browser: 'Safari 17.1',
        os: 'iOS 17.1',
        location: 'Hà Nội, Việt Nam',
        country: 'Vietnam',
        countryCode: 'VN',
        ip: '171.244.140.122',
        lastActivity: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isCurrent: false,
        isTrusted: true,
        isActive: true
      },
      {
        id: 'desktop-session-2',
        deviceType: 'desktop',
        browser: 'Firefox 121.0',
        os: 'macOS 14.2',
        location: 'Đà Nẵng, Việt Nam',
        country: 'Vietnam',
        countryCode: 'VN',
        ip: '115.78.237.89',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isCurrent: false,
        isTrusted: false,
        isActive: true
      }
    ]

    return NextResponse.json({
      success: true,
      sessions: mockSessions
    })

  } catch (error) {
    console.error('Sessions fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Không thể tải danh sách phiên đăng nhập'
    }, { status: 500 })
  }
}
