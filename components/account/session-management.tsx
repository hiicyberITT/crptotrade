'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Monitor, Smartphone, Tablet, Globe, MapPin, Clock, Shield, AlertTriangle, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react'

interface Session {
  id: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  location: string
  country: string
  countryCode: string
  ip: string
  lastActivity: string
  createdAt: string
  isCurrent: boolean
  isTrusted: boolean
  isActive: boolean
}

export function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [terminating, setTerminating] = useState<string | null>(null)

  // Mock session data
  const mockSessions: Session[] = [
    {
      id: 'current',
      deviceType: 'desktop',
      browser: 'Chrome 120.0',
      os: 'Windows 11',
      location: 'Hồ Chí Minh, Việt Nam',
      country: 'Vietnam',
      countryCode: 'VN',
      ip: '203.162.4.191',
      lastActivity: 'Vừa xong',
      createdAt: '2 giờ trước',
      isCurrent: true,
      isTrusted: true,
      isActive: true
    },
    {
      id: 'mobile-1',
      deviceType: 'mobile',
      browser: 'Safari 17.1',
      os: 'iOS 17.1',
      location: 'Hà Nội, Việt Nam',
      country: 'Vietnam',
      countryCode: 'VN',
      ip: '171.244.140.122',
      lastActivity: '15 phút trước',
      createdAt: '1 ngày trước',
      isCurrent: false,
      isTrusted: true,
      isActive: true
    },
    {
      id: 'desktop-2',
      deviceType: 'desktop',
      browser: 'Firefox 121.0',
      os: 'macOS 14.2',
      location: 'Đà Nẵng, Việt Nam',
      country: 'Vietnam',
      countryCode: 'VN',
      ip: '115.78.237.89',
      lastActivity: '2 giờ trước',
      createdAt: '3 ngày trước',
      isCurrent: false,
      isTrusted: false,
      isActive: true
    },
    {
      id: 'suspicious-1',
      deviceType: 'desktop',
      browser: 'Chrome 119.0',
      os: 'Ubuntu 22.04',
      location: 'Singapore',
      country: 'Singapore',
      countryCode: 'SG',
      ip: '103.28.248.15',
      lastActivity: '1 ngày trước',
      createdAt: '2 ngày trước',
      isCurrent: false,
      isTrusted: false,
      isActive: false
    }
  ]

  useEffect(() => {
    // Simulate API call
    const fetchSessions = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSessions(mockSessions)
      setLoading(false)
    }

    fetchSessions()
  }, [])

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />
      case 'tablet':
        return <Tablet className="w-5 h-5" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  const getCountryFlag = (countryCode: string) => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
  }

  const handleTerminateSession = async (sessionId: string) => {
    setTerminating(sessionId)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSessions(prev => prev.filter(session => session.id !== sessionId))
      console.log(`Session ${sessionId} terminated`)
    } catch (error) {
      console.error('Failed to terminate session:', error)
    } finally {
      setTerminating(null)
    }
  }

  const handleTerminateAllSessions = async () => {
    setTerminating('all')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSessions(prev => prev.filter(session => session.isCurrent))
      console.log('All other sessions terminated')
    } catch (error) {
      console.error('Failed to terminate all sessions:', error)
    } finally {
      setTerminating(null)
    }
  }

  const handleRefresh = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setSessions(mockSessions)
    setLoading(false)
  }

  const activeSessions = sessions.filter(s => s.isActive)
  const suspiciousSessions = sessions.filter(s => !s.isTrusted && s.isActive)

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              <span className="text-muted-foreground">Đang tải phiên đăng nhập...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Session Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Tổng quan phiên đăng nhập
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {sessions.length}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Tổng phiên đăng nhập
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {activeSessions.length}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Phiên đang hoạt động
              </div>
            </div>
            
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {suspiciousSessions.length}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                Phiên đáng nghi
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alert */}
      {suspiciousSessions.length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 dark:text-red-200">
                  Cảnh báo bảo mật
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Phát hiện {suspiciousSessions.length} phiên đăng nhập từ vị trí hoặc thiết bị không quen thuộc. 
                  Hãy kiểm tra và đăng xuất các phiên không phải của bạn.
                </p>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="mt-3"
                  onClick={handleTerminateAllSessions}
                  disabled={terminating === 'all'}
                >
                  {terminating === 'all' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Đăng xuất tất cả phiên khác
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Phiên đăng nhập đang hoạt động</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session, index) => (
            <div key={session.id}>
              <div className={`p-4 rounded-lg border ${
                session.isCurrent 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : session.isTrusted 
                    ? 'bg-background' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-muted-foreground">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {session.browser} trên {session.os}
                        </span>
                        
                        {session.isCurrent && (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Hiện tại
                          </Badge>
                        )}
                        
                        {session.isTrusted && !session.isCurrent && (
                          <Badge variant="secondary">
                            <Shield className="w-3 h-3 mr-1" />
                            Tin cậy
                          </Badge>
                        )}
                        
                        {!session.isTrusted && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Đáng nghi
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <img 
                            src={getCountryFlag(session.countryCode) || "/placeholder.svg"} 
                            alt={session.country}
                            className="w-4 h-3"
                          />
                          <MapPin className="w-3 h-3" />
                          <span>{session.location}</span>
                          <span className="text-xs">({session.ip})</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Hoạt động: {session.lastActivity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>Tạo: {session.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTerminateSession(session.id)}
                      disabled={terminating === session.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {terminating === session.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Đăng xuất
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              
              {index < sessions.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Mẹo bảo mật
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Thường xuyên kiểm tra và đăng xuất các phiên không sử dụng</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Không đăng nhập trên máy tính công cộng hoặc không tin cậy</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Bật xác thực 2 yếu tố (2FA) để tăng cường bảo mật</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Đăng xuất ngay lập tức nếu phát hiện hoạt động đáng nghi</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
